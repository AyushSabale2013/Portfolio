import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import projects from "../../data/projects";

const projectAliases = {
    "spider os": "Spider OS Portfolio",
    spideros: "Spider OS Portfolio",
    "track academy": "Track Academy",
    "solar flare": "Solar Flare Prediction",
    campass: "Campass",
};

function getReply(message) {
    const question = message.toLowerCase().trim();
    const skills = profile.skills;

    if (/^(hi|hello|hey|hii|yo)\b/.test(question)) {
        return `Hello! I'm Ayush's portfolio chatbot. Ask me about my background, skills, projects, or experience.`;
    }

    if (/\b(thanks|thank you|thx)\b/.test(question)) {
        return `You're welcome! Type "help" to see what I can answer.`;
    }

    if (/^(help|commands|what can you do)\b/.test(question)) {
        return `Ask about Ayush's background, education, experience, skills, projects, portfolio, or contact details. For example: "What languages does he know?" or "Tell me about Track Academy."`;
    }

    if (/\b(contact|email|reach|linkedin|github)\b/.test(question)) {
        return `Email: ${profile.contacts.find((item) => item.type === "email")?.value ?? "Not listed"}\nGitHub: ${profile.socials.find((item) => item.name === "GitHub")?.link ?? "Not listed"}\nLinkedIn: ${profile.socials.find((item) => item.name === "LinkedIn")?.link ?? "Not listed"}`;
    }

    if (/\b(education|college|university|degree|study|studies)\b/.test(question)) {
        return `${profile.basic.name} is studying ${profile.basic.degree} at ${profile.basic.college} (${profile.basic.batch}).`;
    }

    if (/\b(experience|internship|intern|work history|job)\b/.test(question)) {
        return `The portfolio doesn't list formal work experience. Ayush is a ${profile.basic.degree} student at ${profile.basic.college} and is interested in internship opportunities.`;
    }

    const matchedAlias = Object.entries(projectAliases).find(([alias]) => question.includes(alias));
    const matchedProject = matchedAlias
        ? projects.find((project) => project.title === matchedAlias[1])
        : projects.find((project) => question.includes(project.title.toLowerCase()));

    if (matchedProject) {
        return `${matchedProject.title} (${matchedProject.category}): ${matchedProject.description}\nBuilt with: ${matchedProject.technologies.join(", ")}.`;
    }

    if (/\b(project|projects|built|build|portfolio work)\b/.test(question)) {
        return `Projects include: ${projects.map((project) => `${project.title} — ${project.description}`).join("\n")}`;
    }

    if (/\b(skill|skills|language|languages|stack|technology|technologies|tool|tools|know|proficient)\b/.test(question)) {
        const category = [
            ["language", "languages"],
            ["frontend", "frontend"],
            ["front-end", "frontend"],
            ["backend", "backend"],
            ["back-end", "backend"],
            ["database", "databases"],
            ["ai", "ai"],
            ["machine learning", "ai"],
            ["tool", "tools"],
        ].find(([term]) => question.includes(term));

        if (category) {
            const label = category[1];
            const values = skills[label];
            return `${label[0].toUpperCase()}${label.slice(1)}: ${values.join(", ")}.`;
        }

        return Object.entries(skills)
            .map(([label, values]) => `${label[0].toUpperCase()}${label.slice(1)}: ${values.join(", ")}`)
            .join("\n");
    }

    if (/\b(about|who is|who's|background|focus|goal|ayush)\b/.test(question)) {
        return `${profile.about.description} ${profile.about.focus} Goal: ${profile.about.goal}`;
    }

    if (/\b(portfolio|website|site|built with|framework)\b/.test(question)) {
        const portfolio = projects.find((project) => project.title === "Spider OS Portfolio");
        return `${portfolio?.description ?? "This is Ayush's interactive portfolio."} Its project stack includes ${portfolio?.technologies.join(", ") ?? "React and CSS"}.`;
    }

    return `I don't have that information in the portfolio yet. Try asking about Ayush's background, education, skills, projects, experience, or contact details.`;
}

export default function Terminal() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const historyRef = useRef(null);
    const replyTimerRef = useRef(null);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => () => clearTimeout(replyTimerRef.current), []);

    const sendMessage = (event) => {
        event.preventDefault();
        const question = input.trim();
        if (!question || isTyping) return;

        setMessages((current) => [...current, { role: "user", text: question }]);
        setInput("");
        setIsTyping(true);

        const reply = getReply(question);
        const delay = Math.min(850, Math.max(350, reply.length * 5));
        replyTimerRef.current = setTimeout(() => {
            setMessages((current) => [...current, { role: "bot", text: reply }]);
            setIsTyping(false);
        }, delay);
    };

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
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                userSelect: "text",
            }}
        >
            <div
                style={{
                    color: "#22C55E",
                    fontWeight: "700",
                    marginBottom: "10px",
                    flexShrink: 0,
                }}
            >
                Spider CLI v1.0
            </div>

            <div
                style={{
                    color: "#9CA3AF",
                    marginBottom: "16px",
                    flexShrink: 0,
                }}
            >
                Ask me about Ayush. Type <span style={{ color: "#38BDF8" }}>help</span> for examples.
            </div>

            <div
                ref={historyRef}
                role="log"
                aria-live="polite"
                aria-label="Chat conversation"
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                    paddingBottom: "8px",
                }}
            >
                {messages.map((message, index) => (
                    <div key={`${index}-${message.role}`} style={{ marginBottom: "10px" }}>
                        <span
                            style={{
                                color: message.role === "user" ? "#22C55E" : "#38BDF8",
                                fontWeight: "600",
                            }}
                        >
                            {message.role === "user" ? "Ayush@SpiderOS:~$" : "spider-bot>"}
                        </span>{" "}
                        <span>{message.text}</span>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ color: "#9CA3AF" }}>
                        <span style={{ color: "#38BDF8", fontWeight: "600" }}>spider-bot&gt;</span>{" "}
                        <span aria-label="Chatbot is typing">typing</span>
                        <span style={{ animation: "terminalBlink 1s steps(1) infinite" }}>...</span>
                    </div>
                )}
            </div>

            <form
                onSubmit={sendMessage}
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    marginTop: "10px",
                }}
            >
                <label
                    htmlFor="terminal-chat-input"
                    style={{ color: "#22C55E", fontWeight: "600", flexShrink: 0 }}
                >
                    Ayush@SpiderOS:~$
                </label>
                <input
                    id="terminal-chat-input"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={isTyping}
                    aria-label="Type a message to the portfolio chatbot"
                    autoComplete="off"
                    spellCheck="false"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        marginLeft: "8px",
                        padding: 0,
                        border: 0,
                        outline: 0,
                        background: "transparent",
                        color: "#E5E5E5",
                        caretColor: "#22C55E",
                        font: "inherit",
                    }}
                />
                {!isTyping && (
                    <span
                        aria-hidden="true"
                        style={{
                            width: "10px",
                            height: "22px",
                            marginLeft: "2px",
                            background: "#22C55E",
                            display: "inline-block",
                            animation: "terminalBlink 1s steps(1) infinite",
                            flexShrink: 0,
                        }}
                    />
                )}
            </form>

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
