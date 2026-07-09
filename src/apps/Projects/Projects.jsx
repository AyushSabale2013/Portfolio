import { useState } from "react";

import ProjectsPage from "../../pages/ProjectsPage";

export default function Projects() {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <ProjectsPage
            onClose={() => setIsOpen(false)}
        />
    );
}