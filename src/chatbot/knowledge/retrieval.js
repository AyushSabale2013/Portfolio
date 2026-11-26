/* ==========================================================================
   retrieval.js - read-only query API over validated portfolio knowledge.

   Everything the chatbot says about the owner should come through here, so
   editing portfolio.json is enough to change answers. No React, no network.

   Usage:
     const kb = createKnowledgeBase(rawJson);
     kb.findProjectByName("tell me about the solar flare project");
     kb.findProjectsByTechnology("python");
   ========================================================================== */

import { validateKnowledge } from "./loader.js";
import { fuzzyEqual, hasPhrase, normalize, prepare, techKey, uniqueStrings } from "./text.js";

// Title words that appear in many project names and so don't identify one project.
const GENERIC_TITLE_WORDS = new Set([
    "portfolio", "project", "projects", "app", "system", "management", "prediction", "track", "platform", "website", "site", "tool",
]);

// Vocabulary that maps natural phrasing to a topic. Project data decides which projects match.
const TOPIC_WORDS = {
    ml: [
        "machine learning", "ml", "ai", "artificial intelligence", "deep learning", "neural", "prediction", "predict",
        "forecast", "forecasting", "model", "nlp", "tensorflow", "pytorch", "xgboost", "scikit learn", "recommender",
        "recommendation", "data science",
    ],
    web: ["web development", "web dev", "website", "web app", "frontend", "front end", "full stack", "fullstack"],
};

// Which phrasing in a question points at a skill category.
const CATEGORY_PATTERNS = [
    ["languages", /\b(programming languages?|languages?|coding)\b/],
    ["frontend", /\b(front ?end|ui|user interface|web design)\b/],
    ["backend", /\b(back ?end|server side|server)\b/],
    ["databases", /\b(databases?|db|sql|data storage)\b/],
    ["tools", /\b(tools?|software|devops)\b/],
];

const topicOf = (text) => Object.keys(TOPIC_WORDS).filter((topic) => TOPIC_WORDS[topic].some((word) => hasPhrase(` ${text} `, word)));

export function createKnowledgeBase(raw) {
    const { ok, data, errors, warnings } = validateKnowledge(raw);
    const { profile, education, skills, projects, experience, achievements, certifications, contact } = data;

    /* ---------- indexes (built once) ---------- */

    // One entry per project: searchable text + keywords that identify only that project.
    const wordCounts = new Map();
    const titleWords = projects.map((project) => {
        const words = uniqueStrings(
            normalize(project.title).split(" ").filter((word) => word.length >= 4 && !GENERIC_TITLE_WORDS.has(word)),
        );
        words.forEach((word) => wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1));
        return words;
    });
    const projectIndex = projects.map((project, index) => ({
        project,
        names: uniqueStrings([project.title, ...project.aliases]).map(normalize).filter(Boolean),
        collapsed: uniqueStrings([project.title, ...project.aliases]).map(techKey).filter((key) => key.length >= 4),
        keywords: titleWords[index].filter((word) => wordCounts.get(word) === 1),
        techKeys: project.technologies.map(techKey),
        text: ` ${normalize([project.title, project.category, project.description, project.summary, ...project.technologies, ...project.topics].join(" "))} `,
    }));

    const skillIndex = Object.entries(skills).flatMap(([category, group]) =>
        group.items
            .map((name) => ({ category, categoryLabel: group.label, name, key: normalize(name), compact: techKey(name) }))
            .filter((skill) => skill.key.length >= 2),
    );

    // Every technology we know about: skills first (nicer display names), then project technologies.
    const technologies = new Map();
    skillIndex.forEach((skill) => technologies.set(skill.compact, { name: skill.name, key: normalize(skill.name), compact: skill.compact, category: skill.category }));
    projects.forEach((project) =>
        project.technologies.forEach((tech) => {
            const compact = techKey(tech);
            if (compact && !technologies.has(compact)) {
                technologies.set(compact, { name: tech.replace(/\([^)]*\)/g, "").trim() || tech, key: normalize(tech), compact, category: null });
            }
        }),
    );
    const technologyList = [...technologies.values()].filter((tech) => tech.compact.length >= 2);

    /* ---------- matching helpers ---------- */

    const matchesWord = (input, entry) =>
        hasPhrase(input.padded, entry.key) ||
        input.tokens.some((token) => techKey(token) === entry.compact || (entry.compact.length >= 5 && !entry.key.includes(" ") && fuzzyEqual(token, entry.compact)));

    /* ---------- profile, education, contact ---------- */

    const describeEducation = () => {
        const item = education[0];
        if (!item) return "";
        const degree = [item.degree, item.field && `in ${item.field}`].filter(Boolean).join(" ");
        const place = item.institution ? `${degree ? " at " : ""}${item.institution}` : "";
        const batch = item.batch ? ` (${item.batch})` : "";
        return `${degree}${place}${batch}`.trim();
    };

    const getSocial = (name) => contact.socials.find((item) => item.name.toLowerCase() === String(name).toLowerCase() && item.url) ?? null;

    /* ---------- skills ---------- */

    const getSkillCategories = () =>
        Object.entries(skills)
            .filter(([, group]) => group.items.length)
            .map(([key, group]) => ({ key, label: group.label, items: [...group.items] }));

    const getSkillCategory = (key) => {
        const group = skills[key];
        return group ? { key, label: group.label, items: [...group.items] } : null;
    };

    const findSkillCategory = (text) => {
        const clean = normalize(text);
        const hit = CATEGORY_PATTERNS.find(([key, pattern]) => skills[key]?.items.length && pattern.test(clean));
        return hit ? hit[0] : null;
    };

    const findSkillsInText = (text) => {
        const input = prepare(text);
        return skillIndex.filter((skill) => skill.key.length >= 3 && matchesWord(input, skill)).map(({ category, categoryLabel, name, key }) => ({ category, categoryLabel, name, key }));
    };

    const findTechnologiesInText = (text) => {
        const input = prepare(text);
        return technologyList.filter((tech) => matchesWord(input, tech)).map(({ name, key, category }) => ({ name, key, category }));
    };

    /* ---------- projects ---------- */

    const getProjects = () => [...projects];

    const getProject = (idOrTitle) => {
        const key = String(idOrTitle ?? "").toLowerCase();
        return projects.find((project) => String(project.id).toLowerCase() === key || project.title.toLowerCase() === key) ?? null;
    };

    const getPortfolioSiteProject = () => projects.find((project) => project.isPortfolioSite) ?? null;

    const findProjectByName = (text) => {
        const input = prepare(text);
        if (!input.tokens.length) return null;

        // 1. full title or alias written out (longest wins), or glued like "campass"
        let best = null;
        let bestLength = 0;
        for (const entry of projectIndex) {
            for (const name of entry.names) {
                if (hasPhrase(input.padded, name) && name.length > bestLength) {
                    best = entry.project;
                    bestLength = name.length;
                }
            }
            if (!best && entry.collapsed.some((key) => input.tokens.includes(key))) best = entry.project;
        }
        if (best) return best;

        // 2. a word that only one project title contains ("solar", "academy"), typos allowed
        let hit = null;
        let hitScore = 0;
        for (const entry of projectIndex) {
            let score = 0;
            for (const keyword of entry.keywords) {
                for (const token of input.tokens) {
                    if (token === keyword) score = Math.max(score, 1);
                    else if (fuzzyEqual(token, keyword)) score = Math.max(score, 0.7);
                }
            }
            if (score > hitScore) {
                hit = entry.project;
                hitScore = score;
            }
        }
        return hit;
    };

    const findProjectsByTechnology = (name) => {
        const key = techKey(name);
        if (!key) return [];
        return projectIndex.filter((entry) => entry.techKeys.includes(key)).map((entry) => entry.project);
    };

    const findProjectsByCategory = (text) => {
        const input = prepare(text);
        return projectIndex
            .filter(({ project }) =>
                project.category
                    .split("/")
                    .map(normalize)
                    .filter(Boolean)
                    .some((alt) => hasPhrase(input.padded, alt)),
            )
            .map((entry) => entry.project);
    };

    const findProjectsByTerms = (terms) => {
        const words = (Array.isArray(terms) ? terms : []).map(normalize).filter(Boolean);
        return projectIndex.filter((entry) => words.some((word) => entry.text.includes(` ${word} `))).map((entry) => entry.project);
    };

    const findProjectsByTopic = (text) => {
        const topics = topicOf(normalize(text));
        const words = topics.flatMap((topic) => TOPIC_WORDS[topic]);
        return findProjectsByTerms(words);
    };

    /**
     * One call for "show me X projects": tries a project name, then a technology,
     * then a category, then a topic. `by` tells the caller what matched.
     */
    const searchProjects = (text) => {
        const named = findProjectByName(text);
        if (named) return { by: "project", query: named.title, projects: [named] };

        const techs = findTechnologiesInText(text);
        if (techs.length) {
            const found = uniqueStrings(techs.flatMap((tech) => findProjectsByTechnology(tech.name).map((project) => project.title)));
            return { by: "technology", query: techs.map((tech) => tech.name), projects: found.map(getProject) };
        }

        const byCategory = findProjectsByCategory(text);
        if (byCategory.length) return { by: "category", query: text, projects: byCategory };

        const byTopic = findProjectsByTopic(text);
        if (byTopic.length) return { by: "topic", query: topicOf(normalize(text)), projects: byTopic };

        return { by: "none", query: text, projects: [] };
    };

    const getProjectDetails = (project) => {
        if (!project) return null;
        return {
            title: project.title,
            category: project.category,
            summary: project.summary || project.description,
            description: project.description,
            problem: project.problem,
            highlights: [...project.highlights],
            technologies: [...project.technologies],
            links: { live: project.liveUrl, github: project.githubUrl },
        };
    };

    /* ---------- entities (used by the NLP entity extractor) ---------- */

    const extractEntities = (text) => {
        const entities = {};
        const project = findProjectByName(text);
        if (project) entities.project = [project.title];
        const techs = findTechnologiesInText(text);
        if (techs.length) entities.technology = techs.map((tech) => tech.name);
        const category = findSkillCategory(text);
        if (category) entities.skillCategory = [category];
        const topics = topicOf(normalize(text));
        if (topics.length) entities.topic = topics;
        return entities;
    };

    return {
        ok,
        errors,
        warnings,
        data,

        getProfile: () => ({ ...profile, interests: [...profile.interests], expertise: [...profile.expertise], strengths: [...profile.strengths] }),
        getEducation: () => education.map((item) => ({ ...item })),
        describeEducation,
        getContact: () => ({ email: contact.email, socials: contact.socials.map((item) => ({ ...item })) }),
        getSocial,
        getExperience: () => experience.map((item) => ({ ...item })),
        getAchievements: () => achievements.map((item) => ({ ...item })),
        getCertifications: () => certifications.map((item) => ({ ...item })),
        getInterests: () => [...profile.interests],

        getSkillCategories,
        getSkillCategory,
        findSkillCategory,
        findSkillsInText,
        findTechnologiesInText,

        getProjects,
        getProject,
        getPortfolioSiteProject,
        getProjectDetails,
        findProjectByName,
        findProjectsByTechnology,
        findProjectsByCategory,
        findProjectsByTopic,
        findProjectsByTerms,
        searchProjects,

        extractEntities,
    };
}