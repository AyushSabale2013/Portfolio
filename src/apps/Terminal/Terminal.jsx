import { memo, useEffect, useRef, useState } from "react";
import { getReply, createChatContext, STARTER_CHIPS } from "../../chatbot/nlp/index.js";
import { runTerminalCommand, tokenizeCommand, PORTFOLIO_ROOT, SECTION_ROUTES, TAB_COMMANDS, TAB_COMMANDS_WITH_ARGS } from "../../chatbot/commands.js";
import { SPIDER_CLI_BRAND } from "../../cliVersion.js";
import kaliBackground from "../../assets/icons/Kali.png";
function getPromptDirectory(directory) {
    return directory === PORTFOLIO_ROOT ? "~" : `~${directory.slice(PORTFOLIO_ROOT.length)}`;
}

function commonPrefix(values) {
    if (!values.length) return "";
    let prefix = values[0];
    for (const value of values) {
        while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
}

const THINK_DELAY = 380;
const TYPE_INTERVAL = 16;

const prefersReducedMotion = () =>
    typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

/* ==========================================================================
   9. KALI-STYLE PROMPT + TERMINAL COMPONENT
   This is a visual simulation only. Nothing typed here is ever executed:
   commands are matched against the small registry above and everything else
   goes to the local rule-based chatbot.
   ========================================================================== */

const PROMPT_USER = "ayush";
const PROMPT_HOST = "kali";
// If a visitor's system font shows an empty box for this symbol, change it to "@".
const PROMPT_JOINER = "㉿";

function PromptTop({ directory }) {
    return (
        <div className="terminal-session-prompt-top">
            <span className="terminal-session-frame" aria-hidden="true">┌──(</span>
            <span className="terminal-session-user">{PROMPT_USER}{PROMPT_JOINER}{PROMPT_HOST}</span>
            <span className="terminal-session-frame" aria-hidden="true">)-[</span>
            <span className="terminal-session-path">{directory}</span>
            <span className="terminal-session-frame" aria-hidden="true">]</span>
        </div>
    );
}

function PromptSymbol() {
    return (
        <span className="terminal-session-symbol" aria-hidden="true">
            <span className="terminal-session-frame">└─</span>
            <span className="terminal-session-dollar">$</span>
        </span>
    );
}

const MessageRow = memo(function MessageRow({ message, directory }) {
    if (message.role === "user") return (
        <div className="terminal-session-entry">
            <PromptTop directory={directory} />
            <div className="terminal-session-prompt-bottom">
                <PromptSymbol />
                <span className="terminal-session-command">{message.text}</span>
            </div>
        </div>
    );
    if (message.role === "output") return <div className="terminal-session-output">{message.text}</div>;
    return <BotOutput text={message.text} />;
});

function BotOutput({ text, showCaret = false }) {
    return (
        <div className="terminal-session-bot">
            <span className="terminal-session-tag" aria-hidden="true">[+]</span>
            <span className="terminal-session-bot-text">
                {text}
                {showCaret && <span className="terminal-session-caret" aria-hidden="true">▍</span>}
            </span>
        </div>
    );
}

export default function Terminal({ openApp }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState(null);
    const [currentDirectory, setCurrentDirectory] = useState(PORTFOLIO_ROOT);
    const historyRef = useRef(null);
    const inputRef = useRef(null);
    const thinkTimerRef = useRef(null);
    const typeTimerRef = useRef(null);
    const pendingReplyRef = useRef(null);
    const commandHistoryRef = useRef([]);
    const historyCursorRef = useRef(null);
    const historyDraftRef = useRef("");
    const stickToBottomRef = useRef(true);
    const chatContextRef = useRef(null);
    if (chatContextRef.current === null) chatContextRef.current = createChatContext();

    // Keep the newest output in view, but don't yank the page if the visitor scrolled up to read
    useEffect(() => {
        const element = historyRef.current;
        if (element && stickToBottomRef.current) element.scrollTop = element.scrollHeight;
    }, [messages, isTyping, streamingText]);

    // Grow the input box for Shift+Enter multi-line messages
    useEffect(() => {
        const element = inputRef.current;
        if (!element) return;
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
    }, [input]);

    useEffect(() => {
        inputRef.current?.focus();
        return () => {
            clearTimeout(thinkTimerRef.current);
            clearInterval(typeTimerRef.current);
        };
    }, []);

    const handleHistoryScroll = () => {
        const element = historyRef.current;
        if (!element) return;
        stickToBottomRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48;
    };

    const stopTimers = () => {
        clearTimeout(thinkTimerRef.current);
        clearInterval(typeTimerRef.current);
        thinkTimerRef.current = null;
        typeTimerRef.current = null;
    };

    // Show the rest of the pending answer immediately
    const finishReply = () => {
        stopTimers();
        const reply = pendingReplyRef.current;
        pendingReplyRef.current = null;
        setIsTyping(false);
        setStreamingText(null);
        if (reply) {
            setMessages((current) => [...current, { role: "bot", text: reply.text, suggestions: reply.suggestions }]);
        }
    };

    // Throw the pending answer away (used by "clear" and Ctrl+C)
    const cancelReply = () => {
        stopTimers();
        pendingReplyRef.current = null;
        setIsTyping(false);
        setStreamingText(null);
    };

    const startReply = (reply) => {
        stopTimers();
        pendingReplyRef.current = reply;
        setIsTyping(true);

        thinkTimerRef.current = setTimeout(() => {
            setIsTyping(false);
            if (prefersReducedMotion()) {
                finishReply();
                return;
            }
            const step = Math.max(2, Math.ceil(reply.text.length / 120));
            let shown = 0;
            setStreamingText("");
            typeTimerRef.current = setInterval(() => {
                shown += step;
                if (shown >= reply.text.length) finishReply();
                else setStreamingText(reply.text.slice(0, shown));
            }, TYPE_INTERVAL);
        }, THINK_DELAY);
    };

    const clearScreen = () => {
        cancelReply();
        setMessages([]);
    };

    // Ctrl+C: stop a running answer, or abandon the line being typed (like a real shell)
    const interrupt = () => {
        if (pendingReplyRef.current) {
            cancelReply();
            setMessages((current) => [...current, { role: "output", text: "^C" }]);
            return;
        }
        if (input) {
            const abandoned = input;
            setInput("");
            historyCursorRef.current = null;
            setMessages((current) => [...current, { role: "user", text: `${abandoned}^C`, cwd: currentDirectory }]);
        }
    };

    const navigateCommandHistory = (direction) => {
        const history = commandHistoryRef.current;
        if (!history.length) return;

        if (direction < 0) {
            if (historyCursorRef.current === null) {
                historyDraftRef.current = input;
                historyCursorRef.current = history.length - 1;
            } else {
                historyCursorRef.current = Math.max(0, historyCursorRef.current - 1);
            }

            setInput(history[historyCursorRef.current]);
            return;
        }

        if (historyCursorRef.current === null) return;
        if (historyCursorRef.current >= history.length - 1) {
            historyCursorRef.current = null;
            setInput(historyDraftRef.current);
            historyDraftRef.current = "";
            return;
        }

        historyCursorRef.current += 1;
        setInput(history[historyCursorRef.current]);
    };

    const completeWithTab = () => {
        const trimmed = input.replace(/^\s+/, "");
        if (!trimmed) return;
        const parts = trimmed.split(/\s+/);
        const hasTrailingSpace = /\s$/.test(trimmed);

        if (parts.length === 1 && !hasTrailingSpace) {
            const fragment = parts[0].toLowerCase();
            const matches = TAB_COMMANDS.filter((command) => command.startsWith(fragment));
            if (!matches.length) return;
            const completed = matches.length === 1 ? matches[0] : commonPrefix(matches);
            const suffix = matches.length === 1 && TAB_COMMANDS_WITH_ARGS.has(completed) ? " " : "";
            setInput(`${completed}${suffix}`);
            return;
        }

        if (parts.length <= 2 && ["cd", "open", "ls"].includes(parts[0].toLowerCase())) {
            const fragment = hasTrailingSpace ? "" : (parts[1] ?? "").toLowerCase();
            const matches = Object.keys(SECTION_ROUTES).filter((section) => section.startsWith(fragment));
            if (!matches.length) return;
            const completed = matches.length === 1 ? matches[0] : commonPrefix(matches);
            if (completed.length > fragment.length) setInput(`${parts[0]} ${completed}`);
        }
    };

    const submitText = (raw) => {
        const question = raw.trim();
        if (!question) return;
        if (question.length > 500) { setMessages((current) => [...current, { role: "output", text: "Please keep each message to 500 characters or fewer." }]); setInput(""); return; }

        const tokens = tokenizeCommand(question);
        const isMultiline = question.includes("\n");
        const isClearCommand = !isMultiline && tokens[0]?.toLowerCase() === "clear" && tokens.length <= 2;

        // If a reply is still typing, show it fully and move on instead of ignoring the new input
        if (!isClearCommand && pendingReplyRef.current) finishReply();

        stickToBottomRef.current = true;
        commandHistoryRef.current.push(question);
        setInput("");
        historyCursorRef.current = null;
        historyDraftRef.current = "";

        if (isClearCommand) {
            clearScreen();
            return;
        }

        const commandContext = {
            currentDirectory,
            setCurrentDirectory,
            commandHistory: commandHistoryRef.current,
            openApp,
            spiderCliBrand: SPIDER_CLI_BRAND,
        };

        setMessages((current) => [...current, { role: "user", text: question, cwd: currentDirectory }]);

        // Multi-line input is always treated as a message to the chatbot, never as a command
        const commandResult = isMultiline ? null : runTerminalCommand(question, commandContext);

        if (commandResult?.handled) {
            if (commandResult.clear) {
                clearScreen();
                return;
            }
            if (commandResult.output !== undefined) {
                setMessages((current) => [...current, { role: "output", text: commandResult.output }]);
            }
            return;
        }

        const reply = getReply(question, chatContextRef.current);

        // A single unknown word is most likely a mistyped command, not a question
        if (reply.isFallback && tokens.length === 1) {
            setMessages((current) => [
                ...current,
                {
                    role: "output",
                    text: `zsh: command not found: ${tokens[0]}\nTip: type "help", or just ask me a question in plain English.`,
                },
            ]);
            return;
        }

        startReply(reply);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submitText(input);
    };

    const handleInputKeyDown = (event) => {
        const element = event.currentTarget;

        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submitText(input);
        } else if (event.key === "ArrowUp") {
            // In a multi-line message the arrows move the caret; history only works from the first line
            if (input.includes("\n") && element.value.slice(0, element.selectionStart).includes("\n")) return;
            event.preventDefault();
            navigateCommandHistory(-1);
        } else if (event.key === "ArrowDown") {
            if (input.includes("\n") && element.value.slice(element.selectionEnd).includes("\n")) return;
            event.preventDefault();
            navigateCommandHistory(1);
        } else if (event.key === "Tab") {
            event.preventDefault();
            completeWithTab();
        } else if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "l") {
            event.preventDefault();
            clearScreen();
        } else if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "c") {
            // Leave Ctrl+C alone when text is selected so copying still works
            if (element.selectionStart !== element.selectionEnd) return;
            event.preventDefault();
            interrupt();
        }
    };

    const handleChipClick = (chip) => {
        submitText(chip);
        inputRef.current?.focus();
    };

    const focusInput = () => {
        // Don't steal focus while someone is selecting text to copy
        if (window.getSelection?.().toString()) return;
        inputRef.current?.focus();
    };

    const lastMessage = messages[messages.length - 1];
    const idle = !isTyping && streamingText === null;
    let chips = [];
    if (idle) {
        if (messages.length === 0) chips = STARTER_CHIPS;
        else if (lastMessage?.role === "bot") chips = lastMessage.suggestions ?? [];
    }

    return (
        <div className="terminal-session" onClick={focusInput}>
            <div className="terminal-session-bg" style={{ backgroundImage: `url(${kaliBackground})` }} aria-hidden="true" />
            <div className="terminal-session-veil" aria-hidden="true" />

            <div className="terminal-session-banner">
                <div className="terminal-session-version">Kali {SPIDER_CLI_BRAND}</div>
                <div className="terminal-session-help">
                    Ask me anything about Ayush in plain English, or type 'help' to see how it works.
                </div>
            </div>

            <div
                ref={historyRef}
                role="log"
                aria-live="polite"
                aria-label="Terminal conversation"
                className="terminal-session-history"
                onScroll={handleHistoryScroll}
            >
                {messages.map((message, index) => (
                    <MessageRow
                        key={`${index}-${message.role}`}
                        message={message}
                        directory={getPromptDirectory(message.cwd ?? currentDirectory)}
                    />
                ))}

                {isTyping && (
                    <div className="terminal-session-bot terminal-session-processing" aria-label="Processing your question">
                        <span className="terminal-session-tag terminal-session-tag-info" aria-hidden="true">[*]</span>
                        <span>
                            analysing query<span className="terminal-session-typing-dots">...</span>
                        </span>
                    </div>
                )}

                {streamingText !== null && <BotOutput text={streamingText} showCaret />}
            </div>

            {chips.length > 0 && (
                <div className="terminal-session-chips" aria-label="Suggested questions">
                    {chips.map((chip) => (
                        <button
                            key={chip}
                            type="button"
                            className="terminal-session-chip"
                            onClick={() => handleChipClick(chip)}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="terminal-session-input-block">
                <PromptTop directory={getPromptDirectory(currentDirectory)} />
                <div className="terminal-session-prompt-bottom">
                    <PromptSymbol />
                    <textarea
                        id="terminal-chat-input"
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        aria-label="Type a question or command. Press Enter to send, Shift+Enter for a new line."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className="terminal-session-input"
                    />
                </div>
            </form>

            <style>{`
                .terminal-session {
                    --kali-text: #e6edf3;
                    --kali-muted: #8b98a8;
                    --kali-green: #2bd67b;
                    --kali-cyan: #22d3ee;
                    --kali-frame: #38bdf8;
                    --kali-yellow: #facc15;
                    position: relative;
                    isolation: isolate;
                    min-height: 0;
                    margin: -24px;
                    width: calc(100% + 48px);
                    height: calc(100% + 48px);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    color: var(--kali-text);
                    background: #05080c;
                    box-sizing: border-box;
                    padding: 24px;
                    font: 15px/1.65 'JetBrains Mono', 'Ubuntu Mono', 'DejaVu Sans Mono', 'Noto Sans Mono CJK KR', 'Noto Sans CJK KR', 'Malgun Gothic', 'Apple SD Gothic Neo', monospace;
                    user-select: text;
                }

                .terminal-session ::selection {
                    background: rgba(34, 211, 238, 0.3);
                }

                /* Kali wallpaper, scaled to cover any window size */
                .terminal-session-bg {
                    position: absolute;
                    inset: 0;
                    z-index: -2;
                    background-color: #05080c;
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                    transform: scale(1.04);
                }

                /* Dark translucent layer + light blur keeps the text readable and the wallpaper recognisable */
                .terminal-session-veil {
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    background: linear-gradient(180deg, rgba(4, 8, 13, 0.78) 0%, rgba(4, 8, 13, 0.88) 100%);
                    -webkit-backdrop-filter: blur(3px);
                    backdrop-filter: blur(3px);
                    box-shadow: inset 0 0 90px rgba(34, 211, 238, 0.06);
                }

                .terminal-session-banner {
                    flex: 0 0 auto;
                    margin-bottom: 14px;
                }

                .terminal-session-version {
                    color: var(--kali-green);
                    font-weight: 700;
                    margin-bottom: 6px;
                    text-shadow: 0 0 8px rgba(43, 214, 123, 0.35);
                }

                .terminal-session-help {
                    color: var(--kali-muted);
                }

                .terminal-session-note {
                    color: var(--kali-muted);
                    font-size: 12px;
                    opacity: 0.8;
                }

                .terminal-session-history {
                    flex: 1;
                    min-height: 0;
                    overflow: auto;
                    overflow-wrap: anywhere;
                    white-space: pre-wrap;
                    scrollbar-color: #3b4654 transparent;
                    scrollbar-width: thin;
                    padding: 2px 4px 8px 0;
                }

                .terminal-session-entry,
                .terminal-session-bot,
                .terminal-session-output {
                    margin-bottom: 10px;
                }

                .terminal-session-prompt-top {
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                    font-weight: 600;
                }

                .terminal-session-frame {
                    color: var(--kali-frame);
                }

                .terminal-session-user {
                    color: var(--kali-green);
                    font-weight: 700;
                    text-shadow: 0 0 8px rgba(43, 214, 123, 0.35);
                }

                .terminal-session-path {
                    color: #ffffff;
                    font-weight: 700;
                }

                .terminal-session-prompt-bottom {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    min-width: 0;
                }

                .terminal-session-symbol {
                    flex: 0 0 auto;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .terminal-session-dollar {
                    color: var(--kali-cyan);
                    margin-left: 1px;
                    text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
                }

                .terminal-session-command {
                    flex: 1;
                    min-width: 0;
                    color: var(--kali-text);
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                }

                .terminal-session-output {
                    color: var(--kali-text);
                }

                .terminal-session-bot {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }

                .terminal-session-tag {
                    flex: 0 0 auto;
                    color: var(--kali-green);
                    font-weight: 700;
                    text-shadow: 0 0 8px rgba(43, 214, 123, 0.35);
                }

                .terminal-session-tag-info {
                    color: var(--kali-cyan);
                    text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
                }

                .terminal-session-bot-text {
                    flex: 1;
                    min-width: 0;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                }

                .terminal-session-processing {
                    color: var(--kali-muted);
                }

                .terminal-session-typing-dots {
                    animation: terminalBlink 1s steps(1) infinite;
                }

                .terminal-session-caret {
                    color: var(--kali-cyan);
                    animation: terminalBlink 1s steps(1) infinite;
                }

                .terminal-session-chips {
                    flex: 0 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }

                .terminal-session-chip {
                    padding: 3px 12px;
                    border: none;
                    border-radius: 999px;
                    color: #d1d5db;
                    background: transparent;
                    font: 500 13px/1.5 'JetBrains Mono', 'Ubuntu Mono', 'DejaVu Sans Mono', monospace;
                    cursor: pointer;
                    text-align: left;
                }

                .terminal-session-chip::before {
                    content: "> ";
                    opacity: 0.6;
                }

                .terminal-session-chip:hover {
                    border-color: #71717a;
                    background: rgba(255, 255, 255, 0.06);
                }

                .terminal-session-chip:focus-visible {
                    outline: 2px solid #71717a;
                    outline-offset: 2px;
                }

                .terminal-session-input-block {
                    flex: 0 0 auto;
                    min-width: 0;
                    margin-top: 10px;
                }

                .terminal-session-input {
                    flex: 1;
                    width: 0;
                    min-width: 0;
                    min-height: 1.65em;
                    max-height: 160px;
                    margin: 0;
                    padding: 0 1px;
                    border: 0;
                    outline: 0;
                    resize: none;
                    overflow-y: auto;
                    color: var(--kali-text);
                    background: transparent;
                    caret-color: var(--kali-cyan);
                    caret-shape: block;
                    font: inherit;
                    line-height: inherit;
                    scrollbar-width: thin;
                }

                @keyframes terminalBlink {
                    50% { opacity: 0; }
                }

                @media (max-width: 520px) {
                    .terminal-session {
                        padding: 16px;
                        font-size: 14px;
                    }

                    .terminal-session-prompt-top {
                        font-size: 12px;
                    }

                    .terminal-session-chip {
                        font-size: 12px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .terminal-session-typing-dots,
                    .terminal-session-caret {
                        animation-duration: 0.01ms;
                        animation-iteration-count: 1;
                    }
                }
            `}</style>
        </div>
    );
}
