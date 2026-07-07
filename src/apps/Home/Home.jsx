import { motion } from "framer-motion";

import { apps } from "../../apps/apps";

export default function Home({ onOpen }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",

                padding: 30,

                background: "#232323",

                color: "white",

                overflowY: "auto",
            }}
        >
            {/* Header */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                }}
                style={{
                    marginBottom: 35,
                }}
            >
                <h1
                    style={{
                        margin: 0,

                        fontSize: 34,

                        fontWeight: 700,
                    }}
                >
                    Home
                </h1>

                <p
                    style={{
                        marginTop: 10,

                        color: "#bdbdbd",

                        fontSize: 16,
                    }}
                >
                    Open applications and explore Spider OS.
                </p>
            </motion.div>

            {/* Apps Grid */}

            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(140px,1fr))",

                    gap: 28,
                }}
            >                {Object.entries(apps).map(([id, app]) => (
                    <motion.div
                        key={id}
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        whileHover={{
                            y: -6,
                            scale: 1.04,
                        }}
                        whileTap={{
                            scale: 0.96,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        onDoubleClick={() =>
                            onOpen(id)
                        }
                        style={{
                            background:
                                "rgba(255,255,255,.04)",

                            border:
                                "1px solid rgba(255,255,255,.08)",

                            borderRadius: 18,

                            padding: "22px 18px",

                            display: "flex",

                            flexDirection: "column",

                            alignItems: "center",

                            justifyContent: "center",

                            gap: 16,

                            cursor: "pointer",

                            userSelect: "none",

                            backdropFilter:
                                "blur(10px)",

                            minHeight: 150,

                            transition: ".25s",
                        }}
                    >
                        <img
                            src={app.icon}
                            alt={app.title}
                            draggable={false}
                            style={{
                                width: 68,
                                height: 68,
                                objectFit: "contain",
                            }}
                        />

                        <span
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                textAlign: "center",
                                color: "#F3F4F6",
                            }}
                        >
                            {app.title}
                        </span>
                    </motion.div>
                ))}
            </div>            {/* Status Bar */}

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 0.25,
                }}
                style={{
                    marginTop: 35,

                    padding: "14px 20px",

                    borderRadius: 16,

                    background:
                        "rgba(255,255,255,.04)",

                    border:
                        "1px solid rgba(255,255,255,.08)",

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    color: "#BDBDBD",

                    fontSize: 14,
                }}
            >
                <span>
                    {Object.values(apps).length} Applications
                </span>

                <span>
                    Double-click an app to open it
                </span>
            </motion.div>
        </div>
    );
}