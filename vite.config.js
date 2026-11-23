import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionsMarkdown = readFileSync(path.resolve(__dirname, "versions.md"), "utf8");
const spiderCliVersionMatch = versionsMarkdown.match(/^\s*(?:[-*]\s*)?Spider CLI\s*:\s*v?([0-9]+\.[0-9]+\.[0-9]+(?:[-+][\w.-]+)?)\s*$/im);

if (!spiderCliVersionMatch) {
    throw new Error("versions.md must include a Spider CLI version in major.minor.patch format.");
}

export default defineConfig({
    define: {
        __SPIDER_CLI_VERSION__: JSON.stringify(spiderCliVersionMatch[1]),
    },
    plugins: [
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
