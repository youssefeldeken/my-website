# Youssef Lotfy — Cybersecurity Engineer Portfolio

A full MERN-stack portfolio site with a public-facing site, a REST API, and a
password-protected admin dashboard for managing all content (projects,
skills, experience, messages, CV file, and site settings).

Content is pre-populated from Youssef's real CV via the seed script, so the
site works immediately after setup — no manual data entry required to get
started.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Vite), React Router, Tailwind CSS, Framer Motion, React Hook Form, React Hot Toast, Lucide icons |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie + bearer token), bcrypt password hashing |
| Uploads | Multer, with optional Cloudinary (falls back to local disk storage automatically) |
| Security | Helmet, CORS, rate limiting, express-validator input validation |

---

## Project structure

```
portfolio/
├── backend/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/     # business logic per resource
│   ├── middleware/      # auth, error handling, validation, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST endpoints
│   ├── seed/seed.js      # populates DB with real CV content + admin user
│   ├── uploads/          # local file storage fallback
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProjectCard, TerminalHero, etc.
│   │   ├── pages/         # Home, Projects, ProjectDetails, CV, Contact
│   │   │   ├── sections/  # Home page sections (Hero, About, Skills, ...)
│   │   │   └── admin/     # Admin login, dashboard, CRUD pages
│   │   ├── context/       # Auth + Theme context
│   │   ├── data/          # Static fallback data sourced from the CV
│   │   └── services/api.js
│   └── index.html
├── docker-compose.yml
└── README.md (this file)
```

---

## 1. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB database — easiest option is a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster, or run MongoDB locally/with Docker.

### Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed     # populates DB with CV content + creates your admin login
npm run dev      # starts API on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # starts site on http://localhost:5173
```

Visit `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the admin dashboard, using the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`.

**Change the admin password immediately after first login** if you used the
example value in `.env.example`.

### Image uploads
By default, uploaded images/PDFs are stored on local disk under
`backend/uploads/` and served at `/uploads/...`. To use Cloudinary instead
(recommended for production, since most hosts don't persist local disk
storage), add your Cloudinary credentials to `backend/.env` — the app
detects them automatically and switches storage backends without any code
changes.

---

## 2. Running with Docker (optional)

```bash
cp backend/.env.example backend/.env   # fill in JWT_SECRET, admin creds, etc.
docker compose up --build
```

This starts MongoDB, the API (port 5000), and the built frontend served by
Nginx (port 5173), with `/api` proxied to the backend container.

Run the seed script once against the containerized DB:
```bash
docker compose exec backend npm run seed
```

---

## 3. Deployment (no Docker)

A common free/cheap setup:

1. **Database** — MongoDB Atlas free tier (M0 cluster). Whitelist your backend host's IP (or `0.0.0.0/0` for simplicity) and copy the connection string into `MONGO_URI`.
2. **Backend** — deploy the `backend/` folder to [Render](https://render.com) or [Railway](https://railway.app):
   - Build command: `npm install`
   - Start command: `npm start`
   - Add all vars from `.env.example` in the host's environment settings.
   - After first deploy, run `npm run seed` once (Render/Railway both offer a one-off shell/job for this).
3. **Frontend** — deploy `frontend/` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
   - Build command: `npm run build`
   - Output directory: `dist`
   - Set `VITE_API_URL` to your deployed backend URL, e.g. `https://your-api.onrender.com/api`.
4. Update `CLIENT_URL` in the backend's environment to your deployed frontend URL (for CORS).

---

## 4. API reference

Base URL: `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Admin login, returns JWT |
| GET | `/auth/me` | ✔ | Current admin user |
| POST | `/auth/logout` | — | Clears auth cookie |
| PUT | `/auth/password` | ✔ | Change password |
| GET | `/projects?all=true&category=&featured=` | — / ✔ for `all` | List projects |
| GET | `/projects/:slug` | — | Project details + related |
| POST | `/projects` | ✔ | Create project |
| PUT | `/projects/:id` | ✔ | Update project |
| DELETE | `/projects/:id` | ✔ | Delete project |
| PATCH | `/projects/:id/toggle` | ✔ | Toggle `featured` or `published` |
| GET/POST/PUT/DELETE | `/experience`, `/education`, `/skills`, `/certificates` | GET public, writes ✔ | Standard CRUD |
| POST | `/messages` | — | Submit contact form (rate-limited) |
| GET | `/messages?status=` | ✔ | List messages |
| PATCH | `/messages/:id/status` | ✔ | Mark unread/read/archived |
| DELETE | `/messages/:id` | ✔ | Delete message |
| GET | `/notifications` | ✔ | List + unread count |
| PATCH | `/notifications/:id/read` / `/read-all` | ✔ | Mark read |
| GET | `/settings` | — | Public site settings |
| PUT | `/settings` | ✔ | Update settings |
| GET | `/resume` | — | Active CV file info |
| POST | `/resume` | ✔ | Upload new CV (multipart, field `resume`) |
| GET | `/stats` | ✔ | Dashboard counts + recent activity |
| POST | `/uploads/single` | ✔ | Upload one image (field `image`) |
| POST | `/uploads/multiple` | ✔ | Upload up to 10 images (field `images`) |

`✔` = requires `Authorization: Bearer <token>` header (or the httpOnly
cookie set at login).

---

## 5. Notes on design

The visual identity is a dark, terminal/network-topology theme (per the
brief's palette), with two signature touches that tie it to the subject
rather than generic dashboard styling:

- **Hero terminal window** — the rotating role titles are "typed" at a
  simulated shell prompt instead of plain animated text.
- **Network background** — an animated canvas of connected nodes evokes a
  network topology map rather than generic floating particles.

Section eyebrows follow a `[ 0N ] label` / `label.extension` convention
(`whoami`, `capabilities.map`, `career.timeline`, …) as a structural device
that reinforces the security/systems framing throughout.

---

## 6. What's stubbed vs. fully built

Fully built and working end-to-end: public site, all 5 pages, contact form →
DB → admin notification pipeline, full project CRUD with feature/publish
toggles, messages inbox (read/archive/delete), CV upload & preview, site
settings editor, JWT auth with protected routes, seed data from the real CV.

Marked "future ready" per the original brief and intentionally left as a
simple placeholder rather than fully built out: **blog** and **testimonials**
sections. Certificates and Education have full backend CRUD + models ready,
but no dedicated admin UI screen yet — use the API directly or extend
`AdminProjects.jsx` as a pattern for a matching `AdminCertificates.jsx` /
`AdminEducation.jsx` page.
