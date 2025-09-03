import React, { useState } from "react";
import RecordScreen from "./RecordScreen";
import RecordingsList from "./RecordingsList";

function App() {
  const [view, setView] = useState("recorder");

  return (
    <div className="app-container">
      <h2 className="app-title">Screen Recorder App</h2>
      <div className="app-nav">
        <button className={view === "recorder" ? "selected" : ""} onClick={() => setView("recorder")}>Record</button>
        <button className={view === "list" ? "selected" : ""} onClick={() => setView("list")}>View Uploads</button>
      </div>
      <div className="app-content">
        {view === "recorder" ? <RecordScreen /> : <RecordingsList />}
      </div>
    </div>
  );
}
export default App;
