import { motion } from "framer-motion";
import { FaDownload, FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";

export default function Resume() {
    return (
        <div
            style={{
                padding: "40px 20px 60px",
                color: "#fff",
                maxWidth: 950,
                margin: "0 auto",
                fontFamily: "'Inter', system-ui, sans-serif",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Minimal Background Vector Webs */}
            <svg
                style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-40px",
                    width: "380px",
                    height: "380px",
                    opacity: 0.07,
                    pointerEvents: "none",
                    zIndex: 0
                }}
                viewBox="0 0 100 100"
            >
                <path d="M0,0 L100,100 M0,0 L100,50 M0,0 L50,100 M0,0 L100,25 M0,0 L25,100" stroke="#FF1493" strokeWidth="0.5" fill="none" />
                <path d="M20,5 Q40,25 5,20 M40,10 Q65,45 10,40 M60,15 Q85,65 15,60" stroke="#FF4500" strokeWidth="0.5" fill="none" />
            </svg>

            <svg
                style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "-30px",
                    width: "320px",
                    height: "320px",
                    opacity: 0.05,
                    pointerEvents: "none",
                    zIndex: 0,
                    transform: "rotate(90deg)"
                }}
                viewBox="0 0 100 100"
            >
                <path d="M0,0 L100,100 M0,0 L100,50 M0,0 L50,100" stroke="#FFD700" strokeWidth="0.5" fill="none" />
                <path d="M20,5 Q40,25 5,20 M40,10 Q65,45 10,40" stroke="#FF4500" strokeWidth="0.5" fill="none" />
            </svg>

            {/* Flat Comic-Book Structural Design System Overrides */}
            <style>{`
                .spider-font {
                    font-family: 'Bangers', cursive, system-ui !important;
                }
                .spider-resume-card {
                    box-shadow: 3px 3px 0px #111 !important;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
                }
                .spider-resume-card:hover {
                    border-color: #FF1493 !important;
                    box-shadow: 5px 5px 0px #111 !important;
                }
                @media (max-width: 600px) {
                    .resume-header-dock { flexDirection: column !important; gap: 16px !important; align-items: flex-start !important; }
                    .resume-btn-group { width: 100% !important; flex-direction: column !important; }
                    .resume-action-btn { width: 100% !important; justify-content: center !important; }
                }
            `}</style>

            {/* Top Command Bar & Title */}
            <div
                className="resume-header-dock"
                style={{
                    display: "flex",
                    justifyContent: "between",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 32,
                    position: "relative",
                    zIndex: 1,
                    gap: 20
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ color: "#FF4500", fontSize: 26, display: "flex", alignItems: "center" }}><FaFileAlt /></div>
                    <h1
                        className="spider-font"
                        style={{
                            margin: 0,
                            fontSize: 36,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: "#FFD700",
                        }}
                    >
                        Data Dossier
                    </h1>
                </div>

                {/* Instant Action Triggers */}
                <div className="resume-btn-group" style={{ display: "flex", gap: 14 }}>
                    <motion.a
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href="/Resume.pdf"
                        download="Ayush_Sabale_Resume.pdf"
                        className="spider-resume-card resume-action-btn"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            border: "1px solid #FF1493",
                            borderRadius: 12,
                            background: "#FF1493",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: 13.5,
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                    >
                        <FaDownload size={13} /> Download PDF
                    </motion.a>

                    <motion.a
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href="/Resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spider-resume-card resume-action-btn"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#E5E7EB",
                            fontWeight: 600,
                            fontSize: 13.5,
                            textDecoration: "none",
                        }}
                    >
                        <FaExternalLinkAlt size={12} /> Fullscreen Node
                    </motion.a>
                </div>
            </div>{/* Embedded Holo-Viewer Frame mapped directly to the public folder file */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="spider-resume-card"
                style={{
                    position: "relative",
                    background: "rgba(11, 15, 25, 0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 69, 0, 0.15)",
                    borderRadius: 24,
                    padding: 12,
                    width: "100%",
                    height: "720px",
                    boxSizing: "border-box",
                    zIndex: 1
                }}
            >
                {/* Ambience highlight glow leaking inside the frame layout */}
                <div
                    style={{
                        position: "absolute",
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        bottom: -80,
                        right: -80,
                        background: "radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%)",
                        filter: "blur(45px)",
                        pointerEvents: "none"
                    }}
                />

                <iframe
                    src="/Resume.pdf#view=FitH"
                    title="Ayush Sabale Resume Node"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: 14,
                        background: "#161B26"
                    }}
                />
            </motion.div>{/* Quick-Skim Tech Deployment Grid */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                    marginTop: 32,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 18,
                    position: "relative",
                    zIndex: 1
                }}
            >
                {[
                    { title: "Primary Target Focus", value: "Software Engineering & Architecture", marker: "#FF1493" },
                    { title: "Core Specialization Clusters", value: "Full-Stack Development, AI & ML Modules", marker: "#FF4500" },
                    { title: "Deployment Base Node", value: "Kolhapur, MH ⇄ IIIT Pune Network", marker: "#FFD700" }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="spider-resume-card"
                        style={{
                            padding: "20px 24px",
                            borderRadius: 16,
                            background: "rgba(11, 15, 25, 0.65)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.04)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11.5,
                                color: "#9CA3AF",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 6
                            }}
                        >
                            <span style={{ width: 6, height: 6, background: stat.marker, borderRadius: "50%" }} />
                            {stat.title}
                        </div>
                        <div
                            style={{
                                fontSize: 14.5,
                                color: "#E5E7EB",
                                fontWeight: 500,
                                lineHeight: 1.5
                            }}
                        >
                            {stat.value}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}