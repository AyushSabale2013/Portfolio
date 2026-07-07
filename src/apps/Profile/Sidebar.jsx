import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    HiUser,
    HiCodeBracket,
    HiAcademicCap,
    HiTrophy,
    HiHeart,
    HiEnvelope,
} from "react-icons/hi2";

const menu = [
    { id: "about", label: "About", icon: HiUser },
    { id: "skills", label: "Skills", icon: HiCodeBracket },
    { id: "education", label: "Education", icon: HiAcademicCap },
    { id: "achievements", label: "Achievements", icon: HiTrophy },
    { id: "interests", label: "Interests", icon: HiHeart },
    { id: "contact", label: "Contact", icon: HiEnvelope },
];

export default function Sidebar({ activeTab, setActiveTab }) {
    const [glitch, setGlitch] = useState(false);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Bangers&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    useEffect(() => {
        const loop = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 160);
        }, 4000);
        return () => clearInterval(loop);
    }, []);

    useEffect(() => {
        const cursor = setInterval(() => setBlink((b) => !b), 600);
        return () => clearInterval(cursor);
    }, []);

    const activeIndex = menu.findIndex((m) => m.id === activeTab);

    return (
        <div
            style={{
                width: 250,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                position: "relative",
                background: "rgba(255,255,255,.03)",
                borderRight: "1px solid rgba(255,255,255,.08)",
                backdropFilter: "blur(25px)",
                overflow: "hidden",
            }}
        >
            {/* Web watermark corner */}
            <svg
                width="160"
                height="160"
                style={{ position: "absolute", top: -40, left: -50, opacity: 0.06, pointerEvents: "none" }}
            >
                {[0, 25, 50, 75].map((a) => (
                    <line
                        key={a}
                        x1="0"
                        y1="0"
                        x2={160 * Math.cos((a * Math.PI) / 180)}
                        y2={160 * Math.sin((a * Math.PI) / 180)}
                        stroke="#FF2B46"
                        strokeWidth="1"
                    />
                ))}
                {[40, 80, 120].map((r) => (
                    <path
                        key={r}
                        d={`M 0 ${r} Q ${r * 0.6} ${r * 0.6} ${r} 0`}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="1"
                    />
                ))}
            </svg>

            {/* Logo / wordmark */}
            <div style={{ marginBottom: 18, position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#FF2B46,#2563EB)",
                            boxShadow: "0 0 16px rgba(255,43,70,.5)",
                            flexShrink: 0,
                        }}
                    />
                    <h2
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontFamily: "'Bangers', system-ui",
                            fontSize: 22,
                            letterSpacing: "1px",
                            textShadow: glitch
                                ? "-2px 0 #FF2B46, 2px 0 #2563EB"
                                : "none",
                        }}
                    >
                        SPIDEY OS
                    </h2>
                </div>
                <p
                    style={{
                        margin: "4px 0 0 40px",
                        color: "#6B7280",
                        fontSize: 11,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                    }}
                >
                    Navigation
                </p>
            </div>

            {/* Nav with connecting web thread */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <div
                    style={{
                        position: "absolute",
                        left: 33,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: "rgba(255,255,255,.06)",
                    }}
                />
                <motion.div
                    animate={{ top: activeIndex * 62 + 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                        position: "absolute",
                        left: 27,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "#FF2B46",
                        boxShadow: "0 0 10px rgba(255,43,70,.8)",
                    }}
                />

                {menu.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 6 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                position: "relative",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                padding: "12px 16px 12px 40px",
                                marginBottom: 2,
                                border: "none",
                                borderRadius: 14,
                                cursor: "pointer",
                                background: active
                                    ? "linear-gradient(135deg, rgba(255,43,70,.14), rgba(37,99,235,.1))"
                                    : "transparent",
                                color: active ? "#fff" : "#B8BDC7",
                                fontSize: 15,
                                fontWeight: 500,
                                transition: ".25s",
                            }}
                        >
                            <div
                                style={{
                                    width: 34,
                                    height: 34,
                                    flexShrink: 0,
                                    clipPath:
                                        "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                    background: active
                                        ? "linear-gradient(135deg,#FF2B46,#2563EB)"
                                        : "rgba(255,255,255,.05)",
                                    boxShadow: active
                                        ? "0 0 14px rgba(255,43,70,.5)"
                                        : "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Icon size={17} color={active ? "#fff" : "#9CA3AF"} />
                            </div>
                            {item.label}
                        </motion.button>
                    );
                })}
            </div>

            <div style={{ flex: 1 }} />

            {/* Terminal-style footer */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    padding: 16,
                    borderRadius: 16,
                    background: "rgba(0,0,0,.35)",
                    border: "1px solid rgba(255,43,70,.15)",
                    fontFamily: "'JetBrains Mono', monospace",
                }}
            >
                <p style={{ color: "#9CA3AF", margin: 0, fontSize: 12.5, lineHeight: 1.6 }}>
                    {"> Spider OS Portfolio"}
                </p>
                <p style={{ color: "#FF2B46", marginTop: 6, marginBottom: 0, fontSize: 11.5 }}>
                    {"> v1.0"}
                    <span style={{ opacity: blink ? 1 : 0 }}>_</span>
                </p>
            </div>
        </div>
    );
}