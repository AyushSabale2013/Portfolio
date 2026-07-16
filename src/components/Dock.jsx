import { motion } from "framer-motion";

import about from "../assets/icons/about.png";
import github from "../assets/icons/github.png";
import instagram from "../assets/icons/instagram.png";
import leetcode from "../assets/icons/leetcode.png";
import linkedin from "../assets/icons/linkedin.png";
import projects from "../assets/icons/projects.png";
import resume from "../assets/icons/resume.png";
import terminal from "../assets/icons/terminal.png";
import browser from "../assets/icons/browser.png";

const dockItems = [
    { id: "projects", name: "Projects", icon: projects },
    { id: "contact", name: "Contact", icon: about },
    { id: "resume", name: "Resume", icon: resume },
    { id: "terminal", name: "Terminal", icon: terminal },
    { id: "browser", name: "Browser", icon: browser },

    { divider: true },

    {
        id: "github",
        name: "GitHub",
        icon: github,
        url: "https://github.com/AyushSabale2013",
    },

    {
        id: "linkedin",
        name: "LinkedIn",
        icon: linkedin,
        url: "https://www.linkedin.com/in/ayush-sabale-763908369/",
    },

    {
        id: "leetcode",
        name: "LeetCode",
        icon: leetcode,
        url: "https://leetcode.com/u/AYUSH_SABALE_2282/",
    },

    {
        id: "instagram",
        name: "Instagram",
        icon: instagram,
        url: "https://www.instagram.com/ayush_sabale_2282/",
    },
];

export default function Dock({ onOpen }) {
    return (
        <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            style={{
                position: "fixed",

                left: "38%",
                bottom: "20px",

                transform: "translateX(-50%)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                gap: "6px",

                padding: "10px 16px",

                borderRadius: "24px",

                background: "rgba(255,248,235,.22)",

                backdropFilter: "blur(35px)",
                WebkitBackdropFilter: "blur(35px)",

                border: "1px solid rgba(255,255,255,.25)",

                boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,.35),
                    0 8px 32px rgba(0,0,0,.35),
                    0 0 20px rgba(255,220,180,.12)
                `,

                zIndex: 9999,
                userSelect: "none",
            }}
        >
            {dockItems.map((item, index) => {
                if (item.divider) {
                    return (
                        <div
                            key={`divider-${index}`}
                            style={{
                                width: 1,
                                height: 42,
                                background: "rgba(255,255,255,.25)",
                                margin: "0 6px",
                            }}
                        />
                    );
                }

                const icon = (
                    <img
                        src={item.icon}
                        alt={item.name}
                        draggable={false}
                        style={{
                            width: 48,
                            height: 48,
                            objectFit: "contain",
                            userSelect: "none",
                            pointerEvents: "none",
                        }}
                    />
                );

                // External Links
                if (item.url) {
                    return (
                        <motion.a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{
                                y: -10,
                                scale: 1.15,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 18,
                            }}
                            style={{
                                width: 58,
                                height: 58,

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                borderRadius: 16,

                                textDecoration: "none",

                                cursor: "pointer",
                            }}
                        >
                            {icon}
                        </motion.a>
                    );
                }

                // Internal Apps
                return (
                    <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => onOpen(item.id)}
                        whileHover={{
                            y: -10,
                            scale: 1.15,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                        }}
                        style={{
                            width: 58,
                            height: 58,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            border: "none",
                            outline: "none",
                            background: "transparent",

                            borderRadius: 16,

                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        {icon}
                    </motion.button>
                );
            })}
        </motion.div>
    );
}