import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Orbit,
    MousePointer2,
    ArrowRight,
} from "lucide-react";

/* ======================================================
    PROJECTS POPUP
====================================================== */

const AUTO_CLOSE_MS = 10000;

export default function ProjectsPopup() {

    const [visible, setVisible] = useState(true);

    /* ---------- Fonts ---------- */

    useEffect(() => {

        const id = "projects-popup-fonts";

        if (!document.getElementById(id)) {

            const link = document.createElement("link");

            link.id = id;

            link.rel = "stylesheet";

            link.href =
                "https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500&display=swap";

            document.head.appendChild(link);

        }

    }, []);

    /* ---------- Auto Close ---------- */

    useEffect(() => {

        if (!visible) return;

        const timer = setTimeout(() => {

            setVisible(false);

        }, AUTO_CLOSE_MS);

        return () => clearTimeout(timer);

    }, [visible]);

    return (

        <AnimatePresence>

            {visible && (

                <motion.div

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    exit={{ opacity: 0 }}

                    transition={{ duration: .25 }}

                    style={{

                        position: "fixed",

                        inset: 0,

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        background: "rgba(8,8,10,.70)",

                        backdropFilter: "blur(6px)",

                        zIndex: 99999999,

                    }}

                >

                    <motion.div

                        initial={{
                            opacity: 0,
                            scale: .9,
                            rotate: -2,
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: -1,
                        }}

                        exit={{
                            opacity: 0,
                            scale: .9,
                            rotate: 2,
                        }}

                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}

                        style={{

                            position: "relative",

                            width: "100%",

                            maxWidth: 390,

                            background: "#0A0E17",

                            border: "3px solid #F2EDE0",

                            color: "#F2EDE0",

                            padding: "26px",

                            fontFamily: "Inter",

                            boxShadow:
                                "8px 8px 0 #E8352F, 14px 14px 0 rgba(47,208,255,.45)",

                        }}

                    >

                        {/* Comic Corner */}

                        <div

                            style={{

                                position: "absolute",

                                top: -3,

                                left: -3,

                                width: 52,

                                height: 52,

                                clipPath:
                                    "polygon(0 0,100% 0,0 100%)",

                                backgroundImage:
                                    "radial-gradient(#E8352F 1.5px, transparent 1.5px)",

                                backgroundSize: "7px 7px",

                            }}

                        />

                        {/* Close */}

                        <button

                            onClick={() => setVisible(false)}

                            style={{

                                position: "absolute",

                                top: 14,

                                right: 14,

                                width: 24,

                                height: 24,

                                borderRadius: "50%",

                                border: "2px solid #0A0E17",

                                outline: "1px solid #F2EDE0",

                                background: "#E8352F",

                                cursor: "pointer",

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",

                            }}

                        >

                            <X
                                size={13}
                                color="#0A0E17"
                                strokeWidth={3}
                            />

                        </button>

                        {/* Heading */}

                        <div

                            style={{

                                position: "relative",

                                fontFamily: "Anton",

                                fontSize: 40,

                                textTransform: "uppercase",

                                marginBottom: 18,

                            }}

                        >

                            <span

                                style={{

                                    position: "absolute",

                                    color: "#E8352F",

                                    transform:
                                        "translate(-2px,2px)",

                                    opacity: .8,

                                }}

                            >

                                Project Archive

                            </span>

                            <span

                                style={{

                                    position: "absolute",

                                    color: "#2FD0FF",

                                    transform:
                                        "translate(2px,-2px)",

                                    opacity: .8,

                                }}

                            >

                                Project Archive

                            </span>

                            <span
                                style={{
                                    position: "relative",
                                }}
                            >

                                Project Archive

                            </span>

                        </div>

                        {/* Section Label */}

                        <div

                            style={{

                                fontFamily:
                                    "JetBrains Mono",

                                fontSize: 11,

                                letterSpacing: ".12em",

                                color: "#2FD0FF",

                                marginBottom: 12,

                            }}

                        >

                            MISSION BRIEF

                        </div>                        {/* Instructions */}

                        <ul

                            style={{

                                listStyle: "none",

                                padding: 0,

                                margin: "0 0 26px",

                                display: "flex",

                                flexDirection: "column",

                                gap: 14,

                            }}

                        >

                            <li

                                style={{

                                    display: "flex",

                                    gap: 12,

                                    alignItems: "flex-start",

                                }}

                            >

                                <MousePointer2

                                    size={16}

                                    color="#E8352F"

                                    style={{

                                        marginTop: 2,

                                        flexShrink: 0,

                                    }}

                                />

                                <span

                                    style={{

                                        fontSize: 14,

                                        color: "#C7CDDB",

                                        lineHeight: 1.5,

                                    }}

                                >

                                    Drag the sphere to browse featured projects.

                                </span>

                            </li>

                            <li

                                style={{

                                    display: "flex",

                                    gap: 12,

                                    alignItems: "flex-start",

                                }}

                            >

                                <Orbit

                                    size={16}

                                    color="#2FD0FF"

                                    style={{

                                        marginTop: 2,

                                        flexShrink: 0,

                                    }}

                                />

                                <span

                                    style={{

                                        fontSize: 14,

                                        color: "#C7CDDB",

                                        lineHeight: 1.5,

                                    }}

                                >

                                    Center any project to reveal details and open links.

                                </span>

                            </li>

                        </ul>

                        {/* Action Button */}

                        <button

                            onClick={() => setVisible(false)}

                            style={{

                                width: "100%",

                                display: "flex",

                                justifyContent: "center",

                                alignItems: "center",

                                gap: 10,

                                background: "#E8352F",

                                color: "#0A0E17",

                                border: "2px solid #F2EDE0",

                                padding: "11px 18px",

                                cursor: "pointer",

                                fontFamily:
                                    "JetBrains Mono",

                                fontWeight: 700,

                                fontSize: 13,

                                letterSpacing: ".08em",

                                textTransform: "uppercase",

                                boxShadow:
                                    "3px 3px 0 #2FD0FF",

                            }}

                        >

                            BEGIN EXPLORING

                            <ArrowRight

                                size={16}

                                strokeWidth={2.5}

                            />

                        </button>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>

    );

}