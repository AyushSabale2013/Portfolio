import { profile } from "../../../data/profile";

export default function About() {
    return (
        <section
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
                fontFamily: "'Inter', system-ui, sans-serif",
                boxSizing: "border-box",
                position: "relative",
            }}
        >
            <style>{`
                .spider-panel {
                    position: relative;
                    padding: 26px 28px;
                    border-radius: 14px;
                    background: rgba(14, 17, 27, 0.55);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03) inset, 0 8px 24px rgba(0, 0, 0, 0.25);
                    transition: border-color 0.25s ease, box-shadow 0.25s ease;
                }
                .spider-panel:hover {
                    border-color: rgba(255, 43, 70, 0.18);
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03) inset, 0 10px 28px rgba(0, 0, 0, 0.32);
                }
                .fact-badge {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 7px 13px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: #C8CDD5;
                    font-size: 13.5px;
                }
                @media (max-width: 500px) {
                    .responsive-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* Faint web watermark, corner only */}
            <svg
                width="140"
                height="140"
                style={{ position: "absolute", top: -30, right: -30, opacity: 0.05, pointerEvents: "none" }}
            >
                {[0, 22, 44, 66, 88].map((a) => (
                    <line
                        key={a}
                        x1="140"
                        y1="0"
                        x2={140 - 140 * Math.cos((a * Math.PI) / 180)}
                        y2={140 * Math.sin((a * Math.PI) / 180)}
                        stroke="#fff"
                        strokeWidth="1"
                    />
                ))}
                {[35, 65, 95].map((r) => (
                    <path
                        key={r}
                        d={`M ${140 - r} 0 Q ${140 - r * 0.6} ${r * 0.6} 140 ${r}`}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1"
                    />
                ))}
            </svg>

            {/* Section header */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
                <span
                    style={{
                        color: "#6B7280",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                    }}
                >
                    Profile
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <h2
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontFamily: "'Bangers', cursive, system-ui",
                            fontSize: 26,
                            letterSpacing: "1px",
                        }}
                    >
                        About Me
                    </h2>
                    <div
                        style={{
                            flex: 1,
                            height: 1,
                            background: "linear-gradient(90deg, #FF2B46, #2563EB 60%, transparent)",
                            opacity: 0.35,
                        }}
                    />
                </div>
            </div>

            {/* Main Bio Panel */}
            <Card title="Who I Am" content={profile.about.description} />

            {/* Responsive Dual Column Layout */}
            <div
                className="responsive-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                }}
            >
                <Card title="Current Goal" content={profile.about.goal} />
                <Card title="Current Focus" content={profile.about.focus} />
            </div>

            {/* Quick Facts */}
            <Card title="Quick Facts">
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 9,
                        marginTop: 16,
                    }}
                >
                    <Fact emoji="🎓" text={profile.basic.college} />
                    <Fact emoji="💻" text="AI • ML • Full Stack" />
                    <Fact emoji="📍" text={profile.basic.location} />
                    <Fact emoji="⚽" text="Football • Volleyball" />
                </div>
            </Card>
        </section>
    );
}

function Card({ title, content, children }) {
    return (
        <div className="spider-panel">
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 26,
                    bottom: 26,
                    width: 2,
                    background: "linear-gradient(to bottom, #FF2B46, #2563EB)",
                    borderRadius: "0 3px 3px 0",
                    opacity: 0.6,
                }}
            />

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: content ? 12 : 0,
                    color: "#FF2B46",
                    fontFamily: "'Inter', system-ui",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                }}
            >
                {title}
            </h3>

            {content && (
                <p
                    style={{
                        color: "#C8CDD5",
                        fontSize: 14.5,
                        lineHeight: 1.7,
                        margin: 0,
                    }}
                >
                    {content}
                </p>
            )}

            {children}
        </div>
    );
}

function Fact({ emoji, text }) {
    return (
        <div className="fact-badge">
            <span style={{ fontSize: 14, opacity: 0.85 }}>{emoji}</span>
            <span style={{ fontWeight: 500, letterSpacing: "0.2px" }}>{text}</span>
        </div>
    );
}