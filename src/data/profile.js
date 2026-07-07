import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { HiDocumentArrowDown } from "react-icons/hi2";


export const profile = {
    basic: {
        name: "Ayush Sabale",

        avatar: "/profile.png",

        location: "Kolhapur, Maharashtra",

        college: "Indian Institute of Information Technology Pune",

        degree: "B.Tech Computer Science & Engineering",

        batch: "2024 - 2028",
    },

    roles: [
        "AI / ML ENGINEER",
        "FULL STACK DEVELOPER",
        "SOFTWARE ENGINEER",
        "COMPETITIVE PROGRAMMER",
        "REACT DEVELOPER",
        "DATA SCIENCE ENTHUSIAST",
        "CYBERSECURITY ENTHUSIAST",
        "OPEN SOURCE LEARNER",
        "FRIENDLY NEIGHBORHOOD DESIGNER",
        "INNOVATOR",
        "ATHLETE",

    ],

    socials: [
        {
            name: "GitHub",
            icon: FaGithub,
            link: "https://github.com/AyushSabale2013",
        },

        {
            name: "LinkedIn",
            icon: FaLinkedin,
            link: "https://www.linkedin.com/in/ayush-sabale-763908369?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        },

        {
            name: "LeetCode",
            icon: SiLeetcode,
            link: "https://leetcode.com/u/AYUSH_SABALE_2282/",
        },

        {
            name: "Resume",
            icon: HiDocumentArrowDown,
            link: "/Resume.pdf",
        },
    ],

    about: {
        title: "About Me",

        description:
            "I'm a Computer Science student at IIIT Pune passionate about Artificial Intelligence, Machine Learning and Full Stack Development. I enjoy solving challenging problems, building modern web applications and continuously improving my software engineering skills.",

        goal:
            "To become a software engineer building AI products used by millions of people.",

        focus:
            "Currently focusing on DSA, Machine Learning, System Design and Full Stack Development.",
    },

    skills: {
        languages: [
            "C++",
            "Python",
            "JavaScript",
        ],

        frontend: [
            "React",
            "HTML",
            "CSS",
            "Tailwind",
        ],

        backend: [
            "Node.js",
            "Express.js",
        ],

        databases: [
            "MongoDB",
            "MySQL",
        ],

        ai: [
            "Scikit-Learn",
            "TensorFlow",
            "Pandas",
            "NumPy",
        ],

        tools: [
            "Git",
            "Linux",
            "VS Code",
            "Docker",
        ],
    },

    interests: [
        "Artificial Intelligence",
        "Cyber Security",
        "Football",
        "Volleyball",
        "Linux",
        "UI Design",
    ],
};