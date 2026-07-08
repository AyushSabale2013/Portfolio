import desktopWallpaper from "../assets/desktop.jpg";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import DesktopIcon from "./DesktopIcon";
import WindowManager from "./WindowManager";
import WelcomePopup from "./WelcomePopup";

import { apps } from "../apps/apps";
import ProjectsPage from "../pages/ProjectsPage";

export default function Desktop() {
    /* ==========================================
                WINDOW MANAGER
    ========================================== */

    const [openApps, setOpenApps] = useState([]);
    const [highestZ, setHighestZ] = useState(1000);
    const [windowZ, setWindowZ] = useState({});
    const [maximizedWindow, setMaximizedWindow] = useState(null);
    const [showProjectsPage, setShowProjectsPage] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    /* ==========================================
                DESKTOP GRID
    ========================================== */

    const START_X = 28;
    const START_Y = 42;

    const CELL_WIDTH = 95;
    const CELL_HEIGHT = 105;

    const ICONS_PER_COLUMN = 6;

    const STORAGE_KEY = "spider-os-icons";

    /* ==========================================
                DEFAULT POSITIONS
    ========================================== */

    const createDefaultPositions = () => {
        const positions = {};

        let row = 0;
        let col = 0;

        Object.entries(apps).forEach(([id, app]) => {
            if (!app.desktop) return;

            positions[id] = {
                row,
                col,
            };

            row++;

            if (row >= ICONS_PER_COLUMN) {
                row = 0;
                col++;
            }
        });

        return positions;
    };

    /* ==========================================
                ICON POSITIONS
    ========================================== */

    const [iconPositions, setIconPositions] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                return JSON.parse(saved);
            }
        } catch (err) {
            console.error(err);
        }

        return createDefaultPositions();
    });

    /* ==========================================
                SAVE POSITIONS
    ========================================== */

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(iconPositions)
        );
    }, [iconPositions]);

    /* ==========================================
                SNAP TO GRID
    ========================================== */

    const snapToGrid = (x, y) => {
        let col = Math.round(
            (x - START_X) / CELL_WIDTH
        );

        let row = Math.round(
            (y - START_Y) / CELL_HEIGHT
        );

        if (row < 0) row = 0;
        if (col < 0) col = 0;

        if (row >= ICONS_PER_COLUMN) {
            row = ICONS_PER_COLUMN - 1;
        }

        return {
            row,
            col,
        };
    };

    /* ==========================================
                MOVE ICON
    ========================================== */

    const moveIcon = (id, row, col) => {
        setIconPositions((prev) => {
            const updated = {
                ...prev,
            };

            const occupied = Object.keys(updated).find(
                (key) =>
                    key !== id &&
                    updated[key].row === row &&
                    updated[key].col === col
            );

            if (occupied) {
                updated[occupied] = {
                    ...updated[id],
                };
            }

            updated[id] = {
                row,
                col,
            };

            return updated;
        });
    };

    /* ==========================================
                DRAG END
    ========================================== */

    const handleIconDrop = (
        id,
        x,
        y
    ) => {
        const { row, col } = snapToGrid(x, y);

        moveIcon(id, row, col);
    };    /* ==========================================
                WINDOW FUNCTIONS
    ========================================== */
    const openApp = (id) => {

        // Open Projects as a full-screen page
        if (id === "projects") {
            setShowProjectsPage(true);
            return;
        }

        setOpenApps((prev) => {

            // If already open, bring it to front
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

    return (
        <div
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
                Object.entries(apps).map(([id, app]) => {
                    if (!app.desktop) return null;

                    const position =
                        iconPositions[id] ??
                        createDefaultPositions()[id];

                    return (
                        <DesktopIcon
                            key={id}
                            id={id}
                            icon={app.icon}
                            label={app.title}
                            row={position.row}
                            col={position.col}
                            startX={START_X}
                            startY={START_Y}
                            cellWidth={CELL_WIDTH}
                            cellHeight={CELL_HEIGHT}
                            onDrop={handleIconDrop}
                            onDoubleClick={() =>
                                openApp(id)
                            }
                        />
                    );
                })}

            {/* ================= WELCOME ================= */}

            {showWelcome && <WelcomePopup />}

            {/* ================= MENU BAR ================= */}

            <MenuBar onOpen={openApp} />

            {/* ================= WINDOWS ================= */}

            <WindowManager
                openApps={openApps}
                closeApp={closeApp}
                windowZ={windowZ}
                focusWindow={focusWindow}
                maximizedWindow={maximizedWindow}
                setMaximizedWindow={
                    setMaximizedWindow
                }
            />

            {/* ================= DOCK ================= */}

            {maximizedWindow === null && (
                <Dock onOpen={openApp} />
            )}
            {showProjectsPage && (
                <ProjectsPage
                    onClose={() => setShowProjectsPage(false)}
                />
            )}
        </div>
    );
}