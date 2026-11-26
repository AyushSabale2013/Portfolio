import assert from "node:assert/strict"; import test from "node:test"; import { buildSectionReply, emptySectionReply } from "./sections.js";
test("section replies use listed content and honest empty fallback",()=>{assert.equal(buildSectionReply("Awards",["A","B"]),"Awards:\n- A\n- B");assert.equal(emptySectionReply("Awards"),"Awards are not listed yet.");});
