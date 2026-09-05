import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { HiDocumentArrowDown } from "react-icons/hi2";
import {
    FaBrain,
    FaRobot,
    FaShieldAlt,
    FaLaptopCode,
    FaLinux,
    FaCode,
    FaPalette,
    FaRunning,
    FaFilm,
} from "react-icons/fa";
import { GiVolleyballBall } from "react-icons/gi";

// bundled from src/assets so the build resolves it correctly
// (a bare "/profile.png" string only works if the file lives in /public)
import avatarImg from "../assets/profile.png";

export const profile = {
    basic: {
        name: "Ayush Sabale",

        avatar: avatarImg,

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
            link: "https://www.iiitp.ac.in/",
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
        languages: ["C++", "Python", "JavaScript" , "C" , "JAVA"],

        frontend: ["React", "HTML", "CSS", "Tailwind" , "Figma"],

        backend: ["Node.js", "Express.js" , "FastAPI"],

        databases: ["MongoDB", "MySQL" , "PostgreSQL"],

        ai: ["Scikit-Learn", "TensorFlow", "Pandas", "NumPy" , "MatplotLib" , "Plotly"],

        tools: ["Git", "Linux", "VS Code", "Docker" , "AWS" , "Kubernetes" , "Vercel" , "Netlify" , "Cloudflare" , "Postman" ],
    },

    education: [
        {
            degree: "Bachelor of Technology",

            branch: "Computer Science & Engineering",

            college: "Indian Institute of Information Technology Pune",

            duration: "2024 - 2028",

            semester: "5th Semester",

            graduation: "2028",

            location: "Pune, Maharashtra",

            subjectsCompleted: [
                "Data Structures & Algorithms",
                "Object Oriented Programming",
                "Discrete Mathematics",
                "Database Management Systems",
                "Operating Systems",
                "Computer Networks",
                "Computer Architecture & Organization",
                "Compiler Design",
                "Design & Analysis of Algorithms",
                "Theory of Computation",
                "Software Engineering",
                "Artificial Intelligence",
                "Machine Learning",
                "Probability & Statistics",
                "Linear Algebra",
            ],

            focus: [
                "Artificial Intelligence",
                "Machine Learning",
                "Full Stack Development",
                "Deep Neural Architectures",
            ],
        },
    ],

    // icon components instead of emoji — render with <item.icon />
    interests: [
        {
            icon: FaBrain,
            title: "Artificial Intelligence",
            description: "Building intelligent systems that solve real-world problems.",
        },
        {
            icon: FaRobot,
            title: "Machine Learning",
            description: "Training models and exploring modern AI techniques.",
        },
        {
            icon: FaShieldAlt,
            title: "Cyber Security",
            description: "Learning about ethical hacking and secure software.",
        },
        {
            icon: FaLaptopCode,
            title: "Full Stack Development",
            description: "Creating modern, scalable web applications.",
        },
        {
            icon: FaLinux,
            title: "Linux",
            description: "Customizing systems and working in terminal environments.",
        },
        {
            icon: FaCode,
            title: "Competitive Programming",
            description: "Solving algorithmic problems and improving problem-solving skills.",
        },
        {
            icon: FaPalette,
            title: "UI / UX Design",
            description: "Designing clean, interactive and user-friendly interfaces.",
        },
        {
            icon: FaRunning,
            title: "Athletics",
            description: "Enjoying sports, fitness, teamwork and maintaining an active lifestyle.",
        },
        {
            icon: GiVolleyballBall,
            title: "Volleyball",
            description: "College volleyball player and main spiker.",
        },
        {
            icon: FaFilm,
            title: "Movies & Cinema",
            description: "Exploring storytelling, cinematography and memorable films across genres.",
        },
    ],

    contacts: [
        {
            type: "email",
            title: "Email",
            value: "ayushsabale2013@gmail.com",
        },
        {
            type: "phone",
            title: "Phone",
            value: "+91 7756850969",
        },
        {
            type: "location",
            title: "Location",
            value: "Kolhapur, Maharashtra, India",
        },
        {
            type: "college",
            title: "College",
            value: "Indian Institute of Information Technology Pune",
        },
    ],
};