import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

import About from "./sections/About";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Achievements from "./sections/Achievements";
import Interests from "./sections/Interests";
import Contact from "./sections/Contact";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("about");

    const renderSection = () => {
        switch (activeTab) {
            case "about":
                return <About />;

            case "skills":
                return <Skills />;

            case "education":
                return <Education />;

            case "achievements":
                return <Achievements />;

            case "interests":
                return <Interests />;

            case "contact":
                return <Contact />;

            default:
                return <About />;
        }
    };

    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",

                position: "relative",

                overflow: "hidden",
            }}
        >
            {/* Spider Web Decorations */}

            <svg
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",

                    pointerEvents: "none",

                    opacity: 0.06,

                    zIndex: 0,
                }}
                viewBox="0 0 1000 700"
            >
                {/* Top Left */}

                <g stroke="#ffffff" strokeWidth="1" fill="none">
                    <line x1="0" y1="0" x2="180" y2="180" />

                    <path d="M0 40 Q60 60 110 110" />
                    <path d="M0 80 Q80 95 145 145" />
                    <path d="M0 120 Q95 130 175 175" />

                    <line x1="40" y1="0" x2="150" y2="150" />
                    <line x1="80" y1="0" x2="180" y2="100" />
                </g>

                {/* Bottom Right */}

                <g
                    transform="translate(1000 700) rotate(180)"
                    stroke="#ffffff"
                    strokeWidth="1"
                    fill="none"
                >
                    <line x1="0" y1="0" x2="180" y2="180" />

                    <path d="M0 40 Q60 60 110 110" />
                    <path d="M0 80 Q80 95 145 145" />
                    <path d="M0 120 Q95 130 175 175" />

                    <line x1="40" y1="0" x2="150" y2="150" />
                    <line x1="80" y1="0" x2="180" y2="100" />
                </g>
            </svg>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 30,
                }}
            >
                <Header />

                {renderSection()}
            </div>
        </div>
    );
}