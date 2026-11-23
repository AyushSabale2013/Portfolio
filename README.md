# Spidey Desktop Portfolio

An interactive portfolio by Ayush Sabale. On desktop-sized screens it opens as a Spider-Man-inspired desktop with draggable app icons, a dock, a menu bar, and movable application windows. On smaller screens it uses a separate, scrollable portfolio layout.

## Features

- Desktop entry screen and animated boot sequence.
- Desktop wallpaper, draggable icons, dock, menu bar, calendar, and quick settings.
- Portfolio apps for profile, projects, contact, resume, home, and Terminal.
- Full-screen Profile and Projects pages on the desktop presentation.
- Spider CLI Terminal with local Linux-style commands and a local portfolio question-and-answer helper.
- Built-in dinosaur runner game in the app named **Browser**.
- Separate responsive mobile portfolio presentation.
- Profile and project content stored in JavaScript data modules.

The Terminal helper uses local matching rules and the portfolio's bundled data. This repository does not contain a chatbot API client or server.

## Technologies

- React 19 and JavaScript with JSX
- Vite 8 for development and production builds
- Framer Motion for interface animation
- Tailwind CSS 4 through the Vite plugin, plus project CSS
- Lucide, React Icons, and Tabler Icons for icons
- Other UI and utility packages are listed in `package.json`

## Requirements

- Node.js and npm installed. The repository does not pin a Node.js version.
- Git, if you are cloning the repository.

## Install and run locally

```bash
git clone <repository-url> portfolio
cd portfolio
npm install
npm run dev
```

Vite prints a local URL in the terminal after the development server starts.

## Available commands

```bash
npm run dev       # Start the local development server
npm run build     # Create the production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
```

There is no test script configured in `package.json` at the time of writing.

## Project data and version

- Edit profile content in `src/data/profile.js`.
- Edit project entries in `src/data/projects.js`.
- The Spider CLI version is maintained in `versions.md` and injected by `vite.config.js` for use in the app.
- The downloadable resume is `public/Resume.pdf`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the component and application flow, and [AGENTS.md](AGENTS.md) for coding rules.

## Build and deployment

Run `npm run build`; Vite writes static production files to `dist/`. Run `npm run preview` to inspect that build locally. Deploy the contents of `dist/` to a static hosting service that supports single-page applications. No hosting provider configuration, deployment workflow, Dockerfile, or server-side application is included in this repository, so the host-specific setup must be configured separately.
