import {
    motion,
    useMotionValue,
    animate,
} from "framer-motion";
import { useEffect, useState } from "react";

export default function DesktopIcon({
    id,
    icon,
    label,

    row,
    col,

    startX,
    startY,

    cellWidth,
    cellHeight,

    onDrop,
    onDoubleClick,
}) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const targetX = startX + col * cellWidth;
        const targetY = startY + row * cellHeight;

        const controlsX = animate(x, targetX, {
            type: "spring",
            stiffness: 500,
            damping: 32,
        });

        const controlsY = animate(y, targetY, {
            type: "spring",
            stiffness: 500,
            damping: 32,
        });

        return () => {
            controlsX.stop();
            controlsY.stop();
        };
    }, [
        row,
        col,
        startX,
        startY,
        cellWidth,
        cellHeight,
        x,
        y,
    ]);

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.08}

            style={{
                position: "absolute",

                x,
                y,

                width: 82,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                cursor: dragging
                    ? "grabbing"
                    : "grab",

                userSelect: "none",

                zIndex: dragging ? 99999 : 1,

                filter: dragging
                    ? "drop-shadow(0 14px 18px rgba(0,0,0,.35))"
                    : "none",
            }}

            whileHover={{
                scale: 1.05,
            }}

            whileDrag={{
                scale: 1.08,
                rotate: -2,
            }}

            whileTap={{
                scale: 0.98,
            }}

            onDragStart={() => {
                setDragging(true);
            }}

            onDragEnd={() => {
                setDragging(false);

                onDrop(
                    id,
                    x.get(),
                    y.get()
                );
            }}

            onDoubleClick={() => {
                if (!dragging) {
                    onDoubleClick();
                }
            }}
        >
            <motion.div
                whileHover={{
                    background:
                        "rgba(255,255,255,.08)",
                }}
                transition={{
                    duration: .15,
                }}
                style={{
                    width: 70,
                    height: 70,

                    borderRadius: 16,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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

                    fontWeight: 500,

                    textAlign: "center",

                    textShadow:
                        "0 2px 8px rgba(0,0,0,.8)",
                }}
            >
                {label}
            </span>
        </motion.div>
    );
}