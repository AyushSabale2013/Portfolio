import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TermIcon, MousePointer2 } from "lucide-react";

/**
 * WelcomePopup — Spidey OS welcome modal
 * -----------------------------------------------------------
 * Add to your Google Fonts <link> (index.html):
 *   Anton (display), JetBrains Mono (mono), Inter (body)
 *   https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500&display=swap
 */

// Corrected: Updated timeout length to precisely 10 seconds
const AUTO_CLOSE_MS = 10000;

export default function WelcomePopup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = "spidey-popup-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    
    // Establishing clean side-effect execution lifecycle
    const timer = setTimeout(() => {
      setVisible(false);
    }, AUTO_CLOSE_MS);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", // Changed from absolute to fixed to ensure true overlay positioning
              inset: 0,
              background: "rgba(5,8,14,0.86)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              zIndex: 9999, // Guarantees overlay stacks above open app containers
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "380px",
                background: "#0a0e17",
                border: "3px solid #f2ede0",
                boxShadow:
                  "8px 8px 0px #e8352f, 14px 14px 0px rgba(47,208,255,0.5)",
                padding: "26px 24px 22px",
                color: "#f2ede0",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {/* Ben-Day dot corner accent */}
              <div
                style={{
                  position: "absolute",
                  top: -3,
                  left: -3,
                  width: 48,
                  height: 48,
                  backgroundImage:
                    "radial-gradient(#e8352f 1.6px, transparent 1.6px)",
                  backgroundSize: "7px 7px",
                  opacity: 0.85,
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }}
              />

              {/* Close button */}
              <button
                onClick={() => setVisible(false)}
                aria-label="Close welcome popup"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#e8352f",
                  border: "2px solid #0a0e17",
                  outline: "1px solid #f2ede0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={13} strokeWidth={3} color="#0a0e17" />
              </button>

              {/* Headline */}
              <div
                style={{
                  position: "relative",
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(30px, 7vw, 38px)",
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  margin: "4px 0 18px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    color: "#e8352f",
                    transform: "translate(-2px, 1px)",
                    opacity: 0.75,
                  }}
                >
                  Welcome
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    color: "#2fd0ff",
                    transform: "translate(2px, -1px)",
                    opacity: 0.75,
                  }}
                >
                  Welcome
                </span>
                <span style={{ position: "relative", color: "#f2ede0" }}>
                  Welcome
                </span>
              </div>

              {/* How to use */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  color: "#2fd0ff",
                  marginBottom: "10px",
                }}
              >
                HOW TO USE
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <MousePointer2 size={15} color="#e8352f" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#c7cddb", lineHeight: 1.4 }}>
                    It's a desktop — drag windows, click icons, use it like normal.
                  </span>
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <TermIcon size={15} color="#2fd0ff" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#c7cddb", lineHeight: 1.4 }}>
                    Open the terminal to chat — it works like an assistant.
                  </span>
                </li>
              </ul>

              <button
                onClick={() => setVisible(false)}
                style={{
                  width: "100%",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: "#e8352f",
                  color: "#0a0e17",
                  border: "2px solid #f2ede0",
                  padding: "10px 22px",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0px #2fd0ff",
                }}
              >
                Enter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Replay Action Anchor */}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#2fd0ff",
            background: "#0a0e17",
            border: "1px solid #2fd0ff",
            padding: "8px 14px",
            cursor: "pointer",
            borderRadius: "4px",
            zIndex: 9998,
          }}
        >
          replay intro
        </button>
      )}
    </>
  );
}