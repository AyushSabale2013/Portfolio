import { useEffect, useState } from "react";

import Landing from "./components/Landing";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import PortfolioPhone from "./components/PortfolioPhone";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [stage, setStage] = useState("landing");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    // Check initial device size
    setIsMobile(mediaQuery.matches);

    // Handle resizing
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // =========================
  // MOBILE VERSION
  // =========================
  if (isMobile) {
    return <PortfolioPhone />;
  }

  // =========================
  // PC VERSION
  // =========================
  if (stage === "landing") {
    return <Landing onEnter={() => setStage("boot")} />;
  }

  if (stage === "boot") {
    return <BootScreen onFinish={() => setStage("desktop")} />;
  }

  return <Desktop />;
}