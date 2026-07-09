import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    HiOutlineBars3,
    HiOutlineInformationCircle,
} from "react-icons/hi2";

export default function Window({
    id,
    title,
    children,
    infoContent,

    width = 900,
    height = 550,

    left = "20%",
    top = "12%",

    zIndex = 1000,

    isMaximized = false,
    onToggleMaximize,

    onFocus,

    isOpen = false,

    onClose,
}) {
    const [showInfo, setShowInfo] = useState(false);

    if (!isOpen) return null;

    return (
        <motion.div
            onPointerDown={() => onFocus?.()}
            initial={{
                opacity: 0,
                scale: 0.96,
                y: 24,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.97,
                y: 18,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
            }}
            style={{
                position: "absolute",

                left: isMaximized ? 0 : left,
                top: isMaximized ? 32 : top,

                width: isMaximized
                    ? "100%"
                    : `${width}px`,

                height: isMaximized
                    ? "calc(100vh - 32px)"
                    : `${height}px`,

                borderRadius: isMaximized ? 0 : 14,

                overflow: "hidden",

                display: "flex",
                flexDirection: "column",

                background: "#1E1E20",

                border: "1px solid #343437",

                boxShadow:
                    "0 22px 65px rgba(0,0,0,.55)",

                zIndex,
            }}
        >

            {/* ===================================================
                            TITLE BAR
            =================================================== */}

            <div
                style={{
                    height: 50,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    padding: "0 16px",

                    background: "#2C2C2E",

                    borderBottom:
                        "1px solid #3C3C3E",

                    userSelect: "none",

                    flexShrink: 0,

                    position: "relative",
                }}
            >

                {/* ================= LEFT ================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >

                    <button
                        title="Close"
                        onClick={() => {
                            onFocus?.();
                            onClose?.();
                        }}
                        style={circle("#FF5F57")}
                    />

                    <button
                        title={
                            isMaximized
                                ? "Restore"
                                : "Maximize"
                        }
                        onClick={() => {
                            onFocus?.();
                            onToggleMaximize?.();
                        }}
                        style={circle("#28C840")}
                    />

                    <button
                        title="Minimize"
                        style={circle("#FEBC2E")}
                    />

                </div>

                {/* ================= TITLE ================= */}

                <span
                    style={{
                        position: "absolute",

                        left: "50%",
                        transform:
                            "translateX(-50%)",

                        color: "#F2F2F7",

                        fontSize: 13,

                        fontWeight: 600,

                        letterSpacing: ".2px",

                        fontFamily:
                            "-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",
                    }}
                >
                    {title}
                </span>

                {/* ================= RIGHT ================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >

                    <button
                        title="Information"
                        onClick={() =>
                            setShowInfo(!showInfo)
                        }
                        style={iconButton()}
                    >
                        <HiOutlineInformationCircle
                            size={18}
                        />
                    </button>

                    <button
                        title="Menu"
                        style={iconButton()}
                    >
                        <HiOutlineBars3
                            size={18}
                        />
                    </button>

                </div>

            </div>
            {/* ===================================================
                CONTENT
=================================================== */}

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",
                    position: "relative",
                    background: "#1E1E20",
                }}
            >
                {/* MAIN CONTENT */}

                <motion.div
                    layout
                    style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        overflow:
                            title === "Projects"
                                ? "hidden"
                                : "auto",
                        padding:
                            title === "Projects"
                                ? 0
                                : 24,
                        color: "#F2F2F7",
                        background: "#1E1E20",
                        transition: ".25s ease",
                    }}
                >
                    {children}
                </motion.div>

                {/* INFO DRAWER */}

                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ x: 320 }}
                            animate={{ x: 0 }}
                            exit={{ x: 320 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 28,
                            }}
                            style={{
                                width: 310,
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                background: "#2C2C2E",
                                borderLeft: "1px solid #3C3C3E",
                                overflow: "hidden",
                            }}
                        >
                            {/* Drawer Header */}

                            <div
                                style={{
                                    height: 50,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 20px",
                                    borderBottom: "1px solid #3C3C3E",
                                    color: "#F2F2F7",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    letterSpacing: ".5px",
                                    textTransform: "uppercase",
                                }}
                            >
                                Information
                            </div>

                            {/* Drawer Body */}

                            <div
                                style={{
                                    flex: 1,
                                    padding: 20,
                                    overflowY: "auto",
                                }}
                            >
                                <div
                                    style={{
                                        color: "#9A9AA0",
                                        fontSize: 12,
                                        marginBottom: 12,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Description
                                </div>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#E5E5EA",
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {infoContent || "No information available."}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function circle(color) {
    return {
        width: 12,
        height: 12,

        border: "none",
        borderRadius: "50%",

        background: color,

        padding: 0,
        margin: 0,

        cursor: "pointer",

        outline: "none",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        transition:
            "transform .18s ease, filter .18s ease, box-shadow .18s ease",

        boxShadow: "none",

        appearance: "none",

        WebkitAppearance: "none",
    };
}

function iconButton() {
    return {
        width: 30,
        height: 30,

        border: "none",
        outline: "none",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 7,

        background: "transparent",

        color: "#A1A1AA",

        cursor: "pointer",

        transition: "all .18s ease",

        fontSize: 16,

        appearance: "none",

        WebkitAppearance: "none",
    };
}