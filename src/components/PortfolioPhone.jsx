import { useState, useEffect, useRef } from "react";
import avatarImg from "../assets/profile.png";
import {
  FaGithub, FaLinkedin, FaInstagram, FaEnvelope,
  FaBrain, FaRobot, FaShieldAlt, FaLaptopCode,
  FaLinux, FaCode, FaPalette, FaRunning, FaFilm,
  FaMapMarkerAlt, FaUniversity, FaExternalLinkAlt,
  FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { GiSpiderWeb, GiVolleyballBall } from "react-icons/gi";
import { HiDocumentArrowDown } from "react-icons/hi2";

/* ─── DATA ───────────────────────────────────────────────── */
const ROLES = [
  "AI / ML ENGINEER", "FULL STACK DEVELOPER", "SOFTWARE ENGINEER",
  "COMPETITIVE PROGRAMMER", "REACT DEVELOPER", "CYBERSECURITY ENTHUSIAST",
  "FRIENDLY NEIGHBORHOOD DEVELOPER", "INNOVATOR",
];

const SOCIALS = [
  { name: "GitHub",    icon: FaGithub,           href: "https://github.com/AyushSabale2013",                                               col: "#e2e8f0" },
  { name: "LinkedIn",  icon: FaLinkedin,          href: "https://www.linkedin.com/in/ayush-sabale-763908369",                               col: "#60a5fa" },
  { name: "LeetCode",  icon: SiLeetcode,          href: "https://leetcode.com/u/AYUSH_SABALE_2282/",                                        col: "#fbbf24" },
  { name: "Instagram", icon: FaInstagram,         href: "https://www.instagram.com/ayush__sabale/",                                         col: "#f472b6" },
  { name: "Gmail",     icon: FaEnvelope,          href: "mailto:ayushsabale2013@gmail.com",                                                 col: "#f87171" },
  { name: "Resume",    icon: HiDocumentArrowDown, href: "/Resume.pdf",                                                                      col: "#34d399" },
];

const SKILLS = {
  "Languages":  ["C++", "Python", "JavaScript"],
  "Frontend":   ["React", "HTML", "CSS", "Tailwind"],
  "Backend":    ["Node.js", "Express.js"],
  "Databases":  ["MongoDB", "MySQL"],
  "AI / ML":    ["Scikit-Learn", "TensorFlow", "Pandas", "NumPy"],
  "Tools":      ["Git", "Linux", "VS Code", "Docker"],
};

const SKILL_COLORS = ["#fbbf24","#60a5fa","#f472b6","#34d399","#a78bfa","#fb923c"];

const PROJECTS = [
  { id:1, title:"Spider OS Portfolio", tag:"WEB DEV",
    desc:"Interactive desktop-inspired portfolio built with React and Framer Motion.",
    tech:["React","Framer Motion","JavaScript","CSS"],
    live:"https://portfolio-five-rosy-095v6w6jha.vercel.app/",
    github:"https://github.com/AyushSabale2013/Portfolio", accent:"#fbbf24" },
  { id:2, title:"Track Academy", tag:"FULL STACK",
    desc:"Complete coaching institute management platform with student and teacher dashboards.",
    tech:["React","Node.js","Express","MongoDB"],
    live:"https://www.iiitp.ac.in/",
    github:"https://github.com/AyushSabale2013/track", accent:"#60a5fa" },
  { id:3, title:"Solar Flare Prediction", tag:"AI / ML",
    desc:"ISRO Hackathon project forecasting solar flares using SoLEXS and HEL1OS data from Aditya-L1.",
    tech:["Python","XGBoost","TensorFlow","React"],
    live:"https://www.iiitp.ac.in/",
    github:"https://github.com/AyushSabale2013", accent:"#fb923c" },
  { id:4, title:"CamPass", tag:"WEB DEV",
    desc:"Smart campus access system with QR-based entry, GPS verification, and role-based auth.",
    tech:["React","Node.js","MongoDB","Socket.io","GPS"],
    live:"https://cam-pass-pi.vercel.app/gate/main-gate",
    github:"https://github.com/AyushSabale2013/CamPass", accent:"#34d399" },
];

const INTERESTS = [
  { icon: FaBrain,          title: "Artificial Intelligence",  desc: "Building intelligent systems that solve real-world problems.", col:"#fbbf24" },
  { icon: FaRobot,          title: "Machine Learning",         desc: "Training models and exploring modern AI techniques.",         col:"#60a5fa" },
  { icon: FaShieldAlt,      title: "Cyber Security",           desc: "Ethical hacking and secure software design.",               col:"#f472b6" },
  { icon: FaLaptopCode,     title: "Full Stack Dev",           desc: "Creating modern, scalable web applications.",                col:"#34d399" },
  { icon: FaLinux,          title: "Linux",                    desc: "Customizing systems and terminal environments.",             col:"#a78bfa" },
  { icon: FaCode,           title: "Competitive Prog.",        desc: "Solving algorithmic problems and sharpening skills.",        col:"#fb923c" },
  { icon: FaPalette,        title: "UI / UX Design",           desc: "Designing clean, interactive user-friendly interfaces.",    col:"#f43f5e" },
  { icon: FaRunning,        title: "Athletics",                desc: "Sports, fitness, and an active lifestyle.",                  col:"#fbbf24" },
  { icon: GiVolleyballBall, title: "Volleyball",               desc: "College volleyball player and main spiker.",                 col:"#60a5fa" },
  { icon: FaFilm,           title: "Movies & Cinema",          desc: "Storytelling, cinematography and memorable films.",         col:"#34d399" },
];

const NAV = [
  { id:"hero",      label:"HOME",    icon: GiSpiderWeb   },
  { id:"about",     label:"ABOUT",   icon: FaBrain       },
  { id:"skills",    label:"SKILLS",  icon: FaCode        },
  { id:"projects",  label:"WORK",    icon: FaLaptopCode  },
  { id:"education", label:"EDU",     icon: FaUniversity  },
  { id:"interests", label:"VIBES",   icon: FaFilm        },
  { id:"contact",   label:"CONTACT", icon: FaEnvelope    },
];

const COURSES = [
  "Data Structures & Algorithms","OOP","Discrete Mathematics","DBMS",
  "Operating Systems","Computer Networks","Computer Architecture",
  "Compiler Design","Design & Analysis of Algorithms","Theory of Computation",
  "Software Engineering","Artificial Intelligence","Machine Learning",
  "Probability & Statistics","Linear Algebra",
];

/* ─── CSS ─────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:ital,wght@0,400;0,700;1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --yellow: #fbbf24;
  --yellow-dark: #d97706;
  --blue:   #3b82f6;
  --dark:   #0d0d1a;
  --panel:  #13132a;
  --ink:    #0d0d1a;
  --cream:  #fff9ed;
  --bdr:    3px solid #0d0d1a;
}

.pf-root {
  font-family: 'Comic Neue', cursive;
  background: var(--dark);
  color: var(--cream);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  padding-bottom: 80px;
}

/* halftone dots */
.pf-dots {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(251,191,36,0.14) 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  animation: dotDrift 10s ease-in-out infinite alternate;
}
@keyframes dotDrift {
  from { background-position: 0 0; }
  to   { background-position: 11px 11px; }
}

/* spiderweb corner */
.pf-web {
  position: fixed; top: -20px; right: -20px; z-index: 0;
  pointer-events: none; opacity: 0.09;
  animation: webBreathe 7s ease-in-out infinite alternate;
}
@keyframes webBreathe {
  from { transform: scale(1) rotate(-3deg); }
  to   { transform: scale(1.05) rotate(3deg); }
}

/* ── HERO ── */
.pf-hero {
  position: relative; z-index: 2;
  background: linear-gradient(145deg, #1a1a35 0%, #0d0d1a 100%);
  border: var(--bdr);
  border-radius: 6px;
  margin: 14px 14px 0;
  padding: 32px 20px 26px;
  box-shadow: 6px 6px 0 var(--yellow);
  text-align: center;
  overflow: hidden;
  animation: heroSlide 0.7s cubic-bezier(.22,1,.36,1) both;
}
@keyframes heroSlide {
  from { opacity: 0; transform: translateY(-50px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}

.pf-hero-glow {
  position: absolute; top: -60px; left: 50%;
  transform: translateX(-50%);
  width: 260px; height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%);
  pointer-events: none;
}

.pf-avatar-wrap {
  position: relative; display: inline-block;
  margin-bottom: 18px;
}
.pf-avatar {
  width: 110px; height: 110px; border-radius: 50%;
  border: 4px solid var(--yellow);
  box-shadow: 0 0 0 3px var(--ink), 5px 5px 0 var(--ink);
  object-fit: cover;
  animation: avatarPop 0.8s cubic-bezier(.34,1.56,.64,1) 0.25s both;
}
@keyframes avatarPop {
  from { transform: scale(0) rotate(-18deg); opacity: 0; }
  to   { transform: scale(1) rotate(0); opacity: 1; }
}
.pf-web-badge {
  position: absolute; bottom: -2px; right: -2px;
  background: var(--yellow); color: var(--ink);
  border: 2.5px solid var(--ink); border-radius: 50%;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  animation: spinSlow 8s linear infinite;
}
@keyframes spinSlow { to { transform: rotate(360deg); } }

.pf-name {
  font-family: 'Bangers', cursive;
  font-size: 3rem; letter-spacing: 4px;
  color: var(--yellow);
  text-shadow: 3px 3px 0 var(--ink), -1px -1px 0 var(--ink);
  line-height: 1; margin-bottom: 6px;
}
.pf-loc {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 0.9rem; color: #94a3b8; margin-bottom: 8px;
}
.pf-college-badge {
  display: inline-block;
  background: var(--yellow); color: var(--ink);
  font-family: 'Bangers', cursive; font-size: 0.85rem; letter-spacing: 1.5px;
  padding: 3px 14px; border: 2.5px solid var(--ink); border-radius: 3px;
  box-shadow: 2px 2px 0 var(--ink);
  margin-bottom: 16px;
}

/* role ticker */
.pf-ticker-wrap {
  background: rgba(251,191,36,0.1);
  border: 2px solid var(--yellow);
  border-radius: 3px; padding: 8px 14px;
  display: flex; align-items: center; justify-content: center;
  min-height: 42px;
}
.pf-ticker {
  font-family: 'Bangers', cursive;
  font-size: 1.05rem; letter-spacing: 2.5px;
  color: var(--yellow);
  animation: tickUp 0.4s cubic-bezier(.22,1,.36,1);
}
@keyframes tickUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}

/* ── speech bubble ── */
.pf-bubble-wrap { position: relative; z-index: 2; margin: 16px 14px 0; }
.pf-bubble {
  background: var(--cream); color: var(--ink);
  border: var(--bdr); border-radius: 10px;
  padding: 10px 16px;
  font-family: 'Bangers', cursive;
  font-size: 1.15rem; letter-spacing: 1.5px;
  text-align: center;
  box-shadow: 4px 4px 0 var(--yellow);
  position: relative;
}
.pf-bubble::after {
  content: '';
  position: absolute; top: -14px; left: 28px;
  border: 11px solid transparent;
  border-bottom-color: var(--ink);
}
.pf-bubble::before {
  content: '';
  position: absolute; top: -10px; left: 30px;
  border: 9px solid transparent;
  border-bottom-color: var(--cream);
  z-index: 1;
}
.pf-bubble span { color: var(--yellow-dark); }

/* ── SECTION ── */
.pf-section {
  position: relative; z-index: 2;
  border: var(--bdr); border-radius: 6px;
  margin: 14px;
  background: var(--cream); color: var(--ink);
  overflow: hidden;
  box-shadow: 5px 5px 0 var(--yellow);
}

.pf-sec-hdr {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  border-bottom: var(--bdr);
  font-family: 'Bangers', cursive;
  font-size: 1.25rem; letter-spacing: 2.5px;
  color: var(--cream);
}

/* ── socials ── */
.pf-socials {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 10px; padding: 14px;
}
.pf-soc-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 6px;
  border: 2.5px solid var(--ink); border-radius: 5px;
  text-decoration: none;
  background: var(--cream); color: var(--ink);
  font-family: 'Bangers', cursive; font-size: 0.82rem; letter-spacing: 1.5px;
  box-shadow: 3px 3px 0 var(--ink);
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative; overflow: hidden;
}
.pf-soc-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--ink); }
.pf-soc-icon { font-size: 1.6rem; }

/* ── about ── */
.pf-about-body { padding: 16px; }
.pf-about-text {
  font-size: 1rem; line-height: 1.7; color: #1e1e3a; margin-bottom: 14px;
}
.pf-goal-box {
  border: 2.5px solid var(--ink); border-radius: 4px;
  padding: 10px 14px;
  font-family: 'Bangers', cursive; font-size: 1rem; letter-spacing: 1px;
  color: var(--cream);
  box-shadow: 3px 3px 0 var(--ink);
  margin-bottom: 10px;
}
.pf-focus-text {
  font-size: 0.95rem; line-height: 1.65; color: #333;
}

/* ── skills ── */
.pf-skills-body { padding: 14px; }
.pf-skill-cat { margin-bottom: 16px; }
.pf-skill-cat-label {
  font-family: 'Bangers', cursive; font-size: 1rem; letter-spacing: 2px;
  margin-bottom: 7px;
}
.pf-skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.pf-skill-tag {
  font-size: 0.88rem; font-weight: 700;
  border: 2px solid var(--ink); border-radius: 3px;
  padding: 4px 10px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.25);
  color: var(--ink);
}

/* ── projects ── */
.pf-projects { padding: 14px; display: flex; flex-direction: column; gap: 16px; }
.pf-proj-card {
  border: var(--bdr); border-radius: 5px;
  background: #fff; overflow: hidden;
  box-shadow: 4px 4px 0 var(--ink);
  transition: transform 0.2s;
}
.pf-proj-card:active { transform: scale(0.98); }
.pf-proj-top {
  padding: 10px 14px 6px;
  display: flex; justify-content: space-between; align-items: center;
}
.pf-proj-tag {
  font-family: 'Bangers', cursive; font-size: 0.82rem; letter-spacing: 2px;
  color: var(--ink); padding: 3px 10px;
  border: 2px solid var(--ink); border-radius: 3px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.18);
}
.pf-proj-num { font-size: 0.8rem; color: #999; font-weight: 700; }
.pf-proj-title {
  font-family: 'Bangers', cursive; font-size: 1.35rem; letter-spacing: 1.5px;
  color: var(--ink); padding: 4px 14px 4px;
}
.pf-proj-desc { font-size: 0.92rem; line-height: 1.6; color: #333; padding: 0 14px 10px; }
.pf-proj-tech { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 14px 12px; }
.pf-proj-tech span {
  font-size: 0.78rem; font-weight: 700; background: #f0f0f0;
  border: 1.5px solid #ccc; border-radius: 3px; padding: 2px 8px; color: #333;
}
.pf-proj-links {
  display: flex; border-top: var(--bdr);
}
.pf-proj-link {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px;
  text-decoration: none; color: var(--ink);
  font-family: 'Bangers', cursive; font-size: 0.9rem; letter-spacing: 1.5px;
  transition: background 0.15s;
}
.pf-proj-link:first-child { border-right: var(--bdr); }
.pf-proj-link:active { background: var(--yellow); }

/* ── education ── */
.pf-edu-body { padding: 16px; }
.pf-edu-degree {
  font-family: 'Bangers', cursive; font-size: 1.7rem; letter-spacing: 2px;
  margin-bottom: 2px;
}
.pf-edu-branch { font-size: 1rem; font-weight: 700; margin-bottom: 10px; color: #333; }
.pf-edu-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.92rem; color: #444; margin-bottom: 6px;
}
.pf-edu-chip {
  display: inline-block;
  font-family: 'Bangers', cursive; font-size: 0.82rem; letter-spacing: 1px;
  padding: 3px 10px; border: 2px solid var(--ink); border-radius: 3px;
  box-shadow: 2px 2px 0 var(--ink);
  margin: 6px 5px 4px 0; color: var(--ink);
}
.pf-courses-btn {
  margin-top: 12px; width: 100%;
  background: none; border: 2.5px solid var(--ink);
  border-radius: 4px; padding: 7px 14px;
  font-family: 'Bangers', cursive; font-size: 0.9rem; letter-spacing: 1.5px;
  cursor: pointer; color: var(--ink);
  display: flex; align-items: center; gap: 6px;
  transition: background 0.15s;
}
.pf-courses-btn:active { background: #f5f5f5; }
.pf-courses-grid {
  max-height: 0; overflow: hidden;
  transition: max-height 0.4s ease;
  display: flex; flex-wrap: wrap; gap: 5px;
  margin-top: 0;
}
.pf-courses-grid.open { max-height: 600px; margin-top: 10px; }
.pf-course-chip {
  font-size: 0.8rem; font-weight: 700;
  background: var(--dark); color: var(--cream);
  border: 1.5px solid #333; border-radius: 3px; padding: 3px 9px;
}

/* ── interests ── */
.pf-interests-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 14px;
}
.pf-int-card {
  border: 2.5px solid var(--ink); border-radius: 5px;
  background: #fff; padding: 12px 10px;
  box-shadow: 3px 3px 0 var(--ink);
  display: flex; flex-direction: column; gap: 5px;
}
.pf-int-icon { font-size: 1.5rem; }
.pf-int-title { font-family: 'Bangers', cursive; font-size: 0.95rem; letter-spacing: 1px; color: var(--ink); }
.pf-int-desc { font-size: 0.8rem; color: #555; line-height: 1.45; }

/* ── contact ── */
.pf-contact-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.pf-contact-row {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 2.5px solid var(--ink);
  border-radius: 4px; padding: 12px 14px;
  box-shadow: 3px 3px 0 var(--ink);
  text-decoration: none; color: var(--ink);
}
.pf-contact-icon { font-size: 1.25rem; flex-shrink: 0; }
.pf-contact-label {
  font-family: 'Bangers', cursive; font-size: 0.75rem;
  letter-spacing: 1.5px; color: #888; display: block; margin-bottom: 2px;
}
.pf-contact-val { font-size: 0.9rem; font-weight: 700; word-break: break-all; }

/* ── bottom nav ── */
.pf-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  background: var(--ink);
  border-top: 3px solid var(--yellow);
  display: flex; padding: 0 4px 2px;
}
.pf-nav-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 2px 5px;
  background: none; border: none; cursor: pointer;
  color: #555;
  font-family: 'Bangers', cursive; font-size: 0.6rem; letter-spacing: 0.8px;
  transition: color 0.15s, transform 0.15s;
}
.pf-nav-btn.active { color: var(--yellow); }
.pf-nav-btn:active { transform: scale(0.88); }
.pf-nav-btn svg { font-size: 1.15rem; }

/* ── footer ── */
.pf-footer {
  position: relative; z-index: 2;
  text-align: center; padding: 16px 14px 10px;
  font-family: 'Bangers', cursive;
  font-size: 0.95rem; letter-spacing: 2px;
  color: #3d3d5c;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

/* ─── COMPONENT ───────────────────────────────────────────── */
export default function PortfolioPhone() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleKey, setRoleKey] = useState(0);
  const [activeNav, setActiveNav] = useState("hero");
  const [coursesOpen, setCoursesOpen] = useState(false);
  const sectionRefs = useRef({});

  /* Role rotator */
  useEffect(() => {
    const t = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length);
      setRoleKey(k => k + 1);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  /* Scroll spy */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }),
      { threshold: 0.3 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = id => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const ref = id => el => { sectionRefs.current[id] = el; };

  const HDR_COLORS = {
    hero:"#fbbf24", socials:"#3b82f6", about:"#a78bfa",
    skills:"#34d399", projects:"#fb923c", education:"#60a5fa",
    interests:"#f472b6", contact:"#fbbf24",
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-root">
        <div className="pf-dots" />

        {/* spider web corner */}
        <svg className="pf-web" width="220" height="320" viewBox="0 0 220 320">
          {[25,55,85,115,145,175,210,245,280].map((r,i) => (
            <ellipse key={i} cx="0" cy="0" rx={r} ry={r*0.52} fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
          ))}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => {
            const a = deg * Math.PI / 180;
            return <line key={i} x1="0" y1="0" x2={Math.cos(a)*300} y2={Math.sin(a)*300}
              stroke="#fbbf24" strokeWidth="0.8"/>;
          })}
        </svg>

        {/* ── HERO ── */}
        <div id="hero" ref={ref("hero")} className="pf-hero">
          <div className="pf-hero-glow"/>
          <div className="pf-avatar-wrap">
            <img src={avatarImg} alt="Ayush Sabale" className="pf-avatar"/>
            <div className="pf-web-badge"><GiSpiderWeb/></div>
          </div>
          <div className="pf-name">AYUSH SABALE</div>
          <div className="pf-loc"><FaMapMarkerAlt size={13}/> Kolhapur, Maharashtra</div>
          <div className="pf-college-badge">IIIT PUNE · B.TECH CSE · 2024–28</div>
          <div className="pf-ticker-wrap">
            <span className="pf-ticker" key={roleKey}>{ROLES[roleIdx]}</span>
          </div>
        </div>

        {/* ── SPEECH BUBBLE ── */}
        <div className="pf-bubble-wrap">
          <div className="pf-bubble">
            <span>Hey ...!</span> With great code, comes great responsibility 🕸️
          </div>
        </div>

        {/* ── SOCIALS ── */}
        <div className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.socials}}>
            <GiSpiderWeb/> FIND ME ON THE WEB
          </div>
          <div className="pf-socials">
            {SOCIALS.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer"
                className="pf-soc-btn"
                style={{ boxShadow: `3px 3px 0 ${s.col}`, borderColor: "#0d0d1a" }}>
                <s.icon className="pf-soc-icon" style={{color: s.col}}/>
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <div id="about" ref={ref("about")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.about}}>
            <FaBrain/> ORIGIN STORY
          </div>
          <div className="pf-about-body">
            <div className="pf-about-text">
              I'm a Computer Science student at <strong>IIIT Pune</strong> passionate about
              Artificial Intelligence, Machine Learning, and Full Stack Development. I enjoy
              solving challenging problems and building modern web applications.
            </div>
            <div className="pf-goal-box" style={{background:"#a78bfa"}}>
              🎯 GOAL: Build AI products used by millions of people.
            </div>
            <div className="pf-focus-text">
              Currently focusing on <strong>DSA</strong>, <strong>Machine Learning</strong>,{" "}
              <strong>System Design</strong>, and <strong>Full Stack Development</strong>.
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div id="skills" ref={ref("skills")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.skills, color:"#0d0d1a"}}>
            <FaCode/> SUPERPOWERS
          </div>
          <div className="pf-skills-body">
            {Object.entries(SKILLS).map(([cat, tags], ci) => (
              <div key={cat} className="pf-skill-cat">
                <div className="pf-skill-cat-label" style={{color: SKILL_COLORS[ci % SKILL_COLORS.length]}}>
                  {cat}
                </div>
                <div className="pf-skill-tags">
                  {tags.map(t => (
                    <span key={t} className="pf-skill-tag"
                      style={{
                        background: SKILL_COLORS[ci % SKILL_COLORS.length] + "22",
                        borderColor: SKILL_COLORS[ci % SKILL_COLORS.length],
                        color: "#0d0d1a"
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div id="projects" ref={ref("projects")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.projects}}>
            <FaLaptopCode/> MISSION LOG
          </div>
          <div className="pf-projects">
            {PROJECTS.map(p => (
              <div key={p.id} className="pf-proj-card">
                <div className="pf-proj-top">
                  <span className="pf-proj-tag" style={{background: p.accent + "33", borderColor: p.accent}}>
                    {p.tag}
                  </span>
                  <span className="pf-proj-num">#{String(p.id).padStart(2,"0")}</span>
                </div>
                <div className="pf-proj-title" style={{color: p.accent}}>{p.title}</div>
                <div className="pf-proj-desc">{p.desc}</div>
                <div className="pf-proj-tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div>
                <div className="pf-proj-links">
                  <a href={p.live} target="_blank" rel="noreferrer" className="pf-proj-link">
                    <FaExternalLinkAlt size={12}/> LIVE
                  </a>
                  <a href={p.github} target="_blank" rel="noreferrer" className="pf-proj-link">
                    <FaGithub size={12}/> CODE
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EDUCATION ── */}
        <div id="education" ref={ref("education")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.education}}>
            <FaUniversity/> TRAINING ARC
          </div>
          <div className="pf-edu-body">
            <div className="pf-edu-degree" style={{color:"#1e40af"}}>B.TECH CSE</div>
            <div className="pf-edu-branch">Computer Science & Engineering</div>
            <div className="pf-edu-row"><FaUniversity size={14}/> IIIT Pune, Maharashtra</div>
            <div className="pf-edu-row"><FaMapMarkerAlt size={14}/> Pune, Maharashtra</div>
            <div>
              {[{label:"2024–2028",col:"#fbbf24"},{label:"Ongoing",col:"#34d399"},{label:"Sem 5",col:"#60a5fa"}].map(c =>
                <span key={c.label} className="pf-edu-chip" style={{background: c.col + "44", borderColor: c.col}}>{c.label}</span>
              )}
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontFamily:"'Bangers',cursive",fontSize:"0.92rem",letterSpacing:2,color:"#666",marginBottom:6}}>
                CURRENT FOCUS
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {["Artificial Intelligence","Machine Learning","Full Stack Dev","Deep Neural Architectures"].map(f =>
                  <span key={f} style={{fontSize:"0.82rem",background:"#fbbf2422",color:"#0d0d1a",
                    border:"2px solid #fbbf24",borderRadius:3,padding:"3px 9px",fontWeight:700}}>{f}</span>
                )}
              </div>
            </div>
            <button className="pf-courses-btn" onClick={() => setCoursesOpen(o => !o)}>
              {coursesOpen ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
              {coursesOpen ? "HIDE" : "VIEW"} COMPLETED SUBJECTS ({COURSES.length})
            </button>
            <div className={`pf-courses-grid${coursesOpen ? " open" : ""}`}>
              {COURSES.map(c => <span key={c} className="pf-course-chip">{c}</span>)}
            </div>
          </div>
        </div>

        {/* ── INTERESTS ── */}
        <div id="interests" ref={ref("interests")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.interests}}>
            <FaFilm/> MULTIVERSE OF INTERESTS
          </div>
          <div className="pf-interests-grid">
            {INTERESTS.map(it => (
              <div key={it.title} className="pf-int-card">
                <div className="pf-int-icon" style={{color: it.col}}><it.icon/></div>
                <div className="pf-int-title">{it.title}</div>
                <div className="pf-int-desc">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div id="contact" ref={ref("contact")} className="pf-section">
          <div className="pf-sec-hdr" style={{background: HDR_COLORS.contact, color:"#0d0d1a"}}>
            <FaEnvelope/> SEND A SIGNAL
          </div>
          <div className="pf-contact-body">
            <a href="mailto:ayushsabale2013@gmail.com" className="pf-contact-row">
              <FaEnvelope className="pf-contact-icon" style={{color:"#f87171"}}/>
              <div>
                <span className="pf-contact-label">GMAIL</span>
                <span className="pf-contact-val">ayushsabale2013@gmail.com</span>
              </div>
            </a>
            <div className="pf-contact-row">
              <FaMapMarkerAlt className="pf-contact-icon" style={{color:"#34d399"}}/>
              <div>
                <span className="pf-contact-label">LOCATION</span>
                <span className="pf-contact-val">Kolhapur, Maharashtra, India</span>
              </div>
            </div>
            <div className="pf-contact-row">
              <FaUniversity className="pf-contact-icon" style={{color:"#60a5fa"}}/>
              <div>
                <span className="pf-contact-label">COLLEGE</span>
                <span className="pf-contact-val">Indian Institute of Information Technology Pune</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pf-footer">
          MADE WITH <span style={{color:"#fbbf24"}}>❤</span> BY AYUSH SABALE<br/>
          <span style={{fontSize:"0.82rem",letterSpacing:1,color:"#4a4a6a"}}>
            "Your friendly neighbourhood developer"
          </span>
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav className="pf-nav">
          {NAV.map(n => (
            <button key={n.id}
              className={`pf-nav-btn${activeNav === n.id ? " active" : ""}`}
              onClick={() => scrollTo(n.id)}>
              <n.icon/>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}