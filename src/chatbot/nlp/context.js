export const MAX_HISTORY = 20;
export function createChatContext() { return { visitor: null, lastTopic: null, lastList: [], lastSelected: null, chatSuggestions: [], history: [], compliment: { count: 0, used: {}, humorIndex: 0 } }; }
export function resolveListReference(text, list = [], lastSelected = null) {
    if (!list.length) return null;
    if (/\bboth\b/i.test(text)) return list.length === 2 ? [...list] : null;
    if (/\b(first|1st)\b/i.test(text)) return list[0];
    if (/\b(second|2nd)\b/i.test(text)) return list[1] ?? null;
    if (/\blast\b/i.test(text)) return list.at(-1);
    if (/\bthe other one\b/i.test(text)) return list.length === 2 && lastSelected ? list.find((item) => item !== lastSelected) : list.length === 2 ? list[1] : null;
    if (/\b(that one|this one)\b/i.test(text)) return lastSelected ?? list.at(-1);
    return null;
}
export function pushHistory(ctx, message) { ctx.history.push(String(message)); if (ctx.history.length > MAX_HISTORY) ctx.history.splice(0, ctx.history.length - MAX_HISTORY); }
