# Child Right Reporting (SafeVoice) – Working Prototype

A full-stack prototype for reporting and tracking child-rights concerns.
**No database:** all data lives in memory on the backend and resets when the server restarts.

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express, JWT login, bcrypt password hashing

## Structure

```
child-right-reporting-4/
├── frontend/   React app (pages, components, services/api.js)
├── backend/    Express API (routes, controllers, data/*.js in-memory stores)
└── README.md
```

## Run it

Requires Node.js 18 or newer. Use two terminals.

```bash
# Terminal 1 – API on http://localhost:5000
cd backend
npm install
npm start

# Terminal 2 – web app on http://localhost:5173
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend.

## Demo accounts

| Role     | Email                | Password    |
|----------|----------------------|-------------|
| Admin    | admin@example.com    | admin123    |
| Reviewer | reviewer@example.com | reviewer123 |
| User     | user@example.com     | user123     |

A sample report with tracking ID `CR-DEMO01` is pre-loaded.

## Features

| Area | What it does |
|------|--------------|
| Report (`/report`) | Anyone can submit a report, anonymously or with contact details. Returns a tracking ID. |
| Track (`/track`) | Look up status and public updates by tracking ID. Logged-in users also see their own reports. |
| Awareness / Resources | Warning signs, how to respond, helplines and legal info. Resources are served by the API. |
| Reviewer (`/reviewer`) | Filter reports, change status, post public updates, add internal notes. |
| Admin (`/admin`) | Report statistics, change user roles, add or delete resources. |

## API summary

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me` | logged in |
| GET | `/api/auth/users` | admin |
| PATCH | `/api/auth/users/:id/role` | admin |
| POST | `/api/reports` | public |
| GET | `/api/reports/track/:trackingId` | public |
| GET | `/api/reports/mine` | logged in |
| GET | `/api/reports` | reviewer, admin |
| PATCH | `/api/reports/:id` | reviewer, admin |
| GET | `/api/reports/stats` | admin |
| GET | `/api/resources` | public |
| POST / DELETE | `/api/resources`, `/api/resources/:id` | admin |

## Prototype limits

- Data is not persisted. Restarting the backend resets users, reports and resources.
- Set `JWT_SECRET` as an environment variable before any real deployment.
- Not production-ready: no rate limiting, audit logging, encryption of stored reports, or real case-management workflow. Handling real child-protection reports needs legal and safeguarding review.
- Helpline numbers are India-specific. Edit `backend/data/resources.js` for other regions.
