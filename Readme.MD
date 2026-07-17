<div align="center">

# 🛰️ Relay

**A real-time chat platform with ephemeral and persistent rooms, live presence, rich media, and AI-powered features.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![WebSockets](https://img.shields.io/badge/Realtime-WebSockets-000000?logo=socket.io&logoColor=white)](https://github.com/websockets/ws)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-EF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev)

[**🔗 Live Demo**](https://temp-talk-2026.vercel.app) · [Report a Bug](#) · [Request a Feature](#)

</div>

<br/>

Screenshots/Screenshot 2026-07-17 103856.png Screenshots/Screenshot 2026-07-17 103931.png Screenshots/Screenshot 2026-07-17 103958.png Screenshots/Screenshot 2026-07-17 104009.png Screenshots/Screenshot 2026-07-17 104026.png Screenshots/Screenshot 2026-07-17 104148.png Screenshots/Screenshot 2026-07-17 104202.png Screenshots/Screenshot 2026-07-17 104311.png

<!--
  📸 SCREENSHOTS / DEMO GIF
  Drop your images/GIFs in a `docs/` or `assets/` folder in the repo root,
  then replace the paths below. A short screen-recording GIF of creating a
  persistent room + chatting between two accounts is the single most
  effective thing you can add here.

  ![Landing Page](./docs/screenshot-landing.png)
  ![Persistent Chat Room](./docs/screenshot-chatroom.png)
  ![Admin Controls](./docs/demo.gif)
-->

## 📖 About

Relay is a full-stack, real-time chat application built around one core architectural decision: **two distinct room types for two distinct use cases.**

- **Temporary Rooms** — anonymous, no account required, messages live only in server memory, and the entire room self-destructs when its timer expires. Built for quick, throwaway conversations where nothing needs to outlive the moment.
- **Persistent Rooms** — authenticated, MongoDB-backed, with full message history, granular admin moderation, and rich media support. Built for communities that need to come back.

Rather than bolting ephemeral chat onto a persistent data model (or vice versa), each room type has its own storage strategy, its own WebSocket namespace, and its own lifecycle — which keeps both simple instead of forcing one compromised abstraction to do both jobs.

---

## ✨ Features

### 🔐 Authentication

- Email/password signup with OTP email verification (via [Resend](https://resend.com))
- Forgot / reset password flow, also OTP-gated
- **Google Sign-In** (verified server-side via `google-auth-library`), converging on the same signed, httpOnly JWT session as password login
- Profile management: change username, change password, upload/change avatar, delete account (with automatic cleanup — rooms where you're the last member get deleted, rooms where you're the sole admin auto-promote another member)

### ⚡ Temporary Rooms

- No account needed — just pick a username
- Configurable duration with a live countdown, extendable once by the creator
- Username-uniqueness check per room before joining
- QR code / copy-link / native share sheet for invites
- Entire room (messages + participants) wiped permanently on expiry

### 🏠 Persistent Rooms

- Joinable via a short, unique 6-character room code
- Full message history stored in MongoDB
- **Admin system**: creator is auto-admin; admins can promote other members, kick (removable, can rejoin), or block (removed + permanently barred) disruptive users — with an in-memory blocklist check enforced at both the REST and WebSocket connection layer
- **Leave Room edge cases handled explicitly**: last member leaving auto-deletes the room; last admin leaving with other members still present is blocked with a clear "promote someone first" prompt
- Live **online/offline presence** and **typing indicators**, debounced client-side with a server-side safety timeout
- **Message editing & soft-deletion** (edited tag, "this message was deleted" placeholder — nothing vanishes without a trace)
- **Rich media**: images, PDFs, Word docs, and text files, uploaded as in-memory buffers straight to [Cloudinary](https://cloudinary.com) (never touch disk), with automatic asset cleanup on message/room/account deletion
- **Full-screen image lightbox** with keyboard navigation, looping gallery, and force-download (not just "open in new tab")
- Emoji picker for message composition

### 🤖 AI-Powered Features (Google Gemini)

- **Room Mood Indicator** — periodically analyzes recent conversation (batched every 10 messages or 45 seconds, whichever first) to surface the room's ambient emotional tone. Never analyzes individuals, filters out gibberish/spam before inference, and preserves the last known mood rather than flickering to "Neutral" during noisy stretches.
- **AI-Curated Testimonials** — users can submit rated feedback; Gemini scores sentiment and quality in the background (never during page load), and only feedback that clears quality/consent thresholds is surfaced as a rotating testimonial on the Login/Register pages.

### 🎨 Design & Interaction

- Full dark/light theme support throughout
- Animated, interactive background canvas
- Page transitions and staggered UI animations via Framer Motion
- Fully responsive, mobile-first component design

---

## 🧱 Tech Stack

| Layer             | Technology                                                         |
| ----------------- | ------------------------------------------------------------------ |
| **Frontend**      | React 19, Vite, Tailwind CSS, Zustand, React Router, Framer Motion |
| **Backend**       | Node.js, Express 5                                                 |
| **Database**      | MongoDB + Mongoose                                                 |
| **Real-Time**     | Native WebSockets (`ws`)                                           |
| **Auth**          | JWT (httpOnly cookies), bcrypt, Google OAuth 2.0                   |
| **Media Storage** | Cloudinary (buffered streaming uploads)                            |
| **Email**         | Resend                                                             |
| **AI**            | Google Gemini (`@google/genai`)                                    |
| **Hosting**       | Render (backend), Vercel (frontend)                                |

---

## 📂 Project Structure

```
Temp-Talk-2026/
├── Client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Feature-organized components (TempRoom, PersistentRoom, Profile, etc.)
│   │   ├── pages/          # Route-level pages
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # Axios API + WebSocket service classes
│   │   └── routes/         # React Router + protected route wrappers
│   └── package.json
│
├── Server/                  # Express backend
│   ├── Controllers/
│   ├── Models/
│   ├── Schemas/            # Zod validation schemas
│   ├── MiddleWare/
│   ├── services/           # Business logic (mood analysis, testimonials, email)
│   ├── websocket/          # WebSocket server setup (temp + persistent room handlers)
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ LTS
- A MongoDB instance (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- API keys: [Cloudinary](https://cloudinary.com), [Resend](https://resend.com), [Google Cloud Console](https://console.cloud.google.com) (OAuth Client), [Google AI Studio](https://aistudio.google.com) (Gemini)

### 1. Clone the repo

```bash
git clone https://github.com/PrabhatA77/Temp-Talk-2026.git
cd Temp-Talk-2026
```

### 2. Backend setup

```bash
cd Server
npm install
```

Create a `.env` file in `Server/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
FROM_DOMAIN=your_verified_sender_domain
DEVELOPER_EMAIL=your_email_for_feedback_notifications

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URI=http://localhost:5173
NODE_ENV=development
```

Run the backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../Client
npm install
```

Create a `.env` file in `Client/`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

<details>
<summary><strong>Server (.env)</strong></summary>

| Variable                | Description                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `PORT`                  | Port the Express server listens on                                          |
| `MONGODB_URI`           | MongoDB connection string                                                   |
| `JWT_SECRET`            | Secret used to sign session JWTs                                            |
| `RESEND_API_KEY`        | API key for Resend (transactional email)                                    |
| `FROM_DOMAIN`           | Verified sending domain/address for Resend                                  |
| `DEVELOPER_EMAIL`       | Where private "Send Feedback" submissions are delivered                     |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier                                               |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                          |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                                       |
| `GOOGLE_CLIENT_ID`      | OAuth Client ID (must match frontend's)                                     |
| `GEMINI_API_KEY`        | Google Gemini API key                                                       |
| `FRONTEND_URI`          | Deployed frontend origin, used for CORS (no trailing slash!)                |
| `NODE_ENV`              | `development` or `production` — affects cookie `secure`/`sameSite` behavior |

</details>

<details>
<summary><strong>Client (.env)</strong></summary>

| Variable                | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `VITE_API_URL`          | Base URL for REST API calls                                                  |
| `VITE_WS_URL`           | Base URL for WebSocket connections (`ws://` locally, `wss://` in production) |
| `VITE_GOOGLE_CLIENT_ID` | Same OAuth Client ID as the backend                                          |

</details>

---

## ☁️ Deployment

- **Backend** is deployed on [Render](https://render.com) as a Web Service, with the repo's `Server` folder set as the root directory.
- **Frontend** is deployed on [Vercel](https://vercel.com), with the repo's `Client` folder set as the root directory, and a rewrite rule to support client-side routing.
- Live at: **[temp-talk-2026.vercel.app](https://temp-talk-2026.vercel.app)**

---

## 🗺️ Roadmap

- [ ] Automated test suite (Jest + Supertest) covering auth and room lifecycle
- [ ] Rate limiting on auth endpoints
- [ ] `helmet` security headers
- [ ] Redis-backed presence/session state for horizontal scaling
- [ ] JWT revocation / refresh token rotation

---

## 👨‍💻 Author

Built solo by a B.Tech Computer Science student as a deep-dive into real-time distributed systems, modern React architecture, and full-stack engineering — from WebSocket protocol design to AI-assisted feature curation.

- GitHub: [github.com/PrabhatA77](https://github.com/PrabhatA77)
- LinkedIn: [linkedin.com/in/prabhat-rathore-626944303](https://www.linkedin.com/in/prabhat-rathore-626944303/)

---

## 📄 License

This project is available under the [MIT License](LICENSE).
