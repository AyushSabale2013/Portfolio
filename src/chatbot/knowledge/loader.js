/* ==========================================================================
   loader.js - validates and normalises raw portfolio knowledge.

   - Never throws: malformed or missing data produces safe defaults plus
     entries in `errors` / `warnings`, so the chatbot keeps working.
   - Strips anything that looks like a secret (keys named password / token /
     api key..., values that look like private keys or access tokens) so it can
     never be shown to visitors.
   - Only http(s) links are kept.
   ========================================================================== */

import { uniqueStrings } from "./text.js";

const SECRET_KEY_RE = /(password|passwd|secret|token|api[-_ ]?key|private|credential|authorization)/i;
const SECRET_VALUE_RE = /(-----BEGIN [A-Z ]*PRIVATE KEY-----|\bsk-[A-Za-z0-9_-]{20,}|\bghp_[A-Za-z0-9]{20,}|\bAKIA[0-9A-Z]{16}\b)/;

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const str = (value) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");

const strList = (value) =>
    uniqueStrings((Array.isArray(value) ? value : []).map(str).filter(Boolean));

const publicUrl = (value, warn, where) => {
    const url = str(value);
    if (!url) return "";
    if (/^https?:\/\/\S+$/i.test(url)) return url;
    warn(`${where}: ignored a link that is not http(s).`);
    return "";
};

/** Removes secret-looking keys and values anywhere in the data. Returns a cleaned deep copy. */
function scrub(value, path, warn) {
    if (Array.isArray(value)) return value.map((item, index) => scrub(item, `${path}[${index}]`, warn));
    if (isPlainObject(value)) {
        const out = {};
        for (const [key, inner] of Object.entries(value)) {
            if (SECRET_KEY_RE.test(key)) {
                warn(`${path}.${key}: removed because the field name looks private.`);
                continue;
            }
            out[key] = scrub(inner, `${path}.${key}`, warn);
        }
        return out;
    }
    if (typeof value === "string" && SECRET_VALUE_RE.test(value)) {
        warn(`${path}: removed because the value looks like a secret.`);
        return "";
    }
    return value;
}

function normalizeProfile(raw) {
    const p = isPlainObject(raw) ? raw : {};
    return {
        name: str(p.name),
        fullName: str(p.fullName),
        headline: str(p.headline),
        summary: str(p.summary),
        focus: str(p.focus),
        goal: str(p.goal),
        location: str(p.location),
        interests: strList(p.interests),
        expertise: strList(p.expertise),
        strengths: strList(p.strengths),
    };
}

function normalizeEducation(raw, warn) {
    if (raw !== undefined && !Array.isArray(raw)) warn("education: expected a list, ignoring it.");
    return (Array.isArray(raw) ? raw : [])
        .filter(isPlainObject)
        .map((item) => ({
            institution: str(item.institution),
            degree: str(item.degree),
            field: str(item.field),
            batch: str(item.batch),
            status: str(item.status),
            notes: str(item.notes),
        }))
        .filter((item) => item.institution || item.degree || item.field || item.batch);
}

const DEFAULT_LABELS = { ai: "AI / ML" };
const labelFor = (key) => DEFAULT_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

/** Accepts either { key: ["A","B"] } or { key: { label, items } } and returns the second form. */
function normalizeSkills(raw, warn) {
    if (raw !== undefined && !isPlainObject(raw)) warn("skills: expected an object, ignoring it.");
    const out = {};
    for (const [key, value] of Object.entries(isPlainObject(raw) ? raw : {})) {
        if (Array.isArray(value)) out[key] = { label: labelFor(key), items: strList(value) };
        else if (isPlainObject(value)) out[key] = { label: str(value.label) || labelFor(key), items: strList(value.items) };
        else warn(`skills.${key}: expected a list, ignoring it.`);
    }
    return out;
}

function normalizeProjects(raw, warn) {
    if (raw !== undefined && !Array.isArray(raw)) warn("projects: expected a list, ignoring it.");
    const seen = new Set();
    const out = [];
    (Array.isArray(raw) ? raw : []).forEach((item, index) => {
        if (!isPlainObject(item)) {
            warn(`projects[${index}]: not an object, skipped.`);
            return;
        }
        const title = str(item.title);
        if (!title) {
            warn(`projects[${index}]: missing title, skipped.`);
            return;
        }
        if (seen.has(title.toLowerCase())) {
            warn(`projects[${index}]: duplicate title "${title}", skipped.`);
            return;
        }
        seen.add(title.toLowerCase());
        const where = `projects[${index}] (${title})`;
        out.push({
            id: item.id ?? index + 1,
            title,
            aliases: strList(item.aliases),
            category: str(item.category),
            description: str(item.description),
            summary: str(item.summary),
            problem: str(item.problem),
            highlights: strList(item.highlights),
            technologies: strList(item.technologies),
            topics: strList(item.topics),
            isPortfolioSite: item.isPortfolioSite === true,
            liveUrl: publicUrl(item.liveUrl, warn, where),
            githubUrl: publicUrl(item.githubUrl, warn, where),
        });
    });
    return out;
}

function normalizeExperience(raw, warn) {
    if (raw !== undefined && !Array.isArray(raw)) warn("experience: expected a list, ignoring it.");
    return (Array.isArray(raw) ? raw : [])
        .filter(isPlainObject)
        .map((item) => ({
            role: str(item.role),
            organization: str(item.organization),
            period: str(item.period),
            description: str(item.description),
        }))
        .filter((item) => item.role || item.organization);
}

function normalizeTitled(raw, fields, section, warn) {
    if (raw !== undefined && !Array.isArray(raw)) warn(`${section}: expected a list, ignoring it.`);
    return (Array.isArray(raw) ? raw : [])
        .filter(isPlainObject)
        .map((item) => Object.fromEntries(fields.map((field) => [field, field === "url" ? publicUrl(item[field], warn, section) : str(item[field])])))
        .filter((item) => item.title);
}

function normalizeContact(raw, warn) {
    const c = isPlainObject(raw) ? raw : {};
    const email = str(c.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) warn("contact.email: does not look like an email address, ignored.");
    const socials = (Array.isArray(c.socials) ? c.socials : [])
        .filter(isPlainObject)
        .map((item) => ({ name: str(item.name), url: publicUrl(item.url, warn, `contact.socials (${str(item.name)})`) }))
        .filter((item) => item.name);
    return {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "",
        socials,
    };
}

/**
 * Validates raw knowledge data.
 * @returns {{ ok: boolean, data: object, errors: string[], warnings: string[] }}
 *   `data` is always safe to use; `ok` is false only when the root itself was unusable.
 */
export function validateKnowledge(raw) {
    const errors = [];
    const warnings = [];
    const warn = (message) => warnings.push(message);

    let source = raw;
    if (!isPlainObject(source)) {
        errors.push("Knowledge data must be a JSON object. Using an empty knowledge base.");
        source = {};
    }
    const clean = scrub(source, "knowledge", warn);

    const data = {
        meta: {
            schemaVersion: Number.isInteger(clean.meta?.schemaVersion) ? clean.meta.schemaVersion : 1,
            lastUpdated: str(clean.meta?.lastUpdated),
        },
        profile: normalizeProfile(clean.profile),
        education: normalizeEducation(clean.education, warn),
        skills: normalizeSkills(clean.skills, warn),
        projects: normalizeProjects(clean.projects, warn),
        experience: normalizeExperience(clean.experience, warn),
        achievements: normalizeTitled(clean.achievements, ["title", "description", "date"], "achievements", warn),
        certifications: normalizeTitled(clean.certifications, ["title", "issuer", "date", "url"], "certifications", warn),
        contact: normalizeContact(clean.contact, warn),
    };

    if (!data.profile.name) warn("profile.name is empty.");
    if (!data.projects.length) warn("No valid projects found.");

    return { ok: errors.length === 0, data, errors, warnings };
}