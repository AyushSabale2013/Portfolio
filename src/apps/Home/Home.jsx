import { motion } from "framer-motion";
import {
    FaArrowLeft,
    FaArrowRight,
    FaArrowUp,
    FaHome,
    FaSearch,
} from "react-icons/fa";
import { apps } from "../../apps/apps"; // Adjust this relative path to match your folder tree location

// Scalable Vector Graphics Component for Windows-inspired Yellow Folders
const YellowFolderIcon = () => (
    <svg width="56" height="56" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
        <defs>
            <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFCF4D"/>
                <stop offset="100%" stopColor="#FDB813"/>
            </linearGradient>
            <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE08A"/>
                <stop offset="100%" stopColor="#FFC530"/>
            </linearGradient>
        </defs>
        <path d="M4 14c0-2.2 1.8-4 4-4h14l4 5h26c2.2 0 4 1.8 4 4v3H4v-8z" fill="url(#folderBack)" />
        <rect x="4" y="18" width="56" height="34" rx="5" fill="url(#folderBack)"/>
        <path d="M4 24c0-2.2 1.8-4 4-4h44c2.2 0 4 1.8 4 4v22c0 3.3-2.7 6-6 6H10c-3.3 0-6-2.7-6-6V24z" fill="url(#folderFront)" />
    </svg>
);

export default function Home({ openApp }) {
    
    // Intercept launcher mechanism loops
    const handleFolderClick = (appKey) => {
        // If your main application shell uses a state-setter prop to open windows:
        if (typeof openApp === "function") {
            openApp(appKey);
        } else {
            console.log(`System Intercept: Requesting launch container for key [${appKey}]`);
            // alert(`To execute apps directly, connect your parent launch window handler hook to Home.jsx!`);
        }
    };

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#1f1f1f",
                color: "#fff",
                borderRadius: 16,
                overflow: "hidden",
            }}
        >
            {/* ================= Toolbar ================= */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    height: 58,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                    background: "#2b2b2b",
                    borderBottom: "1px solid rgba(255,255,255,.08)",
                }}
            >
                {/* Navigation */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FaArrowLeft style={{ cursor: "pointer", color: "#bdbdbd" }} />
                    <FaArrowRight style={{ cursor: "pointer", color: "#bdbdbd" }} />
                    <FaArrowUp style={{ cursor: "pointer", color: "#bdbdbd" }} />
                </div>

                {/* Breadcrumb */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#3a3a3a",
                        padding: "8px 18px",
                        borderRadius: 10,
                    }}
                >
                    <FaHome />
                    <span>Home / Ayush</span>
                </div>

                {/* Search */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#3a3a3a",
                        padding: "8px 14px",
                        borderRadius: 10,
                        color: "#bdbdbd",
                    }}
                >
                    <FaSearch />
                    <span>Search</span>
                </div>
            </motion.div>

            {/* ================= Main ================= */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: 220,
                        background: "#262626",
                        borderRight: "1px solid rgba(255,255,255,.08)",
                        padding: 18,
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            marginBottom: 20,
                            fontWeight: 600,
                            color: "#bdbdbd",
                        }}
                    >
                        Favorites
                    </h3>

                    {Object.keys(apps).map((key) => (
                        <div
                            key={key}
                            onClick={() => handleFolderClick(key)}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 10,
                                marginBottom: 6,
                                cursor: "pointer",
                                transition: ".25s",
                                fontSize: "14px"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            📁 {apps[key].title}
                        </div>
                    ))}
                </div>

                {/* File Area Viewport */}
                <div
                    style={{
                        flex: 1,
                        padding: 28,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    {/* ================= Folder Grid Matrix ================= */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: 30,
                            alignContent: "start",
                        }}
                    >
                        {Object.keys(apps).map((key) => {
                            const appItem = apps[key];
                            return (
                                <motion.div
                                    key={key}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleFolderClick(key)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: 14,
                                        borderRadius: 12,
                                        cursor: "pointer",
                                        userSelect: "none",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                    {/* Swapped regular emojis for your clean yellow vector asset layout */}
                                    <YellowFolderIcon />

                                    {/* Folder Name Identifier */}
                                    <span
                                        style={{
                                            textAlign: "center",
                                            fontSize: 14,
                                            color: "#ECECEC",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {appItem.title}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* ================= Status Bar ================= */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        style={{
                            marginTop: 40,
                            padding: "14px 20px",
                            borderRadius: 12,
                            background: "#2b2b2b",
                            border: "1px solid rgba(255,255,255,.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#BDBDBD",
                            fontSize: 13,
                        }}
                    >
                        <span>{Object.keys(apps).length} Items</span>
                        <span>Home Directory</span>
                        <span>Spider OS v1.0</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}