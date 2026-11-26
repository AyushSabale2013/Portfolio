import assert from "node:assert/strict";
import test from "node:test";
import { buildSectionReply, emptySectionReply } from "./sections.js";

test("reply section builder gives honest empty data fallback", () => {
    assert.equal(emptySectionReply("Achievements"), "Achievements are not listed yet.");
    assert.match(buildSectionReply("Awards", []), /not listed yet/);
});
