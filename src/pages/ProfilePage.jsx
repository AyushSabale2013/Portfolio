// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProfilePage.css";

// components
import ParticleText from "../components/ParticleText";

// data
import { profile } from "../data/profile";

/* ------------------------------------------------------
   DERIVED DATA
   Accent hexes below are the biscuit (rich brown + gold)
   grading — same six slots as before, just recolored so
   every module/nav dot stays in the brown/gold family
   instead of the old rainbow spread.
------------------------------------------------------ */
const SKILL_MODULES = [
    { id: "01", label: "Languages", accent: "var(--sv-cyan, #CAA15A)", skills: profile.skills.languages },
    { id: "02", label: "Frontend", accent: "var(--sv-blue, #6B4226)", skills: profile.skills.frontend },
    { id: "03", label: "Backend", accent: "var(--sv-red, #4A2C1A)", skills: profile.skills.backend },
    { id: "04", label: "Databases", accent: "var(--sv-purple, #3E2415)", skills: profile.skills.databases },
    { id: "05", label: "AI / ML", accent: "var(--sv-pink, #A97C34)", skills: profile.skills.ai },
    { id: "06", label: "Tools", accent: "var(--sv-yellow, #D9A941)", skills: profile.skills.tools },
];

// Sidebar / scroll-spy nav — mirrors the section ids below
const NAV_ITEMS = [
    { id: "overview", index: "01", label: "Overview", accent: "#CAA15A" },
    { id: "skill-matrix", index: "02", label: "Skills", accent: "#6B4226" },
    { id: "about", index: "03", label: "About", accent: "#4A2C1A" },
    { id: "education", index: "04", label: "Education", accent: "#A97C34" },
    { id: "interests", index: "05", label: "Interests", accent: "#D9A941" },
    { id: "channels", index: "06", label: "Channels", accent: "#3E2415" },
];

/* ------------------------------------------------------
   ANIMATION VARIANTS
------------------------------------------------------ */
const webVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
        pathLength: 1,
        opacity: 0.6,
        transition: { pathLength: { duration: 1.8, ease: "easeInOut", delay: i * 0.1 }, opacity: { duration: 0.2 } }
    })
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUpItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
};

export default function ProfilePage({ onClose }) {
    const [roleIndex, setRoleIndex] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
    const [isMobile, setIsMobile] = useState(false);

    // Detect phone-sized viewports so we can skip the particle
    // animation there — it's canvas-heavy and not worth the
    // battery/perf cost on small screens.
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        setIsMobile(mql.matches);
        const handleChange = (e) => setIsMobile(e.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    // Rotate through roles
    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % profile.roles.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Scroll-spy: highlight the sidebar item for whichever section is in view
    useEffect(() => {
        const scrollRoot = document.querySelector(".profile-scroll");
        if (!scrollRoot) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { root: scrollRoot, threshold: 0.25, rootMargin: "-15% 0px -55% 0px" }
        );

        NAV_ITEMS.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const triggerGlitch = () => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 350); // Snappier glitch
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.05, filter: "blur(12px) contrast(1.2)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) contrast(1)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px) contrast(1.2)", y: 20 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className={`profile-page ${glitchActive ? "sv-multiverse-glitch" : ""}`}
        >
            {/* Ambient background layers */}
            <div className="profile-halftone" aria-hidden="true" />
            <div className="profile-chromatic-edge" aria-hidden="true" />

            {/* Dynamic Animated Spider Webs (Top Left) */}
            <svg className="profile-web-corner" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {[0, 18, 36, 54, 72, 90].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <motion.line
                            key={`line-${i}`} x1="0" y1="0" x2={Math.cos(rad) * 220} y2={Math.sin(rad) * 220}
                            stroke="currentColor" strokeWidth="1.5"
                            custom={i} variants={webVariants} initial="hidden" animate="visible"
                        />
                    );
                })}
                {[40, 80, 120, 160].map((r, i) => (
                    <motion.path
                        key={`arc-${i}`} d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"
                        custom={i + 4} variants={webVariants} initial="hidden" animate="visible"
                    />
                ))}
            </svg>

            {/* Dynamic Animated Spider Webs (Bottom Right) */}
            <svg className="profile-web-corner profile-web-corner--br" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {[0, 18, 36, 54, 72, 90].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <motion.line
                            key={`br-line-${i}`} x1="0" y1="0" x2={Math.cos(rad) * 220} y2={Math.sin(rad) * 220}
                            stroke="currentColor" strokeWidth="1.5"
                            custom={i} variants={webVariants} initial="hidden" animate="visible"
                        />
                    );
                })}
                {[40, 80, 120, 160].map((r, i) => (
                    <motion.path
                        key={`br-arc-${i}`} d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
                        fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"
                        custom={i + 4} variants={webVariants} initial="hidden" animate="visible"
                    />
                ))}
            </svg>

            {/* Header */}
            <header className="profile-header">
                <motion.button 
                    whileHover={{ scale: 1.05, x: -5 }} 
                    whileTap={{ scale: 0.95 }}
                    className="profile-header-back" 
                    onClick={() => { triggerGlitch(); onClose(); }}
                >
                    <span className="profile-header-back-arrow">←</span>
                    <span className="sv-glitch-text" data-text="SPIDER DESKTOP">SPIDER DESKTOP</span>
                </motion.button>

                <h1 className="profile-header-title" data-text="PROFILE">
                    PROFILE
                </h1>

                <div className="profile-header-spacer" aria-hidden="true" />
            </header>

            {/* Shell */}
            <div className="profile-shell">
                {/* Sidebar — biscuit gradient web-thread + scroll-spy nav */}
                <aside className="profile-sidebar" aria-label="Section navigation">
                    <nav className="sv-side-nav">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`sv-side-link ${activeSection === item.id ? "is-active" : ""}`}
                                style={{ "--nav-accent": item.accent }}
                                onClick={() => scrollToSection(item.id)}
                                aria-current={activeSection === item.id ? "true" : undefined}
                            >
                                <span className="sv-side-dot" aria-hidden="true" />
                                <span className="sv-side-index">{item.index}</span>
                                <span className="sv-side-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="profile-scroll">
                    {/* ============ OVERVIEW ============ */}
                    <section id="overview" className="sv-section sv-section--hero" />


                    {/* Full-bleed hero title — particle animation on desktop/tablet,
                        a plain static heading on phones (lighter and just as legible) */}
                    <div className="sv-fullbleed sv-hero-particle">
                        {isMobile ? (
                            <h1 className="sv-hero-name-static">{profile.basic.name}</h1>
                        ) : (
                            <ParticleText
                                text={profile.basic.name}
                                particleSize={2.2} density={4}
                                color="#241209" highlightColor="#CAA15A" // very dark brown ink text, gold glow
                                scatter={190} gatherDuration={1600} stagger={420}
                                pointerRepel={60} repelRadius={150} idleDrift={0.8}
                                trigger="mount" fontSize="clamp(3.5rem, 13vw, 9.5rem)"
                                fontWeight={900} fontFamily="inherit" glow
                            />
                        )}
                    </div>

                    <section className="sv-section sv-section--hero">
                        <div className="sv-hero-role-wrap">
                            <span className="sv-hero-role-bracket" style={{ color: '#3E2415' }}>[</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={profile.roles[roleIndex]}
                                    className="sv-hero-role"
                                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, y: -20, rotateX: -90 }}
                                    transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                                >
                                    {profile.roles[roleIndex]}
                                </motion.span>
                            </AnimatePresence>
                            <span className="sv-hero-role-bracket" style={{ color: '#3E2415' }}>]</span>
                        </div>

                        <motion.div 
                            className="sv-id-strip sv-comic-panel-border"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, type: "spring" }}
                        >
                            <div className="sv-avatar-container">
                                <motion.img 
                                    className="sv-avatar" 
                                    src={profile.basic.avatar} 
                                    alt={profile.basic.name} 
                                    whileHover={{ scale: 1.06, rotate: -2 }}
                                />
                                <span className="sv-avatar-badge">Hey....!</span>
                            </div>
                            <div className="sv-id-fields">
                                <div className="sv-id-field">
                                    <span className="sv-id-label">Base of Operations</span>
                                    <span className="sv-id-value">{profile.basic.location}</span>
                                </div>
                                <div className="sv-id-divider" aria-hidden="true" />
                                <div className="sv-id-field">
                                    <span className="sv-id-label">College</span>
                                    <span className="sv-id-value">{profile.basic.college}</span>
                                </div>
                                <div className="sv-id-divider" aria-hidden="true" />
                                <div className="sv-id-field">
                                    <span className="sv-id-label">Designation / Batch</span>
                                    <span className="sv-id-value">{profile.basic.degree} · {profile.basic.batch}</span>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <div className="sv-web-divider" aria-hidden="true" />

                    {/* ============ SKILL MATRIX ============ */}
                    <section id="skill-matrix" className="sv-section">
                        <h2 className="sv-section-title" data-index="02">Skill Matrix</h2>
                        <p className="sv-section-sub">Skills sharpened and stacked up over time.</p>

                        <motion.div 
                            className="sv-skill-grid"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {SKILL_MODULES.map((mod) => (
                                <motion.div
                                    key={mod.id}
                                    variants={fadeUpItem}
                                    className="sv-skill-card sv-comic-panel-border"
                                    style={{ "--card-accent": mod.accent }}
                                    whileHover={{ scale: 1.03, y: -6 }}
                                >
                                    <div className="sv-skill-card-head">
                                        <span className="sv-skill-id">{mod.id}</span>
                                        <span className="sv-skill-label">{mod.label}</span>
                                    </div>
                                    <ul className="sv-skill-tags">
                                        {mod.skills.map((skill) => (
                                            <li key={skill} className="sv-skill-tag">{skill}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <div className="sv-web-divider" aria-hidden="true" />

                    {/* ============ ABOUT ============ */}
                    <section id="about" className="sv-section">
                        <h2 className="sv-section-title" data-index="03">{profile.about.title}</h2>
                        
                        <motion.div 
                            className="sv-comic-panel sv-comic-panel-border"
                            initial={{ opacity: 0, rotate: -2 }}
                            whileInView={{ opacity: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <div className="sv-comic-tab" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                AUDIO TRANSMISSION LOG // SECURE
                                {/* Animated Waveform representation */}
                                <div style={{ display: 'flex', gap: '2px', height: '12px', alignItems: 'flex-end' }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div 
                                            key={i} 
                                            style={{ width: '3px', background: 'currentColor', borderRadius: '2px' }}
                                            animate={{ height: ["4px", "12px", "4px"] }}
                                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="sv-comic-desc">{profile.about.description}</p>
                            <div className="sv-about-grid">
                                <div className="sv-about-item">
                                    <span className="sv-id-label">Core Objective</span>
                                    <p>{profile.about.goal}</p>
                                </div>
                                <div className="sv-about-item">
                                    <span className="sv-id-label">Active Focus</span>
                                    <p>{profile.about.focus}</p>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <div className="sv-web-divider" aria-hidden="true" />

                    {/* ============ EDUCATION ============ */}
                    <section id="education" className="sv-section">
                        <h2 className="sv-section-title" data-index="04">Education Records</h2>

                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {profile.education.map((edu) => (
                                <motion.div variants={fadeUpItem} className="sv-comic-panel sv-comic-panel-border" key={edu.college}>
                                    <span className="sv-comic-tab">ACADEMIC DOSSIER — VERIFIED</span>
                                    <div className="sv-id-strip sv-id-strip--flat">
                                        <div className="sv-id-fields">
                                            <div className="sv-id-field">
                                                <span className="sv-id-label">Degree</span>
                                                <span className="sv-id-value">{edu.degree}</span>
                                            </div>
                                            <div className="sv-id-divider" aria-hidden="true" />
                                            <div className="sv-id-field">
                                                <span className="sv-id-label">Branch</span>
                                                <span className="sv-id-value">{edu.branch}</span>
                                            </div>
                                            <div className="sv-id-divider" aria-hidden="true" />
                                            <div className="sv-id-field">
                                                <span className="sv-id-label">Timeline</span>
                                                <span className="sv-id-value">{edu.duration} · {edu.semester}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="sv-id-label sv-block-label">Focus Specialties</span>
                                    <ul className="sv-skill-tags">
                                        {edu.focus.map((f) => <li key={f} className="sv-skill-tag">{f}</li>)}
                                    </ul>

                                    <span className="sv-id-label sv-block-label">Core Modules Passed</span>
                                    <ul className="sv-skill-tags">
                                        {edu.subjectsCompleted.map((s) => (
                                            <li key={s} className="sv-skill-tag sv-skill-tag--muted">{s}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <div className="sv-web-divider" aria-hidden="true" />

                    {/* ============ INTERESTS ============ */}
                    <section id="interests" className="sv-section">
                        <h2 className="sv-section-title" data-index="05">Interests & Hobbies</h2>
                        <p className="sv-section-sub">Off-duty operational parameters.</p>

                        <motion.div 
                            className="sv-interest-grid"
                            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        >
                            {profile.interests.map((item) => (
                                <motion.div
                                    variants={fadeUpItem}
                                    className="sv-interest-card sv-comic-panel-border"
                                    key={item.title}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                >
                                    {/* Icon color now comes purely from .sv-interest-icon in CSS,
                                        which shares the same var as .sv-interest-title — that's
                                        what keeps icon + title color identical. */}
                                    <item.icon className="sv-interest-icon" />
                                    <span className="sv-interest-title">{item.title}</span>
                                    <p className="sv-interest-desc">{item.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <div className="sv-web-divider" aria-hidden="true" />

                    {/* ============ CHANNELS ============ */}
                    <section id="channels" className="sv-section sv-section--last">
                        <h2 className="sv-section-title" data-index="06">Direct Multiverse Channels</h2>
                        <p className="sv-section-sub">Shoot a web. Signal received instantaneously.</p>

                        <div className="sv-channel-grid">
                            {profile.socials.map((ch) => (
                                <motion.a
                                    key={ch.name}
                                    className="sv-channel-card sv-comic-panel-border"
                                    href={ch.link} target="_blank" rel="noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="sv-channel-top">
                                        <ch.icon className="sv-channel-icon" />
                                        <span className="sv-channel-label">{ch.name}</span>
                                    </div>
                                    <motion.span 
                                        className="sv-channel-arrow"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                    >→</motion.span>
                                </motion.a>
                            ))}
                        </div>

                        <motion.div 
                            className="sv-quicklinks sv-comic-panel-border"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="sv-quicklinks-title">Quick Links</span>
                            <div className="sv-quicklinks-grid">
                                {profile.contacts.map((c) => (
                                    c.link ? (
                                        <a
                                            className="sv-quicklink-row"
                                            key={c.type}
                                            href={c.link}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <span className="sv-id-label">{c.title}</span>
                                            <span className="sv-quicklink-value">{c.value}</span>
                                        </a>
                                    ) : (
                                        <div className="sv-quicklink-row" key={c.type}>
                                            <span className="sv-id-label">{c.title}</span>
                                            <span className="sv-quicklink-value">{c.value}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    </section>
                </main>
            </div>
        </motion.div>
    );
}