import knowledge from "../chatbot/knowledge";
import spiderOS from "../assets/projects/spiderOS.png";
import trackAcademy from "../assets/projects/trackAcademy.png";
import solarFlare from "../assets/projects/AdityaL1.png";
import campass from "../assets/projects/campass.png";

// Project text, technologies and links live in src/chatbot/knowledge/portfolio.json
// (the single source of truth shared with the chatbot). Only images stay here,
// because they are bundled assets. Keys are project ids from portfolio.json.
const images = {
    1: spiderOS,
    2: trackAcademy,
    3: solarFlare,
    4: campass,
};

const projects = knowledge.getProjects().map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    image: images[project.id] ?? null,
    description: project.description,
    technologies: project.technologies,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
}));

export default projects;