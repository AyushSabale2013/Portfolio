import assert from "node:assert/strict";
import test from "node:test";
import { isRegisteredCommand, runTerminalCommand, tokenizeCommand } from "./commands.js";

const context = { currentDirectory: "~/portfolio", setCurrentDirectory(value) { this.currentDirectory = value; }, commandHistory: ["help"], openApp(id) { this.opened = id; }, spiderCliBrand: "Spider CLI test" };

test("simulated command registry parses quotes and never executes shell commands", () => {
    assert.deepEqual(tokenizeCommand('echo "hello world"'), ["echo", "hello world"]);
    assert.equal(isRegisteredCommand("cd projects"), true);
    assert.equal(runTerminalCommand("echo hello", context).output, "hello");
    assert.equal(runTerminalCommand("rm -rf /", context).output, "zsh: command not found: rm");
});

test("navigation updates only the virtual directory and opens a registered app", () => {
    const result = runTerminalCommand("cd projects", context);
    assert.equal(result.output, "Opening Projects...");
    assert.equal(context.currentDirectory, "~/portfolio/projects");
    assert.equal(context.opened, "projects");
});
