import { useState } from "react";
import {
    motion,
    AnimatePresence,
} from "framer-motion";

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
    const [showInfo, setShowInfo] =
        useState(false);

    if (!isOpen) return null;

    return (
        <motion.div
            onPointerDown={() => onFocus?.()}
            initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
            }}
            transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
            }}
            style={{
                position: "absolute",

                left: isMaximized
                    ? 0
                    : left,

                top: isMaximized
                    ? 34
                    : top,

                width: isMaximized
                    ? "100%"
                    : `${width}px`,

                height: isMaximized
                    ? "calc(100vh - 34px)"
                    : `${height}px`,

                borderRadius: isMaximized
                    ? 0
                    : 16,

                overflow: "hidden",

                background:
                    "rgba(18,20,25,.82)",

                backdropFilter:
                    "blur(30px)",

                WebkitBackdropFilter:
                    "blur(30px)",

                border:
                    "1px solid rgba(255,255,255,.08)",

                boxShadow:
                    "0 35px 80px rgba(0,0,0,.45)",

                display: "flex",

                flexDirection: "column",

                zIndex,
            }}
        >
            {/* ================= TITLE BAR ================= */}

            <div
                style={{
                    height: 48,

                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",

                    padding: "0 16px",

                    background:
                        "rgba(255,255,255,.03)",

                    borderBottom:
                        "1px solid rgba(255,255,255,.06)",

                    userSelect: "none",

                    position: "relative",
                }}
            >
                {/* LEFT BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                    }}
                >
                    {/* Close */}

                    <button
                        onClick={() => {
                            onFocus?.();
                            onClose?.();
                        }}
                        title="Close"
                        style={circle("#FF5F57")}
                    />

                    {/* Maximize */}

                    <button
                        onClick={() => {
                            onFocus?.();
                            onToggleMaximize?.();
                        }}
                        title={
                            isMaximized
                                ? "Restore"
                                : "Maximize"
                        }
                        style={circle("#28C840")}
                    />

                    {/* Fake Minimize */}

                    <button
                        onClick={() => {
                            onFocus?.();
                            onClose?.();
                        }}
                        title="Minimize"
                        style={circle("#FEBC2E")}
                    />
                </div>

                {/* TITLE */}

                <span
                    style={{
                        position: "absolute",

                        left: "50%",

                        transform:
                            "translateX(-50%)",

                        color: "#ECECEC",

                        fontSize: 14,

                        fontWeight: 600,

                        letterSpacing: ".4px",
                    }}
                >
                    {title}
                </span>                {/* RIGHT BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        gap: 6,
                    }}
                >
                    <button
                        onClick={() =>
                            setShowInfo((prev) => !prev)
                        }
                        title="Information"
                        style={iconButton()}
                    >
                        <HiOutlineInformationCircle size={18} />
                    </button>

                    <button
                        title="Menu"
                        style={iconButton()}
                    >
                        <HiOutlineBars3 size={18} />
                    </button>
                </div>
            </div>

            {/* ================= CONTENT ================= */}

            <div
                style={{
                    flex: 1,

                    display: "flex",

                    position: "relative",

                    overflow: "hidden",

                    background:
                        "rgba(255,255,255,.015)",
                }}
            >
                {/* MAIN CONTENT */}

                <div
                    style={{
                        flex: 1,

                        padding: 24,

                        overflow: "auto",

                        color: "#ECECEC",

                        transition: ".25s",
                    }}
                >
                    {children}
                </div>

                {/* INFORMATION DRAWER */}

                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{
                                x: "100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "100%",
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            style={{
                                width: 300,

                                flexShrink: 0,

                                background:
                                    "rgba(18,20,25,.96)",

                                borderLeft:
                                    "1px solid rgba(255,255,255,.08)",

                                padding: 20,

                                overflowY: "auto",

                                boxShadow:
                                    "-20px 0 40px rgba(0,0,0,.35)",
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,

                                    marginBottom: 16,

                                    color: "#FF5F57",

                                    fontSize: 13,

                                    letterSpacing: "1px",
                                }}
                            >
                                INFORMATION
                            </h3>

                            <p
                                style={{
                                    margin: 0,

                                    color: "#B8BDC7",

                                    fontSize: 13,

                                    lineHeight: 1.7,
                                }}
                            >
                                {infoContent}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
} function circle(color) {
    return {
        width: 13,
        height: 13,

        border: "none",

        borderRadius: "50%",

        background: color,

        cursor: "pointer",

        padding: 0,

        outline: "none",

        transition:
            "transform .18s ease, box-shadow .18s ease",

        boxShadow: `0 0 8px ${color}35`,
    };
}

function iconButton() {
    return {
        width: 34,
        height: 34,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        border: "none",

        borderRadius: 8,

        background: "transparent",

        color: "#D5D9E0",

        cursor: "pointer",

        transition:
            "all .18s ease",
    };
}