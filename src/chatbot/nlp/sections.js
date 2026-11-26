export function emptySectionReply(label) { return `${label} are not listed yet.`; }
export function buildSectionReply(label, items, render = (item) => String(item)) {
    return items?.length ? `${label}:\n${items.map((item) => `- ${render(item)}`).join("\n")}` : emptySectionReply(label);
}
