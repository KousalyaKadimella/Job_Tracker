# Job Application Tracker

[![Tests](https://github.com/KousalyaKadimella/Job_Tracker/actions/workflows/tests.yml/badge.svg)](https://github.com/KousalyaKadimella/Job_Tracker/actions/workflows/tests.yml)

A full-stack web app for tracking job applications: company, role, status and notes. It has a **FastAPI** backend with a **SQLite** database and a **React** frontend. Both are deployed, and 14 automated tests run on every push.

**Live demo:** https://jobtracker-kk.netlify.app
**Backend API docs:** https://job-tracker-r1bt.onrender.com/docs

> The live demo uses **fictional sample data** (15 made-up companies such as Acme Corp and Globex).
> The backend runs on Render's free tier, which sleeps when idle, so **the first load can take up to a minute**.

---

## Features

- Add, view, update and delete job applications (CRUD)
- Track the status of each application: **Applied, Interview, Offer, Rejected**. Status is chosen from a dropdown, so spelling stays consistent.
- **Duplicate protection:** adding an application with the same **company + role** returns the existing record instead of creating a second one
- Success and error messages after every action, including a clear message when the API can't be reached
- Interactive API documentation generated automatically by FastAPI at `/docs`

## Tech stack

| Layer | Technology |
|---|---|
| Backend API | Python, FastAPI, Uvicorn |
| Database access | SQLAlchemy (ORM) |
| Validation | Pydantic |
| Database | SQLite |
| Frontend | React 19 (Create React App), `fetch` calls to the API |
| Testing | pytest + FastAPI TestClient (backend), Jest + React Testing Library (frontend) |
| CI | GitHub Actions |
| Hosting | Render (backend), Netlify (frontend) |

## Architecture

```text
Browser
   │
   ▼
React app (Netlify)  ──  REACT_APP_API_URL  ──►  FastAPI (Render)  ──►  SQLite
                                                 │
                                                 └─ CORS allows only FRONTEND_URL
```

1. The React app calls the backend URL set in `REACT_APP_API_URL`. Locally this defaults to `http://127.0.0.1:8000`.
2. FastAPI validates each request with Pydantic and reads or writes the `applications` table through SQLAlchemy.
3. The backend only accepts browser requests from the frontend address set in `FRONTEND_URL`. Locally this defaults to `http://localhost:3000`.

## How the frontend works

`frontend/src/App.js` is a single React component that:

- Loads all applications from `GET /applications` when the page opens
- Has an **Add New Application** form (company, role, status, notes) that sends `POST /applications`
- Lists saved applications with a status dropdown and an **Update Status** button (`PUT /applications/{id}`), plus a **Delete** button (`DELETE /applications/{id}`)
- Shows a green success message or a red error message after each action, then reloads the list

## API endpoints

| Method | Path | What it does |
|---|---|---|
| `GET` | `/` | Health check: confirms the backend is running |
| `POST` | `/applications` | Create an application (returns the existing one if company + role already exist) |
| `GET` | `/applications` | List all applications |
| `GET` | `/applications/{id}` | Get one application (`404` if not found) |
| `PUT` | `/applications/{id}` | Update company, role, status and notes (`404` if not found) |
| `DELETE` | `/applications/{id}` | Delete an application (`404` if not found) |

Missing required fields return `422 Unprocessable Entity` (Pydantic validation).

## Data model

One table, `applications`:

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `company` | String | Indexed |
| `role` | String | Indexed |
| `status` | String | Indexed |
| `notes` | String | Free text |

## Testing

**14 automated tests**, run on every push and pull request by GitHub Actions.

**Backend: 11 tests** (`backend/test_main.py`, pytest + FastAPI TestClient)
- Health check route
- Create, list, get one, update and delete
- `404` for get, update and delete when the record doesn't exist
- `422` when a required field is missing
- Duplicate company + role is not saved twice

The tests use a **separate in-memory SQLite database**, so running them never touches real data. Each test starts with empty tables.

**Frontend: 3 tests** (`frontend/src/App.test.js`, Jest + React Testing Library)
- Page title and add form render
- Applications loaded from the API are shown
- An error message appears when the API is down

These tests replace `fetch` with a mock, so they check the UI without needing the backend running.

## Project structure

```text
Job_Tracker/
├── .github/workflows/
│   └── tests.yml        # GitHub Actions: runs backend and frontend tests
├── backend/
│   ├── main.py          # FastAPI app, CORS setup and all routes
│   ├── database.py      # SQLAlchemy engine and session setup (SQLite)
│   ├── models.py        # ApplicationModel table definition
│   ├── schemas.py       # Pydantic request/response models
│   ├── seed.py          # Loads 15 fictional demo records if the table is empty
│   ├── test_main.py     # 11 API tests
│   └── requirements.txt # Python dependencies
├── frontend/            # React app (Create React App)
│   └── src/
│       ├── App.js       # Form, list, update and delete UI
│       └── App.test.js  # 3 UI tests
└── README.md
```

## Run it locally

**Backend**

```bash
cd Job_Tracker/backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                    # optional: load 15 demo records
uvicorn main:app --reload         # http://127.0.0.1:8000  (API docs at /docs)
```

**Frontend** (in a second terminal)

```bash
cd Job_Tracker/frontend
npm install
npm start                         # http://localhost:3000
```

**Run the tests**

```bash
cd backend && pytest -v                          # 11 backend tests
cd ../frontend && npm test -- --watchAll=false   # 3 frontend tests
```

## Deployment

| Part | Host | Settings |
|---|---|---|
| Backend | Render (free web service) | Root directory `backend` · Build `pip install -r requirements.txt` · Start `python seed.py && uvicorn main:app --host 0.0.0.0 --port $PORT` · Env var `FRONTEND_URL` |
| Frontend | Netlify | Base directory `frontend` · Build `npm run build` · Publish `frontend/build` · Env var `REACT_APP_API_URL` |

`REACT_APP_API_URL` is built into the frontend at build time, so changing it requires a new Netlify deploy.

## Known limitations

- **Data resets:** Render's free tier has a temporary disk, so the SQLite file resets to the 15 demo records whenever the service restarts.
- **Cold starts:** the free backend sleeps after inactivity, so the first request can be slow.
- **No login:** anyone with the link can add, edit or delete demo records.
- Duplicates return the existing record instead of an error.

## Possible improvements

- Move to a managed database (e.g. PostgreSQL) so data persists across restarts
- Return `409 Conflict` for duplicates
- Add user accounts so each person sees only their own applications
- Add filtering and search by status or company

---

**Kousalya Kadimella** · M.S. Computer Science, CSU Dominguez Hills
