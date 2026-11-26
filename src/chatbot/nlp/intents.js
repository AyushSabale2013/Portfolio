import { normalize, stem, fuzzyEqual, analyse } from "./preprocess.js";
const makeIntent = (id, weight, terms, options = {}) => ({
    id,
    weight,
    maxTokens: options.maxTokens ?? Infinity,
    phrases: terms.filter((term) => term.includes(" ")).map(normalize),
    words: terms.filter((term) => !term.includes(" ")).map((term) => stem(normalize(term))),
});

// Order matters: when two intents tie, the earlier one wins.
export const INTENTS = [
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
    makeIntent("achievements", 3, ["achievement", "achievements", "award", "awards", "accomplishment"]),
    makeIntent("certifications", 3, ["certification", "certifications", "certificate", "certificates"]),
    makeIntent("interests", 3, ["interest", "interests", "hobbies", "hobby"]),
    makeIntent("location", 3, ["location", "located", "city", "where is he", "where does he live", "where does he stay", "where is he based"]),
    makeIntent("skills", 2, [
        "skill", "language", "stack", "technology", "tech", "tool", "framework", "proficient", "programming",
        "know", "familiar", "tech stack", "what does he know", "what can he code", "what can he do",
    ]),
    makeIntent("portfolioSite", 3, [
        "this website", "this site", "this portfolio", "this terminal", "this page", "this desktop", "this os",
        "how was this built", "how is this built", "who made this", "who built this", "who designed this",
        "", "",
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
        "good morning", "good afternoon", "good evening", "nice to meet you", "pleased to meet you", "pleasure to meet you",
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
];

export const SMALLTALK_IDS = new Set(["greeting", "thanks", "bye", "howareyou", "botIdentity", "help"]);
export const PERSONAL_INTENTS = new Set([
    "contact", "resume", "hire", "fit", "strengths", "experience", "education", "about", "aiml",
]);
export const SKILL_FRIENDLY_INTENTS = new Set([null, "skills", "strengths", "projects", "experience", "aiml", "followup"]);

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

export function rankIntents(value) {
    const input = typeof value === "string" ? analyse(value) : value;
    return INTENTS
        .filter((intent) => input.tokens.length <= intent.maxTokens)
        .map((intent) => ({ id: intent.id, score: scoreIntent(intent, input) }))
        .filter((item) => item.score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score);
}

