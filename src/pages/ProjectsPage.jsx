import { motion } from "framer-motion";
import ProjectsPopup from "../components/ProjectsPopup";
import InfiniteMenu from "../components/InfiniteMenu";
import projects from "../data/projects";

import infiniteMenuBackground from "../assets/projects/infiniteMenuBackground2.jpg";

import "./ProjectsPage.css";

export default function ProjectsPage({ onClose }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 1.02,
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
            className="projects-page"
            style={{
                backgroundImage: `url(${infiniteMenuBackground})`,
            }}
        >

            <ProjectsPopup />
            {/* ================= HEADER ================= */}

            <header className="projects-header">

                <button
                    className="projects-header-back"
                    onClick={onClose}
                >
                    <span className="projects-header-back-arrow">
                        ←
                    </span>

                    Spider Desktop
                </button>

                <h1
                    className="projects-header-title"
                    data-text="MY WORK"
                >
                    MY WORK
                </h1>

                {/* Keeps title perfectly centered */}

                <div
                    className="projects-header-spacer"
                    aria-hidden="true"
                />

            </header>

            {/* ================= SPHERE ================= */}

            <main className="projects-menu-section">

                {/* <InfiniteMenu
                    items={projects}
                /> */}

                <InfiniteMenu
                    items={projects}
                    scale={1.2}
                />

            </main>

        </motion.div>
    );
}