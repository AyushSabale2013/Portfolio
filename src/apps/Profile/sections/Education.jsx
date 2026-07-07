import { motion } from "framer-motion";
import { profile } from "../../../data/profile";

import {
    FaGraduationCap,
    FaUniversity,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
} from "react-icons/fa";

export default function Education() {
    return (
        <section
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: 950,
                margin: "60px auto",
                gap: 40,
                position: "relative",
                fontFamily: "'Inter', system-ui, sans-serif",
                boxSizing: "border-box",
                padding: "0 20px"
            }}
        >
            {/* Global style overrides for uniform Spider-Verse panel styles without background glow */}
            <style>{`
                .spider-font {
                    font-family: 'Bangers', cursive, system-ui !important;
                }
                .spider-card-glow {
                    box-shadow: 3px 3px 0px #111 !important;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
                }
                .spider-card-glow:hover {
                    border-color: rgba(255, 43, 70, 0.35) !important;
                    box-shadow: 4px 4px 0px #111 !important; /* Only pops the flat comic depth shadow forward */
                }
                @media (max-width: 600px) {
                    .timeline-line { left: 12px !important; }
                    .card-container { marginLeft: 40px !important; padding: 20px !important; }
                    .node-dot { left: -39px !important; width: 18px !important; height: 18px !important; top: 38px !important; }
                }
            `}</style>

            {/* Heading Accent */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <h2
                    className="spider-font"
                    style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontSize: 32,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                    }}
                >
                    Education
                </h2>
                <div
                    style={{
                        flex: 1,
                        height: 2,
                        background: "linear-gradient(90deg, #FF2B46, #2563EB, transparent)",
                        opacity: 0.6
                    }}
                />
            </div>

            {/* Timeline Area */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 60 }}>
                {/* Vertical Interactive Web-Line */}
                <div
                    className="timeline-line"
                    style={{
                        position: "absolute",
                        left: 24,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        borderRadius: 20,
                        background: "linear-gradient(to bottom, #FF2B46, #2563EB, rgba(37,99,235,0.1))",
                        opacity: 0.85,
                    }}
                />

                {profile.education.map((item, index) => (
                    <EducationCard key={index} data={item} />
                ))}

                <FutureNode />
            </div>
        </section>
    );
};


function EducationCard({ data }) {
    return (
        <motion.div
            className="spider-card-glow card-container"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                position: "relative",
                marginLeft: 70,
                padding: 32,
                borderRadius: 20,
                overflow: "hidden",
                background: "rgba(11, 15, 25, 0.65)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
        >
            {/* Chromatic Portal Halftone Glow */}
            <div
                style={{
                    position: "absolute",
                    width: 250,
                    height: 250,
                    borderRadius: "50%",
                    right: -90,
                    top: -90,
                    background: "radial-gradient(circle, rgba(255,43,70,0.12) 0%, transparent 70%)",
                    filter: "blur(45px)",
                    pointerEvents: "none"
                }}
            />

            {/* Timeline Custom-Border Node */}
            <div
                className="node-dot"
                style={{
                    position: "absolute",
                    left: -57,
                    top: 38,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF2B46, #2563EB)",
                    border: "4px solid #0B0F19",
                    boxShadow: "0 0 20px rgba(255,43,70,0.6)",
                    zIndex: 2
                }}
            />

            {/* Degree and Identity Info Block */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        background: "rgba(255, 43, 70, 0.08)",
                        border: "1px solid rgba(255, 43, 70, 0.2)",
                        color: "#FF2B46",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 22,
                    }}
                >
                    <FaGraduationCap />
                </div>

                <div>
                    <h2 style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 600, letterSpacing: "0.3px" }}>
                        {data.degree}
                    </h2>
                    <h3 style={{ margin: "4px 0 0", color: "#2563EB", fontWeight: 500, fontSize: 16, letterSpacing: "0.5px" }}>
                        {data.branch}
                    </h3>
                </div>
            </div>

            {/* Metadata Rows */}
            <div style={{ display: "grid", gap: 12, marginBottom: 26 }}>
                {/* Clicking your college name will now open the official IIIT Pune website in a new tab */}
                <div 
                    onClick={() => window.open("https://www.iiitp.ac.in", "_blank")}
                    style={{ cursor: "pointer" }}
                >
                    <InfoRow 
                        icon={<FaUniversity />} 
                        text={data.college} 
                        isLink={true}
                    />
                </div>
                <InfoRow icon={<FaCalendarAlt />} text={data.duration} />
                <InfoRow icon={<FaMapMarkerAlt />} text={data.location} />
            </div>

            {/* Sub-block: Subjects Completed Section */}
            {data.subjectsCompleted && data.subjectsCompleted.length > 0 && (
                <div style={{ marginBottom: 26 }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#FF2B46", fontSize: 13, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                        Core Systems Mastered
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                        {data.subjectsCompleted.map((subject) => (
                            <div key={subject} style={{ display: "flex", alignItems: "center", gap: 10, color: "#D1D5DB", fontSize: 14 }}>
                                <FaCheckCircle style={{ color: "#2563EB", flexShrink: 0, fontSize: 13 }} />
                                <span style={{ fontWeight: 400 }}>{subject}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Focus Clusters */}
            <h4 style={{ marginBottom: 12, color: "#9CA3AF", fontSize: 13, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                Current Specializations
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                {data.focus.map((item) => (
                    <FocusChip key={item} text={item} />
                ))}
            </div>

            {/* Updated Structural Stats (No CGPA Block) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <StatCard title="Timeline Step" value={data.semester} />
                <StatCard title="Expected Deployment" value={data.graduation} />
            </div>
        </motion.div>
    );
}

function InfoRow({ icon, text, isLink }) {
    return (
        <div 
            style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                color: "#C8CDD5", 
                fontSize: 14.5,
                transition: "color 0.2s ease"
            }}
            className={isLink ? "college-link-row" : ""}
        >
            {/* Embedded styles cleanly handling the micro-hover underline effect for the link option */}
            {isLink && (
                <style>{`
                    .college-link-row:hover {
                        color: #FFF !important;
                        text-decoration: underline;
                        text-decoration-color: #2563EB;
                        text-underline-offset: 4px;
                    }
                `}</style>
            )}
            <div style={{ color: "#FF2B46", fontSize: 16, display: "flex", alignItems: "center" }}>{icon}</div>
            <span>{text}</span>
        </div>
    );
}

function FocusChip({ text }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.15 }}
            style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "#E5E7EB",
                fontWeight: 500,
                fontSize: 13,
            }}
        >
            {text}
        </motion.div>
    );
}


function StatCard({ title, value }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ duration: 0.2 }}
            style={{
                padding: "16px 12px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                textAlign: "center",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.2)"
            }}
        >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
                {value}
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#9CA3AF", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>
                {title}
            </div>
        </motion.div>
    );
}

function FutureNode() {
    return (
        <div
            className="card-container"
            style={{
                position: "relative",
                marginLeft: 70,
                padding: 28,
                borderRadius: 18,
                border: "1px dashed rgba(255, 43, 70, 0.25)",
                background: "rgba(255, 43, 70, 0.01)",
                overflow: "hidden",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.15)"
            }}
        >
            {/* Future Projection Signal Dot */}
            <div
                className="node-dot"
                style={{
                    position: "absolute",
                    left: -57,
                    top: 36,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563EB, #FF2B46)",
                    border: "4px solid #0B0F19",
                    boxShadow: "0 0 16px rgba(37,99,235,0.4)",
                    zIndex: 2
                }}
            />

            <h2 className="spider-font" style={{ margin: 0, color: "#FFFFFF", fontSize: 22, letterSpacing: "1px" }}>
                Future Directives
            </h2>
            <p style={{ marginTop: 10, color: "#B8BDC7", lineHeight: 1.7, fontSize: 14.5, margin: "10px 0 0 0" }}>
                Continue building highly impactful AI & Machine Learning ecosystems, contributing heavily to next-gen open source frameworks, scaling competitive problem-solving capabilities, and executing high-level software architectures within premier global technology divisions.
            </p>
        </div>
    );
}