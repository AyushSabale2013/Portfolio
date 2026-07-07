import { motion } from "framer-motion";
import { profile } from "../../../data/profile";

import {
    FaCode,
    FaReact,
    FaServer,
    FaDatabase,
    FaRobot,
    FaTools,
} from "react-icons/fa";

const sections = [
    {
        title: "Languages",
        icon: <FaCode />,
        color: "#FF2B46",
        skills: profile.skills.languages,
    },
    {
        title: "Frontend",
        icon: <FaReact />,
        color: "#2563EB",
        skills: profile.skills.frontend,
    },
    {
        title: "Backend",
        icon: <FaServer />,
        color: "#10B981",
        skills: profile.skills.backend,
    },
    {
        title: "Databases",
        icon: <FaDatabase />,
        color: "#F59E0B",
        skills: profile.skills.databases,
    },
    {
        title: "AI / ML",
        icon: <FaRobot />,
        color: "#8B5CF6",
        skills: profile.skills.ai,
    },
    {
        title: "Tools",
        icon: <FaTools />,
        color: "#9CA3AF",
        skills: profile.skills.tools,
    },
];

export default function Skills() {
    return (
        <section
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 30,
                width: "100%",
                maxWidth: 950,
                margin: "60px auto",
                boxSizing: "border-box",
            }}
        >
            {/* Heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span
                    style={{
                        color: "#6B7280",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                    }}
                >
                    Capabilities
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <h2
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize: 26,
                            letterSpacing: "1px",
                        }}
                    >
                        Skills
                    </h2>
                    <div
                        style={{
                            flex: 1,
                            height: 1,
                            background: "linear-gradient(90deg,#FF2B46,#2563EB 60%,transparent)",
                            opacity: 0.35,
                        }}
                    />
                </div>
            </div>

            {/* Categories */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))",
                    gap: 20,
                }}
            >
                {sections.map((section) => (
                    <SkillSection key={section.title} {...section} />
                ))}
            </div>
        </section>
    );
}

function SkillSection({ title, icon, color, skills }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
                position: "relative",
                borderRadius: 14,
                padding: 24,
                background: "rgba(14,17,27,.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,.25)",
            }}
        >
            {/* Thin top accent, static */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 24,
                    right: 24,
                    height: 2,
                    background: color,
                    opacity: 0.5,
                    borderRadius: "0 0 3px 3px",
                }}
            />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                        background: "rgba(255,255,255,.05)",
                        color,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 17,
                    }}
                >
                    {icon}
                </div>

                <div>
                    <h3
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: ".3px",
                        }}
                    >
                        {title}
                    </h3>
                    <span
                        style={{
                            color: "#6B7280",
                            fontSize: 11.5,
                            letterSpacing: ".5px",
                        }}
                    >
                        {skills.length} skills
                    </span>
                </div>
            </div>

            {/* Skill Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} color={color} />
                ))}
            </div>
        </motion.div>
    );
}

function SkillChip({ skill, color }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)",
                transition: "border-color .2s ease, background .2s ease",
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                }}
            />
            <span
                style={{
                    color: "#D5D9E0",
                    fontWeight: 500,
                    fontSize: 13.5,
                    letterSpacing: ".2px",
                }}
            >
                {skill}
            </span>
        </div>
    );
}