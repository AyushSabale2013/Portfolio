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
            }}
        >
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