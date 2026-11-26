/* ==========================================================================
   text.js - tiny text helpers shared by the knowledge modules.
   Pure functions, no dependencies.
   ========================================================================== */

/** Same normalisation the chatbot uses: lower-case, ASCII words, "node.js" -> "node js". */
export function normalize(value) {
    return String(value ?? "")
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/'s\b/g, "")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** "MongoDB(ATLAS)" -> "mongodb", "Node.js" -> "nodejs". Used to compare technology names. */
export function techKey(value) {
    return String(value ?? "")
        .toLowerCase()
        .replace(/\([^)]*\)/g, " ")
        .replace(/[^a-z0-9+#]/g, "");
}

export function levenshtein(a, b) {
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

/** True for identical words and for small typos in longer words ("proejct", "tensorflw"). */
export function fuzzyEqual(a, b) {
    if (a === b) return true;
    if (a.length < 5 || b.length < 5 || a[0] !== b[0]) return false;
    if (Math.abs(a.length - b.length) > 2) return false;
    return levenshtein(a, b) <= (Math.max(a.length, b.length) >= 8 ? 2 : 1);
}

/** Prepares a message for matching without touching the original string. */
export function prepare(message) {
    const text = normalize(message);
    const tokens = text ? text.split(" ") : [];
    return { text, tokens, padded: ` ${text} ` };
}

export const hasPhrase = (padded, phrase) => Boolean(phrase) && padded.includes(` ${phrase} `);

/** Case-insensitive de-duplication that keeps the first spelling. */
export function uniqueStrings(values) {
    const seen = new Set();
    const out = [];
    for (const value of values) {
        const key = String(value).toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            out.push(value);
        }
    }
    return out;
}