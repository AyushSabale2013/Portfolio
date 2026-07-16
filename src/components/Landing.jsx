import wallpaper from "../assets/spidermanWallpaper.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import TextPressure from "./TextPressure";


export default function Landing({ onEnter }) {
    const roles = [
        "AI / ML ENGINEER",
        "FULL STACK DEVELOPER",
        "COMPETITIVE PROGRAMMER",
        "DESIGNER",
        "ATHLETE",
        "MACHINE LEARNING ENTHUSIAST",
    ];

    const [currentRole, setCurrentRole] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
            }}
            style={{
                width: "100%",
                height: "100vh",
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Dark Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(rgba(0,0,0,.70), rgba(0,0,0,.78))",
                }}
            />

            {/* Red Ambient Glow */}
            <motion.div
                animate={{
                    opacity: [0.25, 0.55, 0.25],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "#ff2b46",
                    filter: "blur(220px)",
                    top: -250,
                    left: -250,
                }}
            />

            {/* Blue Ambient Glow */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.45, 0.2],
                    scale: [1, 1.12, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                }}
                style={{
                    position: "absolute",
                    width: 650,
                    height: 650,
                    borderRadius: "50%",
                    background: "#2563eb",
                    filter: "blur(220px)",
                    bottom: -250,
                    right: -250,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                }}
            >
                {/* Title */}
                <div
                    style={{
                        width: "92%",
                        maxWidth: "1450px",
                        height: "230px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <TextPressure
                        text="AYUSH SABALE"
                        flex
                        width
                        weight
                        italic
                        alpha={false}
                        stroke={false}
                        textColor="#FFFFFF"
                        strokeColor="#FF2B46"
                        minFontSize={72}
                    />
                </div>

                {/* Animated Role */}
                <div
                    style={{
                        height: 35,
                        marginTop: 25,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={roles[currentRole]}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                            style={{
                                fontSize: 22,
                                fontWeight: 500,
                                color: "#E2E8F0",
                                letterSpacing: 4,
                            }}
                        >
                            {roles[currentRole]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Button */}
                <motion.button
                    onClick={onEnter}
                    whileHover={{
                        scale: 1.04,
                        y: -3,
                    }}
                    whileTap={{
                        scale: 0.97,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                    }}
                    style={{
                        marginTop: "70px",
                        width: "340px",
                        height: "62px",

                        borderRadius: "20px",

                        background:
                            "linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,.03))",

                        backdropFilter: "blur(22px)",
                        WebkitBackdropFilter: "blur(22px)",

                        border: "1px solid rgba(255,255,255,.18)",

                        color: "#fff",

                        fontSize: "15px",
                        fontWeight: 700,

                        letterSpacing: "2px",

                        cursor: "pointer",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "14px",

                        boxShadow:
                            "0 15px 40px rgba(0,0,0,.45), 0 0 30px rgba(255,43,70,.18)",

                        overflow: "hidden",

                        position: "relative",
                    }}
                >
                    <span>ENTER SPIDEY DESKTOP</span>

                    <motion.span
                        animate={{
                            x: [0, 6, 0],
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                        }}
                        style={{
                            color: "#FF2B46",
                            fontSize: 20,
                        }}
                    >
                        →
                    </motion.span>
                </motion.button>
            </div>
        </motion.div>
    );
}