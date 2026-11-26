import assert from "node:assert/strict"; import test from "node:test"; import { normalize, tokenize, fuzzyEqual } from "./preprocess.js";
test("preprocess normalizes, tokenizes and tolerates small typos",()=>{assert.equal(normalize("Python, please!"),"python please");assert.deepEqual(tokenize("Show projects"),["show","projects"]);assert.ok(fuzzyEqual("proejct","project") > 0);});
