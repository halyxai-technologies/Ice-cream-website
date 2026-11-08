import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// No StrictMode: its double-invoked effects would duplicate GSAP timelines, pins and frame loading.
createRoot(document.getElementById("root")!).render(<App />);
