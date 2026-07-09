import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdWifi,
    MdBluetooth,
    MdVolumeUp,
    MdBatteryFull,
} from "react-icons/md";

import Calendar from "react-calendar";
import "../styles/Calendar.css";
import QuickSettings from "../styles/QuickSettings";

export default function MenuBar() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [value, setValue] = useState(new Date());
    const [showQuickSettings, setShowQuickSettings] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();

            setTime(
                now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

            setDate(
                now.toLocaleDateString([], {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                })
            );
        };

        updateClock();

        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(e.target)
            ) {
                setShowCalendar(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{
                position: "fixed",

                top: 0,
                left: 0,
                right: 0,

                height: 34,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                padding: "0 18px",

                background: "rgba(10,10,15,.30)",

                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",

                borderBottom:
                    "1px solid rgba(255,255,255,.08)",

                color: "#F8FAFC",

                zIndex: 10000,

                userSelect: "none",
            }}
        >
            {/* ================= LEFT ================= */}

            <div
                style={{
                    width: 180,
                }}
            />            {/* ================= CENTER ================= */}

            <div
                ref={calendarRef}
                style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <motion.div
                    whileHover={{
                        background: "rgba(255,255,255,.08)",
                    }}
                    whileTap={{
                        scale: 0.97,
                    }}
                    onClick={() =>
                        setShowCalendar((prev) => !prev)
                    }
                    style={{
                        cursor: "pointer",

                        padding: "5px 12px",

                        borderRadius: 8,

                        color: "#E5E7EB",

                        fontSize: 13,

                        fontWeight: 500,

                        letterSpacing: ".4px",

                        transition: ".2s",
                    }}
                >
                    {date}
                </motion.div>

                <AnimatePresence>
                    {showCalendar && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -10,
                                scale: 0.96,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            style={{
                                position: "absolute",

                                top: 42,
                                left: "50%",

                                transform: "translateX(-50%)",

                                width: 340,

                                padding: 18,

                                borderRadius: 20,

                                background:
                                    "rgba(24,24,30,.88)",

                                backdropFilter: "blur(30px)",
                                WebkitBackdropFilter: "blur(30px)",

                                border:
                                    "1px solid rgba(255,255,255,.08)",

                                boxShadow:
                                    "0 25px 70px rgba(0,0,0,.45)",

                                zIndex: 10001,
                            }}
                        >
                            <Calendar
                                value={value}
                                onChange={setValue}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ================= RIGHT ================= */}

            <div
                onClick={() => setShowQuickSettings((prev) => !prev)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 18,
                    cursor: "pointer",
                    position: "relative",
                }}
            >
                <MdWifi />
                <MdBluetooth />
                <MdVolumeUp />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <MdBatteryFull />
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                    >
                        100%
                    </span>
                </div>

                <div
                    style={{
                        width: 1,
                        height: 16,
                        background: "rgba(255,255,255,.12)",
                    }}
                />

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#D1D5DB",
                        minWidth: 55,
                        textAlign: "right",
                    }}
                >
                    {time}
                </span>

                <QuickSettings
                    isOpen={showQuickSettings}
                    onClose={() => setShowQuickSettings(false)}
                />
            </div>
        </motion.div>
    );
}