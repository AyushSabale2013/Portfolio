import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaWifi,
    FaBluetoothB,
    FaMoon,
    FaPlane,
    FaKeyboard,
    FaCog,
    FaLock,
    FaPowerOff,
    FaCamera,
    FaBatteryThreeQuarters,
    FaChevronRight,
} from "react-icons/fa";

import {
    HiSpeakerWave,
    HiSun,
    HiBolt,
} from "react-icons/hi2";

import "./QuickSettings.css";


/* Reusable pill row */
function SettingPill({ icon, label, sublabel, active, onClick, arrow }) {
    return (
        <div
            className={`qs-pill ${active ? "active" : ""}`}
            onClick={onClick}
        >
            <span className="qs-pill-icon">{icon}</span>

            <div className="qs-pill-text">
                <span>{label}</span>
                <small>{sublabel}</small>
            </div>

            {arrow && (
                <FaChevronRight className="qs-pill-arrow" />
            )}
        </div>
    );
}

export default function QuickSettings({ isOpen, onClose }) {

    const panelRef = useRef(null);

    const [wifi, setWifi] = useState(true);
    const [bluetooth, setBluetooth] = useState(true);
    const [dark, setDark] = useState(true);
    const [night, setNight] = useState(false);
    const [airplane, setAirplane] = useState(false);

    const [volume, setVolume] = useState(72);
    const [brightness, setBrightness] = useState(35);
    const [currentTime, setCurrentTime] = useState(new Date());

    /* Robust click-outside-to-close */
    useEffect(() => {
        if (!isOpen) return;

        function handleClick(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        }

        // mousedown feels more native than click for panels like this
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    /* Optional: close on Escape */
    useEffect(() => {
        if (!isOpen) return;
        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    /* Real-time clock */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const time = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // change to true if you want AM/PM
    });

    const date = currentTime.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="qs-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        ref={panelRef}
                        className="quick-settings"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96, y: -14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -14 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    >
                        {/* HEADER */}
                        <div className="qs-header">
                            <div className="qs-battery">
                                <FaBatteryThreeQuarters />
                                <span>54%</span>
                            </div>

                            <div className="qs-header-icons">
                                <button><FaCamera /></button>
                                <button><FaCog /></button>
                                <button><FaLock /></button>
                                <button><FaPowerOff /></button>
                            </div>
                        </div>

                        {/* SLIDERS */}
                        <div className="qs-slider">
                            <HiSpeakerWave className="slider-icon" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                            />
                        </div>

                        <div className="qs-slider">
                            <HiSun className="slider-icon" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                            />
                        </div>

                        {/* PILL GRID */}
                        <div className="qs-grid">
                            <SettingPill
                                icon={<FaWifi />}
                                label="Wi-Fi"
                                sublabel={wifi ? "SPIDEY-WIFI" : "Off"}
                                active={wifi}
                                arrow
                                onClick={() => setWifi(!wifi)}
                            />

                            <SettingPill
                                icon={<FaBluetoothB />}
                                label="Bluetooth"
                                sublabel={bluetooth ? "spiderman BT" : "Off"}
                                active={bluetooth}
                                arrow
                                onClick={() => setBluetooth(!bluetooth)}
                            />

                            <SettingPill
                                icon={<HiBolt />}
                                label="Power Mode"
                                sublabel="Balanced"
                                arrow
                            />

                            <SettingPill
                                icon={<FaMoon />}
                                label="Night Light"
                                sublabel={night ? "Enabled" : "Disabled"}
                                active={night}
                                onClick={() => setNight(!night)}
                            />

                            <SettingPill
                                icon={<HiSun />}
                                label="Dark Style"
                                sublabel={dark ? "Enabled" : "Disabled"}
                                active={dark}
                                onClick={() => setDark(!dark)}
                            />

                            <SettingPill
                                icon={<FaKeyboard />}
                                label="Keyboard"
                                sublabel="US Layout"
                                arrow
                            />
                        </div>

                        <div className="qs-grid qs-grid-single">
                            <SettingPill
                                icon={<FaPlane />}
                                label="Airplane Mode"
                                sublabel={airplane ? "Enabled" : "Disabled"}
                                active={airplane}
                                onClick={() => setAirplane(!airplane)}
                            />
                        </div>

                        {/* FOOTER */}
                        <div className="qs-footer">
                            <div className="qs-footer-left">
                                <span className="qs-time">{time}</span>
                                <span className="qs-date">{date}</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}