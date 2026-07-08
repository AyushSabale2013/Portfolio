// src/apps/apps.js
import Profile from "./Profile/Profile";
import Home from "./Home/Home";
import Projects from "./Projects/Projects";
import Resume from "./Resume/Resume";
import Contact from "./Contact/Contact";
import Terminal from "./Terminal/Terminal";

// Icons
import profileIcon from "../assets/spiderLogo.png";
import homeIcon from "../assets/home.png";
import projectsIcon from "../assets/projects.png";
import resumeIcon from "../assets/resume.png";
import contactIcon from "../assets/about.png";
import terminalIcon from "../assets/terminal.png";

export const apps = {
    profile: {
        title: "Profile",
        component: Profile,
        icon: profileIcon,
        info: "Personal profile.",
        desktop: true,
    },

    home: {
        title: "Home",
        component: Home,
        icon: homeIcon,
        info: "Root directory.",
        desktop: true,
    },

    projects: {
        title: "Projects",
        component: Projects,
        icon: projectsIcon,
        info: "AI/ML & Web Development.",
        desktop: true,
    },

    resume: {
        title: "Resume",
        component: Resume,
        icon: resumeIcon,
        info: "Professional resume.",
        desktop: true,
    },

    contact: {
        title: "Contact",
        component: Contact,
        icon: contactIcon,
        info: "Social profiles.",
        desktop: true,
    },

    terminal: {
        title: "Terminal",
        component: Terminal,
        icon: terminalIcon,
        info: "Interactive command line.",
        desktop: true,
    },

    // Fake folder entries (No JSX here!)
    trash: {
        title: "Trash",
        isFake: true,
    },

    pictures: {
        title: "Pictures",
        isFake: true,
    },

    documents: {
        title: "Documents",
        isFake: true,
    },

    downloads: {
        title: "Downloads",
        isFake: true,
    },

    music: {
        title: "Music",
        isFake: true,
    },

    videos: {
        title: "Videos",
        isFake: true,
    },

    starred: {
        title: "Starred",
        isFake: true,
    },
};