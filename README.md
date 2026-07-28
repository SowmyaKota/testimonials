# Testimonial Platform

A small platform where businesses collect customer testimonials, review/approve them, and display approved ones on a public wall and via an embeddable widget on third-party sites.

## Stack
- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`) - a single file, zero external setup

## What's done (P0 - core loop)
- [x] Public submission form (`/`) - name, email, company, testimonial, star rating, optional photo URL
- [x] Backend API persisting submissions to SQLite
- [x] Moderation dashboard (`/dashboard`) - list pending/approved/rejected, approve/reject actions
- [x] Public wall (`/wall`) - shows only approved testimonials
- [x] Full loop verified: submit → pending in dashboard → approve → appears on wall

## What's done (P1)
- [x] Embeddable widget (`backend/public/widget/widget.js`) - vanilla JS, no build step, works via a single `<script>` tag on any third-party page. Demo at `demo/embed-demo.html`.
- [x] Widget accent color customization via `data-accent` attribute
- [x] Basic duplicate submission detection (same email + same testimonial text is rejected with a friendly error)
- [x] Pagination on both the wall page and the widget ("Show more")
- [x] Loading / empty / error states on submission form, dashboard, and wall

## What's NOT done (by design, or cut due to time)
- No authentication (explicit non-goal per the brief)
- No email notifications, payments, multi-business support (explicit non-goals)
- No P2 AI feature or live deploy included in this submission as-built - see JOURNAL.md for what I'd add next
- Photo upload is a URL field only, not actual file upload/storage

## Running locally

### Backend
```bash
cd backend
npm install
npm start
# API running at http://localhost:4000
```
The SQLite database file (`testimonials.db`) is created automatically on first run - no setup needed.

### Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### Widget demo
With the backend running, open `demo/embed-demo.html` directly in a browser (double-click it, or use a simple static server). It loads the widget from `http://localhost:4000/widget/widget.js` exactly as an external site would.

## API endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/submissions` | Customer submits a testimonial (public) |
| GET | `/api/moderation?status=pending` | List testimonials by status |
| PATCH | `/api/moderation/:id/approve` | Approve a testimonial |
| PATCH | `/api/moderation/:id/reject` | Reject a testimonial |
| GET | `/api/wall?page=1&limit=10` | Public, approved testimonials only, paginated |

## Deployment
- Frontend: Vercel or Netlify (`npm run build`, deploy `dist/`)
- Backend: Render, Railway, or Fly.io (set `PORT` env var if required by host)
- After deploying the backend, update `frontend/.env` (`VITE_API_URL`) and the widget's `data-api` attribute to point at the live backend URL.
