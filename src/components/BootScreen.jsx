import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const bootLines = [
    "INITIALIZING SPIDEY_OS CORE STACK...",
    "BYPASSING LOCAL FIREWALLS... SUCCESS",
    "INJECTING KERNEL MODULES [0x7FFF8A3C]",
    "ESTABLISHING SECURE SSH TUNNEL TO GITHUB_API...",
    "DOWNLOADING USER_PROFILE_METADATA... 100%",
    "DECRYPTING PORTFOLIO_MODULES...",
    "STARTING WINDOW_MANAGER V3.4.1-BETA...",
    "SYS_STATUS: ACCESS_GRANTED. WELCOME OPERATOR.",
];

export default function BootScreen({ onFinish }) {
    const [visibleLines, setVisibleLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [hexGarbage, setHexGarbage] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        let lineIndex = 0;

        // 1. Spitting out terminal lines (2X Slower: Delays increased to 300ms - 800ms)
        const printLine = () => {
            if (lineIndex < bootLines.length) {
                setVisibleLines((prev) => [...prev, bootLines[lineIndex]]);
                lineIndex++;
                setTimeout(printLine, Math.random() * 500 + 300);
            }
        };

        const lineTimeout = setTimeout(printLine, 400);

        // 2. Generating rapid, flickering hacker hex logs (Updates every 100ms)
        const hexInterval = setInterval(() => {
            if (progress < 100) {
                const randomHex = Array.from({ length: 3 }, () =>
                    `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`
                ).join("  |  ");
                setHexGarbage(randomHex);
            } else {
                setHexGarbage("SYSTEM STABLE // NO LOGS EN ROUTE");
            }
        }, 100);

        // 3. Cinematic progress bar (Updates every 90ms)
        const progressTimer = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(progressTimer);
                    clearInterval(hexInterval);

                    // Dramatic 1.8-second delay after getting access before transition
                    setTimeout(() => {
                        onFinish();
                    }, 1800);

                    return 100;
                }

                const increment = Math.random() > 0.7 ? 8 : 2;
                return Math.min(p + increment, 100);
            });
        }, 90);

        return () => {
            clearTimeout(lineTimeout);
            clearInterval(progressTimer);
            clearInterval(hexInterval);
        };
    }, [onFinish]);

    // Keep terminal scrolled to the bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [visibleLines, hexGarbage]);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                background: "#020204",
                color: "#00FF66",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            {/* Scanline overlay for that retro CRT screen grid look */}
            <div style={{
                position: "fixed",
                top: 0, left: 0, width: "100vw", height: "100vh",
                background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
                backgroundSize: "100% 4px",
                zIndex: 10,
                pointerEvents: "none"
            }} />

            <div
                style={{
                    width: "800px",
                    maxWidth: "100%",
                    border: "1px solid #FF2B46",
                    background: "rgba(5, 6, 8, 0.85)",
                    padding: "30px",
                    borderRadius: "4px",
                    boxShadow: "0 0 20px rgba(255, 43, 70, 0.15)",
                }}
            >
                {/* Main Header Info Area */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25, borderBottom: "1px dashed rgba(255, 43, 70, 0.3)", paddingBottom: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, textShadow: "0 0 0px #FF2B46" }}
                        animate={{ opacity: 1, textShadow: "0 0 8px #FF2B46" }}
                        style={{
                            color: "#FF2B46",
                            fontSize: 22,
                            margin: 0,
                            letterSpacing: 4,
                            fontWeight: "900"
                        }}
                    >
                        SPIDEY_OS // OVERRIDE_MODE
                    </motion.h1>
                    <span style={{ color: "#FF2B46", fontSize: 12, opacity: 0.7 }}>SECURE_LN // TYPE_ALPHA</span>
                </div>

                {/* Live Terminal Log Streamer */}
                <div
                    ref={containerRef}
                    style={{
                        height: "260px",
                        overflowY: "auto",
                        marginBottom: 20,
                        paddingRight: "10px"
                    }}
                >
                    {visibleLines.map((line, i) => {
                        const isLast = i === visibleLines.length - 1;
                        const isGranted = typeof line === "string" && line.includes("GRANTED");
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    marginBottom: 10,
                                    fontSize: 14,
                                    lineHeight: "1.5",
                                    color: isGranted ? "#FF2B46" : "#00FF66",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <span style={{ color: "#FF2B46", marginRight: 8, userSelect: "none" }}>root@spidey:~#</span>
                                <span>{line}</span>
                                {isLast && !isGranted && (
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6 }}
                                        style={{ display: "inline-block", width: 8, height: 15, background: "#00FF66", marginLeft: 6 }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Constantly computing Hex Data readouts */}
                <div style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "rgba(0, 255, 102, 0.35)",
                    marginBottom: 30,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderTop: "1px solid rgba(0, 255, 102, 0.1)",
                    paddingTop: 12
                }}>
                    [MEMORY_DUMP]: {hexGarbage}
                </div>

                {/* Loading status panel */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#a1a1aa", marginBottom: 6 }}>
                        <span>OVERRIDE STATUS</span>
                        <span style={{ color: progress === 100 ? "#00FF66" : "#FF2B46", fontWeight: "bold" }}>
                            {progress === 100 ? "READY" : `${progress}%`}
                        </span>
                    </div>
                    <div
                        style={{
                            height: 6,
                            background: "#12131a",
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid rgba(255, 43, 70, 0.2)"
                        }}
                    >
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeInOut" }}
                            style={{
                                height: "100%",
                                background: "linear-gradient(90deg, #FF2B46 0%, #ff6b7d 100%)",
                                boxShadow: "0 0 8px #FF2B46"
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}