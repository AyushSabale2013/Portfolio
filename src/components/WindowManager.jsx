import Window from "./Window";
import { apps } from "../apps/apps";

export default function WindowManager({
    openApps,
    openApp,
    closeApp,

    windowZ,
    focusWindow,

    maximizedWindow,
    setMaximizedWindow,
}) {
    const BASE_LEFT = 20;
    const BASE_TOP = 12;
    const OFFSET = 3;

    const toggleMaximize = (id) => {
        setMaximizedWindow((prev) =>
            prev === id ? null : id
        );
    };

    return (
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
                        left={`${BASE_LEFT + index * OFFSET}%`}
                        top={`${BASE_TOP + index * OFFSET}%`}
                        zIndex={windowZ[id] ?? 1000}
                        isMaximized={maximizedWindow === id}
                        onFocus={() => focusWindow(id)}                        onToggleMaximize={() => {
                            focusWindow(id);
                            toggleMaximize(id);
                        }}

                        onClose={() => {
                            if (maximizedWindow === id) {
                                setMaximizedWindow(null);
                            }

                            closeApp(id);
                        }}
                    >
                        <Component
                            openApp={openApp}
                            closeApp={closeApp}
                            focusWindow={focusWindow}
                            windowId={id}
                        />
                    </Window>
                );
            })}
        </>
    );
}