import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

globalThis.__SPIDER_CLI_VERSION__ = "2.0.1";
const { getReply, createChatContext } = await import("./index.js");
const portfolio = JSON.parse(readFileSync(new URL("../knowledge/portfolio.json", import.meta.url), "utf8"));

test("technology project list resolves an ordinal follow-up and reports structured data", () => {
    const ctx = createChatContext();
    const first = getReply("Show me your Python projects", ctx);
    assert.match(first.text, /Solar Flare Prediction/);
    assert.deepEqual(first.entities.technology, ["Python"]);
    assert.equal(first.intent, "PROJECTS");
    assert.equal(first.sentiment, "NEUTRAL");
    const follow = getReply("Tell me about the first one", ctx);
    assert.match(follow.text, /Solar Flare Prediction/);
});

test("unknown technology is stated honestly and positive sentiment does not replace intent", () => {
    const ctx = createChatContext();
    const rust = getReply("Show me your Rust projects", ctx);
    assert.match(rust.text, /Rust isn't listed in his skills or projects/);
    const combined = getReply("I love your projects. Show me your Python projects.", ctx);
    assert.equal(combined.intent, "PROJECTS");
    assert.equal(combined.sentiment, "POSITIVE");
    assert.deepEqual(combined.entities.technology, ["Python"]);
});

test("empty sections, no context, empty and long messages remain safe", () => {
    const ctx = createChatContext();
    assert.match(getReply("What are his achievements?", ctx).text, /not listed yet/);
    assert.ok(getReply("Tell me about the first one", createChatContext()).text);
    assert.ok(getReply("", ctx).text);
    for (let i = 0; i < 100; i++) getReply(`repeat ${i}`, ctx);
    getReply("x".repeat(100000), ctx);
    assert.ok(ctx.history.length <= 20);
});

test("NLP and reply implementation contains no portfolio title or skill literals", () => {
    const sourceFiles = ["preprocess.js", "intents.js", "sentiment.js", "context.js", "replies.js", "index.js"];
    const source = sourceFiles.map((name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8").toLowerCase()).join("\n");
    for (const project of portfolio.projects) for (const name of [project.title, ...project.aliases]) assert.equal(source.includes(name.toLowerCase()), false, `Hardcoded project name: ${name}`);
    for (const group of Object.values(portfolio.skills)) for (const skill of group.items) assert.equal(source.includes(skill.toLowerCase()), false, `Hardcoded skill: ${skill}`);
});

test("negative comments receive a constructive response while questions keep their intent", () => {
    const ctx = createChatContext();
    const feedback = getReply("Your website is confusing", ctx);
    assert.match(feedback.text, /take that as constructive feedback/i);
    assert.equal(feedback.sentiment, "NEGATIVE");
    const question = getReply("I hate the site. How was it built?", ctx);
    assert.equal(question.intent, "PROJECTS");
    assert.doesNotMatch(question.text, /constructive feedback/i);
});
