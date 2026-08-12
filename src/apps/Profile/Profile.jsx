// src/apps/Profile/Profile.jsx
import { useState } from "react";
import ProfilePage from "../../pages/ProfilePage";

export default function Profile() {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <ProfilePage
            onClose={() => setIsOpen(false)}
        />
    );
}