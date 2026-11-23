# Instructions for AI Coding Assistants

These rules apply to future coding sessions in this repository.

## Before making changes

- Read the relevant source files and these project documents before editing.
- Check `git status` first. Preserve existing user changes and do not overwrite unrelated work.
- Treat the current source code as authoritative. Older notes can be out of date.
- Confirm that a feature or service exists before documenting or extending it.

## Scope and design

- Make only the changes needed for the user's request.
- Do not edit unrelated React components, application logic, styles, or configuration.
- Preserve the existing visual design, animations, responsive behavior, and working features unless the user asks to change them.
- Reuse existing components and data modules. Avoid unnecessary dependencies and duplicate functionality.
- Keep personal information and project details in the existing data modules where appropriate.
- `versions.md` is the source for the Spider CLI version. Do not duplicate that version as a literal in application components.

## Project facts to keep in mind

- This is a Vite and React portfolio, with a desktop presentation and a separate mobile presentation.
- The Terminal's current conversational replies are generated locally from portfolio data and matching rules. Do not describe them as a live AI API integration unless one is added and verified.
- `src/apps/Browser/Browser.jsx` currently implements a dinosaur runner game; it is not a general web browser.
- The app registry is `src/apps/apps.js`. Desktop window behavior is managed by `src/components/Desktop.jsx` and `src/components/WindowManager.jsx`.

## Verification and reporting

- Use the verification that fits the change. For application changes, run the production build and inspect the affected behavior when possible.
- Do not add dependencies or tests unless needed for the request.
- Report what changed, what was checked, and any important limitation. Do not claim a check passed unless it was run.

## Git safety

- Never force-push or run destructive Git commands without explicit permission.
- Do not commit, push, merge, or publish unless the user asks.
- Keep unrelated uncommitted changes intact.
