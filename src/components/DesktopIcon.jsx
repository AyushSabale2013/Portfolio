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