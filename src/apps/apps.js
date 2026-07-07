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
import contactIcon from "../assets/about.png";      // Change if you have a contact icon
import terminalIcon from "../assets/terminal.png";

export const apps = {
    profile: {
        title: "Profile",
        component: Profile,
        icon: profileIcon,
        info: "Personal profile, education, skills and achievements.",

        desktop: true,
    },

    home: {
        title: "Home",
        component: Home,
        icon: homeIcon,
        info: "Root directory of the Spider OS portfolio.",

        desktop: true,
    },

    projects: {
        title: "Projects",
        component: Projects,
        icon: projectsIcon,
        info: "AI, ML, Web Development and Hackathon projects.",

        desktop: true,
    },

    resume: {
        title: "Resume",
        component: Resume,
        icon: resumeIcon,
        info: "Professional resume and downloadable PDF.",

        desktop: true,
    },

    contact: {
        title: "Contact",
        component: Contact,
        icon: contactIcon,
        info: "Email, phone number and social media profiles.",

        desktop: true,
    },

    terminal: {
        title: "Terminal",
        component: Terminal,
        icon: terminalIcon,
        info: "Interactive command line interface.",

        desktop: true,
    },
};