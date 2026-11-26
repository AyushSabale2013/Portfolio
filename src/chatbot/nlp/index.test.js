import assert from "node:assert/strict"; import test from "node:test"; import { normalize, detectSentiment, createChatContext } from "./index.js";
test("public NLP entry exports pure primitives",()=>{assert.equal(normalize("  Hi! "),"hi");assert.equal(detectSentiment("great"),"POSITIVE");assert.deepEqual(createChatContext().lastList,[]);});
