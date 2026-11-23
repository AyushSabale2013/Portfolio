import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import projects from "../../data/projects";
import { SPIDER_CLI_BRAND } from "../../cliVersion";

/* ==========================================================================
   1. DATA HELPERS
   Everything the chatbot says comes from profile.js + projects.js.
   Optional extra fields (simple, problem, highlights, link) can live either
   in projects.js or in PROJECT_EXTRAS below. Nothing breaks if they are missing.
   ========================================================================== */

const basic = profile.basic ?? {};
const about = profile.about ?? {};
const skills = profile.skills ?? {};
const projectList = Array.isArray(projects) ? projects : [];

const projectAliases = {
    "spider os": "Spider OS Portfolio",
    spideros: "Spider OS Portfolio",
    "track academy": "Track Academy",
    "solar flare": "Solar Flare Prediction",
    campass: "Campass",
};

// Plain-language text for non-technical visitors. EDIT THESE to match your real projects.
// Keys must match the "title" field in projects.js exactly.
const PROJECT_EXTRAS = {
    "Spider OS Portfolio": {
        simple: "This very website: a portfolio that looks and feels like a computer desktop, with windows, apps and a terminal, instead of a normal scrolling page.",
        problem: "It makes a portfolio more fun and memorable to explore than a plain page.",
    },
    "Solar Flare Prediction": {
        simple: "A project that tries to predict solar flares (sudden bursts of energy from the Sun) using data from India's Aditya-L1 solar mission.",
    },
    Campass: {
        simple: "A campus gate management system for IIIT Pune that helps keep track of entries and exits at the gates.",
    },
    "Track Academy": {
        // simple: "...",
        // problem: "...",
        // highlights: ["...", "..."],
    },
};

const SKILL_LABELS = {
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend",
    databases: "Databases",
    ai: "AI / ML",
    tools: "Tools",
};

const CATEGORY_HINTS = {
    languages: "Languages are what programmers write their code in.",
    frontend: "Frontend is the part of an app you see and click on.",
    backend: "Backend is the behind-the-scenes part that stores data and does the heavy work.",
    databases: "Databases are where an app keeps its information.",
    ai: "AI / ML is about teaching computers to learn patterns from data.",
    tools: "Tools are the software that helps build, test and ship projects.",
};

// Short, friendly definitions for jargon. Visitors can ask "What is React?" etc.
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
        related: ["deep learning", "neural", "tensorflow", "pytorch"],
    },
    {
        terms: ["api"],
        answer: "An API is a messenger between two pieces of software. One app asks for something, the API carries the request over, and brings the answer back.",
        related: ["api", "rest", "flask", "express", "node js"],
    },
    {
        terms: ["frontend", "front end"],
        answer: "The frontend is everything you see and interact with in an app: the layout, buttons, colours and animations.",
        related: ["react", "css", "html", "javascript", "frontend", "framer motion"],
    },
    {
        terms: ["backend", "back end"],
        answer: "The backend is the hidden part of an app that runs on a server. It stores data, checks logins and does the heavy work.",
        related: ["node js", "express", "flask", "backend", "postgres", "mongodb"],
    },
    {
        terms: ["full stack", "fullstack", "full stack development", "full stack developer"],
        answer: "Full-stack means working on both sides of an app: the part users see (frontend) and the part running behind the scenes (backend and database).",
        related: ["react", "node js", "express", "flask", "postgres", "mongodb"],
    },
    {
        terms: ["web development", "web dev"],
        answer: "Web development is building websites and web apps: what you see on screen, plus the systems behind it that store and serve the data.",
        related: ["react", "javascript", "html", "css", "node js"],
    },
    {
        terms: ["react", "react js", "reactjs"],
        answer: "React is a popular tool for building interactive websites. It lets developers build a page from small reusable pieces, like Lego blocks.",
        related: ["react"],
    },
    {
        terms: ["python"],
        answer: "Python is a beginner-friendly programming language that is very popular for data science, AI and automation.",
        related: ["python", "flask"],
    },
    {
        terms: ["database", "databases", "sql"],
        answer: "A database is an organised digital filing cabinet where an app stores its information, like users, bookings or movies, so it can find it again quickly.",
        related: ["postgres", "sql", "mongodb", "mysql", "database", "sqlite"],
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

const STARTER_CHIPS = [
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
const skillLabel = (key) => SKILL_LABELS[key] ?? capitalize(key);
const skillList = (key) => (Array.isArray(skills[key]) ? skills[key] : []);

const joinList = (items) => {
    const list = items.filter(Boolean);
    if (list.length <= 1) return list[0] ?? "";
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
};

function normalize(value) {
    return String(value)
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/\bi'm\b/g, "i am")
        .replace(/\b(what|who|where|how|that|it|he|she|there|here|let)'s\b/g, "$1 is")
        .replace(/'s\b/g, "")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Words that carry no meaning for matching.
const STOPWORDS = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "am", "to", "of", "in", "on", "at",
    "for", "and", "or", "but", "me", "my", "you", "your", "yours", "please", "can", "could", "would",
    "will", "shall", "should", "do", "does", "did", "tell", "about", "give", "show", "i", "im", "he",
    "his", "him", "she", "her", "they", "their", "them", "we", "us", "our", "it", "its", "this", "that",
    "these", "those", "with", "so", "just", "also", "some", "any", "there", "here", "than", "then",
    "if", "as", "by", "from", "into", "over", "out", "up", "has", "have", "had", "get", "got", "let",
    "want", "need", "like", "ayush",
]);

// Very light stemmer: "projects" -> "project", "building" -> "build", "studies" -> "study".
function stem(word) {
    if (word.length <= 3) return word;
    if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
    if (word.endsWith("sses")) return word.slice(0, -2);
    if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
    if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
    return word;
}

function levenshtein(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
        let diagonal = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j += 1) {
            const above = row[j];
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
            diagonal = above;
        }
    }
    return row[b.length];
}

// 1 = exact match, 0.7 = close enough (typo), 0 = no match.
function fuzzyEqual(a, b) {
    if (a === b) return 1;
    if (a.length < 4 || b.length < 4 || a[0] !== b[0]) return 0;
    if (Math.abs(a.length - b.length) > 2) return 0;
    if (a.length === b.length) {
        // two neighbouring letters swapped, like "proejct" for "project"
        const diffs = [];
        for (let i = 0; i < a.length && diffs.length < 3; i += 1) if (a[i] !== b[i]) diffs.push(i);
        if (diffs.length === 2 && diffs[1] === diffs[0] + 1 && a[diffs[0]] === b[diffs[1]] && a[diffs[1]] === b[diffs[0]]) return 0.7;
    }
    const allowed = Math.max(a.length, b.length) >= 8 ? 2 : 1;
    return levenshtein(a, b) <= allowed ? 0.7 : 0;
}

function analyse(message) {
    const text = normalize(message);
    const tokens = text.split(" ").filter(Boolean);
    const stems = tokens.filter((token) => !STOPWORDS.has(token)).map(stem);
    return { text, padded: ` ${text} `, tokens, stems };
}

/* ==========================================================================
   3. INTENTS (what the visitor wants) - edit keywords here to teach the bot
   ========================================================================== */

const makeIntent = (id, weight, terms, options = {}) => ({
    id,
    weight,
    maxTokens: options.maxTokens ?? Infinity,
    phrases: terms.filter((term) => term.includes(" ")).map(normalize),
    words: terms.filter((term) => !term.includes(" ")).map((term) => stem(normalize(term))),
});

// Order matters: when two intents tie, the earlier one wins.
const INTENTS = [
    makeIntent("contact", 3, [
        "contact", "email", "mail", "reach", "linkedin", "github", "connect", "phone", "social", "socials",
        "get in touch", "talk to him", "speak to him", "how to reach",
    ]),
    makeIntent("resume", 3, ["resume", "cv", "curriculum vitae", "download resume", "see resume"]),
    makeIntent("hire", 3, [
        "hire", "hiring", "recruit", "worth", "why should we hire", "why should i hire", "why hire", "why him",
        "why ayush", "should we hire", "should i hire", "what makes him special", "what makes ayush", "convince",
        "join our team", "add to our team",
    ]),
    makeIntent("fit", 3, [
        "suitable", "fit", "qualified", "ready", "internship", "intern", "role", "position", "opening", "candidate",
        "opportunity", "eligible", "suitable for", "good for", "right for", "fit for", "ready for", "good fit",
        "can he handle", "would he be",
    ]),
    makeIntent("strengths", 3, [
        "strength", "strongest", "strong", "expertise", "specialty", "speciality", "specialize", "specialise",
        "standout", "good at", "best at", "best skills", "top skills", "strong points", "stand out", "main skills",
        "core skills", "what is he best at",
    ]),
    makeIntent("experience", 3, [
        "experience", "experienced", "job", "employ", "employment", "company", "companies", "professional",
        "previous", "career", "freelance", "industry", "worked at", "work experience", "work history",
    ]),
    makeIntent("aiml", 3, [
        "ai", "ml", "machine learning", "artificial intelligence", "deep learning", "data science", "nlp",
        "neural", "model", "predict", "prediction", "recommender",
    ]),
    makeIntent("education", 3, [
        "education", "college", "university", "degree", "study", "graduate", "batch", "iiit", "btech", "school",
        "academic", "cgpa", "qualification", "where does he study", "which college", "where did he study",
        "what is he studying", "what year", "is he a student",
    ]),
    makeIntent("projects", 2, [
        "project", "built", "build", "building", "made", "make", "created", "create", "creating", "app",
        "application", "showcase", "develop", "developed", "work", "worked", "portfolio", "demo", "example",
        "side project", "what has he made", "what did he make", "what has he built", "what did he build",
        "what has he done", "things he made",
    ]),
    makeIntent("skills", 2, [
        "skill", "language", "stack", "technology", "tech", "tool", "framework", "proficient", "programming",
        "know", "familiar", "tech stack", "what does he know", "what can he code", "what can he do",
    ]),
    makeIntent("portfolioSite", 3, [
        "this website", "this site", "this portfolio", "this terminal", "this page", "this desktop", "this os",
        "how was this built", "how is this built", "who made this", "who built this", "who designed this",
        "spider os", "spideros",
    ]),
    makeIntent("about", 2, [
        "introduce", "intro", "background", "bio", "overview", "summary", "who is ayush", "who is he",
        "about ayush", "about him", "who is this", "what does he do", "what does ayush do", "what is ayush",
        "tell me about him", "tell me about ayush",
    ]),
    makeIntent("followup", 2, [
        "tell me more", "tell more", "say more", "more", "more details", "more info", "more about it", "go on", "what else", "anything else",
        "continue", "elaborate", "expand on that", "more please", "details", "detail",
    ], { maxTokens: 5 }),
    makeIntent("greeting", 3, [
        "hi", "hii", "hiii", "hello", "hey", "heyy", "yo", "hola", "namaste", "sup", "greetings",
        "good morning", "good afternoon", "good evening",
    ], { maxTokens: 4 }),
    makeIntent("thanks", 3, [
        "thanks", "thank", "thx", "thankyou", "ty", "got it", "ok", "okay", "alright",
    ], { maxTokens: 5 }),
    makeIntent("bye", 3, ["bye", "goodbye", "cya", "see you", "good night", "take care"], { maxTokens: 4 }),
    makeIntent("howareyou", 4, [
        "how are you", "how do you do", "how is it going", "how you doing", "whats up", "what is up", "how are things",
    ]),
    makeIntent("botIdentity", 4, [
        "are you ai", "are you real", "are you a bot", "are you human", "are you chatgpt", "are you gpt",
        "are you a robot", "who are you", "who made you", "who built you", "who created you", "what are you",
        "what is your name", "chatbot", "bot", "robot",
    ]),
    // A bare "help" only counts in a very short message, so "help me find his projects" still reaches Projects
    makeIntent("help", 3, ["help"], { maxTokens: 3 }),
    makeIntent("help", 3, [
        "guide", "instructions", "options", "menu", "what can you do", "how does this work", "how do i use",
        "what can i ask", "what should i ask", "how to use", "what to ask",
    ]),
    makeIntent("praise", 2, ["nice", "cool", "great", "awesome", "wow", "amazing", "impressive"], { maxTokens: 3 }),
];

const SMALLTALK_IDS = new Set(["greeting", "thanks", "praise", "bye", "howareyou", "botIdentity", "help"]);
const PERSONAL_INTENTS = new Set([
    "contact", "resume", "hire", "fit", "strengths", "experience", "education", "about", "aiml",
]);
const SKILL_FRIENDLY_INTENTS = new Set([null, "skills", "strengths", "projects", "experience", "aiml", "followup"]);

const MIN_SCORE = 1.3;

function scoreIntent(intent, input) {
    let score = 0;
    for (const phrase of intent.phrases) {
        if (input.padded.includes(` ${phrase} `)) score += intent.weight * 2;
    }
    for (const word of intent.words) {
        let best = 0;
        for (const candidate of input.stems) {
            const match = fuzzyEqual(candidate, word);
            if (match > best) best = match;
            if (best === 1) break;
        }
        score += best * intent.weight;
    }
    return score;
}

function rankIntents(input) {
    return INTENTS
        .filter((intent) => input.tokens.length <= intent.maxTokens)
        .map((intent) => ({ id: intent.id, score: scoreIntent(intent, input) }))
        .filter((item) => item.score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score);
}

/* ==========================================================================
   4. ENTITIES (project names, skills, categories, jargon)
   ========================================================================== */

const GENERIC_TITLE_WORDS = new Set([
    "portfolio", "project", "app", "system", "management", "prediction", "track", "platform", "website", "site", "tool",
]);

// Words that appear in only ONE project title, so they identify that project.
const projectKeywords = (() => {
    const perProject = projectList.map((project) => [
        ...new Set(
            normalize(project.title)
                .split(" ")
                .filter((word) => word.length >= 4 && !GENERIC_TITLE_WORDS.has(word) && !STOPWORDS.has(word)),
        ),
    ]);
    const counts = new Map();
    perProject.forEach((words) => words.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1)));
    return perProject.map((words) => words.filter((word) => counts.get(word) === 1));
})();

const projectTextCache = new Map();
function projectText(project) {
    if (!projectTextCache.has(project.title)) {
        projectTextCache.set(
            project.title,
            ` ${normalize([project.title, project.category, project.description, ...(project.technologies ?? [])].join(" "))} `,
        );
    }
    return projectTextCache.get(project.title);
}

const mentions = (project, words) => {
    const text = projectText(project);
    return words.some((word) => text.includes(` ${normalize(word)} `));
};

const ML_WORDS = ["machine learning", "ml", "ai", "tf idf", "prediction", "predict", "model", "recommender", "recommendation", "neural", "deep learning", "scikit learn", "tensorflow", "pytorch", "nlp"];
const findMlProjects = () => projectList.filter((project) => mentions(project, ML_WORDS));
const projectByTitle = (title) => projectList.find((project) => project.title === title) ?? null;

function getProjectInfo(project) {
    const extra = PROJECT_EXTRAS[project.title] ?? {};
    return {
        simple: project.simple ?? extra.simple ?? project.description,
        problem: project.problem ?? extra.problem ?? null,
        highlights: project.highlights ?? extra.highlights ?? null,
        link: project.link ?? project.github ?? project.demo ?? project.url ?? extra.link ?? null,
    };
}

function findProject(input) {
    if (!projectList.length) return null;

    for (const [alias, title] of Object.entries(projectAliases)) {
        if (input.padded.includes(` ${alias} `)) {
            const project = projectByTitle(title);
            if (project) return project;
        }
    }

    let best = null;
    let bestScore = 0;
    projectList.forEach((project, index) => {
        if (input.padded.includes(` ${normalize(project.title)} `)) {
            best = project;
            bestScore = Infinity;
            return;
        }
        let score = 0;
        for (const keyword of projectKeywords[index]) {
            for (const token of input.tokens) {
                score = Math.max(score, fuzzyEqual(token, keyword));
            }
        }
        if (score > bestScore) {
            best = project;
            bestScore = score;
        }
    });
    return bestScore > 0 ? best : null;
}

const SKILL_INDEX = Object.entries(skills).flatMap(([category, values]) =>
    (Array.isArray(values) ? values : [])
        .map((name) => ({ category, name, key: normalize(name) }))
        .filter((skill) => skill.key.length >= 3),
);

function findSkills(input) {
    const found = new Map();
    for (const skill of SKILL_INDEX) {
        const exact = input.padded.includes(` ${skill.key} `);
        const typo = !skill.key.includes(" ") && skill.key.length >= 5 && input.tokens.some((token) => fuzzyEqual(token, skill.key) > 0);
        if ((exact || typo) && !found.has(skill.key)) found.set(skill.key, skill);
    }
    return [...found.values()];
}

const CATEGORY_PATTERNS = [
    ["languages", /\b(programming languages?|languages?|coding)\b/],
    ["frontend", /\b(front ?end|ui|user interface|web design)\b/],
    ["backend", /\b(back ?end|server side|server)\b/],
    ["databases", /\b(databases?|db|sql|data storage)\b/],
    ["tools", /\b(tools?|software|devops)\b/],
];

function findCategory(text) {
    const match = CATEGORY_PATTERNS.find(([key, pattern]) => skillList(key).length && pattern.test(text));
    return match ? match[0] : null;
}

function findGlossaryEntry(text) {
    const cleaned = text
        .replace(/\b(please|can you|could you|in simple words|in simple terms|in easy words|simply|in short|a|an|the|mean|means|stand for)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const match = cleaned.match(/^(?:what is|what are|what does|define|explain|meaning of|explain me|tell me about|eli5)\s+(.+)$/);
    if (!match) return null;
    return GLOSSARY.find((entry) => entry.terms.map(normalize).includes(match[1])) ?? null;
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
            `Quick summary: ${basic.name ?? "Ayush"} is a ${basic.degree ?? "computer science"} student at ${basic.college ?? "his college"} and is interested in internship opportunities.`,
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
        case "praise":
            return makeReply(
                pick([
                    "Thank you! Ayush will be glad to hear that.",
                    "Glad you like it! Want to see what else he has built?",
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
                "I'm Spider-Bot, a simple assistant that lives in this terminal. I'm not a big AI like ChatGPT: I only know what's written in Ayush's portfolio, so I won't invent anything. If I don't know something, I'll tell you.",
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
    const parts = [
        pick(["Sure! Here's a quick introduction.", "Happy to introduce him.", "Here's the short version."]),
        "",
        [about.description, about.focus].filter(Boolean).join(" "),
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
        `${pick(["", "Sure. ", "Of course. "])}${basic.name} is studying ${basic.degree} at ${basic.college} (${basic.batch}).`,
        ["What are his strongest skills?", "What projects has he built?", "Is he suitable for an internship?"],
    );
}

function contactReply(ctx) {
    ctx.lastTopic = { type: "contact" };
    const email = (profile.contacts ?? []).find((item) => item.type === "email")?.value ?? "Not listed";
    const github = (profile.socials ?? []).find((item) => item.name === "GitHub")?.link ?? "Not listed";
    const linkedin = (profile.socials ?? []).find((item) => item.name === "LinkedIn")?.link ?? "Not listed";
    return makeReply(
        [
            pick(["Here's how to reach Ayush:", "You can get in touch with Ayush here:", "Happy to point you to him:"]),
            "",
            `Email: ${email}`,
            `GitHub: ${github}`,
            `LinkedIn: ${linkedin}`,
            "",
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
        if (isCasual(ctx, wantTech)) lines.push("", "Don't worry if the names are unfamiliar: they are just the tools used to build it. Ask me 'What is React?' (or any other name) and I'll explain.");
    } else if (facet === "problem") {
        lines.push(info.problem ?? `In simple terms: ${info.simple}`);
    } else if (facet === "how") {
        if (info.highlights?.length) {
            lines.push(`Here's how ${project.title} works:`, ...info.highlights.map((item) => `- ${item}`));
        } else {
            lines.push(info.simple, "", "I don't have more detail on how it works in the portfolio yet.");
        }
    } else if (facet === "link") {
        lines.push(info.link ? `You can see ${project.title} here: ${info.link}` : `I don't have a public link for ${project.title}. Open the Projects section to see more.`);
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
        const related = projectList.filter((project) => mentions(project, [hit.name]));
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
    Object.entries(skills).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length) lines.push(`${skillLabel(key)}: ${values.join(", ")}`);
    });
    if (isCasual(ctx, wantTech)) lines.push("", "Not sure what a word means? Ask me, for example: 'What is React?'");
    return makeReply(lines.join("\n"), ["What are his strongest skills?", "What projects has he built?", "What is machine learning?"]);
}

function strengthsReply(ctx) {
    ctx.lastTopic = { type: "strengths" };
    if (Array.isArray(profile.strengths) && profile.strengths.length) {
        return makeReply(
            ["Ayush's strongest areas:", "", ...profile.strengths.map((item) => `- ${item}`)].join("\n"),
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
        `- Strong foundation: ${basic.degree} student at ${basic.college} (${basic.batch}).`,
    ];
    if (mlProjects[0]) lines.push(`- Hands-on AI/ML: ${mlProjects[0].title}. ${mlInfo.simple}`);
    if (skillList("frontend").length || skillList("backend").length) {
        lines.push(`- Builds complete apps: comfortable with ${joinList([...skillList("frontend").slice(0, 2), ...skillList("backend").slice(0, 2)])}.`);
    }
    if (projectList.length) lines.push(`- Keeps shipping: ${projectList.length} projects in the portfolio, from web apps to machine learning.`);
    lines.push(`- Keeps learning: ${about.goal ?? "focused on growing as an engineer"}.`);
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
    lines.push(`- Foundation: ${basic.degree} at ${basic.college} (${basic.batch}).`);
    lines.push("", "The Projects and Resume sections will give you the full picture.");
    return makeReply(lines.join("\n"), ["Show me his projects", "cd resume", "How can I contact him?"]);
}

function experienceReply(ctx) {
    ctx.lastTopic = { type: "experience" };
    return makeReply(
        [
            "The portfolio doesn't list formal work experience yet. Ayush is a student, and he is interested in internship opportunities.",
            "",
            projectList.length
                ? `What he does have is hands-on project work: ${joinList(projectList.map((project) => project.title))}.`
                : "He builds hands-on projects alongside his studies.",
        ].join("\n"),
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
    const related = projectList.filter((project) => mentions(project, entry.related ?? entry.terms));
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

/* ==========================================================================
   7. THE BRAIN: getReply()
   ========================================================================== */

function createChatContext() {
    return { visitor: null, lastTopic: null, chatSuggestions: [] };
}

function computeReply(message, ctx) {
    const input = analyse(message);
    const { text, tokens } = input;
    if (!tokens.length) return fallbackReply();

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

    // "What is React?" style questions
    const glossaryEntry = findGlossaryEntry(text);
    if (glossaryEntry) return glossaryReply(glossaryEntry, ctx);

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
        project = projectByTitle("Spider OS Portfolio");
        intro = "That's this very site!";
    }
    if (!project && ctx.lastTopic?.type === "project") {
        const refersBack = PRONOUN_RE.test(text) || topId === "followup";
        if (refersBack && !PERSONAL_INTENTS.has(topId)) project = projectByTitle(ctx.lastTopic.title);
    }
    if (project && topId !== "contact" && topId !== "resume") {
        const chosenFacet = topId === "followup" ? nextFacet(ctx, project) : facet;
        return projectReply(project, chosenFacet, ctx, wantTech, intro);
    }

    // Specific skills ("Does he know Python?")
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
        case "strengths": return strengthsReply(ctx);
        case "experience": return experienceReply(ctx);
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

function getReply(message, ctx) {
    const result = computeReply(message, ctx);
    // Only plain questions can be re-run by a "yes", not terminal commands like "cd projects"
    ctx.chatSuggestions = result.suggestions.filter((item) => !item.startsWith("cd ") && !item.startsWith("open "));
    return result;
}

/* ==========================================================================
   8. TERMINAL COMMANDS (run locally, never go through the chatbot)
   ========================================================================== */

const PORTFOLIO_ROOT = "~/portfolio";

const PORTFOLIO_TREE = `portfolio/
├── profile/
├── projects/
├── connect/
├── browser/
├── terminal/
├── links/
└── resume/`;

const COMMAND_HELP = `Welcome! You can talk to Spider CLI in plain English. No technical background needed.

You can:
  - Ask about Ayush, his skills, projects and experience.
  - Tap the suggestion buttons under each answer.
  - Explore his sections with commands like "cd profile" and "cd projects".

Try asking:
  Who is Ayush?
  What has he built?
  What is machine learning?
  Is he suitable for an AI/ML internship?
  Why should we hire him?

Terminal commands:
  clear             Clear the terminal output
  ls [section]      List portfolio sections (try "ls projects")
  help              Show this guide
  whoami            Introduce Ayush
  pwd               Print the current virtual directory
  date              Show the current date and time
  neofetch          Show Spider CLI and portfolio information
  history           Show previously entered commands and questions
  echo [text]       Print text
  about             Show information about Ayush
  commands          Alias for help
  cd <section>      Open profile, projects, connect, browser, terminal, links, or resume
  open <section>    Same as cd

Tips: press Tab to complete commands, and the Up/Down arrows to recall earlier input.`;

const SECTION_ROUTES = {
    profile: { appId: "profile", label: "Profile" },
    projects: { appId: "projects", label: "Projects" },
    connect: { appId: "contact", label: "Connect" },
    browser: { appId: "browser", label: "Browser" },
    terminal: { appId: "terminal", label: "Terminal" },
    links: { appId: "contact", label: "Links" },
    resume: { appId: "resume", label: "Resume" },
};

const SHELL_COMMANDS = new Set([
    "alias", "apt", "cat", "chmod", "cp", "curl", "find", "git", "grep",
    "head", "less", "mkdir", "mv", "nano", "node", "npm", "printenv",
    "rm", "rmdir", "tail", "touch", "vim", "wget",
]);

// If these are followed by a whole sentence, treat the input as a question, not a command.
const NO_ARGUMENT_COMMANDS = new Set(["help", "commands", "whoami", "pwd", "date", "neofetch", "history", "about", "clear", "exit"]);

const TAB_COMMANDS = ["clear", "ls", "help", "whoami", "pwd", "date", "neofetch", "history", "echo", "about", "commands", "cd", "open", "exit", "sudo"];
const TAB_COMMANDS_WITH_ARGS = new Set(["cd", "open", "ls", "echo"]);

function tokenizeCommand(input) {
    const tokens = [];
    const tokenPattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;

    while ((match = tokenPattern.exec(input)) !== null) {
        tokens.push(match[1] ?? match[2] ?? match[3]);
    }

    return tokens;
}

function openSection(args, context) {
    const destination = (args[0] ?? "").toLowerCase().replace(/^\.\//, "").replace(/\/$/, "");

    if (!destination || ["/", "~", "..", "portfolio", "~/portfolio"].includes(destination)) {
        context.setCurrentDirectory(PORTFOLIO_ROOT);
        return { output: PORTFOLIO_ROOT };
    }

    const section = destination.replace(/^.*\//, "");
    const route = Object.hasOwn(SECTION_ROUTES, section) ? SECTION_ROUTES[section] : null;
    if (!route) {
        return { output: `bash: cd: ${args[0]}: No such file or directory` };
    }

    context.setCurrentDirectory(`${PORTFOLIO_ROOT}/${section}`);
    context.openApp?.(route.appId);
    return { output: `Opening ${route.label}...` };
}

const commandRegistry = {
    clear: () => ({ clear: true }),
    ls: (args) => {
        const target = (args[0] ?? "").toLowerCase().replace(/\/$/, "");
        if (!target) return { output: PORTFOLIO_TREE };
        if (target === "projects") {
            return { output: projectList.length ? projectList.map((project) => project.title).join("\n") : "No projects listed." };
        }
        if (Object.hasOwn(SECTION_ROUTES, target)) {
            return { output: `${target}/ is an app. Type "cd ${target}" to open it.` };
        }
        return { output: `ls: cannot access '${args[0]}': No such file or directory` };
    },
    help: () => ({ output: COMMAND_HELP }),
    commands: () => ({ output: COMMAND_HELP }),
    whoami: () => ({
        output: `${basic.name}, ${basic.degree} student at ${basic.college}.`,
    }),
    pwd: (_args, context) => ({ output: context.currentDirectory }),
    date: () => ({ output: new Date().toString() }),
    neofetch: () => ({
        output: `       /\\_/\\       ${basic.name}\n      ( o.o )      OS: ${SPIDER_CLI_BRAND}\n       > ^ <       Host: Ayush Sabale Portfolio\n                     Sections: Profile, Projects, Connect, Browser, Links, Resume\n                     Stack: React`,
    }),
    history: (_args, context) => ({
        output: context.commandHistory.length
            ? context.commandHistory.map((entry, index) => `${String(index + 1).padStart(3, " ")}  ${entry}`).join("\n")
            : "No commands in history.",
    }),
    echo: (args) => ({ output: args.join(" ") }),
    about: () => ({
        output: `${about.description}\nFocus: ${about.focus}\nGoal: ${about.goal}`,
    }),
    cd: (args, context) => openSection(args, context),
    open: (args, context) => (args.length ? openSection(args, context) : { output: "usage: open <section>" }),
    exit: () => ({ output: "There's no escape from the Spider-Verse. Close the window when you're done :)" }),
    sudo: () => ({ output: "ayush is not in the sudoers file. This incident will be reported." }),
};

function looksLikeShell(input, command, args) {
    const trimmed = input.trim();
    if (/^(\.\.\/|\.\/|\/|~\/)/.test(trimmed)) return true;
    if (SHELL_COMMANDS.has(command)) {
        return args.length <= 1 || args.some((arg) => arg.startsWith("-") || arg.includes("/"));
    }
    return false;
}

function runTerminalCommand(input, context) {
    const [rawCommand = "", ...args] = tokenizeCommand(input);
    const command = rawCommand.toLowerCase();
    if (!command) return null;

    const handler = Object.hasOwn(commandRegistry, command) ? commandRegistry[command] : null;
    if (handler) {
        // "help me find his projects" is a question, not the help command
        if (NO_ARGUMENT_COMMANDS.has(command) && args.length >= 2) return null;
        return { handled: true, ...handler(args, context) };
    }

    if (looksLikeShell(input, command, args)) {
        return { handled: true, output: `bash: ${rawCommand}: command not found` };
    }

    return null;
}

function getPromptDirectory(directory) {
    return directory === PORTFOLIO_ROOT ? "~" : `~${directory.slice(PORTFOLIO_ROOT.length)}`;
}

function commonPrefix(values) {
    if (!values.length) return "";
    let prefix = values[0];
    for (const value of values) {
        while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
}

const THINK_DELAY = 380;
const TYPE_INTERVAL = 16;

const prefersReducedMotion = () =>
    typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

/* ==========================================================================
   9. THE TERMINAL COMPONENT
   ========================================================================== */

export default function Terminal({ openApp }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState(null);
    const [currentDirectory, setCurrentDirectory] = useState(PORTFOLIO_ROOT);

    const historyRef = useRef(null);
    const inputRef = useRef(null);
    const thinkTimerRef = useRef(null);
    const typeTimerRef = useRef(null);
    const pendingReplyRef = useRef(null);
    const commandHistoryRef = useRef([]);
    const historyCursorRef = useRef(null);
    const historyDraftRef = useRef("");
    const chatContextRef = useRef(null);
    if (chatContextRef.current === null) chatContextRef.current = createChatContext();

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages, isTyping, streamingText]);

    useEffect(() => {
        inputRef.current?.focus();
        return () => {
            clearTimeout(thinkTimerRef.current);
            clearInterval(typeTimerRef.current);
        };
    }, []);

    const stopTimers = () => {
        clearTimeout(thinkTimerRef.current);
        clearInterval(typeTimerRef.current);
        thinkTimerRef.current = null;
        typeTimerRef.current = null;
    };

    // Show the rest of the pending answer immediately
    const finishReply = () => {
        stopTimers();
        const reply = pendingReplyRef.current;
        pendingReplyRef.current = null;
        setIsTyping(false);
        setStreamingText(null);
        if (reply) {
            setMessages((current) => [...current, { role: "bot", text: reply.text, suggestions: reply.suggestions }]);
        }
    };

    // Throw the pending answer away (used by "clear")
    const cancelReply = () => {
        stopTimers();
        pendingReplyRef.current = null;
        setIsTyping(false);
        setStreamingText(null);
    };

    const startReply = (reply) => {
        stopTimers();
        pendingReplyRef.current = reply;
        setIsTyping(true);

        thinkTimerRef.current = setTimeout(() => {
            setIsTyping(false);
            if (prefersReducedMotion()) {
                finishReply();
                return;
            }
            const step = Math.max(2, Math.ceil(reply.text.length / 120));
            let shown = 0;
            setStreamingText("");
            typeTimerRef.current = setInterval(() => {
                shown += step;
                if (shown >= reply.text.length) finishReply();
                else setStreamingText(reply.text.slice(0, shown));
            }, TYPE_INTERVAL);
        }, THINK_DELAY);
    };

    const navigateCommandHistory = (direction) => {
        const history = commandHistoryRef.current;
        if (!history.length) return;

        if (direction < 0) {
            if (historyCursorRef.current === null) {
                historyDraftRef.current = input;
                historyCursorRef.current = history.length - 1;
            } else {
                historyCursorRef.current = Math.max(0, historyCursorRef.current - 1);
            }

            setInput(history[historyCursorRef.current]);
            return;
        }

        if (historyCursorRef.current === null) return;
        if (historyCursorRef.current >= history.length - 1) {
            historyCursorRef.current = null;
            setInput(historyDraftRef.current);
            historyDraftRef.current = "";
            return;
        }

        historyCursorRef.current += 1;
        setInput(history[historyCursorRef.current]);
    };

    const completeWithTab = () => {
        const trimmed = input.replace(/^\s+/, "");
        if (!trimmed) return;
        const parts = trimmed.split(/\s+/);
        const hasTrailingSpace = /\s$/.test(trimmed);

        if (parts.length === 1 && !hasTrailingSpace) {
            const fragment = parts[0].toLowerCase();
            const matches = TAB_COMMANDS.filter((command) => command.startsWith(fragment));
            if (!matches.length) return;
            const completed = matches.length === 1 ? matches[0] : commonPrefix(matches);
            const suffix = matches.length === 1 && TAB_COMMANDS_WITH_ARGS.has(completed) ? " " : "";
            setInput(`${completed}${suffix}`);
            return;
        }

        if (parts.length <= 2 && ["cd", "open", "ls"].includes(parts[0].toLowerCase())) {
            const fragment = hasTrailingSpace ? "" : (parts[1] ?? "").toLowerCase();
            const matches = Object.keys(SECTION_ROUTES).filter((section) => section.startsWith(fragment));
            if (!matches.length) return;
            const completed = matches.length === 1 ? matches[0] : commonPrefix(matches);
            if (completed.length > fragment.length) setInput(`${parts[0]} ${completed}`);
        }
    };

    const handleInputKeyDown = (event) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            navigateCommandHistory(-1);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            navigateCommandHistory(1);
        } else if (event.key === "Tab") {
            event.preventDefault();
            completeWithTab();
        }
    };

    const submitText = (raw) => {
        const question = raw.trim();
        if (!question) return;

        const tokens = tokenizeCommand(question);
        const isClearCommand = tokens[0]?.toLowerCase() === "clear" && tokens.length <= 2;

        // If a reply is still typing, show it fully and move on instead of ignoring the new input
        if (!isClearCommand && pendingReplyRef.current) finishReply();

        commandHistoryRef.current.push(question);
        setInput("");
        historyCursorRef.current = null;
        historyDraftRef.current = "";

        if (isClearCommand) {
            cancelReply();
            setMessages([]);
            return;
        }

        const commandContext = {
            currentDirectory,
            setCurrentDirectory,
            commandHistory: commandHistoryRef.current,
            openApp,
        };

        setMessages((current) => [...current, { role: "user", text: question, cwd: currentDirectory }]);

        const commandResult = runTerminalCommand(question, commandContext);

        if (commandResult?.handled) {
            if (commandResult.clear) {
                cancelReply();
                setMessages([]);
                return;
            }
            if (commandResult.output !== undefined) {
                setMessages((current) => [...current, { role: "output", text: commandResult.output }]);
            }
            return;
        }

        const reply = getReply(question, chatContextRef.current);

        // A single unknown word is most likely a mistyped command, not a question
        if (reply.isFallback && tokens.length === 1) {
            setMessages((current) => [
                ...current,
                {
                    role: "output",
                    text: `bash: ${tokens[0]}: command not found\nTip: type "help", or just ask me a question in plain English.`,
                },
            ]);
            return;
        }

        startReply(reply);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submitText(input);
    };

    const handleChipClick = (chip) => {
        submitText(chip);
        inputRef.current?.focus();
    };

    const focusInput = () => {
        // Don't steal focus while someone is selecting text to copy
        if (window.getSelection?.().toString()) return;
        inputRef.current?.focus();
    };

    const lastMessage = messages[messages.length - 1];
    const idle = !isTyping && streamingText === null;
    let chips = [];
    if (idle) {
        if (messages.length === 0) chips = STARTER_CHIPS;
        else if (lastMessage?.role === "bot") chips = lastMessage.suggestions ?? [];
    }

    return (
        <div className="terminal-session" onClick={focusInput}>
            <div className="terminal-session-welcome">
                <div className="terminal-session-version">Welcome to {SPIDER_CLI_BRAND}</div>
                <div className="terminal-session-help">
                    Ask me anything about Ayush in plain English, or type 'help' to see how it works :)
                </div>
            </div>

            <div
                ref={historyRef}
                role="log"
                aria-live="polite"
                aria-label="Chat conversation"
                className="terminal-session-history"
            >
                {messages.map((message, index) => (
                    <div key={`${index}-${message.role}`} className="terminal-session-line">
                        {message.role === "output" ? (
                            <span>{message.text}</span>
                        ) : message.role === "user" ? (
                            <>
                                <span className="terminal-session-prompt">
                                    <span className="terminal-session-host">ayush@spideros</span>
                                    <span className="terminal-session-path">:{getPromptDirectory(message.cwd ?? currentDirectory)}</span>
                                    <span className="terminal-session-symbol"> $</span>
                                </span>{" "}
                                <span>{message.text}</span>
                            </>
                        ) : (
                            <>
                                <span className="terminal-session-bot-prompt">spider-bot&gt; </span>
                                <span>{message.text}</span>
                            </>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="terminal-session-line terminal-session-typing">
                        <span className="terminal-session-bot-prompt">spider-bot&gt; </span>
                        <span aria-label="Chatbot is typing">typing</span>
                        <span className="terminal-session-typing-dots">...</span>
                    </div>
                )}

                {streamingText !== null && (
                    <div className="terminal-session-line" aria-hidden="true">
                        <span className="terminal-session-bot-prompt">spider-bot&gt; </span>
                        <span>{streamingText}</span>
                        <span className="terminal-session-caret">▍</span>
                    </div>
                )}
            </div>

            {chips.length > 0 && (
                <div className="terminal-session-chips" aria-label="Suggested questions">
                    {chips.map((chip) => (
                        <button
                            key={chip}
                            type="button"
                            className="terminal-session-chip"
                            onClick={() => handleChipClick(chip)}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="terminal-session-input-row">
                <label htmlFor="terminal-chat-input" className="terminal-session-prompt">
                    <span className="terminal-session-host">ayush@spideros</span>
                    <span className="terminal-session-path">:{getPromptDirectory(currentDirectory)}</span>
                    <span className="terminal-session-symbol"> $</span>
                </label>{" "}
                <input
                    id="terminal-chat-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    aria-label="Type a message to the portfolio chatbot"
                    autoComplete="off"
                    spellCheck="false"
                    className="terminal-session-input"
                />
            </form>

            <style>{`
                .terminal-session {
                    --terminal-bg: #1e1e20;
                    --terminal-fg: #e5e5e5;
                    --terminal-muted: #9ca3af;
                    --terminal-green: #22c55e;
                    --terminal-blue: #38bdf8;
                    --terminal-yellow: #facc15;
                    min-height: 0;
                    margin: -24px;
                    width: calc(100% + 48px);
                    height: calc(100% + 48px);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    color: var(--terminal-fg);
                    background: var(--terminal-bg);
                    box-sizing: border-box;
                    padding: 24px;
                    font: 16px/1.7 'JetBrains Mono', 'Ubuntu Mono', monospace;
                    user-select: text;
                }

                .terminal-session-welcome {
                    flex: 0 0 auto;
                    margin-bottom: 16px;
                }

                .terminal-session-version {
                    color: var(--terminal-green);
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .terminal-session-help {
                    color: var(--terminal-muted);
                }

                .terminal-session-history {
                    flex: 1;
                    min-height: 0;
                    overflow: auto;
                    overflow-wrap: anywhere;
                    white-space: pre-wrap;
                    scrollbar-color: #555 transparent;
                    scrollbar-width: thin;
                    padding: 2px 0 8px;
                }

                .terminal-session-line {
                    margin-bottom: 4px;
                }

                .terminal-session-prompt {
                    font-weight: 700;
                    white-space: nowrap;
                }

                .terminal-session-host {
                    color: var(--terminal-green);
                }

                .terminal-session-path {
                    color: var(--terminal-blue);
                }

                .terminal-session-symbol {
                    color: var(--terminal-fg);
                }

                .terminal-session-bot-prompt {
                    color: var(--terminal-blue);
                    font-weight: 600;
                }

                .terminal-session-typing {
                    color: var(--terminal-muted);
                }

                .terminal-session-typing-dots {
                    animation: terminalBlink 1s steps(1) infinite;
                }

                .terminal-session-caret {
                    color: var(--terminal-green);
                    animation: terminalBlink 1s steps(1) infinite;
                }

                .terminal-session-chips {
                    flex: 0 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }

                .terminal-session-chip {
                    padding: 3px 12px;
                    border: 1px solid #3f3f46;
                    border-radius: 999px;
                    color: var(--terminal-yellow);
                    background: transparent;
                    font: 500 13px/1.5 'JetBrains Mono', 'Ubuntu Mono', monospace;
                    cursor: pointer;
                    text-align: left;
                }

                .terminal-session-chip::before {
                    content: "> ";
                    opacity: 0.6;
                }

                .terminal-session-chip:hover {
                    border-color: #71717a;
                    background: rgba(255, 255, 255, 0.05);
                }

                .terminal-session-chip:focus-visible {
                    outline: 2px solid #71717a;
                    outline-offset: 2px;
                }

                .terminal-session-input-row {
                    display: flex;
                    align-items: center;
                    flex: 0 0 auto;
                    min-width: 0;
                    margin-top: 8px;
                }

                .terminal-session-input {
                    flex: 1;
                    width: 0;
                    min-width: 0;
                    margin-left: 8px;
                    padding: 0 1px;
                    border: 0;
                    outline: 0;
                    color: var(--terminal-fg);
                    background: transparent;
                    caret-color: var(--terminal-green);
                    font: inherit;
                }

                @keyframes terminalBlink {
                    50% { opacity: 0; }
                }

                @media (max-width: 520px) {
                    .terminal-session {
                        padding: 16px;
                        font-size: 14px;
                    }

                    .terminal-session-prompt {
                        font-size: 12px;
                    }

                    .terminal-session-chip {
                        font-size: 12px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .terminal-session-typing-dots,
                    .terminal-session-caret {
                        animation-duration: 0.01ms;
                        animation-iteration-count: 1;
                    }
                }
            `}</style>
        </div>
    );
}