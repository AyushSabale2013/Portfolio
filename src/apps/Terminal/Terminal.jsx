export default function Terminal() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "#000000",
                color: "#E5E5E5",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "18px",
                lineHeight: 1.7,
                padding: "24px",
                boxSizing: "border-box",
                overflowY: "auto",
                userSelect: "text",
            }}
        >
            <div
                style={{
                    color: "#22C55E",
                    fontWeight: "700",
                    marginBottom: "18px",
                }}
            >
                Spider CLI v1.0
            </div>

            <div
                style={{
                    color: "#9CA3AF",
                    marginBottom: "30px",
                }}
            >
                Type{" "}
                <span style={{ color: "#38BDF8" }}>
                    help
                </span>{" "}
                to begin.
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        color: "#22C55E",
                        fontWeight: "600",
                    }}
                >
                    Ayush@SpiderOS:~$
                </span>

                <span
                    style={{
                        width: "10px",
                        height: "22px",
                        marginLeft: "8px",
                        background: "#22C55E",
                        display: "inline-block",
                        animation: "terminalBlink 1s steps(1) infinite",
                    }}
                />
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

                @keyframes terminalBlink {
                    50% {
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}