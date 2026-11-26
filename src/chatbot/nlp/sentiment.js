const POSITIVE = /\b(love|like|great|good|awesome|amazing|nice|impressive|thanks|thank|excellent|wonderful|helpful)\b/i;
const NEGATIVE = /\b(hate|bad|ugly|terrible|awful|worst|boring|broken|useless|confusing|slow|clunky|messy|poor|annoying|disappointing|disappointed|frustrating|frustrated|unhelpful|cringe|sucks|suck)\b/i;
const NEGATED_POSITIVE = /\b(?:not|never|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|cannot|can't)\s+(?:really\s+|very\s+)?(?:good|great|nice|helpful|impressive|useful|clear|easy|awesome|amazing|excellent|wonderful|like|love|enjoy)\b/i;
const POSITIVE_NEGATIVE = /\bnot\s+(?:so\s+)?bad\b/i;

export function detectSentiment(text) {
    const value = String(text ?? "");
    if (POSITIVE_NEGATIVE.test(value)) return "POSITIVE";
    if (NEGATIVE.test(value) || NEGATED_POSITIVE.test(value)) return "NEGATIVE";
    if (POSITIVE.test(value)) return "POSITIVE";
    return "NEUTRAL";
}

export function isFeedbackStatement(text) {
    const value = String(text ?? "").trim();
    if (!value || value.includes("?") || detectSentiment(value) !== "NEGATIVE") return false;
    return !/\b(show|tell|what|how|where|why|which|explain|list|find|can you|could you|does he|is he|are there)\b/i.test(value);
}
