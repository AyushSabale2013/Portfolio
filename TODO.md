# TODO

This list keeps older planning notes aligned with the current source. These are future ideas, not confirmed bugs.

## Potential improvements

- **Clarify the Browser app.** The app is named Browser in the registry and desktop UI, but its current implementation is a dinosaur runner game. Decide whether to rename it, add actual browsing, or keep the game and update the app description.
- **Polish app content and presentation.** An older planning note asks for cleanup of Contact, Resume, and Projects. Review these areas with the current UI before deciding on specific changes.
- **Review icon branding.** An older note proposes changing the logos. Check which icons still need work and keep existing desktop icon sizes and behavior intact.
- **Expand project details carefully.** The portfolio currently contains four project entries. Add verified descriptions, technologies, and links as project information becomes available; keep the Terminal's local answers consistent with those entries.
- **Add automated checks.** There are no test files or test script in `package.json`. Consider adding focused checks for command parsing, navigation, and key desktop flows if the project needs automated regression coverage.
- **Reduce the initial JavaScript bundle.** The production build currently emits a main JavaScript bundle above Vite's 500 kB warning threshold. Consider route/app-level code splitting, then recheck the initial load and interactions.
- **Consider a real chatbot service only if desired.** Terminal answers are currently generated locally from static portfolio data and matching rules. A live model or server is not implemented; adding one would need a separately designed and configured API integration.
- **Document deployment after choosing a host.** The repository has no deployment workflow or host configuration. Add provider-specific instructions once the deployment target and routing requirements are known.

## Confirmed in the current source

These older ideas in `rough.md` are already present and should not be treated as pending:

- A dinosaur runner game exists in `src/apps/Browser/Browser.jsx`.
- Profile can open as a full-screen page on desktop.
- The Terminal supports local commands and portfolio questions.
- Profile and project content are stored in data modules.

## Known bugs

No confirmed bug list was present in the source or existing notes when this document was prepared. Verify suspected issues before recording them here.
