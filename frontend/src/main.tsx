import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTransparentFavicon } from "./lib/applyTransparentFavicon";

applyTransparentFavicon({ thresholdLow: 14, thresholdHigh: 55, chromaMax: 26 });

createRoot(document.getElementById("root")!).render(<App />);

