import { motion } from "framer-motion";

import {
    HiUser,
    HiCodeBracket,
    HiAcademicCap,
    HiTrophy,
    HiHeart,
    HiEnvelope,
} from "react-icons/hi2";

const menu = [
    {
        id: "about",
        label: "About",
        icon: HiUser,
    },

    {
        id: "skills",
        label: "Skills",
        icon: HiCodeBracket,
    },

    {
        id: "education",
        label: "Education",
        icon: HiAcademicCap,
    },

    {
        id: "achievements",
        label: "Achievements",
        icon: HiTrophy,
    },

    {
        id: "interests",
        label: "Interests",
        icon: HiHeart,
    },

    {
        id: "contact",
        label: "Contact",
        icon: HiEnvelope,
    },
];

export default function Sidebar({
    activeTab,
    setActiveTab,
}) {
    return (
        <div
            style={{
                width: 250,

                padding: 18,

                display: "flex",
                flexDirection: "column",

                gap: 10,

                background:
                    "rgba(255,255,255,.03)",

                borderRight:
                    "1px solid rgba(255,255,255,.08)",

                backdropFilter: "blur(25px)",
            }}
        >
            <h2
                style={{
                    color: "#fff",

                    marginBottom: 20,

                    fontSize: 18,

                    fontWeight: 700,

                    letterSpacing: ".5px",
                }}
            >
                Profile
            </h2>

            {menu.map((item) => {
                const Icon = item.icon;

                const active =
                    activeTab === item.id;

                return (
                    <motion.button
                        key={item.id}
                        whileHover={{
                            x: 6,
                        }}
                        whileTap={{
                            scale: .97,
                        }}
                        onClick={() =>
                            setActiveTab(item.id)
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",

                            gap: 14,

                            padding:
                                "14px 18px",

                            border: "none",

                            borderRadius: 14,

                            cursor: "pointer",

                            background: active
                                ? "linear-gradient(135deg,#FF2B46,#B91C1C)"
                                : "transparent",

                            color: active
                                ? "#fff"
                                : "#B8BDC7",

                            fontSize: 15,

                            fontWeight: 500,

                            transition: ".25s",
                        }}
                    >
                        <Icon size={20} />

                        {item.label}
                    </motion.button>
                );
            })}

            <div
                style={{
                    flex: 1,
                }}
            />

            <div
                style={{
                    padding: 16,

                    borderRadius: 16,

                    background:
                        "rgba(255,255,255,.04)",

                    border:
                        "1px solid rgba(255,255,255,.08)",
                }}
            >
                <p
                    style={{
                        color: "#9CA3AF",

                        margin: 0,

                        fontSize: 13,

                        lineHeight: 1.6,
                    }}
                >
                    Spider OS Portfolio
                </p>

                <p
                    style={{
                        color: "#6B7280",

                        marginTop: 8,

                        marginBottom: 0,

                        fontSize: 12,
                    }}
                >
                    Version 1.0
                </p>
            </div>
        </div>
    );
}