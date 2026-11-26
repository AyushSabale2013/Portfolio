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
- Terminal Q&A and simulated commands are separated into independently testable modules under `src/chatbot/`.
- Terminal project follow-ups resolve list references, report unknown technologies honestly, and return local intent, entity, and sentiment metadata.

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

Unit tests use Node’s built-in test runner. Run them with `node --test src/chatbot/nlp/*.test.js src/chatbot/knowledge/knowledge.test.js src/chatbot/commands.test.js`.

## Project data and version

- Edit profile content in `src/data/profile.js`.
- Edit project entries in `src/data/projects.js`.
- The Spider CLI version is maintained in `versions.md` and injected by `vite.config.js` for use in the app.
- The downloadable resume is `public/Resume.pdf`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the component and application flow, and [AGENTS.md](AGENTS.md) for coding rules.

## Portfolio chatbot knowledge base

`src/chatbot/knowledge/portfolio.json` is the single source of truth for the chatbot's public facts about the portfolio owner: profile, education, skills, projects, experience, achievements, certifications, contact details and interests. Edit this file to change chatbot answers. Leave unknown fields empty so the bot can give an honest fallback.

```text
src/chatbot/knowledge/
  portfolio.json       chatbot data
  loader.js            validateKnowledge(): validates and sanitizes; never throws
  retrieval.js         createKnowledgeBase(): query API
  text.js              normalization and typo-tolerance helpers
  index.js             ready-to-use knowledge instance
  knowledge.test.js    knowledge-layer unit tests

src/chatbot/nlp/
  preprocess.js        normalization, tokenization, stopwords, stemming and fuzzy matching
  intents.js            intent definitions and ranking
  sentiment.js          positive/negative/neutral classification
  context.js             bounded history and project-list reference resolution
  replies.js             knowledge-driven reply builders and getReply
  sections.js            generic section formatting
  compliments.js         compliment detection and replies
  index.js               NLP entry point
src/chatbot/commands.js  simulated terminal command registry
```

```text
portfolio.json -> loader.validateKnowledge -> retrieval.createKnowledgeBase -> Terminal reply builders
                                                                  └---------> src/data/projects.js -> project cards
```

The loader normalizes strings, de-duplicates list values, skips projects without a title, keeps only HTTP(S) links, validates email addresses, and removes secret-looking fields and values. Validation problems are collected as errors or warnings; the app continues with safe defaults. Development warnings are printed to the browser console.

The retrieval API provides profile, education, contact, skills, projects, experience, achievements, certifications and interests. Project matching supports titles, aliases, unique title words, small typos, technologies, categories and topics. Technology matching ignores punctuation and parenthetical labels. Extracted entities come from the knowledge base.

It exposes `getProfile`, `getEducation`, `describeEducation`, `getContact`, `getSocial`, `getExperience`, `getAchievements`, `getCertifications`, `getInterests`, `getSkillCategories`, `getSkillCategory`, `findSkillCategory`, `findSkillsInText`, `findTechnologiesInText`, `getProjects`, `getProject`, `getProjectDetails`, `getPortfolioSiteProject`, `findProjectByName`, `findProjectsByTechnology`, `findProjectsByCategory`, `findProjectsByTopic`, `findProjectsByTerms`, `searchProjects` and `extractEntities`. Project, skill and technology entities are resolved from validated portfolio data; topic labels use the small configured topic vocabulary.

The JSON sections contain:

| Section | Main fields |
| --- | --- |
| `profile` | `name`, `fullName`, `headline`, `summary`, `focus`, `goal`, `location`, `interests`, `expertise`, `strengths` |
| `education` | `institution`, `degree`, `field`, `batch`, `status`, `notes` |
| `skills` | category objects with `label` and `items` |
| `projects` | `id`, `title`, `aliases`, `category`, `description`, `summary`, `problem`, `highlights`, `technologies`, `topics`, `liveUrl`, `githubUrl`, `isPortfolioSite` |
| `experience` | `role`, `organization`, `period`, `description` |
| `achievements` | `title`, `description`, `date` |
| `certifications` | `title`, `issuer`, `date`, `url` |
| `contact` | `email` and `socials` with `name` and `url` |

To add a project, add an entry with a unique ID to `portfolio.json`, then add its bundled image to the `images` map in `src/data/projects.js`. Optional fields include `aliases`, `summary`, `problem`, `highlights`, `topics` and `isPortfolioSite`. Project text and technologies are derived from the JSON; only image imports and mappings stay in the data module.

The chatbot is frontend-only: portfolio data is bundled with the website, and answers are generated locally. Do not put private information in the JSON. Project-list follow-ups can refer to “the first one”, “second one”, “last one”, “that one”, “the other one” or “both”; conversation history is bounded. Topic matching uses a small vocabulary in `retrieval.js` plus each project's category, description, technologies and topics.

Run the built-in tests with:

```bash
node --test
```

## Build and deployment

Run `npm run build`; Vite writes static production files to `dist/`. Run `npm run preview` to inspect that build locally. Deploy the contents of `dist/` to a static hosting service that supports single-page applications. No hosting provider configuration, deployment workflow, Dockerfile, or server-side application is included in this repository, so the host-specific setup must be configured separately.
