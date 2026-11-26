import knowledge from "./knowledge/index.js";
const kb = knowledge;
const profileInfo = kb.getProfile();
const projectList = kb.getProjects();
const basic = { name: profileInfo.name || "the portfolio owner" };
const about = { description: profileInfo.summary, focus: profileInfo.focus, goal: profileInfo.goal };
const educationLine = kb.describeEducation();
const PROMPT_USER = "ayush";
const PROMPT_HOST = "kali";
/* ==========================================================================
   8. TERMINAL COMMANDS (run locally, never go through the chatbot)
   ========================================================================== */

export const PORTFOLIO_ROOT = "~/portfolio";

const PORTFOLIO_TREE = `portfolio/
├── profile/
├── projects/
├── connect/
├── browser/
├── terminal/
├── links/
└── resume/`;

const COMMAND_HELP = `Welcome! You can talk to Spider CLI in plain English. No technical background needed.

You can:
  - Ask about Ayush, his skills, projects and experience.
  - Tap the suggestion buttons under each answer.
  - Explore his sections with commands like "cd profile" and "cd projects".

Try asking:
  Who is Ayush?
  What has he built?
  What is machine learning?
  Is he suitable for an AI/ML internship?
  Why should we hire him?

Terminal commands:
  clear             Clear the terminal output
  ls [section]      List portfolio sections (try "ls projects")
  help              Show this guide
  whoami            Introduce Ayush
  pwd               Print the current virtual directory
  date              Show the current date and time
  neofetch          Show Spider CLI and portfolio information
  history           Show previously entered commands and questions
  echo [text]       Print text
  about             Show information about Ayush
  commands          Alias for help
  cd <section>      Open profile, projects, connect, browser, terminal, links, or resume
  open <section>    Same as cd

Keyboard:
  Enter             Send
  Shift+Enter       New line
  Tab               Complete a command
  Up / Down         Recall earlier input
  Ctrl+L            Clear the screen
  Ctrl+C            Stop an answer or abandon the line

This is a simulated terminal: no real commands are ever executed.`;

export const SECTION_ROUTES = {
    profile: { appId: "profile", label: "Profile" },
    projects: { appId: "projects", label: "Projects" },
    connect: { appId: "contact", label: "Connect" },
    browser: { appId: "browser", label: "Browser" },
    terminal: { appId: "terminal", label: "Terminal" },
    links: { appId: "contact", label: "Links" },
    resume: { appId: "resume", label: "Resume" },
};

const SHELL_COMMANDS = new Set([
    "alias", "apt", "cat", "chmod", "cp", "curl", "find", "git", "grep",
    "head", "less", "mkdir", "mv", "nano", "node", "npm", "printenv",
    "rm", "rmdir", "tail", "touch", "vim", "wget",
]);

// If these are followed by a whole sentence, treat the input as a question, not a command.
const NO_ARGUMENT_COMMANDS = new Set(["help", "commands", "whoami", "pwd", "date", "neofetch", "history", "about", "clear", "exit"]);

export const TAB_COMMANDS = ["clear", "ls", "help", "whoami", "pwd", "date", "neofetch", "history", "echo", "about", "commands", "cd", "open", "exit", "sudo"];
export const TAB_COMMANDS_WITH_ARGS = new Set(["cd", "open", "ls", "echo"]);

export function tokenizeCommand(input) {
    const tokens = [];
    const tokenPattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;

    while ((match = tokenPattern.exec(input)) !== null) {
        tokens.push(match[1] ?? match[2] ?? match[3]);
    }

    return tokens;
}

function openSection(args, context) {
    const destination = (args[0] ?? "").toLowerCase().replace(/^\.\//, "").replace(/\/$/, "");

    if (!destination || ["/", "~", "..", "portfolio", "~/portfolio"].includes(destination)) {
        context.setCurrentDirectory(PORTFOLIO_ROOT);
        return { output: PORTFOLIO_ROOT };
    }

    const section = destination.replace(/^.*\//, "");
    const route = Object.hasOwn(SECTION_ROUTES, section) ? SECTION_ROUTES[section] : null;
    if (!route) {
        return { output: `cd: no such file or directory: ${args[0]}` };
    }

    context.setCurrentDirectory(`${PORTFOLIO_ROOT}/${section}`);
    context.openApp?.(route.appId);
    return { output: `Opening ${route.label}...` };
}

const commandRegistry = {
    clear: () => ({ clear: true }),
    ls: (args) => {
        const target = (args[0] ?? "").toLowerCase().replace(/\/$/, "");
        if (!target) return { output: PORTFOLIO_TREE };
        if (target === "projects") {
            return { output: projectList.length ? projectList.map((project) => project.title).join("\n") : "No projects listed." };
        }
        if (Object.hasOwn(SECTION_ROUTES, target)) {
            return { output: `${target}/ is an app. Type "cd ${target}" to open it.` };
        }
        return { output: `ls: cannot access '${args[0]}': No such file or directory` };
    },
    help: () => ({ output: COMMAND_HELP }),
    commands: () => ({ output: COMMAND_HELP }),
    whoami: () => ({
        output: educationLine ? `${basic.name}, studying ${educationLine}.` : basic.name,
    }),
    pwd: (_args, context) => ({ output: context.currentDirectory }),
    date: () => ({ output: new Date().toString() }),
    neofetch: (_args, context) => ({
        output: [
            `${PROMPT_USER}@${PROMPT_HOST}`,
            "-----------",
            "OS: Kali GNU/Linux Rolling (simulated)",
            `Host: ${basic.name} Portfolio`,
            `Terminal: ${context.spiderCliBrand ?? "Spider CLI"}`,
            "Shell: zsh (simulated)",
            "Sections: Profile, Projects, Connect, Browser, Links, Resume",
            "Stack: React",
        ].join("\n"),
    }),
    history: (_args, context) => ({
        output: context.commandHistory.length
            ? context.commandHistory.map((entry, index) => `${String(index + 1).padStart(3, " ")}  ${entry}`).join("\n")
            : "No commands in history.",
    }),
    echo: (args) => ({ output: args.join(" ") }),
    about: () => ({
        output: [
            about.description || `${basic.name} hasn't added an introduction to the portfolio yet.`,
            about.focus && `Focus: ${about.focus}`,
            about.goal && `Goal: ${about.goal}`,
        ].filter(Boolean).join("\n"),
    }),
    cd: (args, context) => openSection(args, context),
    open: (args, context) => (args.length ? openSection(args, context) : { output: "usage: open <section>" }),
    exit: () => ({ output: "There's no escape from the Spider-Verse. Close the window when you're done :)" }),
    sudo: () => ({ output: "ayush is not in the sudoers file. This incident will be reported." }),
};

function looksLikeShell(input, command, args) {
    const trimmed = input.trim();
    if (/^(\.\.\/|\.\/|\/|~\/)/.test(trimmed)) return true;
    if (SHELL_COMMANDS.has(command)) {
        return args.length <= 1 || args.some((arg) => arg.startsWith("-") || arg.includes("/"));
    }
    return false;
}

export function runTerminalCommand(input, context) {
    const [rawCommand = "", ...args] = tokenizeCommand(input);
    const command = rawCommand.toLowerCase();
    if (!command) return null;

    const handler = Object.hasOwn(commandRegistry, command) ? commandRegistry[command] : null;
    if (handler) {
        // "help me find his projects" is a question, not the help command
        if (NO_ARGUMENT_COMMANDS.has(command) && args.length >= 2) return null;
        return { handled: true, ...handler(args, context) };
    }

    if (looksLikeShell(input, command, args)) {
        return { handled: true, output: `zsh: command not found: ${rawCommand}` };
    }

    return null;
}


export const registeredCommandNames = Object.keys(commandRegistry);
export const isRegisteredCommand = (item) => registeredCommandNames.includes(String(item).split(" ")[0].toLowerCase());
