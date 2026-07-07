import { motion } from "framer-motion";
import { profile } from "../../../data/profile";
import {
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineMapPin,
    HiOutlineClipboardDocument,
    HiOutlineAcademicCap,
} from "react-icons/hi2";

import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { HiArrowDownTray } from "react-icons/hi2";

export default function Contact() {
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

                        color: "#FBBF24",

                        fontSize: 30,

                        letterSpacing: "2px",

                        textTransform: "uppercase",
                    }}
                >
                    Let's Connect
                </h2>

                <div
                    style={{
                        flex: 1,

                        height: 2,

                        background:
                            "linear-gradient(90deg,#FBBF24,#F59E0B,transparent)",
                    }}
                />
            </div>

            {/* ================= HERO CARD ================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
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

                    overflow: "hidden",

                    padding: 34,

                    borderRadius: 24,

                    background:
                        "rgba(18,20,26,.72)",

                    backdropFilter: "blur(24px)",

                    border:
                        "1px solid rgba(251,191,36,.18)",

                    boxShadow:
                        "0 18px 60px rgba(0,0,0,.35)",
                }}
            >
                {/* Golden Glow */}

                <div
                    style={{
                        position: "absolute",

                        width: 260,
                        height: 260,

                        right: -100,
                        top: -100,

                        borderRadius: "50%",

                        background:
                            "radial-gradient(circle,#FBBF24 0%,#F59E0B 55%,transparent 75%)",

                        opacity: .12,

                        filter: "blur(55px)",
                    }}
                />

                <h3
                    style={{
                        marginTop: 0,

                        marginBottom: 18,

                        color: "#FFFFFF",

                        fontSize: 28,
                    }}
                >
                    Let's Build Something Amazing Together.
                </h3>

                <p
                    style={{
                        margin: 0,

                        color: "#D5D9E0",

                        fontSize: 16,

                        lineHeight: 1.9,

                        maxWidth: 760,
                    }}
                >
                    I'm always open to discussing innovative ideas,
                    AI & Machine Learning, Full Stack Development,
                    internships, open-source contributions, and
                    exciting collaborations. If you have an idea or
                    opportunity, I'd be happy to connect and build
                    something meaningful together.
                </p>
            </motion.div>

            {/* ================= CONTENT GRID ================= */}

            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(340px,1fr))",

                    gap: 28,
                }}
            >
                {/* Contact Cards */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",

                        gap: 18,
                    }}
                >
                    {profile.contacts.map((item) => (
                        <ContactCard
                            key={item.title}
                            item={item}
                        />
                    ))}
                </div>

                {/* Right Side */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",

                        gap: 20,
                    }}
                >
                    <AvailabilityCard />

                    <SocialLinks />
                </div>
            </div>
        </section>
    );
} function ContactCard({ item }) {
    const iconMap = {
        email: <HiOutlineEnvelope />,
        phone: <HiOutlinePhone />,
        location: <HiOutlineMapPin />,
        college: <HiOutlineAcademicCap />,
    };

    return (
        <motion.div
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            transition={{
                duration: .25,
            }}
            style={{
                position: "relative",

                overflow: "hidden",

                padding: 22,

                borderRadius: 20,

                background:
                    "rgba(20,22,30,.72)",

                backdropFilter: "blur(24px)",

                border:
                    "1px solid rgba(251,191,36,.15)",

                boxShadow:
                    "0 14px 40px rgba(0,0,0,.30)",
            }}
        >
            {/* Golden Glow */}

            <div
                style={{
                    position: "absolute",

                    right: -60,
                    top: -60,

                    width: 160,
                    height: 160,

                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle,#FBBF24,transparent 70%)",

                    opacity: .08,

                    filter: "blur(35px)",
                }}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,

                            borderRadius: 16,

                            background:
                                "rgba(251,191,36,.12)",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            color: "#FBBF24",

                            fontSize: 24,
                        }}
                    >
                        {iconMap[item.type]}
                    </div>

                    <div>
                        <h3
                            style={{
                                margin: 0,

                                color: "#FFFFFF",

                                fontSize: 17,
                            }}
                        >
                            {item.title}
                        </h3>

                        <p
                            style={{
                                marginTop: 8,
                                marginBottom: 0,

                                color: "#C8CDD5",

                                fontSize: 14,
                            }}
                        >
                            {item.value}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() =>
                        navigator.clipboard.writeText(
                            item.value
                        )
                    }
                    style={{
                        width: 42,
                        height: 42,

                        border: "none",

                        borderRadius: 12,

                        background:
                            "rgba(251,191,36,.10)",

                        color: "#FBBF24",

                        cursor: "pointer",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <HiOutlineClipboardDocument size={18} />
                </button>
            </div>
        </motion.div>
    );
} function AvailabilityCard() {
    const items = [
        "Internships",
        "AI / ML Projects",
        "Full Stack Development",
        "Open Source",
        "Research Collaboration",
    ];

    return (
        <div
            style={{
                padding: 26,

                borderRadius: 22,

                background:
                    "rgba(20,22,30,.72)",

                backdropFilter: "blur(24px)",

                border:
                    "1px solid rgba(251,191,36,.15)",
            }}
        >
            <h3
                style={{
                    marginTop: 0,

                    color: "#FBBF24",

                    letterSpacing: "1px",
                }}
            >
                Availability
            </h3>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",

                    gap: 10,

                    marginBottom: 20,
                }}
            >
                <div
                    style={{
                        width: 10,
                        height: 10,

                        borderRadius: "50%",

                        background: "#22C55E",

                        boxShadow:
                            "0 0 10px #22C55E",
                    }}
                />

                <span
                    style={{
                        color: "#FFFFFF",
                    }}
                >
                    Available
                </span>
            </div>

            {items.map((item) => (
                <div
                    key={item}
                    style={{
                        color: "#D5D9E0",

                        marginBottom: 12,

                        display: "flex",

                        gap: 10,
                    }}
                >
                    <span
                        style={{
                            color: "#FBBF24",
                        }}
                    >
                        ✓
                    </span>

                    {item}
                </div>
            ))}
        </div>
    );
} function SocialLinks() {
    const icons = {
        GitHub: <FaGithub />,
        LinkedIn: <FaLinkedin />,
        Instagram: <FaInstagram />,
        LeetCode: <SiLeetcode />,
        Resume: <HiArrowDownTray />,
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",

                gap: 20,

                padding: 26,

                borderRadius: 22,

                background:
                    "rgba(20,22,30,.72)",

                backdropFilter: "blur(24px)",

                border:
                    "1px solid rgba(251,191,36,.15)",
            }}
        >
            <h3
                style={{
                    margin: 0,

                    color: "#FBBF24",

                    letterSpacing: "1px",
                }}
            >
                Social Network
            </h3>

            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(2,1fr)",

                    gap: 16,
                }}
            >
                {profile.socials.map((social) => (
                    <motion.a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"

                        whileHover={{
                            y: -5,
                            scale: 1.04,
                        }}

                        whileTap={{
                            scale: .96,
                        }}

                        style={{
                            textDecoration: "none",

                            display: "flex",

                            flexDirection: "column",

                            alignItems: "center",

                            justifyContent: "center",

                            gap: 12,

                            padding: 22,

                            borderRadius: 18,

                            background:
                                "rgba(255,255,255,.04)",

                            border:
                                "1px solid rgba(251,191,36,.10)",

                            color: "#FFFFFF",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 28,

                                color: "#FBBF24",
                            }}
                        >
                            {icons[social.name]}
                        </div>

                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            {social.name}
                        </span>
                    </motion.a>
                ))}
            </div>

            {/* Resume */}

            <motion.a
                href="/resume.pdf"

                target="_blank"

                whileHover={{
                    scale: 1.03,
                }}

                whileTap={{
                    scale: .98,
                }}

                style={{
                    marginTop: 8,

                    textDecoration: "none",

                    padding: "18px 24px",

                    borderRadius: 18,

                    background:
                        "linear-gradient(135deg,#FBBF24,#F59E0B)",

                    color: "#121212",

                    fontWeight: 700,

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    gap: 12,

                    boxShadow:
                        "0 12px 30px rgba(251,191,36,.35)",
                }}
            >
                <HiArrowDownTray size={22} />

                Download Resume
            </motion.a>
        </div>
    );
}