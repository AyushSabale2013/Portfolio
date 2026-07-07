import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { profile } from "../../data/profile";
import profileImage from "../../assets/profile.png";

export default function Header() {
    const [currentRole, setCurrentRole] = useState(0);
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % profile.roles.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Load comic display font
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Bangers&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    // Random chromatic-aberration glitch tick on the name
    useEffect(() => {
        const glitchLoop = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 180);
        }, 3400);
        return () => clearInterval(glitchLoop);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 45,
                position: "relative",
            }}
        >
            {/* Ambient web backdrop */}
            <svg
                width="420"
                height="420"
                viewBox="0 0 420 420"
                style={{
                    position: "absolute",
                    top: -90,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 0,
                    opacity: 0.12,
                    pointerEvents: "none",
                }}
            >
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const x2 = 210 + 200 * Math.cos((angle * Math.PI) / 180);
                    const y2 = 210 + 200 * Math.sin((angle * Math.PI) / 180);
                    return (
                        <line
                            key={i}
                            x1="210"
                            y1="210"
                            x2={x2}
                            y2={y2}
                            stroke="#FF2B46"
                            strokeWidth="1"
                        />
                    );
                })}
                {[60, 110, 160, 200].map((r) => (
                    <circle
                        key={r}
                        cx="210"
                        cy="210"
                        r={r}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="1"
                    />
                ))}
            </svg>

            {/* Avatar with spider-sense pulse rings */}
            <div style={{ position: "relative", zIndex: 1 }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.6, 1.6],
                            opacity: [0.5, 0, 0],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut",
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "2px solid #FF2B46",
                            zIndex: 0,
                        }}
                    />
                ))}

                <motion.div
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.35 }}
                    style={{
                        width: 190,
                        height: 190,
                        borderRadius: "50%",
                        padding: 5,
                        background: "linear-gradient(135deg,#FF2B46,#2563EB)",
                        boxShadow:
                            "0 0 45px rgba(255,43,70,.45), 0 0 90px rgba(37,99,235,.25)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <img
                        src={profileImage}
                        alt={profile.basic.name}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "4px solid #111",
                        }}
                    />
                </motion.div>
            </div>

            {/* Name — chromatic-glitch comic lettering */}
            <div style={{ position: "relative", marginTop: 24, zIndex: 1 }}>
                <h1
                    style={{
                        margin: 0,
                        fontFamily: "'Bangers', system-ui",
                        fontWeight: 400,
                        fontSize: 44,
                        letterSpacing: "1.5px",
                        color: "#FFF",
                        textShadow: glitch
                            ? "-3px 0 #FF2B46, 3px 0 #2563EB"
                            : "0 0 20px rgba(255,255,255,.15)",
                        transition: "text-shadow 0.05s",
                    }}
                >
                    {profile.basic.name}
                </h1>
            </div>

            {/* Animated Role */}
            <AnimatePresence mode="wait">
                <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        margin: 0,
                        marginTop: 8,
                        color: "#FF2B46",
                        fontSize: 18,
                        fontWeight: 500,
                        letterSpacing: "1px",
                        zIndex: 1,
                    }}
                >
                    {profile.roles[currentRole]}
                </motion.h2>
            </AnimatePresence>

            {/* College */}
            <p style={{ marginTop: 14, color: "#9CA3AF", fontSize: 15, letterSpacing: ".3px", zIndex: 1 }}>
                {profile.basic.college}
            </p>

            {/* Location */}
            <p style={{ marginTop: 5, color: "#6B7280", fontSize: 13, zIndex: 1 }}>
                📍 {profile.basic.location}
            </p>

            {/* Web-shooter dock */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 20,
                    marginTop: 30,
                    padding: "14px 24px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,.04)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,43,70,.15)",
                    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                    zIndex: 1,
                }}
            >
                {profile.socials.map((item) => {
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.name}
                            whileHover={{ scale: 1.15, y: -6 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => window.open(item.link, "_blank")}
                            title={item.name}
                            style={{
                                width: 54,
                                height: 54,
                                clipPath:
                                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                border: "1px solid rgba(255,43,70,.3)",
                                background:
                                    "linear-gradient(135deg, rgba(255,43,70,.08), rgba(37,99,235,.08))",
                                color: "#F3F4F6",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: ".25s",
                            }}
                        >
                            <Icon size={22} />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}