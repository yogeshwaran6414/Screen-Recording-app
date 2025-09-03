import React, { useRef, useState } from "react";

const MAX_TIME = 180;

function RecordScreen() {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setMessage("");
    setMediaBlobUrl(null);
    setMediaBlob(null);
    setTimer(0);
    chunksRef.current = [];
    try {
      const displayStream = await window.navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      const audioStream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = [...displayStream.getVideoTracks(), ...audioStream.getAudioTracks()];
      const stream = new MediaStream(tracks);

      mediaRecorderRef.current = new window.MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setMediaBlob(blob);
        setMediaBlobUrl(URL.createObjectURL(blob));
        setRecording(false);
        clearInterval(intervalRef.current);
      };
      mediaRecorderRef.current.start(100);
      setRecording(true);
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t + 1 >= MAX_TIME) {
            stopRecording();
            return MAX_TIME;
          }
          return t + 1;
        });
      }, 1000);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const stopRecording = () => {
    try { mediaRecorderRef.current && mediaRecorderRef.current.state === "recording" && mediaRecorderRef.current.stop(); } catch (e) {}
    clearInterval(intervalRef.current);
    setRecording(false);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = mediaBlobUrl;
    a.download = "recording.webm";
    a.click();
  };

  const upload = async () => {
    if (!mediaBlob) return;
    setUploading(true); setMessage("");
    const form = new FormData();
    form.append("file", mediaBlob, "recording.webm");
    form.append("title", "Screen recording " + new Date().toLocaleString());
    try {
      const resp = await fetch(import.meta.env.VITE_API_URL + "/api/recordings", { method: "POST", body: form });
      const json = await resp.json();
      setMessage(json.message || "Upload complete!");
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="recorder-container">
      <div className="recorder-controls">
        {!recording ?
          <button className="rec-btn" onClick={startRecording}>Start Recording</button>
          :
          <button className="stop-btn" onClick={stopRecording}>Stop</button>
        }
        <span className="timer">
          {recording && `Recording: ${Math.floor(timer / 60)}:${('0'+(timer%60)).slice(-2)} (max 3 min)`}
        </span>
      </div>
      {uploading && <div className="loading-bar"></div>}
      {message && (
        <div className={`alert  ${message.startsWith("Upload failed") || message.startsWith("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}
      {!recording && mediaBlobUrl &&
        <div className="preview-container">
          <video src={mediaBlobUrl} controls className="preview-player"/>
          <div className="preview-actions">
            <button onClick={download}>Download</button>
            <button onClick={upload}>Upload</button>
          </div>
        </div>
      }
    </div>
  );
}
export default RecordScreen;
