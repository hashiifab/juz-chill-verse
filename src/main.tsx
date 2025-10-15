import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AudioPlayerProvider } from "./components/AudioPlayer";

createRoot(document.getElementById("root")!).render(
  <AudioPlayerProvider>
    <App />
  </AudioPlayerProvider>
);
