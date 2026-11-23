// src/apps/apps.js

import Profile from "./Profile/Profile";
import Home from "./Home/Home";
import Projects from "./Projects/Projects";
import Resume from "./Resume/Resume";
import Contact from "./Contact/Contact";
import Terminal from "./Terminal/Terminal";
import Folder from "./Folder/Folder";
import Browser from "./Browser/Browser";

// Icons
import profileIcon from "../assets/icons/spiderLogo.png";
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import resumeIcon from "../assets/icons/resume.png";
import contactIcon from "../assets/icons/about.png";
import terminalIcon from "../assets/icons/terminal.png";
import folderIcon from "../assets/icons/projects.png";
import browserIcon from "../assets/icons/browser.png";

export const apps = {

    profile: {
        title: "Profile",
        component: Profile,
        icon: profileIcon,
        info: "Explore Ayush's personal profile, including his introduction, education, interests, technical background, skills, achievements, and career goals.",
        desktop: true,
    },

    home: {
        title: "Home",
        component: Home,
        icon: homeIcon,
        info: "Explore the main directory of the portfolio. Find available applications, folders, documents, and other resources just like navigating a desktop file system.",
        desktop: true,
    },

    projects: {
        title: "Projects",
        component: Projects,
        icon: projectsIcon,
        info: "Explore Ayush's technical projects in Artificial Intelligence, Machine Learning, Deep Learning, and software development. Discover project descriptions, technologies used, implementation details, and source code links.",
        desktop: true,
    },

    resume: {
        title: "Resume",
        component: Resume,
        icon: resumeIcon,
        info: "View Ayush's professional resume, including his education, technical skills, projects, achievements, experience, and other relevant qualifications.",
        desktop: true,
    },

    contact: {
        title: "Contact",
        component: Contact,
        icon: contactIcon,
        info: "Find ways to connect with Ayush through his social profiles, professional networks, email, and other available contact links.",
        desktop: true,
    },

    terminal: {
        title: "Terminal",
        component: Terminal,
        icon: terminalIcon,
        info: "Interact with Spider CLI, an interactive terminal and AI-powered portfolio assistant. Execute commands such as help, ls, clear, whoami, and history, or ask questions about Ayush, his skills, projects, and technical experience using natural language.",
        desktop: true,
    },

    browser: {
        title: "Browser",
        component: Browser,
        icon: browserIcon,
        info: "Open the built-in web browser to explore websites and browse the internet through the portfolio's desktop environment.",
        desktop: true,
    },

    /* ======================================
       COMMON EMPTY FOLDER
    ====================================== */

    folder: {
        title: "Folder",
        component: Folder,
        icon: folderIcon,
        info: "A reusable folder application for displaying and organizing files, documents, and other portfolio resources.",
        desktop: false,
    },

    /* ======================================
       FAKE FOLDERS
    ====================================== */

    documents: {
        title: "Documents",
        folderName: "Documents",
        isFake: true,
        info: "A virtual Documents folder representing a location for storing and accessing personal documents and files.",
    },

    downloads: {
        title: "Downloads",
        folderName: "Downloads",
        isFake: true,
        info: "A virtual Downloads folder representing files and resources downloaded to the desktop environment.",
    },

    pictures: {
        title: "Pictures",
        folderName: "Pictures",
        isFake: true,
        info: "A virtual Pictures folder representing images, photographs, graphics, and other visual resources.",
    },

    music: {
        title: "Music",
        folderName: "Music",
        isFake: true,
        info: "A virtual Music folder representing audio files and music-related resources.",
    },

    videos: {
        title: "Videos",
        folderName: "Videos",
        isFake: true,
        info: "A virtual Videos folder representing video files and multimedia resources.",
    },

    trash: {
        title: "Trash",
        folderName: "Trash",
        isFake: true,
        info: "A virtual Trash folder representing deleted files and items that may be removed from the desktop environment.",
    },

    starred: {
        title: "Starred",
        folderName: "Starred",
        isFake: true,
        info: "A virtual Starred folder representing important or frequently accessed files and resources.",
    },

};