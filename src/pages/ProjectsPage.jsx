import { motion } from "framer-motion";
import ProjectsPopup from "../components/ProjectsPopup";
import InfiniteMenu from "../components/InfiniteMenu";
import projects from "../data/projects";

import "./ProjectsPage.css";

export default function ProjectsPage({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="projects-page"
            style={{ background: "#020810" }}
        >
            {/* Halftone + scanline overlays */}
            <div className="pp-halftone" aria-hidden="true" />
            <div className="pp-scanlines" aria-hidden="true" />

            {/* Spider-web corner SVG */}
            <svg
                className="pp-web-corner"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Radial lines from top-left corner */}
                {[0, 18, 36, 54, 72, 90].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <line
                            key={i}
                            x1="0" y1="0"
                            x2={Math.cos(rad) * 220}
                            y2={Math.sin(rad) * 220}
                            stroke="white" strokeWidth="0.8"
                        />
                    );
                })}
                {/* Concentric arcs */}
                {[40, 80, 120, 160].map((r, i) => (
                    <path
                        key={i}
                        d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.8"
                    />
                ))}
            </svg>

            {/* Bottom-right mirrored web corner */}
            <svg
                className="pp-web-corner pp-web-corner--br"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {[0, 18, 36, 54, 72, 90].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <line
                            key={i}
                            x1="0" y1="0"
                            x2={Math.cos(rad) * 220}
                            y2={Math.sin(rad) * 220}
                            stroke="white" strokeWidth="0.8"
                        />
                    );
                })}
                {[40, 80, 120, 160].map((r, i) => (
                    <path
                        key={i}
                        d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.8"
                    />
                ))}
            </svg>

            <ProjectsPopup />

            {/* ================= HEADER ================= */}
            <header className="projects-header">
                <button className="projects-header-back" onClick={onClose}>
                    <span className="projects-header-back-arrow">←</span>
                    Spider Desktop
                </button>

                <h1
                    className="projects-header-title"
                    data-text="MY WORK"
                >
                    MY WORK
                </h1>

                <div className="projects-header-spacer" aria-hidden="true" />
            </header>

            {/* ================= SPHERE ================= */}
            <main className="projects-menu-section">
                <InfiniteMenu items={projects} scale={1.2} />
            </main>
        </motion.div>
    );
}