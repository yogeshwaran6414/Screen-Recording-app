# MERN Screen Recorder App

A full-stack web app to record the active browser tab’s screen with microphone audio, preview, download, upload recordings to a Node/Express + SQL backend, and view/delete uploaded recordings.

---

## Table of Contents

- [About The Project](#about-the-project)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About The Project

This app allows users to record their current browser tab screen with microphone audio for up to 3 minutes, preview and download the recording, upload it to a backend, and manage uploaded recordings (list, play, delete) through a web interface.

---

## Technology Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite (SQL)
- Deployment Targets: Vercel/Netlify (Frontend), Render (Backend)

---

## Features

- Screen recording via `navigator.mediaDevices.getDisplayMedia` + mic capture
- Live timer with 3-minute max recording limit
- Playback of recordings before saving
- Download recordings locally
- Upload recording files with metadata to backend API
- List all uploaded recordings with info and inline playback
- Delete uploaded recordings (removes file + DB entry)
- Responsive, clean UI with modular CSS

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- Git

---

### Installation

1. Clone the repo:

git clone [your-repo-url]
cd screen-recorder-app

text

2. Setup Backend:

cd backend
npm install

text

3. Setup Frontend:

cd ../frontend
npm install

text

4. Create `uploads` folder in backend:

mkdir ../backend/uploads

text

5. Set backend API URL in frontend `.env`:

VITE_API_URL=http://localhost:5000

text

---

## Usage

### Run Backend Server

cd backend
node server.js

text

### Run Frontend Server

cd ../frontend
npm run dev

text

Open `http://localhost:3000` in your browser.

- Use **Record** tab to record and upload
- Use **View Uploads** to play or delete saved recordings

---

## Deployment

- Frontend: Deploy `/frontend` folder to Vercel or Netlify.
- Backend: Deploy `/backend` folder to Render.
- Remember to configure environment variables to link frontend to backend URLs after deployment.

---

## Known Limitations

- Works best in Chrome (tab recording + mic audio)
- SQLite used for demo purposes — switch to MySQL/PostgreSQL for production scale
- Files stored locally on backend server disk

---

## Folder Structure

screen-recorder-app/
├── backend/
│ ├── server.js
│ ├── models.js
│ ├── uploads/
│ ├── db.sqlite
│ ├── .env
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── RecordScreen.jsx
│ │ ├── RecordingsList.jsx
│ │ ├── styles.css
│ │ ├── main.jsx
│ ├── .env
│ ├── index.html
│ ├── vite.config.js
│ ├── package.json
├── README.md

text

---

## Contributing

Contributions, issues, and feature requests are welcome! Please open an issue or submit pull requests for improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions or suggestions, please contact [Yogeshwaran K / yw884422@gmail.com].
