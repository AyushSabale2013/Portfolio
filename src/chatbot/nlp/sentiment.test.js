import assert from "node:assert/strict";
import test from "node:test";
import { detectSentiment, isFeedbackStatement } from "./sentiment.js";

test("sentiment is independent from request classification", () => {
    assert.equal(detectSentiment("I love your projects"), "POSITIVE");
    assert.equal(detectSentiment("show projects"), "NEUTRAL");
});

test("negative and negated-positive feedback is recognized", () => {
    assert.equal(detectSentiment("This site is confusing"), "NEGATIVE");
    assert.equal(detectSentiment("The design is not very good"), "NEGATIVE");
    assert.equal(detectSentiment("I do not like this design"), "NEGATIVE");
    assert.equal(detectSentiment("It is not bad"), "POSITIVE");
    assert.equal(isFeedbackStatement("Your website is ugly"), true);
    assert.equal(isFeedbackStatement("I hate the site. How was it built?"), false);
});
