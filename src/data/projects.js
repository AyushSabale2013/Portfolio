import spiderOS from "../assets/projects/spiderOS.png";
import trackAcademy from "../assets/projects/trackAcademy.png";
import solarFlare from "../assets/projects/AdityaL1.png";
import campass from "../assets/projects/campass.png";

const projects = [
    {
        id: 1,
        title: "Spider OS Portfolio",
        category: "Web Development",
        image: spiderOS,
        description:
            "Interactive desktop-inspired portfolio built with React and Framer Motion.",

        technologies: [
            "React",
            "Framer Motion",
            "JavaScript",
            "CSS",
        ],

        liveUrl: "https://portfolio-five-rosy-095v6w6jha.vercel.app/",

        githubUrl: "https://github.com/AyushSabale2013/Portfolio",
    },

    {
        id: 2,
        title: "Track Academy",
        category: "Full Stack",

        image: trackAcademy,

        description:
            "Complete coaching institute management platform with student and teacher dashboards.",

        technologies: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
        ],

        liveUrl: "https://www.iiitp.ac.in/",

        githubUrl: "https://github.com/AyushSabale2013/track",
    },

    {
        id: 3,
        title: "Solar Flare Prediction",
        category: "AI / Machine Learning",

        image: solarFlare,

        description:
            "ISRO Hackathon project for forecasting solar flares using SoLEXS and HEL1OS data.",

        technologies: [
            "Python",
            "XGBoost",
            "TensorFlow",
            "React",
        ],

        liveUrl: "https://www.iiitp.ac.in/",

        githubUrl: "https://github.com/AyushSabale2013",
    },

    {
        id: 4,
        title: "Campass",
        category: "Web Development",

        image: campass,

        description:
            "Smart campus access system with secure QR-based entry and GPS verification",

        technologies: [
            "React",
            "Node.js",
            "MongoDB(ATLAS)",
            "Socket.io",
            "GPS",
        ],

        liveUrl: "https://cam-pass-pi.vercel.app/",

        githubUrl: "https://github.com/AyushSabale2013/CamPass",
    },
];

export default projects;