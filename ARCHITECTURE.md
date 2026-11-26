# Architecture

This document describes the current implementation in the repository. The desktop visual theme resembles an operating system, but its apps and folders are React components inside one browser application.

## Startup and presentation selection

`index.html` provides the root element and loads `src/main.jsx`. The entry point renders `src/App.jsx` inside React Strict Mode and imports the global stylesheet.

`App` checks the browser width with `window.matchMedia("(max-width: 768px)")`:

- At 768 px wide or below, it renders `PortfolioPhone`.
- On wider screens, it moves through three stages: `Landing` → `BootScreen` → `Desktop`.

The desktop stages are selected with local React state. They do not use a router.

## Desktop and app management

`src/components/Desktop.jsx` owns the desktop-level state:

- `openApps` stores which windowed apps are open.
- `windowZ` and `highestZ` control window stacking and focus.
- `maximizedWindow` tracks the maximized window.
- `showProfilePage` and `showProjectsPage` control the two full-screen sections.
- `iconPositions` stores draggable icon positions in browser `localStorage` under `spider-os-icons`.
- The welcome popup opens Terminal when it is dismissed, including by its timeout. A ref prevents duplicate launches.

App launch behavior comes from the `openApp(id)` function in `Desktop`. Profile and Projects are handled as full-screen pages there. Other apps are added to `openApps` and displayed in windows. Opening an app that is already open focuses it instead of adding another entry.

`DesktopIcon` renders draggable desktop icons. Its normal launch gesture is a double-click. The dock uses a single click. The dock also contains external social links. `MenuBar` displays the clock/calendar and opens `QuickSettings`.

## App registry and windows

`src/apps/apps.js` is the app registry. Each real app entry supplies an ID, title, React component, icon, information text, and whether it appears on the desktop. `WindowManager` reads this registry and renders a `Window` for each app, passing whether it is open, its stacking order, and focus, close, and maximize handlers.

`Window` provides the shared window frame and controls. It returns no UI when its `isOpen` prop is false. App components receive shared callbacks such as `openApp` and `closeApp` through `WindowManager`.

The Profile and Projects pages are also used by their registry wrappers, but the desktop normally opens them directly as full-screen views. The Home app uses the registry to list and open available apps. Its fake folder entries use the shared Folder app; they do not represent separate filesystem folders.

## Main source areas

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Chooses the mobile view or desktop startup stages. |
| `src/components/` | Landing, boot, desktop, icons, dock, menu bar, welcome popup, windows, and visual effects. |
| `src/apps/apps.js` | Central registry of desktop applications and virtual folders. |
| `src/apps/` | Individual app implementations, including Terminal, profile, projects, contact, resume, home, folder, and the dinosaur runner. |
| `src/chatbot/` | Validated portfolio knowledge, retrieval, local NLP and replies, plus the simulated Terminal command registry. |
| `src/pages/` | Full-screen Profile and Projects page layouts. |
| `src/data/profile.js` | Profile, education, skills, interests, contact data, and social links. |
| `src/data/projects.js` | Project descriptions, categories, technologies, images, and links. |
| `src/assets/` | Wallpapers, profile image, project images, and app icons imported by the UI. |
| `src/styles/` and `src/*.css` | Shared and feature-specific styling. |
| `public/` | Static files copied directly to the build, including `Resume.pdf`. |
| `vite.config.js` | Vite, React, Tailwind CSS plugin, `@` alias, and Spider CLI version injection. |
| `versions.md` | Single source for the Spider CLI version. |

## Data flow and navigation

The Profile page and mobile portfolio read `src/data/profile.js` and `src/data/projects.js`. Terminal chatbot facts come from `src/chatbot/knowledge/portfolio.json`, validated and queried through the knowledge API. `src/data/projects.js` derives its project text from that JSON and maps bundled images by project ID.

Navigation is callback-based rather than URL-based:

1. Desktop icons, dock buttons, Home, and Terminal can call `openApp(id)`.
2. `Desktop` decides whether the ID opens a full-screen page or a managed window.
3. `WindowManager` passes app callbacks down to each registered component.
4. Close and focus events travel back up through those callbacks to update desktop state.

The project does not currently configure a client-side route system.

## Terminal behavior

`src/apps/Terminal/Terminal.jsx` owns the Kali-style UI, input, conversation rendering, command history, and typing animation. Message rows are memoized so typing in the input does not re-render the full transcript.

- `src/chatbot/commands.js` contains the simulated command registry. Recognized commands such as `help`, `ls`, `clear`, `history`, `echo`, `cd`, and `open` run locally.
- `cd` and `open` update a virtual prompt directory and use `openApp` to navigate to registered portfolio sections. No real shell commands run.
- `src/chatbot/nlp/` contains local text preprocessing, intent ranking, sentiment, bounded conversation context, reply builders, and the `getReply` entry point. Input is capped at 500 characters. Portfolio facts are read through the validated knowledge API.
- The reply is shown with a typing delay and character-by-character display, with reduced-motion support.
- The Terminal component is lazy-loaded from the app registry. `WindowManager` provides a `Suspense` boundary while it loads.
- Conversation messages, command history, current directory, and input navigation are held in component state or refs. `clear` empties the visible conversation and cancels a pending reply.

There is no `fetch`, Axios, or other chatbot backend client in the current source. Terminal responses are local; the typing display is a presentation effect, not server streaming.

## Portfolio chatbot knowledge

`src/chatbot/knowledge/portfolio.json` is the chatbot's source of truth for public owner information: profile, education, skills, projects, experience, achievements, certifications, contact details and interests. Leave unknown or private fields empty; the bot uses explicit fallbacks rather than inventing details.

```text
src/chatbot/knowledge/
  portfolio.json   chatbot data
  loader.js        validation, normalization and sanitizing
  retrieval.js     read-only query API
  text.js          matching helpers
  index.js         ready-to-use knowledge instance
  knowledge.test.js

src/chatbot/nlp/
  preprocess.js    normalization, tokenization, stemming and fuzzy matching
  intents.js       intent definitions and ranking
  sentiment.js     sentiment classification
  context.js       bounded conversation history and list-reference resolution
  replies.js       knowledge-driven reply builders and getReply implementation
  sections.js      generic section reply formatting
  compliments.js   compliment handling
  index.js         public NLP exports

src/chatbot/commands.js   simulated command registry; no real shell execution
```

```text
portfolio.json -> loader.validateKnowledge -> retrieval.createKnowledgeBase -> local reply builders
                                                                  └---------> src/data/projects.js -> UI project cards
```

The loader never throws for malformed data. It trims and de-duplicates strings, skips projects without titles, keeps only HTTP(S) links, validates email addresses and removes secret-looking fields or values. Validation issues are collected as errors or warnings; development builds print warnings to the browser console.

The retrieval API covers profile, education, contact, skills, projects and the experience, achievement, certification and interest sections. It supports project lookup by title or alias, technology, category and topic. Technology matching tolerates punctuation and parenthetical labels. Entity extraction returns portfolio-backed entities only.

To add a project, update `portfolio.json` with a unique ID and its public details, then add the bundled image mapping in `src/data/projects.js`. Optional project fields include aliases, summary, problem, highlights, topics and `isPortfolioSite`. The data is bundled with the frontend, so only public information belongs in the JSON.

Project list follow-ups such as “the first one”, “second one”, “last one”, “that one”, “the other one” and “both” use the bounded conversation context. Topic search uses a small vocabulary in `retrieval.js` together with the project categories, descriptions, technologies and topics.

`src/cliVersion.js` reads the build-time constant `__SPIDER_CLI_VERSION__`. `vite.config.js` reads the `Spider CLI` entry from `versions.md`, validates its format, and injects the value. Components should use the exported brand/version instead of adding a separate literal.

## Mobile presentation

`src/components/PortfolioPhone.jsx` is a separate, single-page mobile portfolio. It derives profile, skills, projects, interests, education, and contact content from the same data modules. It is selected by the width check in `App`; it is not a mobile layout of the desktop window manager.

## Build and external services

Vite builds the client-side app to `dist/`. The repository has no server-side app, API service, automated test script, hosting configuration, or CI deployment workflow at the time of inspection. Some components load Google Fonts from Google Fonts URLs when rendered, so those custom fonts require network access.
