import { useCallback, useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const STORAGE_KEY = "excalidraw-board";

function loadScene() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const [initialData] = useState(() => loadScene());
  const saveTimer = useRef(null);

  const handleChange = useCallback((elements, appState, files) => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            elements,
            appState: {
              ...appState,
              collaborators: undefined,
            },
            files,
          }),
        );
      } catch {
        // ignore quota / serialization errors
      }
    }, 400);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(saveTimer.current);
  }, []);

  return (
    <div className="board">
      <Excalidraw
        langCode="zh-CN"
        theme="light"
        initialData={initialData || undefined}
        onChange={handleChange}
      />
    </div>
  );
}
