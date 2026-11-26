import assert from "node:assert/strict"; import test from "node:test"; import { rankIntents } from "./intents.js";
test("intent ranking identifies project and experience requests",()=>{assert.equal(rankIntents("show me projects")[0].id,"projects");assert.equal(rankIntents("work experience")[0].id,"experience");});
