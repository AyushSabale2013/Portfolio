# Changelog

This log summarizes notable changes found in the Git history and current source. Git commit history is the source for released milestones. Items under **Unreleased** describe the working tree inspected on 2026-11-24 and may not be committed.

## Unreleased — working tree on 2026-11-24

- Spider CLI is set to `2.0.1` in `versions.md`; Vite injects that value into the app at build time.
- Terminal includes local commands, command recall and completion, and a rule-based portfolio Q&A helper with a typing animation. It uses local profile and project data; there is no chatbot API integration in this repository.
- Dismissing or timing out the Welcome popup opens the Terminal. The desktop guards against duplicate launches.
- The Profile About text and focus statement have been updated.
- Fixed lint errors and warnings across the app while preserving the existing visual design and animation behavior.
- Documentation has been expanded across the project guide, architecture, coding instructions, changelog, and TODO list.

## 2.0.0 — 2026-11-24

Git commit `b13e249` marks Portfolio 2.0.0. It expanded the Terminal's portfolio question handling and updated Terminal/shared styling. The commit also reduced the size of the About icon asset.

## Earlier development

- **2026-10-18 — project links:** Added a project's GitHub and live-site links (`ccf5d1a`).
- **2026-09-02 — profile data:** Connected profile content to a shared data module (`6d364da`); this followed Profile section work and improvements in August and September (`ca5e5a4`, `e694163`).
- **2026-08-05 — projects and dock:** Updated the Projects and Dock components (`44f83e1`).
- **2026-07-16 — prototype and browser:** Added the Browser feature, compressed images, and marked the working prototype complete (`475bcb7`, `b461003`, `f736d82`). The current Browser app source contains a dinosaur runner game.
- **2026-07-09 — projects:** Completed the project section and its explorer UI (`c263ed1`, `31c6097`).
- **2026-07-08 — welcome and folders:** Added the Welcome popup and improved the Home and Projects folder experiences (`5c0b5b4`).
- **2026-07-07 — desktop foundations:** Added window features, adjusted the desktop and dock, and organized apps through `apps.js` (`a65e579`, `8bd591f`). The About and Skills sections were also completed (`0aff57b`).
- **2026-07-06 — first releases:** The initial commit (`e2a0469`) was followed by a portfolio 1.0 completion commit (`6fd116c`).

Commit subjects and dates are taken from local Git history. Intermediate commits with unclear one-character or generic messages are omitted.
