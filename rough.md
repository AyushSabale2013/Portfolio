we gonna add antigravity to our header
TExt flipping board (Aceternity)
https://ui.aceternity.com/components/terminal - terminal

https://ui.aceternity.com/components/floating-dock










import { motion } from "framer-motion";

export default function DesktopIcon({
    icon,
    label,
    top,
    left,
    onDoubleClick,
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onDoubleClick={onDoubleClick}
            style={{
                position: "absolute",
                top,
                left,

                width: 82,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                cursor: "default",
                userSelect: "none",
            }}
        >
            <motion.div
                whileHover={{
                    background: "rgba(255,255,255,.08)",
                }}
                style={{
                    width: 70,
                    height: 70,

                    borderRadius: 16,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    transition: ".2s",
                }}
            >
                <img
                    src={icon}
                    alt={label}
                    draggable={false}
                    style={{
                        width: 58,
                        height: 58,
                        objectFit: "contain",
                        pointerEvents: "none",
                    }}
                />
            </motion.div>

            <span
                style={{
                    marginTop: 6,

                    color: "white",

                    fontSize: 13,

                    textAlign: "center",

                    textShadow: "0 2px 8px rgba(0,0,0,.8)",

                    fontWeight: 500,
                }}
            >
                {label}
            </span>
        </motion.div>
    );
}






































<!-- Desktop.jsx -->
import desktopWallpaper from "../assets/desktop.jpg";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import DesktopIcon from "./DesktopIcon";
import WindowManager from "./WindowManager";
import WelcomePopup from "./WelcomePopup";

import { apps } from "../apps/apps";

export default function Desktop() {
    const [openApps, setOpenApps] = useState([]);
    const [highestZ, setHighestZ] = useState(1000);
    const [windowZ, setWindowZ] = useState({});
    const [maximizedWindow, setMaximizedWindow] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const openApp = (id) => {
        setOpenApps((prev) => {
            if (prev.includes(id)) {
                focusWindow(id);
                return prev;
            }

            setHighestZ((current) => {
                const next = current + 1;

                setWindowZ((prevZ) => ({
                    ...prevZ,
                    [id]: next,
                }));

                return next;
            });

            return [...prev, id];
        });
    };

    const closeApp = (id) => {
        setOpenApps((prev) =>
            prev.filter((app) => app !== id)
        );
    };

    const focusWindow = (id) => {
        setHighestZ((current) => {
            const next = current + 1;

            setWindowZ((prev) => ({
                ...prev,
                [id]: next,
            }));

            return next;
        });
    };

    const START_TOP = 8;
    const START_LEFT = 2;

    const ROW_GAP = 14;
    const COLUMN_GAP = 8;

    const ICONS_PER_COLUMN = 6;

    return (<div
        style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            position: "relative",
        }}
    >
        {/* Wallpaper */}

        <motion.div
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${desktopWallpaper})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />

        {/* Dark Overlay */}

        <div
            style={{
                position: "absolute",
                inset: 0,
                background:
                    "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.45))",
            }}
        />

        {/* Red Ambient Light */}

        <motion.div
            animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.15, 1],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
            }}
            style={{
                position: "absolute",
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: "#ff2b46",
                filter: "blur(180px)",
                top: -180,
                left: -180,
            }}
        />

        {/* Blue Ambient Light */}

        <motion.div
            animate={{
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.15, 1],
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
            }}
            style={{
                position: "absolute",
                width: 550,
                height: 550,
                borderRadius: "50%",
                background: "#2563eb",
                filter: "blur(180px)",
                right: -180,
                bottom: -180,
            }}
        />

        {/* ================= DESKTOP ICONS ================= */}

        {maximizedWindow === null &&
            Object.entries(apps).map(([id, app], index) => {
                if (!app.desktop) return null;

                const row = index % ICONS_PER_COLUMN;
                const column = Math.floor(
                    index / ICONS_PER_COLUMN
                );

                return (
                    <DesktopIcon
                        key={id}
                        icon={app.icon}
                        label={app.title}
                        top={`${START_TOP + row * ROW_GAP}%`}
                        left={`${START_LEFT + column * COLUMN_GAP}%`}
                        onDoubleClick={() =>
                            openApp(id)
                        }
                    />
                );
            })}

        {/* ================= WELCOME POPUP ================= */}

        <WelcomePopup />
        {/* ================= MENU BAR ================= */}

        <MenuBar onOpen={openApp} />

        {/* ================= WINDOW MANAGER ================= */}

        <WindowManager
            openApps={openApps}
            closeApp={closeApp}
            windowZ={windowZ}
            focusWindow={focusWindow}
            maximizedWindow={maximizedWindow}
            setMaximizedWindow={setMaximizedWindow}
        />

        {/* ================= DOCK ================= */}

        {maximizedWindow === null && (
            <Dock onOpen={openApp} />
        )}
    </div>
    );
}