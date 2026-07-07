import { motion } from "framer-motion";
import profile from "../../assets/spiderLogo.png";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaLinkedin,
    FaGithub,
    FaInstagram,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function Contact() {
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
            {/* Minimal Background Webs */}
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

            {/* Flat Comic-Book Edge Pop Styles */}
            <style>{`
                .spider-font {
                    font-family: 'Bangers', cursive, system-ui !important;
                }
                .spider-contact-card {
                    box-shadow: 3px 3px 0px #111 !important;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
                }
                .spider-contact-card:hover {
                    border-color: #FF1493 !important; 
                    box-shadow: 5px 5px 0px #111 !important;
                }
                @media (max-width: 600px) {
                    .spider-hero-panel { flexDirection: column !important; textAlign: center !important; padding: 24px !important; }
                    .spider-hero-badge { display: inline-flex !important; }
                }
            `}</style>

            {/* Hero Main Panel */}
            <motion.div
                className="spider-contact-card spider-hero-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    background: "rgba(11, 15, 25, 0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 69, 0, 0.2)", 
                    borderRadius: 24,
                    padding: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        right: -60,
                        top: -60,
                        background: "radial-gradient(circle, rgba(255,20,147,0.1) 0%, transparent 70%)",
                        filter: "blur(40px)",
                        pointerEvents: "none"
                    }}
                />

                <motion.img
                    whileHover={{ rotate: -4, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    src={profile}
                    alt="Profile Logo"
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        border: "2px solid #FFD700", 
                        padding: 6,
                        background: "rgba(255,255,255,.02)",
                        objectFit: "contain",
                    }}
                />

                <div style={{ flex: 1, zIndex: 1 }}>
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
                        Let's Connect
                    </h1>

                    <p
                        style={{
                            marginTop: 12,
                            lineHeight: 1.7,
                            color: "#9CA3AF",
                            fontSize: 15,
                            marginInline: 0
                        }}
                    >
                        I'm always interested in discussing new ideas, software engineering, 
                        AI & Machine Learning, open-source projects, hackathons, and internship opportunities.
                    </p>

                    <div
                        className="spider-hero-badge"
                        style={{
                            marginTop: 18,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 16px",
                            borderRadius: 10,
                            background: "rgba(255, 69, 0, 0.06)",
                            border: "1px solid rgba(255, 69, 0, 0.25)", 
                        }}
                    >
                        <FaEnvelope color="#FF4500" size={14} />
                        <span style={{ color: "#E5E7EB", fontWeight: 500, fontSize: 13.5 }}>
                            Open for Internships & Collaborations
                        </span>
                    </div>
                </div>
            </motion.div>{/* Grid Array of Contact Channels */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                style={{
                    marginTop: 32,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 20,
                    position: "relative",
                    zIndex: 1
                }}
            >
                {[
                    {
                        icon: <FaEnvelope size={20} />,
                        title: "Email",
                        value: "ayushsabale2282@gmail.com",
                        action: "mailto:ayushsabale2282@gmail.com",
                        themeColor: "#FF1493" 
                    },
                    {
                        icon: <FaPhoneAlt size={18} />,
                        title: "Phone",
                        value: "+91 77568 50969",
                        action: "tel:+917756850969",
                        themeColor: "#FF4500" 
                    },
                    {
                        icon: <FaLinkedin size={20} />,
                        title: "LinkedIn",
                        value: "Connect Professionally",
                        action: "https://www.linkedin.com/in/ayush-sabale-763908369/",
                        themeColor: "#FFD700" 
                    },
                    {
                        icon: <FaGithub size={20} />,
                        title: "GitHub",
                        value: "View My Repositories",
                        action: "https://github.com/AyushSabale2013",
                        themeColor: "#FF1493"
                    },
                    {
                        icon: <SiLeetcode size={20} />,
                        title: "LeetCode",
                        value: "Competitive Profile",
                        action: "https://leetcode.com/u/AYUSH_SABALE_2282/",
                        themeColor: "#FF4500"
                    },
                    {
                        icon: <FaInstagram size={20} />,
                        title: "Instagram",
                        value: "@ayush_sabale_2282",
                        action: "https://www.instagram.com/ayush_sabale_2282/",
                        themeColor: "#FFD700"
                    },
                    {
                        icon: <FaMapMarkerAlt size={20} />,
                        title: "Location",
                        value: "Kolhapur, MH, India",
                        action: "https://maps.google.com/?q=Kolhapur,Maharashtra",
                        themeColor: "#FF1493"
                    },
                ].map((item) => (
                    <motion.a
                        key={item.title}
                        href={item.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.99 }}
                        className="spider-contact-card"
                        style={{
                            textDecoration: "none",
                            padding: 24,
                            borderRadius: 16,
                            background: "rgba(11, 15, 25, 0.75)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.04)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.02)",
                                border: `1px solid ${item.themeColor}35`,
                                color: item.themeColor
                            }}
                        >
                            {item.icon}
                        </div>

                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    color: "#E5E7EB",
                                    fontSize: 17,
                                    fontWeight: 600,
                                    letterSpacing: "0.3px"
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    margin: "4px 0 0",
                                    color: "#9CA3AF",
                                    fontSize: 13.5,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {item.value}
                            </p>
                        </div>
                    </motion.a>
                ))}
            </motion.div>{/* Quick Action Footer Panels */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 16,
                    position: "relative",
                    zIndex: 1
                }}
            >
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigator.clipboard.writeText("ayushsabale2282@gmail.com")}
                    className="spider-contact-card"
                    style={{
                        padding: "12px 24px",
                        border: "1px solid #FF1493",
                        borderRadius: 12,
                        background: "#FF1493", 
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                    }}
                >
                    Copy Email Address
                </motion.button>

                <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    href="/resume.pdf"
                    download
                    className="spider-contact-card"
                    style={{
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#FFD700", 
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                    }}
                >
                    Download Resume
                </motion.a>
            </motion.div>

            {/* Network Deployment Status Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="spider-contact-card"
                style={{
                    marginTop: 40,
                    textAlign: "center",
                    padding: "20px 24px",
                    borderRadius: 16,
                    background: "rgba(11, 15, 25, 0.5)",
                    border: "1px solid rgba(255, 69, 0, 0.15)", 
                    position: "relative",
                    zIndex: 1
                }}
            >
                <div
                    style={{
                        fontSize: 14,
                        color: "#FFD700",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                    }}
                >
                    <span style={{ width: 7, height: 7, background: "#FFD700", borderRadius: "50%", display: "inline-block" }} />
                    Active Availability Node
                </div>
                <p
                    style={{
                        marginTop: 8,
                        color: "#9CA3AF",
                        fontSize: 14,
                        lineHeight: 1.6,
                        maxWidth: 650,
                        marginInline: "auto",
                        marginBottom: 0
                    }}
                >
                    Currently looking for internship opportunities, software engineering roles, 
                    AI & Machine Learning collaborations, and open-source contributions.
                </p>
            </motion.div>
        </div>
    );
}