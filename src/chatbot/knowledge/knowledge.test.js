// Run with: node --test src/chatbot/knowledge/
// Uses only Node's built-in test runner, so no dependencies are needed.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateKnowledge } from "./loader.js";
import { createKnowledgeBase } from "./retrieval.js";

const raw = JSON.parse(readFileSync(new URL("./portfolio.json", import.meta.url), "utf8"));
const clone = () => JSON.parse(JSON.stringify(raw));
const kb = createKnowledgeBase(raw);
const titles = (projects) => projects.map((project) => project.title);

test("shipped portfolio.json is valid with no errors or warnings", () => {
    assert.equal(kb.ok, true);
    assert.deepEqual(kb.errors, []);
    assert.deepEqual(kb.warnings, []);
});

/* ---- the six questions from the task ---- */

test("Who is Ayush? -> profile comes from JSON", () => {
    assert.equal(kb.getProfile().name, "Ayush");
});

test("Where does he study? -> education from JSON, empty when not provided", () => {
    assert.equal(kb.describeEducation(), "");
    const edited = clone();
    edited.education = [{ institution: "Example Institute", degree: "B.Tech", field: "Computer Science", batch: "2027" }];
    assert.equal(createKnowledgeBase(edited).describeEducation(), "B.Tech in Computer Science at Example Institute (2027)");
});

test("What programming languages does he know? -> skill category", () => {
    assert.equal(kb.findSkillCategory("what programming languages does he know"), "languages");
    assert.deepEqual(kb.getSkillCategory("languages").items, ["JavaScript", "Python"]);
});

test("Show his machine learning projects -> topic search", () => {
    const result = kb.searchProjects("show his machine learning projects");
    assert.deepEqual(titles(result.projects), ["Solar Flare Prediction"]);
});

test("What technologies were used in CamPass? -> project by name", () => {
    const project = kb.findProjectByName("what technologies were used in CamPass?");
    assert.equal(project.title, "Campass");
    assert.deepEqual(kb.getProjectDetails(project).technologies, ["React", "Node.js", "MongoDB(ATLAS)", "Socket.io", "GPS"]);
});

test("How can I contact him? -> contact info, only public links", () => {
    const contact = kb.getContact();
    assert.equal(contact.email, "");
    assert.equal(kb.getSocial("GitHub").url, "https://github.com/AyushSabale2013");
    assert.equal(kb.getSocial("LinkedIn"), null);
});

/* ---- retrieval details ---- */

test("project names: aliases, unique words and typos", () => {
    assert.equal(kb.findProjectByName("tell me more about your solar flare project").title, "Solar Flare Prediction");
    assert.equal(kb.findProjectByName("spider os").title, "Spider OS Portfolio");
    assert.equal(kb.findProjectByName("track academy").title, "Track Academy");
    assert.equal(kb.findProjectByName("solr flare").title, "Solar Flare Prediction");
    assert.equal(kb.findProjectByName("show me your projects"), null);
    assert.equal(kb.findProjectByName(""), null);
});

test("technology search handles Node.js and MongoDB(ATLAS) spellings", () => {
    assert.deepEqual(titles(kb.findProjectsByTechnology("python")), ["Solar Flare Prediction"]);
    assert.deepEqual(titles(kb.findProjectsByTechnology("node js")), ["Track Academy", "Campass"]);
    assert.deepEqual(titles(kb.findProjectsByTechnology("MongoDB")), ["Track Academy", "Campass"]);
    assert.deepEqual(kb.findProjectsByTechnology("cobol"), []);
    assert.deepEqual(kb.searchProjects("show me your python projects").query, ["Python"]);
});

test("category and topic search", () => {
    assert.deepEqual(titles(kb.findProjectsByCategory("any full stack work")), ["Track Academy"]);
    assert.deepEqual(titles(kb.findProjectsByCategory("web development")), ["Spider OS Portfolio", "Campass"]);
    assert.equal(kb.searchProjects("recipes for dinner").by, "none");
});

test("entity extraction only returns things that exist in the data", () => {
    assert.deepEqual(kb.extractEntities("Show me your Python projects."), { technology: ["Python"] });
    assert.deepEqual(kb.extractEntities("Tell me more about your solar flare project."), { project: ["Solar Flare Prediction"] });
    assert.deepEqual(kb.extractEntities("do you know cobol"), {});
});

test("the portfolio-site project is found by flag, not by title", () => {
    assert.equal(kb.getPortfolioSiteProject().title, "Spider OS Portfolio");
});

/* ---- updating the JSON changes answers without touching code ---- */

test("editing JSON changes what is retrieved", () => {
    const edited = clone();
    edited.projects.push({ title: "Weather Bot", category: "Web Development", description: "Forecast app.", technologies: ["Python", "Flask"] });
    edited.skills.backend.items.push("Flask");
    edited.contact.email = "me@example.com";
    const next = createKnowledgeBase(edited);

    assert.equal(next.findProjectByName("weather bot").title, "Weather Bot");
    assert.deepEqual(titles(next.findProjectsByTechnology("python")), ["Solar Flare Prediction", "Weather Bot"]);
    assert.ok(next.findSkillsInText("do you know flask").some((skill) => skill.name === "Flask"));
    assert.equal(next.getContact().email, "me@example.com");
    // the original is untouched
    assert.equal(kb.findProjectByName("weather bot"), null);
});

/* ---- validation and safety ---- */

test("malformed data never throws and falls back to safe defaults", () => {
    for (const bad of [null, undefined, 42, "text", [], { projects: "nope", skills: [1], education: {}, contact: 5 }]) {
        const result = createKnowledgeBase(bad);
        assert.ok(Array.isArray(result.getProjects()));
        assert.equal(typeof result.describeEducation(), "string");
        assert.deepEqual(result.getContact().socials, []);
    }
    assert.equal(validateKnowledge(null).ok, false);
    assert.equal(validateKnowledge({}).ok, true);
});

test("bad projects are skipped with a warning", () => {
    const result = validateKnowledge({ projects: [{ title: "A" }, { title: "a" }, { description: "no title" }, "x"] });
    assert.deepEqual(result.data.projects.map((project) => project.title), ["A"]);
    assert.equal(result.warnings.filter((message) => message.startsWith("projects[")).length, 3);
});

test("secrets and non-http links are stripped", () => {
    const result = validateKnowledge({
        profile: { name: "A", apiKey: "abc" },
        contact: { email: "not-an-email", socials: [{ name: "Site", url: "javascript:alert(1)" }], password: "x" },
        projects: [{ title: "P", githubUrl: "ftp://example.com", description: "key sk-abcdefghijklmnopqrstuvwxyz123456" }],
    });
    assert.equal("apiKey" in result.data.profile, false);
    assert.equal(result.data.contact.email, "");
    assert.equal(result.data.contact.socials[0].url, "");
    assert.equal(result.data.projects[0].githubUrl, "");
    assert.equal(result.data.projects[0].description, "");
    assert.ok(result.warnings.length >= 5);
});

test("returned data is a copy: callers cannot corrupt the knowledge base", () => {
    kb.getSkillCategory("languages").items.push("COBOL");
    kb.getProfile().interests.push("x");
    assert.deepEqual(kb.getSkillCategory("languages").items, ["JavaScript", "Python"]);
    assert.deepEqual(kb.getInterests(), []);
});