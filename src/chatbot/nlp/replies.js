import knowledge from "../knowledge/index.js";
import { createChatContext, resolveListReference, pushHistory } from "./context.js";
import { detectSentiment, isFeedbackStatement } from "./sentiment.js";
import { isRegisteredCommand } from "../commands.js";
import { buildSectionReply } from "./sections.js";
import { normalize, analyse } from "./preprocess.js";
import { rankIntents, SMALLTALK_IDS, PERSONAL_INTENTS, SKILL_FRIENDLY_INTENTS } from "./intents.js";
import { buildComplimentReply, detectComplimentIntent, splitSegments } from "./compliments.js";
/* ==========================================================================
   1. DATA HELPERS
   Everything the chatbot says about the owner comes from the knowledge base
   (src/chatbot/knowledge/portfolio.json). Edit that file to change answers.
   Empty fields are handled: the bot says it has no information instead of guessing.
   ========================================================================== */

const kb = knowledge;
const profileInfo = kb.getProfile();
const projectList = kb.getProjects();
const basic = { name: profileInfo.name || "the portfolio owner" };
const about = { description: profileInfo.summary, focus: profileInfo.focus, goal: profileInfo.goal };
// e.g. "B.Tech in Computer Science at Some College (2027)", or "" when education is not in the knowledge base
const educationLine = kb.describeEducation();

const CATEGORY_HINTS = {
    languages: "Languages are what programmers write their code in.",
    frontend: "Frontend is the part of an app you see and click on.",
    backend: "Backend is the behind-the-scenes part that stores data and does the heavy work.",
    databases: "Databases are where an app keeps its information.",
    ai: "AI / ML is about teaching computers to learn patterns from data.",
    tools: "Tools are the software that helps build, test and ship projects.",
};

// Short, friendly definitions for jargon. Visitors can ask about technical terms.
const GLOSSARY = [
    {
        terms: ["machine learning", "ml"],
        answer: "Machine learning is a way of teaching computers to find patterns in data so they can make predictions on their own, like how a streaming app suggests movies you might enjoy.",
        related: ["machine learning", "ml", "ai", "tf idf", "prediction", "predict", "model", "recommender", "recommendation"],
    },
    {
        terms: ["ai", "artificial intelligence"],
        answer: "AI (artificial intelligence) means software that can do things that normally need human thinking, like recognising images, understanding language or making predictions.",
        related: ["ai", "ml", "machine learning", "prediction", "model", "recommender"],
    },
    {
        terms: ["deep learning", "neural network", "neural networks"],
        answer: "Deep learning is a type of machine learning that uses layered 'neural networks', loosely inspired by the brain, to learn from large amounts of data.",
        related: ["deep learning", "neural", "", "pytorch"],
    },
    {
        terms: ["api"],
        answer: "An API is a messenger between two pieces of software. One app asks for something, the API carries the request over, and brings the answer back.",
        related: ["api", "rest", "flask", "", "node js"],
    },
    {
        terms: ["frontend", "front end"],
        answer: "The frontend is everything you see and interact with in an app: the layout, buttons, colours and animations.",
        related: ["", "", "html", "", "frontend", ""],
    },
    {
        terms: ["backend", "back end"],
        answer: "The backend is the hidden part of an app that runs on a server. It stores data, checks logins and does the heavy work.",
        related: ["node js", "", "flask", "backend", "postgres", ""],
    },
    {
        terms: ["full stack", "fullstack", "full stack development", "full stack developer"],
        answer: "Full-stack means working on both sides of an app: the part users see (frontend) and the part running behind the scenes (backend and database).",
        related: ["", "node js", "", "flask", "postgres", ""],
    },
    {
        terms: ["web development", "web dev"],
        answer: "Web development is building websites and web apps: what you see on screen, plus the systems behind it that store and serve the data.",
        related: ["", "", "html", "", "node js"],
    },
    {
        terms: ["database", "databases", "sql"],
        answer: "A database is an organised digital filing cabinet where an app stores its information, like users, bookings or movies, so it can find it again quickly.",
        related: ["postgres", "sql", "", "mysql", "database", "sqlite"],
    },
    {
        terms: ["git", "github"],
        answer: "Git keeps a history of every change made to a project, and GitHub is a website where developers store and share that code.",
        related: ["git", "github"],
    },
    {
        terms: ["algorithm", "algorithms"],
        answer: "An algorithm is a step-by-step recipe a computer follows to solve a problem.",
        related: ["algorithm"],
    },
    {
        terms: ["competitive programming", "cp"],
        answer: "Competitive programming is like a sport for coders: you get timed problems and have to write fast, correct and efficient solutions.",
        related: ["competitive programming"],
    },
    {
        terms: ["cybersecurity", "cyber security", "security"],
        answer: "Cybersecurity is about protecting software, data and people from attacks, hackers and leaks.",
        related: ["security", "cybersecurity", "cyber security"],
    },
    {
        terms: ["tf idf", "tfidf"],
        answer: "TF-IDF is a classic way to turn text into numbers by finding which words are important in a document. It helps software compare how similar two pieces of text are.",
        related: ["tf idf", "tfidf"],
    },
];

const EXAMPLE_QUESTIONS = [
    "Who is Ayush?",
    "What projects has he built?",
    "What are his strongest skills?",
    "Why should we hire him?",
    "Is he suitable for an AI/ML internship?",
    "What technologies does he know?",
    "How can I contact him?",
    "What is machine learning?",
    "Where does he study?",
    "How was this website built?",
];

export const STARTER_CHIPS = [
    "Who is Ayush?",
    "What projects has he built?",
    "Why should we hire him?",
    "How can I contact him?",
    "open profile",
];

const DEFAULT_CHIPS = [
    "What projects has he built?",
    "What are his strongest skills?",
    "Why should we hire him?",
    "How can I contact him?",
];

const RECRUITER_CHIPS = [
    "Why should we hire him?",
    "Is he suitable for an AI/ML internship?",
    "Show me his projects",
    "How can I contact him?",
];

/* ==========================================================================
   2. TEXT UTILITIES (cleaning, stemming, typo tolerance)
   ========================================================================== */

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const capitalize = (value) => (value ? value[0].toUpperCase() + value.slice(1) : value);
const skillLabel = (key) => kb.getSkillCategory(key)?.label ?? capitalize(key);
const skillList = (key) => kb.getSkillCategory(key)?.items ?? [];

const joinList = (items) => {
    const list = items.filter(Boolean);
    if (list.length <= 1) return list[0] ?? "";
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
};


/* ==========================================================================
   3. INTENTS (what the visitor wants) - edit keywords here to teach the bot
   ========================================================================== */


/* ==========================================================================
   4. ENTITIES (project names, skills, categories, jargon)
   ========================================================================== */

// Projects, skills and categories are looked up in the knowledge base (see src/chatbot/knowledge/retrieval.js).
const findMlProjects = () => kb.findProjectsByTopic("machine learning");
const projectByTitle = (title) => kb.getProject(title);

function getProjectInfo(project) {
    const details = kb.getProjectDetails(project);
    return {
        simple: details.summary,
        problem: details.problem || null,
        highlights: details.highlights.length ? details.highlights : null,
        live: details.links.live || null,
        github: details.links.github || null,
    };
}

const findProject = (input) => kb.findProjectByName(input.text);
const findSkills = (input) => kb.findSkillsInText(input.text);
const findCategory = (text) => kb.findSkillCategory(text);

function findGlossaryEntry(text) {
    const cleaned = text
        .replace(/\b(please|can you|could you|in simple words|in simple terms|in easy words|simply|in short|a|an|the|mean|means|stand for)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const match = cleaned.match(/^(?:what is|what are|what does|define|explain|meaning of|explain me|tell me about|eli5)\s+(.+)$/);
    if (!match) return null;
    return GLOSSARY.find((entry) => entry.terms.map(normalize).filter(Boolean).includes(match[1])) ?? null;
}

/* ==========================================================================
   5. VISITOR TYPE (so replies can sound customised)
   ========================================================================== */

const VISITOR_PATTERNS = [
    {
        type: "recruiter",
        re: /\b(i am|im|we are|i work as|i work in)\b.*\b(recruiter|recruiting|hr|talent|hiring)\b|\b(i am|im|we are) (looking to )?(hire|hiring|recruit|recruiting)\b/,
    },
    { type: "developer", re: /\b(i am|im) (a |an )?(developer|programmer|engineer|software engineer|coder|dev)\b/ },
    { type: "student", re: /\b(i am|im) (a |an )?(student|beginner|fresher)\b/ },
    { type: "curious", re: /\b(just curious|just browsing|non technical|not technical|no technical background|not a developer|not from tech)\b/ },
];

const RECRUITER_CUE_RE = /\b(recruiter|recruiting|hiring|hire|hr|candidate|interview)\b/;
const TECH_CUE_RE = /\b(technical|technically|in detail|detailed|architecture|under the hood|deep dive|tech details|implementation)\b/;
const PRONOUN_RE = /\b(it|its|that|that one|this one|the same|there)\b/;
const AI_RE = /\b(ai|ml|machine learning|artificial intelligence|deep learning|data science)\b/;
const AFFIRMATIVE_RE = /^(yes|yeah|yep|yup|ya|sure|ok|okay|please|go ahead|do it|yes please|sure thing|show me)$/;

function detectFacet(text) {
    if (/\b(tech|technology|technologies|stack|built with|made with|tools|language|languages|framework|frameworks|used)\b/.test(text)) return "tech";
    if (/\b(problem|solve|solves|purpose|useful|use case|helps|why)\b/.test(text)) return "problem";
    if (/\b(how does|how it works|how do|works|working|architecture|flow|features)\b/.test(text)) return "how";
    if (/\b(link|github|demo|live|source|repo|code|try)\b/.test(text)) return "link";
    return "overview";
}

/* ==========================================================================
   6. REPLY BUILDERS
   ========================================================================== */

const makeReply = (text, suggestions = [], extra = {}) => ({
    text,
    suggestions: suggestions.slice(0, 4),
    ...extra,
});

const mainChips = (ctx, exclude = []) =>
    (ctx.visitor === "recruiter" ? RECRUITER_CHIPS : DEFAULT_CHIPS).filter((chip) => !exclude.includes(chip));

const isCasual = (ctx, wantTech) => !wantTech && ctx.visitor !== "developer";

function fallbackReply() {
    return makeReply(
        pick([
            "I'm not sure about that one. I only know what's in Ayush's portfolio, and I'd rather say so than guess.",
            "Hmm, that's not something I have in Ayush's portfolio yet, and I don't want to make something up.",
            "I don't have an answer for that. I can only talk about Ayush's background, skills, projects and contact details.",
        ]) + "\n\nHere are a few things I can help with:",
        shuffle(EXAMPLE_QUESTIONS).slice(0, 3),
        { isFallback: true },
    );
}

function introReply(type, ctx) {
    const base = {
        recruiter: [
            "Welcome, and thanks for stopping by! I'll keep the answers short and focused on what matters for hiring.",
            educationLine
                ? `Quick summary: ${basic.name} is studying ${educationLine} and is interested in internship opportunities.`
                : `Quick summary: ${basic.name} is interested in internship opportunities.`,
        ],
        developer: [
            "Great to have a fellow developer here! I'll include technical details wherever they're useful.",
        ],
        student: [
            "Nice to meet you! I'll keep things clear and friendly.",
        ],
        curious: [
            "No technical background needed. I'll keep everything in plain English.",
        ],
    }[type] ?? ["Nice to meet you!"];
    return makeReply([...base, "", "Here are some good places to start:"].join("\n"), mainChips(ctx));
}

function smallTalkReply(id, ctx) {
    switch (id) {
        case "greeting":
            return makeReply(
                pick([
                    "Hello! I'm Spider-Bot, Ayush's portfolio assistant. Ask me anything about him in plain English.",
                    "Hi there! Welcome to Ayush's portfolio. What would you like to know?",
                    "Hey! I can tell you about Ayush's background, skills and projects. Where should we start?",
                ]),
                mainChips(ctx),
            );
        case "thanks":
            return makeReply(
                pick([
                    "You're welcome! Anything else you'd like to know?",
                    "Happy to help! Ask me anything else about Ayush.",
                    "Anytime! There's more to explore if you're curious.",
                ]),
                mainChips(ctx),
            );
        case "bye":
            return makeReply(
                pick([
                    "Thanks for stopping by! If you'd like to get in touch with Ayush, open the Connect section.",
                    "Goodbye! Feel free to come back anytime.",
                ]),
                ["cd connect", "cd resume"],
            );
        case "howareyou":
            return makeReply(
                pick([
                    "I'm doing great, thanks for asking! What would you like to know about Ayush?",
                    "All good here! Ask me anything about Ayush's skills or projects.",
                ]),
                mainChips(ctx),
            );
        case "botIdentity":
            return makeReply(
                "I'm Spider-Bot, the assistant that lives in this terminal and speaks on Ayush's behalf. I'm not a big AI like ChatGPT: I only know what's written in his portfolio, so I won't invent anything. If I don't know something, I'll tell you.",
                mainChips(ctx),
            );
        case "help":
        default:
            return makeReply(
                [
                    "You can talk to me like you would to a person. For example:",
                    "  Who is Ayush?",
                    "  What has he built?",
                    "  Is he suitable for an AI/ML internship?",
                    "  What is machine learning?",
                    "",
                    "You don't need any technical background. If I use a word you don't know, just ask me what it means.",
                    "Type 'help' on its own to see the terminal commands.",
                ].join("\n"),
                mainChips(ctx),
            );
    }
}

function aboutReply(ctx) {
    ctx.lastTopic = { type: "about" };
    const intro = [about.description, about.focus].filter(Boolean).join(" ");
    const parts = [
        pick(["Sure! Here's a quick introduction.", "Happy to introduce him.", "Here's the short version."]),
        "",
        intro || `${basic.name} hasn't added an introduction to the portfolio yet.`,
        educationLine ? `Studying: ${educationLine}.` : "",
        about.goal ? `Goal: ${about.goal}` : "",
    ].filter((part, index) => index < 2 || part);
    if (ctx.visitor === "recruiter") parts.push("", "He is interested in internship opportunities.");
    const chips = ctx.visitor === "recruiter"
        ? ["Why should we hire him?", "Show me his projects", "How can I contact him?"]
        : ["What projects has he built?", "What are his strongest skills?", "How can I contact him?"];
    return makeReply(parts.join("\n"), chips);
}

function educationReply(ctx) {
    ctx.lastTopic = { type: "education" };
    return makeReply(
        educationLine
            ? `${pick(["", "Sure. ", "Of course. "])}${basic.name} is studying ${educationLine}.`
            : "I don't have education details in the portfolio yet. The Profile and Resume sections may have more.",
        ["What are his strongest skills?", "What projects has he built?", "Is he suitable for an internship?"],
    );
}

function contactReply(ctx) {
    ctx.lastTopic = { type: "contact" };
    const contact = kb.getContact();
    const details = [
        contact.email ? `Email: ${contact.email}` : "",
        ...contact.socials.filter((item) => item.url).map((item) => `${item.name}: ${item.url}`),
    ].filter(Boolean);
    return makeReply(
        [
            details.length
                ? pick([`Here's how to reach ${basic.name}:`, `You can get in touch with ${basic.name} here:`, "Happy to point you to him:"])
                : "I don't have public contact details listed yet.",
            "",
            ...details,
            ...(details.length ? [""] : []),
            "You can also open the Connect section for more options.",
        ].join("\n"),
        ["cd connect", "cd resume", "Why should we hire him?"],
    );
}

function resumeReply(ctx) {
    ctx.lastTopic = { type: "resume" };
    return makeReply(
        "You can view Ayush's resume in the Resume section. Tap the button below to open it.",
        ["cd resume", "cd connect", "Why should we hire him?"],
    );
}

function projectsReply(ctx, wantTech) {
    ctx.lastTopic = { type: "projects" };
    ctx.lastList = projectList.slice(0, 20).map((project) => project.title);
    ctx.lastSelected = null;
    if (!projectList.length) return makeReply("There aren't any projects listed in the portfolio yet.", mainChips(ctx));
    const withTech = !isCasual(ctx, wantTech) || ctx.visitor === "recruiter";
    const lines = projectList.map((project) => {
        const info = getProjectInfo(project);
        const tech = withTech && project.technologies?.length ? `\n    Built with: ${joinList(project.technologies)}` : "";
        return `- ${project.title}: ${info.simple}${tech}`;
    });
    return makeReply(
        [pick(["Here's what Ayush has built so far:", "Happy to show you! These are his projects:", "Ayush has worked on these projects:"]), "", ...lines].join("\n"),
        [`Tell me about ${projectList[0].title}`, "Which project shows his ML knowledge?", "What technologies does he know?", "cd projects"],
    );
}

// "Show me your  projects": the projects that use the technology, straight from the knowledge base
function techProjectsReply(techs, ctx) {
    ctx.lastTopic = { type: "projects" };
    const names = joinList(techs.map((tech) => tech.name));
    ctx.lastList = [];
    ctx.lastSelected = null;
    const found = [...new Map(techs.flatMap((tech) => kb.findProjectsByTechnology(tech.name)).map((project) => [project.title, project])).values()];
    if (!found.length) {
        ctx.lastList = []; ctx.lastSelected = null;
        return makeReply(
            `None of the projects in the portfolio list ${names} as a technology.`,
            ["What projects has he built?", "What technologies does he know?", "What are his strongest skills?"],
        );
    }
    ctx.lastList = found.slice(0, 20).map((project) => project.title);
    const lines = found.map((project) => `- ${project.title}: ${getProjectInfo(project).simple}`);
    return makeReply(
        [`Projects that use ${names}:`, "", ...lines].join("\n"),
        [`Tell me about ${found[0].title}`, "What projects has he built?", "What technologies does he know?"],
    );
}

const FACET_PROMPTS = {
    tech: "What technologies does it use?",
    problem: "What problem does it solve?",
    how: "How does it work?",
};

function projectReply(project, facet, ctx, wantTech, intro = "") {
    const info = getProjectInfo(project);
    const previous = ctx.lastTopic?.type === "project" && ctx.lastTopic.title === project.title ? ctx.lastTopic.shown ?? [] : [];
    ctx.lastTopic = { type: "project", title: project.title, shown: [...new Set([...previous, facet])] };

    const tech = project.technologies?.length ? joinList(project.technologies) : null;
    const lines = [];
    if (intro) lines.push(intro, "");

    if (facet === "tech") {
        lines.push(tech ? `${project.title} is built with ${tech}.` : `I don't have the technology list for ${project.title}.`);
        if (isCasual(ctx, wantTech)) lines.push("", "Don't worry if the names are unfamiliar: they are just the tools used to build it. Ask me 'What is ?' (or any other name) and I'll explain.");
    } else if (facet === "problem") {
        lines.push(info.problem ?? `In simple terms: ${info.simple}`);
    } else if (facet === "how") {
        if (info.highlights?.length) {
            lines.push(`Here's how ${project.title} works:`, ...info.highlights.map((item) => `- ${item}`));
        } else {
            lines.push(info.simple, "", "I don't have more detail on how it works in the portfolio yet.");
        }
    } else if (facet === "link") {
        const links = [info.live && `Live: ${info.live}`, info.github && `Code: ${info.github}`].filter(Boolean);
        lines.push(links.length ? [`Here's where to find ${project.title}:`, ...links].join("\n") : `I don't have a public link for ${project.title}. Open the Projects section to see more.`);
    } else {
        lines.push(`${project.title}${project.category ? ` (${project.category})` : ""}`, info.simple);
        if (tech) lines.push(isCasual(ctx, wantTech) && ctx.visitor !== "recruiter" ? `It's built with tools like ${joinList(project.technologies.slice(0, 3))}.` : `Built with: ${tech}.`);
    }

    const next = Object.keys(FACET_PROMPTS)
        .filter((key) => !ctx.lastTopic.shown.includes(key))
        .map((key) => FACET_PROMPTS[key]);
    return makeReply(lines.join("\n"), [...next, "Show me his other projects", "cd projects"]);
}

function nextFacet(ctx, project) {
    const shown = ctx.lastTopic?.type === "project" && ctx.lastTopic.title === project.title ? ctx.lastTopic.shown ?? [] : [];
    return ["overview", "tech", "problem", "how"].find((facet) => !shown.includes(facet)) ?? "link";
}

function skillHitReply(hits, ctx, wantTech, topId) {
    ctx.lastTopic = { type: "skills" };
    const lines = [];
    hits.slice(0, 4).forEach((hit) => {
        const related = kb.findProjectsByTechnology(hit.name);
        const entry = GLOSSARY.find((item) => item.terms.map(normalize).includes(hit.key));
        lines.push(
            `${pick(["Yes", "Yes, indeed"])}: ${hit.name} is part of Ayush's toolkit (${skillLabel(hit.category)}).` +
            (related.length ? ` He has used it in ${joinList(related.map((project) => project.title))}.` : " It's in his skill list, though it isn't tied to a listed project yet."),
        );
        if (entry && isCasual(ctx, wantTech)) lines.push(`  In simple words: ${entry.answer}`);
    });
    if (topId === "projects") lines.push("", "Want the full list of his projects?");
    return makeReply(lines.join("\n"), ["What projects has he built?", "What are his strongest skills?", "How can I contact him?"]);
}

function categoryReply(key, ctx, wantTech) {
    ctx.lastTopic = { type: "skills" };
    const lines = [
        pick(["Sure! Here's what Ayush uses:", "Here you go:", "This is what he works with:"]),
        `${skillLabel(key)}: ${skillList(key).join(", ")}.`,
    ];
    if (isCasual(ctx, wantTech) && CATEGORY_HINTS[key]) lines.push("", CATEGORY_HINTS[key]);
    return makeReply(lines.join("\n"), ["What are his strongest skills?", "What projects has he built?", "How can I contact him?"]);
}

function skillsReply(ctx, wantTech, prefix = "") {
    ctx.lastTopic = { type: "skills" };
    const lines = [prefix || pick(["Here's Ayush's toolkit:", "These are the technologies Ayush works with:", "Here's what he knows:"]), ""];
    const categories = kb.getSkillCategories();
    if (!categories.length) lines.push("No skills are listed in the portfolio yet.");
    categories.forEach(({ label, items }) => lines.push(`${label}: ${items.join(", ")}`));
    if (isCasual(ctx, wantTech)) lines.push("", "Not sure what a word means? Ask me, for example: 'What is ?'");
    return makeReply(lines.join("\n"), ["What are his strongest skills?", "What projects has he built?", "What is machine learning?"]);
}

function strengthsReply(ctx) {
    ctx.lastTopic = { type: "strengths" };
    if (profileInfo.strengths.length) {
        return makeReply(
            [`${basic.name}'s strongest areas:`, "", ...profileInfo.strengths.map((item) => `- ${item}`)].join("\n"),
            ["Why should we hire him?", "What projects has he built?", "How can I contact him?"],
        );
    }
    const mlProjects = findMlProjects();
    const lines = ["Based on his skills and projects, Ayush's strongest areas are:", ""];
    if (skillList("ai").length) {
        lines.push(`- AI / ML: ${skillList("ai").join(", ")}${mlProjects.length ? `. Seen in ${joinList(mlProjects.map((project) => project.title))}` : ""}.`);
    }
    if (skillList("frontend").length || skillList("backend").length) {
        lines.push(`- Full-stack web development: ${joinList([...skillList("frontend"), ...skillList("backend")])}.`);
    }
    if (skillList("languages").length) lines.push(`- Programming languages: ${skillList("languages").join(", ")}.`);
    if (skillList("databases").length) lines.push(`- Databases: ${skillList("databases").join(", ")}.`);
    return makeReply(lines.join("\n"), ["Why should we hire him?", "Which project shows his ML knowledge?", "How can I contact him?"]);
}

function hireReply(ctx) {
    ctx.lastTopic = { type: "hire" };
    const mlProjects = findMlProjects();
    const mlInfo = mlProjects[0] ? getProjectInfo(mlProjects[0]) : null;
    const lines = [
        pick(["Here's the short version of why Ayush is worth a look:", "Good question. Here's the case for Ayush:", "A few reasons stand out:"]),
        "",
    ];
    if (educationLine) lines.push(`- Strong foundation: ${educationLine}.`);
    if (mlProjects[0]) lines.push(`- Hands-on AI/ML: ${mlProjects[0].title}. ${mlInfo.simple}`);
    if (skillList("frontend").length || skillList("backend").length) {
        lines.push(`- Builds complete apps: comfortable with ${joinList([...skillList("frontend").slice(0, 2), ...skillList("backend").slice(0, 2)])}.`);
    }
    if (projectList.length) lines.push(`- Keeps shipping: ${projectList.length} projects in the portfolio, from web apps to machine learning.`);
    if (about.goal) lines.push(`- Keeps learning: ${about.goal}`);
    lines.push("", "To judge for yourself, have a look at his projects or resume.");
    return makeReply(lines.join("\n"), ["Show me his projects", "cd resume", "Is he suitable for an AI/ML internship?", "How can I contact him?"]);
}

function fitReply(text, ctx) {
    ctx.lastTopic = { type: "fit" };
    const isMl = AI_RE.test(text);
    const mlProjects = findMlProjects();
    const lines = [
        isMl
            ? "He looks like a promising fit for an AI/ML internship. To be upfront, he's a student with hands-on projects rather than formal job experience."
            : "He looks like a promising fit for a software internship. To be upfront, he's a student with hands-on projects rather than formal job experience.",
        "",
        "Why:",
    ];
    if (isMl) {
        if (skillList("ai").length) lines.push(`- Toolkit: ${skillList("ai").join(", ")}.`);
        if (mlProjects.length) lines.push(`- Project evidence: ${joinList(mlProjects.map((project) => project.title))}.`);
    } else {
        lines.push(`- Skills: ${joinList([...skillList("languages").slice(0, 3), ...skillList("frontend").slice(0, 2), ...skillList("backend").slice(0, 2)])}.`);
        if (projectList.length) lines.push(`- Project evidence: ${projectList.length} projects in the portfolio.`);
    }
    if (educationLine) lines.push(`- Foundation: ${educationLine}.`);
    lines.push("", "The Projects and Resume sections will give you the full picture.");
    return makeReply(lines.join("\n"), ["Show me his projects", "cd resume", "How can I contact him?"]);
}

function experienceReply(ctx) {
    ctx.lastTopic = { type: "experience" };
    const entries = kb.getExperience();
    return makeReply(
        entries.length ? entries.map((entry) => [entry.role, entry.organization, entry.period, entry.description].filter(Boolean).join(" · ")).join("\n") : "Formal experience is not listed in the portfolio yet.",
        ["Show me his projects", "Is he suitable for an internship?", "cd resume"],
    );
}

function aimlReply(ctx, wantTech, asksExperience) {
    ctx.lastTopic = { type: "aiml" };
    const mlProjects = findMlProjects();
    const lines = [];
    if (asksExperience) {
        lines.push("The portfolio doesn't list formal AI/ML employment. Ayush is a student, and his AI/ML work shows up in his projects.", "");
    } else {
        lines.push(pick(["Here's Ayush's AI/ML side:", "AI and machine learning are a big part of his work:"]), "");
    }
    if (skillList("ai").length) lines.push(`Toolkit: ${skillList("ai").join(", ")}.`);
    if (mlProjects.length) {
        lines.push("", "Projects that show it:");
        mlProjects.forEach((project) => lines.push(`- ${project.title}: ${getProjectInfo(project).simple}`));
    }
    if (isCasual(ctx, wantTech)) lines.push("", "In simple words: machine learning teaches computers to find patterns in data, like a movie app suggesting what to watch next.");
    const chips = mlProjects[0]
        ? [`Tell me about ${mlProjects[0].title}`, "Is he suitable for an AI/ML internship?", "What is machine learning?"]
        : ["Is he suitable for an AI/ML internship?", "What is machine learning?", "What projects has he built?"];
    return makeReply(lines.join("\n"), chips);
}

function glossaryReply(entry, ctx) {
    ctx.lastTopic = { type: "glossary" };
    const related = kb.findProjectsByTerms(entry.related ?? entry.terms);
    const lines = [`${pick(["Good question! ", "Sure. ", "Happy to explain. "])}${entry.answer}`];
    if (related.length) lines.push("", `Where Ayush uses it: ${joinList(related.map((project) => project.title))}.`);
    const chips = related[0]
        ? [`Tell me about ${related[0].title}`, "What are his strongest skills?", "What projects has he built?"]
        : ["What are his strongest skills?", "What projects has he built?", "How can I contact him?"];
    return makeReply(lines.join("\n"), chips);
}

function followupReply(ctx) {
    const topic = ctx.lastTopic;
    if (topic?.type === "projects" || topic?.type === "skills" || topic?.type === "strengths") {
        return makeReply("Sure! What would you like to dig into?", ["Which project shows his ML knowledge?", "What technologies does he know?", "Why should we hire him?"]);
    }
    return makeReply("Of course! Which part should I go deeper on?", mainChips(ctx));
}

const KNOWN_TECH_NAMES = ["Rust", "Go", "Java", "C++", "Docker", "AWS", "Kubernetes", "Ruby", "PHP", "Swift", "Kotlin", "C#", "TypeScript", "PostgreSQL", "Redis", "Azure", "GCP"];
function findUnknownTechnology(text) {
    const found = KNOWN_TECH_NAMES.find((name) => new RegExp(`\\b${name.replace(/[+]/g, "\\+")}\\b`, "i").test(text));
    return found && !kb.findTechnologiesInText(found).length ? found : null;
}
function portfolioSectionReply(ctx, section) {
    const map = { achievements: ["achievements", kb.getAchievements(), (x) => [x.title, x.description, x.date].filter(Boolean).join(" · ")], certifications: ["certifications", kb.getCertifications(), (x) => [x.title, x.issuer, x.date].filter(Boolean).join(" · ")], interests: ["interests", kb.getInterests(), (x) => x], experience: ["experience", kb.getExperience(), (x) => [x.role, x.organization, x.period, x.description].filter(Boolean).join(" · ")] };
    const [label, values, format] = map[section]; ctx.lastList = [];
    return makeReply(buildSectionReply(`${label[0].toUpperCase()}${label.slice(1)}`, values, format), ["What projects has he built?", "What are his strongest skills?", "How can I contact him?"]);
}

/* ==========================================================================
   7. THE BRAIN: getReply()
   ========================================================================== */

function computeReply(message, ctx) {
    const input = analyse(message);
    const { text, tokens } = input;
    if (!tokens.length) return fallbackReply();
    const ordinal = resolveListReference(text, ctx.lastList, ctx.lastSelected);
    if (ordinal) { if (Array.isArray(ordinal)) {
        const projects = ordinal.map((title) => kb.getProject(title)).filter(Boolean);
        if (projects.length) return makeReply(projects.map((item) => `${item.title}: ${getProjectInfo(item).simple}`).join("\n\n"), [`Tell me about ${projects[0].title}`, "What projects has he built?"]);
    }
    const item = kb.getProject(ordinal); if (item) { ctx.lastSelected = ordinal; return projectReply(item, "overview", ctx, false); } }

    // "yes" / "ok" follows the last suggestion
    if (AFFIRMATIVE_RE.test(text) && ctx.chatSuggestions.length) {
        return computeReply(ctx.chatSuggestions[0], ctx);
    }

    // Who is asking? (adjusts tone and which suggestions we offer)
    const visitorMatch = VISITOR_PATTERNS.find(({ re }) => re.test(text));
    if (visitorMatch) ctx.visitor = visitorMatch.type;
    else if (!ctx.visitor && RECRUITER_CUE_RE.test(text)) ctx.visitor = "recruiter";
    const wantTech = ctx.visitor === "developer" || TECH_CUE_RE.test(text);

    const ranked = rankIntents(input);
    let topId = ranked[0]?.id ?? null;

    // "What is ?" style questions
    const glossaryEntry = findGlossaryEntry(text);
    if (glossaryEntry) { ctx.lastList = []; ctx.lastSelected = null; return glossaryReply(glossaryEntry, ctx); }

    // "I'm a recruiter" style introductions
    if (visitorMatch && !message.includes("?") && (!ranked[0] || ranked[0].score < 4)) {
        return introReply(visitorMatch.type, ctx);
    }

    if (SMALLTALK_IDS.has(topId)) return smallTalkReply(topId, ctx);

    // Projects: named directly, referred to as "this website", or as "it" after a project answer
    const facet = detectFacet(text);
    let project = findProject(input);
    let intro = "";
    if (!project && topId === "portfolioSite") {
        project = kb.getPortfolioSiteProject();
        intro = "That's this very site!";
    }
    if (!project && ctx.lastTopic?.type === "project") {
        const refersBack = PRONOUN_RE.test(text) || topId === "followup";
        if (refersBack && !PERSONAL_INTENTS.has(topId)) project = projectByTitle(ctx.lastTopic.title);
    }
    if (project && (topId !== "contact" || facet === "link") && topId !== "resume") {
        const chosenFacet = topId === "followup" ? nextFacet(ctx, project) : facet;
        return projectReply(project, chosenFacet, ctx, wantTech, intro);
    }

    // "Show me your  projects": list the projects that use that technology
    if (topId === "projects") {
        const techs = kb.findTechnologiesInText(text);
        if (techs.length) return techProjectsReply(techs, ctx);
        const unknown = findUnknownTechnology(text);
        if (unknown) { ctx.lastList = []; ctx.lastSelected = null; return makeReply(`${unknown} isn't listed in his skills or projects. You can ask what technologies he does use, or see all his projects.`, ["What technologies does he know?", "What projects has he built?", "What are his strongest skills?"]); }
    }
    // A new non-project topic ends the project list reference window.
    if (topId && !["projects", "followup", "skills"].includes(topId)) { ctx.lastList = []; ctx.lastSelected = null; }

    // Specific skills ("Does he know ?")
    const skillHits = findSkills(input);
    if (skillHits.length && SKILL_FRIENDLY_INTENTS.has(topId)) return skillHitReply(skillHits, ctx, wantTech, topId);

    // AI/ML questions phrased in other ways ("is he good at ML?")
    if (AI_RE.test(text) && [null, "skills", "strengths", "experience"].includes(topId)) topId = "aiml";

    // Skill categories ("what's his frontend stack?")
    const category = findCategory(text);
    if (category && (topId === null || topId === "skills")) return categoryReply(category, ctx, wantTech);

    switch (topId) {
        case "contact": return contactReply(ctx);
        case "resume": return resumeReply(ctx);
        case "hire": return hireReply(ctx);
        case "fit": return fitReply(text, ctx);
        case "experience": return experienceReply(ctx);
        case "achievements": return portfolioSectionReply(ctx, "achievements");
        case "certifications": return portfolioSectionReply(ctx, "certifications");
        case "interests": return portfolioSectionReply(ctx, "interests");
        case "location": { const location = kb.getProfile().location; return makeReply(location || "Location is not listed yet.", ["Who is Ayush?", "How can I contact him?"]); }
        case "strengths": { const p = kb.getProfile(); const strengths = [...p.expertise, ...p.strengths]; return strengths.length ? makeReply(`His listed strengths include ${joinList(strengths)}.`, ["What projects has he built?", "What technologies does he know?"]) : strengthsReply(ctx); }
        case "aiml": return aimlReply(ctx, wantTech, /\b(experience|job|work|worked|employ)\w*/.test(text));
        case "education": return educationReply(ctx);
        case "projects": return projectsReply(ctx, wantTech);
        case "skills": {
            const asksCan = /^(does|do|can|is)\b/.test(text);
            return skillsReply(ctx, wantTech, asksCan ? "I couldn't find that exact skill in his list, but here's what Ayush works with:" : "");
        }
        case "about": return aboutReply(ctx);
        case "followup": return followupReply(ctx);
        default: return fallbackReply();
    }
}

// Names of technologies Ayush uses, so " is awesome" isn't mistaken for a compliment to him
const COMPLIMENT_SUBJECTS = kb.getSkillCategories().flatMap((category) => category.items);

const isCommandChip = (item) => isRegisteredCommand(item);

// Greetings / thanks sitting next to a compliment don't need their own reply
function isTrivialSegment(segment) {
    const input = analyse(segment);
    const topId = rankIntents(input)[0]?.id;
    return input.tokens.length <= 1 || (["greeting", "thanks", "bye", "howareyou"].includes(topId) && input.tokens.length <= 5);
}

// Compliments get their own intent. A message can also mix a compliment with a question
// ("Nice portfolio! What projects has he built?"): then both parts are answered.
function tryComplimentReply(message, ctx) {
    const parts = splitSegments(message).map((segment) => ({
        segment,
        match: detectComplimentIntent(segment, { subjects: COMPLIMENT_SUBJECTS }),
    }));
    const compliments = parts.filter((part) => part.match);
    if (!compliments.length) return null;

    const thanks = buildComplimentReply(compliments[0].match, ctx.compliment);
    const rest = parts.filter((part) => !part.match).map((part) => part.segment).join(" ").trim();
    if (!rest || isTrivialSegment(rest)) return makeReply(thanks.text, thanks.suggestions);

    const answer = computeReply(rest, ctx);
    if (answer.isFallback) return makeReply(thanks.text, thanks.suggestions);
    return makeReply(`${thanks.text}\n\n${answer.text}`, answer.suggestions);
}

function constructiveFeedbackReply() {
    return makeReply(
        "Thanks for being honest. I’ll take that as constructive feedback. Tell me what felt unclear or frustrating, and I can explain it or point you to more detail.",
        ["What projects has he built?", "What technologies does he know?", "How can I contact him?"],
    );
}

export function getReply(message, ctx = createChatContext()) {
    const ordinaryReply = tryComplimentReply(message, ctx) ?? computeReply(message, ctx);
    const result = isFeedbackStatement(message) ? constructiveFeedbackReply() : ordinaryReply;
    const structured = rankIntents(analyse(message))[0]?.id?.toUpperCase() ?? null;
    result.intent = structured;
    result.entities = kb.extractEntities(message);
    result.sentiment = detectSentiment(message);
    pushHistory(ctx, normalize(message));
    // Only plain questions can be re-run by a "yes", not terminal commands like "cd projects" or "neofetch"
    ctx.chatSuggestions = result.suggestions.filter((item) => !isCommandChip(item));
    return result;
}


export { createChatContext };
