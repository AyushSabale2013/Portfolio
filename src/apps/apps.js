// src/apps/apps.js

import Profile from "./Profile/Profile";
import Home from "./Home/Home";
import Projects from "./Projects/Projects";
import Resume from "./Resume/Resume";
import Contact from "./Contact/Contact";
import Terminal from "./Terminal/Terminal";
import Folder from "./Folder/Folder";

// Icons
import profileIcon from "../assets/spiderLogo.png";
import homeIcon from "../assets/home.png";
import projectsIcon from "../assets/projects.png";
import resumeIcon from "../assets/resume.png";
import contactIcon from "../assets/about.png";
import terminalIcon from "../assets/terminal.png";
import folderIcon from "../assets/projects.png"; // Optional

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

    /* ======================================
       COMMON EMPTY FOLDER
    ====================================== */

    folder: {
        title: "Folder",
        component: Folder,
        icon: folderIcon,
        desktop: false,
    },

    /* ======================================
       FAKE FOLDERS
    ====================================== */

    documents: {
        title: "Documents",
        folderName: "Documents",
        isFake: true,
    },

    downloads: {
        title: "Downloads",
        folderName: "Downloads",
        isFake: true,
    },

    pictures: {
        title: "Pictures",
        folderName: "Pictures",
        isFake: true,
    },

    music: {
        title: "Music",
        folderName: "Music",
        isFake: true,
    },

    videos: {
        title: "Videos",
        folderName: "Videos",
        isFake: true,
    },

    trash: {
        title: "Trash",
        folderName: "Trash",
        isFake: true,
    },

    starred: {
        title: "Starred",
        folderName: "Starred",
        isFake: true,
    },

};