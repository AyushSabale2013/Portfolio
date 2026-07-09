import { motion } from "framer-motion";
import {
    FaArrowLeft,
    FaArrowRight,
    FaArrowUp,
    FaHome,
    FaSearch,
} from "react-icons/fa";

import { apps } from "../../apps/apps";

/* ======================================================
        WINDOWS STYLE FOLDER ICON
====================================================== */

const FolderIcon = () => (
    <svg
        width="58"
        height="58"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: "none" }}
    >
        <defs>
            <linearGradient
                id="folderBack"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop
                    offset="0%"
                    stopColor="#FFD75E"
                />
                <stop
                    offset="100%"
                    stopColor="#F2B322"
                />
            </linearGradient>

            <linearGradient
                id="folderFront"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop
                    offset="0%"
                    stopColor="#FFE48B"
                />
                <stop
                    offset="100%"
                    stopColor="#FFC83A"
                />
            </linearGradient>
        </defs>

        <path
            d="M4 14
               C4 11.8 5.8 10 8 10
               H21
               L26 15
               H56
               C58.2 15 60 16.8 60 19
               V22
               H4
               Z"
            fill="url(#folderBack)"
        />

        <rect
            x="4"
            y="18"
            width="56"
            height="34"
            rx="5"
            fill="url(#folderBack)"
        />

        <path
            d="M4 24
               C4 21.8 5.8 20 8 20
               H56
               C58.2 20 60 21.8 60 24
               V46
               C60 49.5 57.5 52 54 52
               H10
               C6.5 52 4 49.5 4 46
               Z"
            fill="url(#folderFront)"
        />
    </svg>
);

/* ======================================================
        HOME
====================================================== */

export default function Home({ openApp }) {

    /* ----------------------------------
            REAL APPS
    ---------------------------------- */

    const realApps = Object.entries(apps).filter(

        ([key, app]) =>

            key !== "home" &&
            !app.isFake

    );

    /* ----------------------------------
            FAKE FOLDERS
    ---------------------------------- */

    const fakeFolders = Object.entries(apps).filter(

        ([, app]) =>

            app.isFake

    );

    /* ----------------------------------
            OPEN
    ---------------------------------- */

    const handleOpen = (key, fake = false) => {

        if (!openApp) return;

        if (fake) {

            openApp("folder");

            return;

        }

        openApp(key);

    }; return (

        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#282828",
                overflow: "hidden",
                userSelect: "none",
            }}
        >

            {/* ======================================================
                    TOOLBAR
            ====================================================== */}

            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .35 }}
                style={{
                    height: 58,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                    background: "#282828",
                    borderBottom: "1px solid #D6D6D6",
                    flexShrink: 0,
                }}
            >

                {/* Navigation */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >

                    <FaArrowLeft
                        style={{
                            color: "#acacac",
                            cursor: "pointer",
                        }}
                    />

                    <FaArrowRight
                        style={{
                            color: "#acacac",
                            cursor: "pointer",
                        }}
                    />

                    <FaArrowUp
                        style={{
                            color: "#acacac",
                            cursor: "pointer",
                        }}
                    />

                </div>

                {/* Breadcrumb */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 18px",
                        background: "#e4e1e1",
                        border: "1px solid #D9D9D9",
                        borderRadius: 10,
                        color: "#444",
                        fontSize: 14,
                        fontWeight: 500,
                        minWidth: 240,
                        justifyContent: "center",
                    }}
                >

                    <FaHome />

                    <span>
                        Home
                    </span>

                </div>

                {/* Search */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 14px",
                        background: "#e4e1e1",
                        border: "1px solid #D9D9D9",
                        borderRadius: 10,
                        color: "#888",
                        minWidth: 200,
                    }}
                >

                    <FaSearch />

                    <span>
                        Search Home
                    </span>

                </div>

            </motion.div>

            {/* ======================================================
                    BODY
            ====================================================== */}

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",
                }}
            >

                {/* ======================================================
                        SIDEBAR
                ====================================================== */}

                <div
                    style={{
                        width: 220,
                        background:  "#282828",
                        borderRight: "1px solid #3c3c3c",
                        padding: 18,
                        overflowY: "auto",
                        flexShrink: 0,
                    }}
                >

                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff9f9",
                            marginBottom: 18,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        Quick Access
                    </div>

                    {[

                        "Desktop",

                        "Home",

                        "Documents",

                        "Downloads",

                        "Pictures",

                        "Music",

                        "Videos",

                        "Trash",

                    ].map((item) => (

                        <div
                            key={item}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 8,
                                marginBottom: 4,
                                color: "#f5f5f5",
                                fontSize: 14,
                                cursor: "pointer",
                                transition: ".2s",
                            }}
                            onMouseEnter={(e) =>
                                e.currentTarget.style.background = "#171717"
                            }
                            onMouseLeave={(e) =>
                                e.currentTarget.style.background = "transparent"
                            }
                        >
                            📁 {item}
                        </div>

                    ))}

                </div>

                {/* ======================================================
                        MAIN CONTENT
                ====================================================== */}

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: 28,
                        overflow: "hidden",
                    }}
                >                    {/* ======================================================
                            FOLDER GRID
                    ====================================================== */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: .4 }}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill,minmax(120px,1fr))",
                            alignContent: "start",
                            gap: 28,
                            paddingRight: 6,
                        }}
                    >

                        {/* ===============================
                                REAL APPS
                        =============================== */}

                        {realApps.map(([key, app]) => (

                            <motion.div

                                key={key}

                                whileHover={{
                                    y: -5,
                                    scale: 1.05,
                                }}

                                whileTap={{
                                    scale: .95,
                                }}

                                onClick={() => handleOpen(key)}

                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,

                                    padding: "14px",

                                    borderRadius: 10,

                                    cursor: "pointer",

                                    transition: ".2s",

                                    minHeight: 120,
                                }}

                                onMouseEnter={(e) => {

                                    e.currentTarget.style.background =
                                        "#000000";

                                }}

                                onMouseLeave={(e) => {

                                    e.currentTarget.style.background =
                                        "transparent";

                                }}

                            >

                                <FolderIcon />

                                <span

                                    style={{

                                        color: "#f0f0f0",

                                        fontSize: 14,

                                        fontWeight: 500,

                                        textAlign: "center",

                                        lineHeight: 1.35,

                                        wordBreak: "break-word",

                                    }}

                                >

                                    {app.title}

                                </span>

                            </motion.div>

                        ))}

                        {/* ===============================
                                FAKE FOLDERS
                        =============================== */}

                        {fakeFolders.map(([key, app]) => (

                            <motion.div

                                key={key}

                                whileHover={{
                                    y: -5,
                                    scale: 1.05,
                                }}

                                whileTap={{
                                    scale: .95,
                                }}

                                onClick={() => handleOpen(key, true)}

                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,

                                    padding: "14px",

                                    borderRadius: 10,

                                    cursor: "pointer",

                                    transition: ".2s",

                                    minHeight: 120,
                                }}

                                onMouseEnter={(e) => {

                                    e.currentTarget.style.background =
                                        "#000000";

                                }}

                                onMouseLeave={(e) => {

                                    e.currentTarget.style.background =
                                        "transparent";

                                }}

                            >

                                <FolderIcon />

                                <span

                                    style={{

                                        color: "#e0dfdf",

                                        fontSize: 14,

                                        fontWeight: 500,

                                        textAlign: "center",

                                        lineHeight: 1.35,

                                        wordBreak: "break-word",

                                    }}

                                >

                                    {app.title}

                                </span>

                            </motion.div>

                        ))}

                    </motion.div>                    {/* ======================================================
                            STATUS BAR
                    ====================================================== */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: .25 }}
                        style={{
                            height: 52,
                            marginTop: 18,

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",

                            padding: "0 18px",

                            background: "#191707",

                            border: "1px solid #000000",

                            borderRadius: 10,

                            color: "#fdfdfd",

                            fontSize: 13,

                            flexShrink: 0,
                        }}
                    >

                        <span>

                            {realApps.length + fakeFolders.length} Items

                        </span>

                        <span>

                            Home Directory

                        </span>

                        <span>

                            Spider OS v1.0

                        </span>

                    </motion.div>

                </div>

            </div>

        </div>

    );

}