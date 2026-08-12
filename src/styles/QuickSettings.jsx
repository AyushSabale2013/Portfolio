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

/* Reusable pill row - Mac style uses the icon circle for active state */
function SettingPill({ icon, label, sublabel, active, onClick, arrow }) {
    return (
        <div className="qs-pill" onClick={onClick}>
            <div className={`qs-pill-icon-wrapper ${active ? "active" : ""}`}>
                <span className="qs-pill-icon">{icon}</span>
            </div>

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
        hour12: false,
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
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {/* HEADER */}
                        <div className="qs-header">
                            <div className="qs-battery">
                                <span>54%</span>
                                <FaBatteryThreeQuarters className="battery-icon" />
                            </div>

                            <div className="qs-header-icons">
                                <button aria-label="Camera"><FaCamera /></button>
                                <button aria-label="Settings"><FaCog /></button>
                                <button aria-label="Lock"><FaLock /></button>
                                <button aria-label="Power"><FaPowerOff /></button>
                            </div>
                        </div>

                        {/* SLIDERS (Mac Style Thick Sliders) */}
                        <div className="qs-sliders-container">
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
                        </div>

                        {/* PILL GRID */}
                        <div className="qs-grid">
                            <SettingPill
                                icon={<FaWifi />}
                                label="Wi-Fi"
                                sublabel={wifi ? "Network" : "Off"}
                                active={wifi}
                                arrow
                                onClick={() => setWifi(!wifi)}
                            />

                            <SettingPill
                                icon={<FaBluetoothB />}
                                label="Bluetooth"
                                sublabel={bluetooth ? "On" : "Off"}
                                active={bluetooth}
                                arrow
                                onClick={() => setBluetooth(!bluetooth)}
                            />

                            <SettingPill
                                icon={<HiBolt />}
                                label="Battery"
                                sublabel="Optimized"
                                arrow
                            />

                            <SettingPill
                                icon={<FaMoon />}
                                label="Night Shift"
                                sublabel={night ? "On" : "Off"}
                                active={night}
                                onClick={() => setNight(!night)}
                            />

                            <SettingPill
                                icon={<HiSun />}
                                label="Dark Mode"
                                sublabel={dark ? "On" : "Off"}
                                active={dark}
                                onClick={() => setDark(!dark)}
                            />

                            <SettingPill
                                icon={<FaKeyboard />}
                                label="Keyboard"
                                sublabel="Default"
                                arrow
                            />
                        </div>

                        <div className="qs-grid qs-grid-single">
                            <SettingPill
                                icon={<FaPlane />}
                                label="Airplane Mode"
                                sublabel={airplane ? "On" : "Off"}
                                active={airplane}
                                onClick={() => setAirplane(!airplane)}
                            />
                        </div>

                        {/* FOOTER */}
                        <div className="qs-footer">
                            <span className="qs-time">{time}</span>
                            <span className="qs-date">{date}</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}