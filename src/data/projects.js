import spiderOS from "../assets/projects/spiderOS.png";
import trackAcademy from "../assets/projects/trackAcademy.png";
import solarFlare from "../assets/projects/men.png";
import community from "../assets/projects/community.png";

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
        title: "Community Platform",
        category: "Web Development",

        image: community,

        description:
            "Collaborative platform for notes, discussions, and study groups.",

        technologies: [
            "React",
            "Node.js",
            "MongoDB",
            "Socket.io",
        ],

        liveUrl: "https://www.iiitp.ac.in/",

        githubUrl: "https://github.com/AyushSabale2013/fixmycampus",
    },
];

export default projects;