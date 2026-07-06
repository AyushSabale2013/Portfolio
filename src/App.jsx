import { useState } from "react";

import Landing from "./components/Landing";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";

export default function App() {
  const [stage, setStage] = useState("landing");

  if (stage === "landing") {
    return (
      <Landing
        onEnter={() => setStage("boot")}
      />
    );
  }

  if (stage === "boot") {
    return (
      <BootScreen
        onFinish={() => setStage("desktop")}
      />
    );
  }

  return <Desktop />;
}                                             