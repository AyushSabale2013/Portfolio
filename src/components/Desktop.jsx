import desktopWallpaper from "../assets/desktop.jpg";
import { motion } from "framer-motion";
import MenuBar from "./MenuBar";
import Dock from "./Dock";

export default function Desktop() {
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

            {/* Menu Bar */}
            <MenuBar />

            <Dock />

        </div>
    );
}