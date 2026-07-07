import { motion } from "framer-motion";
import { profile } from "../../../data/profile";

export default function Interests() {
    return (
        <section
            style={{
                width: "100%",
                maxWidth: 1000,

                margin: "0 auto",

                display: "flex",
                flexDirection: "column",

                gap: 36,
            }}
        >
            <SpiderBackground />
            {/* ================= HEADING ================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",

                    gap: 16,
                }}
            >
                <h2
                    style={{
                        margin: 0,

                        color: "#FFFFFF",

                        fontSize: 30,

                        letterSpacing: "2px",

                        textTransform: "uppercase",
                    }}
                >
                    Interests
                </h2>

                <div
                    style={{
                        flex: 1,

                        height: 2,

                        background:
                            "linear-gradient(90deg,#FF2B46,#2563EB,transparent)",
                    }}
                />
            </div>

            {/* ================= INTRO ================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: .5,
                }}
                style={{
                    position: "relative",

                    padding: 28,

                    borderRadius: 22,

                    overflow: "hidden",

                    background:
                        "rgba(18,20,26,.72)",

                    backdropFilter: "blur(24px)",

                    border:
                        "1px solid rgba(255,255,255,.08)",

                    boxShadow:
                        "0 18px 50px rgba(0,0,0,.35)",
                }}
            >
                {/* Spider Glow */}

                <div
                    style={{
                        position: "absolute",

                        width: 250,
                        height: 250,

                        right: -80,
                        top: -80,

                        borderRadius: "50%",

                        background:
                            "radial-gradient(circle,#FF2B46 0%,transparent 70%)",

                        opacity: .08,

                        filter: "blur(50px)",
                    }}
                />

                <p
                    style={{
                        margin: 0,

                        color: "#D1D5DB",

                        fontSize: 16,

                        lineHeight: 1.9,

                        maxWidth: 780,
                    }}
                >
                    I enjoy building software that solves
                    real problems and creates meaningful
                    impact. Every project I work on is
                    driven by curiosity, continuous
                    learning, and the goal of making
                    technology genuinely useful.
                </p>
            </motion.div>

            {/* ================= INTEREST GRID ================= */}

            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(280px,1fr))",

                    gap: 24,
                }}
            >
                {profile.interests.map((interest) => (
                    <InterestCard
                        key={interest.title}
                        interest={interest}
                    />
                ))}
            </div>
        </section>
    );
}function InterestCard({ interest }) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                scale: 1.02,
            }}
            whileTap={{
                scale: 0.98,
            }}
            transition={{
                duration: 0.25,
            }}
            style={{
                position: "relative",

                overflow: "hidden",

                padding: 24,

                borderRadius: 22,

                background: "rgba(18,20,26,.72)",

                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",

                border:
                    "1px solid rgba(255,255,255,.08)",

                boxShadow:
                    "0 18px 45px rgba(0,0,0,.35)",

                cursor: "default",
            }}
        >
            {/* Animated Spider Glow */}

            <motion.div
                animate={{
                    opacity: [0.05, 0.12, 0.05],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                }}
                style={{
                    position: "absolute",

                    width: 180,
                    height: 180,

                    borderRadius: "50%",

                    right: -70,
                    top: -70,

                    background:
                        "radial-gradient(circle,#FF2B46 0%,#2563EB 55%,transparent 75%)",

                    filter: "blur(45px)",
                }}
            />

            {/* Icon */}

            <motion.div
                whileHover={{
                    rotate: 8,
                    scale: 1.15,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                }}
                style={{
                    width: 72,
                    height: 72,

                    borderRadius: 18,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    fontSize: 34,

                    background:
                        "linear-gradient(135deg, rgba(255,43,70,.18), rgba(37,99,235,.18))",

                    border:
                        "1px solid rgba(255,255,255,.08)",

                    marginBottom: 22,
                }}
            >
                {interest.icon}
            </motion.div>

            {/* Title */}

            <h3
                style={{
                    margin: 0,

                    color: "#FFFFFF",

                    fontSize: 20,

                    letterSpacing: ".5px",
                }}
            >
                {interest.title}
            </h3>

            {/* Description */}

            <p
                style={{
                    marginTop: 14,

                    marginBottom: 0,

                    color: "#C8CDD5",

                    fontSize: 14.5,

                    lineHeight: 1.8,
                }}
            >
                {interest.description}
            </p>
        </motion.div>
    );
}function SpiderBackground() {
    return (
        <>
            {/* Red Ambient Glow */}

            <motion.div
                animate={{
                    opacity: [0.08, 0.15, 0.08],
                    scale: [1, 1.12, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
                style={{
                    position: "fixed",

                    width: 420,
                    height: 420,

                    borderRadius: "50%",

                    background: "#FF2B46",

                    filter: "blur(140px)",

                    top: -180,
                    right: -120,

                    pointerEvents: "none",

                    opacity: .08,
                }}
            />

            {/* Blue Ambient Glow */}

            <motion.div
                animate={{
                    opacity: [0.08, 0.14, 0.08],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                }}
                style={{
                    position: "fixed",

                    width: 420,
                    height: 420,

                    borderRadius: "50%",

                    background: "#2563EB",

                    filter: "blur(140px)",

                    bottom: -160,
                    left: -140,

                    pointerEvents: "none",

                    opacity: .08,
                }}
            />

            {/* Spider Web */}

            <svg
                style={{
                    position: "absolute",

                    inset: 0,

                    width: "100%",
                    height: "100%",

                    pointerEvents: "none",

                    opacity: .035,
                }}
                viewBox="0 0 1200 800"
            >
                <g
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                >
                    <line x1="0" y1="0" x2="220" y2="220" />

                    <line x1="40" y1="0" x2="220" y2="180" />
                    <line x1="80" y1="0" x2="220" y2="140" />
                    <line x1="120" y1="0" x2="220" y2="100" />

                    <path d="M0 40 Q80 60 140 140" />
                    <path d="M0 80 Q100 90 180 180" />
                    <path d="M0 120 Q110 120 220 220" />
                </g>

                <g
                    transform="translate(1200 800) rotate(180)"
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                >
                    <line x1="0" y1="0" x2="220" y2="220" />

                    <line x1="40" y1="0" x2="220" y2="180" />
                    <line x1="80" y1="0" x2="220" y2="140" />
                    <line x1="120" y1="0" x2="220" y2="100" />

                    <path d="M0 40 Q80 60 140 140" />
                    <path d="M0 80 Q100 90 180 180" />
                    <path d="M0 120 Q110 120 220 220" />
                </g>
            </svg>
        </>
    );
}