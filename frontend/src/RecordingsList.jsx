import React, { useEffect, useState } from "react";

function RecordingsList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/api/recordings")
      .then(res => res.json())
      .then(json => { setList(json); setLoading(false); });
  }, []);

  const deleteRecording = async (id) => {
    if (!window.confirm("Delete this recording?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recordings/${id}`, { method: 'DELETE' });
      const json = await res.json();
      alert(json.message);
      // Refresh list
      setLoading(true);
      const refreshed = await fetch(import.meta.env.VITE_API_URL + "/api/recordings").then(r => r.json());
      setList(refreshed);
      setLoading(false);
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="recordings-list">
      <h3>Uploaded Recordings</h3>
      {loading ? <div className="loading-bar"></div> :
        list.length === 0 ? <div className="no-recordings">No recordings uploaded yet.</div> :
        <table className="rec-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Size (KB)</th>
              <th>Created</th>
              <th>Play</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {list.map(rec => (
              <tr key={rec.id}>
                <td>{rec.title}</td>
                <td align="center">{(rec.size / 1024).toFixed(1)}</td>
                <td align="center">{new Date(rec.createdAt).toLocaleString()}</td>
                <td align="center">
                  <video src={import.meta.env.VITE_API_URL + "/api/recordings/" + rec.id} controls className="rec-list-player"/>
                </td>
                <td align="center">
                  <button onClick={() => deleteRecording(rec.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default RecordingsList;
