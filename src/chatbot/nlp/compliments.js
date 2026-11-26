/* ==========================================================================
   complimentIntent.js

   Dedicated "compliment" intent for the portfolio chatbot.

   - Pure functions, no React, no network, no dependencies.
   - Uses a small vocabulary + context rules (what is being praised, who is
     being praised, is it a question, is it negated...) instead of one
     hard-coded phrase per compliment.
   - Replies are written in the developer's first-person voice, vary between
     calls, and avoid repeating the same line twice in a row.
   ========================================================================== */

/* ---------- text helpers ---------- */

export function normalizeText(value) {
    return String(value)
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/(.)\1{2,}/g, "$1") // "soooo" -> "so", "awesomeee" -> "awesome"
        .replace(/n't\b/g, " not")
        .replace(/'re\b/g, " are")
        .replace(/'m\b/g, " am")
        .replace(/'ll\b/g, " will")
        .replace(/'ve\b/g, " have")
        .replace(/'s\b/g, "")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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

// Typo tolerance for longer words only ("impresive", "awsome").
function closeEnough(a, b) {
    if (a === b) return true;
    if (a.length < 5 || b.length < 5 || a[0] !== b[0]) return false;
    if (Math.abs(a.length - b.length) > 2) return false;
    return levenshtein(a, b) <= (Math.max(a.length, b.length) >= 8 ? 2 : 1);
}

const singular = (word) =>
    word.length > 3 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us") && !word.endsWith("is")
        ? word.slice(0, -1)
        : word;

/** Splits a message into sentences / clauses so "Nice site! Who is Ayush?" can be handled in two parts. */
export function splitSegments(message) {
    const sentences = String(message).match(/[^.!?;\n]+[.!?]*/g) ?? [String(message)];
    return sentences
        .flatMap((sentence) =>
            sentence.split(/,\s+(?=(?:can|could|how|what|where|who|why|please|also|show|tell|do|does|is|are)\b)/i),
        )
        .map((segment) => segment.trim())
        .filter(Boolean);
}

/* ---------- vocabulary ---------- */

// Clearly positive on their own.
const STRONG_PRAISE = [
    "awesome", "amazing", "great", "impressive", "impressed", "beautiful", "stunning", "gorgeous", "fantastic",
    "excellent", "brilliant", "incredible", "wonderful", "fabulous", "superb", "outstanding", "phenomenal", "epic",
    "perfect", "cool", "sleek", "slick", "clean", "dope", "lit", "fire", "neat", "wow", "talented", "skilled",
    "creative", "genius", "smart", "clever", "professional", "polished", "innovative", "sick", "legend", "rockstar",
    "beast", "nice", "lovely", "marvelous", "magnificent", "flawless", "elegant", "classy", "charming",
    "inspiring", "inspirational", "thoughtful",
];

// Positive, but too vague to count unless something is being referred to ("good" in "is he good?").
const WEAK_PRAISE = ["good", "fine", "solid", "decent", "better", "best", "fun", "interesting", "pretty", "sweet", "unique", "original"];

// Short idioms. Everything else is matched by vocabulary and context.
const PRAISE_PHRASES = [
    "well done", "good job", "great job", "nice job", "nice work", "great work", "good work", "hats off",
    "keep it up", "next level", "mind blowing", "mind blown", "kudos", "bravo", "congrats", "congratulations",
    "speechless", "looks good", "well made", "well built", "well designed", "thumbs up",
];

// "I love your...", "I like how...", "loving the vibe"
const VERB_PRAISE_RE =
    /\b(love|loved|loving|like|liked|admire|admired|appreciate|appreciated|enjoy|enjoyed|enjoying|adore|adored)\b (your|ur|this|these|it|that|how|the|what you|what u)\b/;

const NEGATIVE_WORDS = new Set([
    "bad", "ugly", "terrible", "awful", "worst", "boring", "slow", "broken", "bug", "buggy", "hate", "hated",
    "trash", "sucks", "suck", "lame", "poor", "horrible", "confusing", "useless", "meh", "mid", "cringe", "stupid",
    "annoying", "disappointing", "disappointed", "laggy", "clunky",
]);
const NEGATION_WORDS = new Set(["not", "never", "no", "none", "nothing", "hardly", "barely", "without"]);

// Phrases that contain praise words but are greetings, wishes or small talk.
const NON_COMPLIMENT_PHRASES =
    /\b(good (morning|afternoon|evening|night|day|luck|bye)|nice to (meet|see|talk)( you)?|(pleasure|great|good|nice) to meet|have a (great|nice|good|wonderful) (day|one|weekend|time)|take care|all good|good to go|sounds good|that is fine|works for me)\b/g;

// Who/what is being praised.
const TARGETS = {
    terminal: ["terminal", "chatbot", "bot", "shell", "cli", "console", "prompt", "assistant", "hacker"],
    projects: ["project", "app", "application", "implementation", "solution", "product", "creation", "build", "system", "repo", "repository", "demo"],
    creativity: ["creative", "creativity", "idea", "imagination", "imaginative", "original", "originality", "innovative", "innovation", "unique", "concept", "thinking", "inventive"],
    skills: ["skill", "coding", "code", "coder", "programming", "programmer", "developer", "engineer", "talent", "talented", "skilled", "knowledge", "expertise", "genius", "smart", "clever", "brain", "mind", "logic", "solving"],
    site: ["portfolio", "website", "site", "webpage", "page", "ui", "ux", "design", "layout", "interface", "theme", "animation", "desktop", "look", "aesthetic", "vibe", "visual", "style", "colour", "color", "presentation", "wallpaper", "background", "font", "typography", "os"],
    general: ["work", "effort", "job", "craft", "craftsmanship"],
};
const TARGET_PRIORITY = ["terminal", "projects", "creativity", "skills", "site", "general"];
const TARGET_LOOKUP = new Map();
for (const [area, words] of Object.entries(TARGETS)) {
    words.forEach((word) => {
        if (!TARGET_LOOKUP.has(word)) TARGET_LOOKUP.set(word, []);
        TARGET_LOOKUP.get(word).push(area);
    });
}

const REFERENCE_WORDS = new Set(["this", "these", "those", "your", "ur", "you", "u", "it", "he", "him", "his", "ayush", "here", "everything"]);

// Words that never make a message "about something else".
const FILLER_WORDS = new Set([
    "so", "very", "really", "truly", "super", "too", "such", "absolutely", "totally", "quite", "extremely",
    "insanely", "seriously", "genuinely", "honestly", "just", "damn", "dang", "freaking", "well", "man", "bro",
    "dude", "guys", "guy", "omg", "oh", "ah", "aw", "aww", "lol", "haha", "yeah", "yes", "yep", "ok", "okay",
    "hey", "hi", "hello", "btw", "also", "and", "but", "is", "are", "was", "were", "be", "the", "a", "an", "of",
    "to", "for", "at", "in", "on", "with", "i", "am", "me", "my", "we", "she", "her", "have", "has", "had", "do",
    "did", "does", "got", "get", "made", "make", "built", "created", "designed", "wrote", "done", "how", "what",
    "that", "like", "love", "loved", "loving", "admire", "appreciate", "enjoy", "enjoyed", "enjoying", "liked",
    "looks", "looking", "feels", "feel", "seems", "come", "all", "much", "lot", "way", "kinda", "tbh", "imo",
    "thanks", "thank", "thx", "man", "ya", "re", "ve", "will", "can", "could", "would", "there", "its", "again",
    "indeed", "now", "right", "ever", "seen", "ive", "youve", "u", "ur", "yourself", "mate",
]);

const QUESTION_STARTERS = new Set([
    "show", "give", "tell", "make", "build", "write", "do", "does", "did", "let", "please", "can", "could", "would",
    "will", "what", "how", "why", "who", "where", "when", "which", "is", "are", "was", "were", "should", "may",
    "find", "list", "explain", "describe", "suggest", "recommend",
]);

/* ---------- detection ---------- */

function findPraise(tokens, text) {
    let strong = false;
    let weak = false;

    if (PRAISE_PHRASES.some((phrase) => ` ${text} `.includes(` ${phrase} `))) strong = true;
    if (VERB_PRAISE_RE.test(text)) strong = true;

    for (const token of tokens) {
        if (STRONG_PRAISE.some((word) => closeEnough(token, word))) strong = true;
        else if (WEAK_PRAISE.some((word) => closeEnough(token, word))) weak = true;
    }
    return strong ? "strong" : weak ? "weak" : null;
}

function findTargets(tokens) {
    const found = new Set();
    tokens.forEach((token) => {
        const areas = TARGET_LOOKUP.get(singular(token)) ?? TARGET_LOOKUP.get(token);
        areas?.forEach((area) => found.add(area));
    });
    return TARGET_PRIORITY.filter((area) => found.has(area));
}

const hasWord = (padded, word) => padded.includes(` ${word} `);

/**
 * Decides whether one sentence is a compliment and what it is about.
 *
 * @param {string} sentence  A single sentence (see splitSegments).
 * @param {{ subjects?: string[] }} options  subjects = names of technologies the owner uses
 *        (used to tell "Python is awesome" apart from "your code is awesome").
 * @returns {null | { kind: "compliment", target: string } | { kind: "thirdParty", subject: string, isKali: boolean }}
 */
export function detectComplimentIntent(sentence, { subjects = [] } = {}) {
    const raw = String(sentence);
    let text = normalizeText(raw);
    if (!text) return null;

    // Greetings / wishes that happen to contain praise words
    text = text.replace(NON_COMPLIMENT_PHRASES, " ").replace(/\s+/g, " ").trim();
    if (!text) return null;
    // "not bad" really is a mild compliment
    text = text.replace(/\bnot bad\b/g, "decent");

    const tokens = text.split(" ");
    const padded = ` ${text} `;

    // Requests and questions are not compliments ("show me something cool", "is this good?")
    const exclamative = /^(how|what a|what an)\b/.test(text) && !raw.includes("?");
    if (!exclamative) {
        if (QUESTION_STARTERS.has(tokens[0])) return null;
        if (raw.includes("?") && !/^(is|are) not\b/.test(text)) return null;
    }

    // Negated or negative statements
    if (tokens.some((token) => NEGATION_WORDS.has(token))) return null;
    if (tokens.some((token) => NEGATIVE_WORDS.has(token))) return null;

    const praise = findPraise(tokens, text);
    if (!praise) return null;

    const targets = findTargets(tokens);
    // "Great, thanks" is an acknowledgement, not a compliment
    if (!targets.length && tokens.some((token) => token === "thanks" || token === "thank" || token === "thx")) return null;
    const hasReference = tokens.some((token) => REFERENCE_WORDS.has(token));
    const isTargetToken = (token) => TARGET_LOOKUP.has(singular(token)) || TARGET_LOOKUP.has(token);
    const isPraiseToken = (token) =>
        STRONG_PRAISE.some((word) => closeEnough(token, word)) || WEAK_PRAISE.some((word) => closeEnough(token, word));

    // Praise for a technology in general ("Python is awesome", "Kali Linux is cool")
    const ownerWords = tokens.some((token) => REFERENCE_WORDS.has(token) && token !== "it" && token !== "here" && token !== "everything");
    const mentionsKali = hasWord(padded, "kali") || hasWord(padded, "linux");
    const subject = subjects.find((name) => {
        const key = normalizeText(name);
        return key.length >= 3 && hasWord(padded, key);
    });
    if (!ownerWords && !targets.length) {
        if (mentionsKali) return { kind: "thirdParty", subject: "Kali Linux", isKali: true };
        if (subject) return { kind: "thirdParty", subject, isKali: false };
    }

    // Anything left over means the message is about something else ("Elon is great", "my dog is awesome")
    const leftover = tokens.filter(
        (token) =>
            !FILLER_WORDS.has(token) &&
            !isPraiseToken(token) &&
            !isTargetToken(token) &&
            !REFERENCE_WORDS.has(token) &&
            !/^(love|like|admire|appreciate|enjoy|adore)/.test(token) &&
            !(token === "kali" || token === "linux"),
    );
    if (!targets.length && leftover.length) return null;

    // Vague praise needs something to attach to
    if (praise === "weak" && !targets.length && !hasReference) return null;

    const pureExclamation = !targets.length && !leftover.length && tokens.length <= 8;
    if (!targets.length && !hasReference && !pureExclamation) return null;

    return { kind: "compliment", target: targets[0] ?? "general" };
}

/* ---------- replies ---------- */

const VARIANTS = {
    site: [
        "Thanks! Glad you like it. I wanted to build something that reflects my interests in engineering, AI, and problem-solving.",
        "Appreciate it! I wanted a portfolio that feels like a desktop instead of a webpage, and a lot of small details went into that.",
        "That means a lot, thank you! Making it feel like a real operating system was the fun part.",
        "Glad it landed well! It's never really finished, there's always one more detail I want to tweak.",
    ],
    terminal: [
        "Appreciate it! Wanted to give this portfolio a little Kali Linux personality instead of the usual chatbot experience.",
        "Thanks! It's only a simulation, so nothing here can touch a real system, but it looks the part, right?",
        "Ha, thanks! All the hacker-movie atmosphere, none of the actual hacking.",
        "Glad you like it! If you haven't poked around yet, try 'neofetch' or 'ls'.",
    ],
    projects: [
        "Thanks! I've put a lot of effort into building projects that solve actual problems and explore interesting technologies.",
        "Appreciate that! I like building things I'd actually use, and I learn a lot along the way.",
        "Glad they stand out! Want me to point you to the one I'd start with?",
        "Thank you! Every project taught me something I didn't know when I started it.",
    ],
    skills: [
        "That's kind of you! Still learning, experimenting, and trying to build better things every day.",
        "Thanks! I'm mostly curious and stubborn, which goes a surprisingly long way in engineering.",
        "Appreciate it! There's still plenty I want to learn, and that's what keeps it fun.",
        "Kind words, thank you! I try to learn something new from every project.",
    ],
    creativity: [
        "Thank you! I like mixing engineering with a bit of design. The unusual ideas are usually the fun ones.",
        "Appreciate that! Creativity is half the fun of building things.",
        "That means a lot! I try to make things that don't look like everyone else's.",
    ],
    general: [
        "Thanks, I appreciate that! Glad you're enjoying it.",
        "That made my day, thank you!",
        "Appreciate it! Let me know if there's anything you'd like to explore.",
        "Thank you! Glad it comes across well.",
    ],
};

// Occasionally used when someone keeps complimenting (every third compliment).
const HUMOR = [
    "Careful, keep this up and I'll need a bigger monospace font for my ego.",
    "Okay, you're going to make my cursor blink faster.",
    "At this rate I'll have to add a 'compliments' command to this terminal.",
];

const THIRD_PARTY_SKILL = [
    (name) => `Agreed, ${name} is a lot of fun to work with.`,
    (name) => `Ha, I'm a fan too. ${name} is part of my toolkit.`,
];

const THIRD_PARTY_KALI = [
    "Kali's a classic! It's the inspiration for this terminal's look, minus the actual security tools.",
    "Same here, I like the Kali aesthetic. This terminal borrows the look and none of the power.",
];

const SUGGESTIONS = {
    site: ["How was this website built?", "What projects has he built?", "How can I contact him?"],
    terminal: ["neofetch", "How was this website built?", "What projects has he built?"],
    projects: ["Which project shows his ML knowledge?", "What technologies does he know?", "How can I contact him?"],
    skills: ["What are his strongest skills?", "Why should we hire him?", "How can I contact him?"],
    creativity: ["How was this website built?", "What projects has he built?", "How can I contact him?"],
    general: ["What projects has he built?", "What are his strongest skills?", "How can I contact him?"],
    thirdParty: ["What technologies does he know?", "What projects has he built?", "How can I contact him?"],
};

export function createComplimentState() {
    return { count: 0, used: {}, humorIndex: 0 };
}

function pickUnused(key, options, state) {
    const used = state.used[key] ?? [];
    let candidates = options.map((_, index) => index).filter((index) => !used.includes(index));
    if (!candidates.length) {
        // everything used once: start again, but never repeat the line we just used
        const last = used[used.length - 1];
        candidates = options.map((_, index) => index).filter((index) => index !== last);
        state.used[key] = [];
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    state.used[key] = [...(state.used[key] ?? []), chosen];
    return options[chosen];
}

/**
 * Builds the reply for a detected compliment. `state` (from createComplimentState) remembers which
 * lines were already used so the conversation doesn't repeat itself.
 */
export function buildComplimentReply(match, state) {
    state.count += 1;

    if (match.kind === "thirdParty") {
        const text = match.isKali
            ? pickUnused("kali", THIRD_PARTY_KALI, state)
            : pickUnused("thirdParty", THIRD_PARTY_SKILL, state)(match.subject);
        return { text, suggestions: SUGGESTIONS.thirdParty };
    }

    const base = pickUnused(match.target, VARIANTS[match.target] ?? VARIANTS.general, state);
    const addHumor = state.count >= 3 && state.count % 3 === 0;
    const text = addHumor ? `${base}\n${HUMOR[state.humorIndex++ % HUMOR.length]}` : base;
    return { text, suggestions: SUGGESTIONS[match.target] ?? SUGGESTIONS.general };
}