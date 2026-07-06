import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    MdWifi,
    MdBluetooth,
    MdVolumeUp,
    MdBatteryFull,
} from "react-icons/md";

import logo from "../assets/logo.png";

export default function MenuBar() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

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

    return (
        <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "34px",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                padding: "0 18px",

                background: "rgba(10,10,15,.30)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",

                borderBottom: "1px solid rgba(255,255,255,.08)",

                color: "#F8FAFC",

                zIndex: 999,
                userSelect: "none",
            }}
        >
            {/* Left */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        width: 33,
                        height: 33,
                        objectFit: "contain",
                    }}
                />

                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        color: "#C0C0C0",
                    }}
                >
                    SPIDEY OS
                </span>
            </div>

            {/* Center */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",

                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#D1D5DB",
                    letterSpacing: ".5px",
                }}
            >
                {date}
            </div>

            {/* Right */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontSize: "18px",
                }}
            >
                <MdWifi />

                <MdBluetooth />

                <MdVolumeUp />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <MdBatteryFull />

                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                        }}
                    >
                        100%
                    </span>
                </div>

                <div
                    style={{
                        width: "1px",
                        height: "16px",
                        background: "rgba(255,255,255,.12)",
                    }}
                />

                <span
                    style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#D1D5DB",
                    }}
                >
                    {time}
                </span>
            </div>
        </motion.div>
    );
}