export function normalize(value) {
    return String(value)
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/\bi'm\b/g, "i am")
        .replace(/n't\b/g, " not")
        .replace(/\b(what|who|where|how|that|it|he|she|there|here|let)'s\b/g, "$1 is")
        .replace(/'s\b/g, "")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Words that carry no meaning for matching.
export const STOPWORDS = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "am", "to", "of", "in", "on", "at",
    "for", "and", "or", "but", "me", "my", "you", "your", "yours", "please", "can", "could", "would",
    "will", "shall", "should", "do", "does", "did", "tell", "about", "give", "show", "i", "im", "he",
    "his", "him", "she", "her", "they", "their", "them", "we", "us", "our", "it", "its", "this", "that",
    "these", "those", "with", "so", "just", "also", "some", "any", "there", "here", "than", "then",
    "if", "as", "by", "from", "into", "over", "out", "up", "has", "have", "had", "get", "got", "let",
    "want", "need", "like", "ayush",
]);

// Very light stemmer: "projects" -> "project", "building" -> "build", "studies" -> "study".
export function stem(word) {
    if (word.length <= 3) return word;
    if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
    if (word.endsWith("sses")) return word.slice(0, -2);
    if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
    if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
    return word;
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

// 1 = exact match, 0.7 = close enough (typo), 0 = no match.
export function fuzzyEqual(a, b) {
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

export function analyse(message) {
    const text = normalize(message);
    const tokens = text.split(" ").filter(Boolean);
    const stems = tokens.filter((token) => !STOPWORDS.has(token)).map(stem);
    return { text, padded: ` ${text} `, tokens, stems };
}


export function tokenize(value) { return normalize(value).split(" ").filter(Boolean); }
