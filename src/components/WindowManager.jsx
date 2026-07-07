import { useState } from "react";

import Window from "./Window";

// Apps
import Profile from "../apps/Profile";
import Home from "../apps/Home/Home";
import Projects from "../apps/Projects/Projects";
import Resume from "../apps/Resume/Resume";
import Contact from "../apps/Contact/Contact";
import Terminal from "../apps/Terminal/Terminal";

const apps = {
    profile: {
        title: "Profile",
        component: Profile,
        info: "Personal profile, education, skills and achievements.",
    },

    home: {
        title: "Home",
        component: Home,
        info: "Root directory of the Spider OS portfolio.",
    },

    projects: {
        title: "Projects",
        component: Projects,
        info: "AI, ML, Web Development and Hackathon projects.",
    },

    resume: {
        title: "Resume",
        component: Resume,
        info: "Professional resume and downloadable PDF.",
    },

    contact: {
        title: "Contact",
        component: Contact,
        info: "Email, phone number and social media profiles.",
    },

    terminal: {
        title: "Terminal",
        component: Terminal,
        info: "Interactive command line interface.",
    },
};

export default function WindowManager({
    openApps,
    closeApp,
    windowZ,
    focusWindow,
}) {
    const BASE_LEFT = 20;
    const BASE_TOP = 12;
    const OFFSET = 3;

    const [maximizedWindow, setMaximizedWindow] =
        useState(null);

    const toggleMaximize = (id) => {
        setMaximizedWindow((prev) =>
            prev === id ? null : id
        );
    };    return (
        <>
            {Object.entries(apps).map(([id, app], index) => {
                const Component = app.component;

                return (
                    <Window
                        key={id}
                        id={id}
                        title={app.title}
                        infoContent={app.info}

                        isOpen={openApps.includes(id)}

                        onClose={() => {
                            if (maximizedWindow === id) {
                                setMaximizedWindow(null);
                            }

                            closeApp(id);
                        }}

                        left={`${BASE_LEFT + index * OFFSET}%`}
                        top={`${BASE_TOP + index * OFFSET}%`}

                        zIndex={windowZ[id] || 1000}

                        onFocus={() => focusWindow(id)}

                        isMaximized={
                            maximizedWindow === id
                        }

                        onToggleMaximize={() =>
                            toggleMaximize(id)
                        }
                    >
                        <Component />
                    </Window>
                );
            })}
        </>
    );
}