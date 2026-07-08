import { useEffect } from "react";
import { motion } from "framer-motion";

import InfiniteMenu from "../components/InfiniteMenu";
import projects from "../data/projects";

export default function ProjectsPage({ onClose }) {
    const items = projects.map((project) => ({
        image: project.image,
        link: project.liveUrl,
        title: project.title,
        description: project.description,
    }));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [onClose]);

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 1.03,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.45,
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999999,
                background: "#f8f8f8",
                overflow: "hidden",
            }}
        >
            {/* ================= RETURN BUTTON ================= */}

            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 24,
                    left: 24,

                    zIndex: 999,

                    padding: "10px 18px",

                    background: "rgba(255,255,255,0.06)",

                    border: "1px solid rgba(255,255,255,0.12)",

                    borderRadius: 10,

                    color: "#F3F4F6",

                    fontSize: 15,

                    fontWeight: 600,

                    cursor: "pointer",

                    backdropFilter: "blur(16px)",

                    transition: ".2s",
                }}
            >
                ← Desktop
            </motion.button>

            {/* ================= PROJECT MENU ================= */}

            <InfiniteMenu
                items={items}
                scale={1}
            />
        </motion.div>
    );
}