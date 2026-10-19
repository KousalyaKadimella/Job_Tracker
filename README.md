# Job Application Tracker

A small full-stack app for tracking job applications: company, role, status and notes. It has a **FastAPI** backend with a **SQLite** database, and a **React** frontend.

---

## Features

- Add, view, update and delete job applications (CRUD)
- Track status for each application (for example: Applied, Interviewing, Offered, Rejected)
- **Duplicate protection:** adding an application with the same **company + role** returns the existing record instead of creating a second one
- Data is saved in a local SQLite file, so it survives restarts

## Tech stack

| Layer | Technology |
|---|---|
| Backend API | Python, FastAPI, Uvicorn |
| Database access | SQLAlchemy (ORM) |
| Validation | Pydantic |
| Database | SQLite (`backend/job_tracker.db`) |
| Frontend | React (runs on `http://localhost:3000`) |

## API endpoints

| Method | Path | What it does |
|---|---|---|
| `GET` | `/` | Health check: confirms the backend is running |
| `POST` | `/applications` | Create an application (returns the existing one if company + role already exist) |
| `GET` | `/applications` | List all applications |
| `GET` | `/applications/{id}` | Get one application (`404` if not found) |
| `PUT` | `/applications/{id}` | Update company, role, status and notes (`404` if not found) |
| `DELETE` | `/applications/{id}` | Delete an application (`404` if not found) |

Interactive API docs are available at `http://127.0.0.1:8000/docs` while the backend is running (FastAPI generates them automatically).

## Data model

One table, `applications`:

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `company` | String | Indexed |
| `role` | String | Indexed |
| `status` | String | Indexed |
| `notes` | String | Free text |

## Project structure

```text
Job_Tracker/
├── backend/
│   ├── main.py          # FastAPI app, CORS setup and all routes
│   ├── database.py      # SQLAlchemy engine and session setup (SQLite)
│   ├── models.py        # ApplicationModel table definition
│   ├── schemas.py       # Pydantic request/response models
│   └── job_tracker.db   # Local SQLite database (sample data)
├── frontend/            # React app
└── README.md
```

## Run it locally

**Backend**

```bash
cd Job_Tracker/backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload         # http://127.0.0.1:8000
```

**Frontend** (in a second terminal)

```bash
cd Job_Tracker/frontend
npm install
npm start                         # http://localhost:3000
```

The backend allows requests from `http://localhost:3000` (CORS is configured in `main.py`).

## Possible improvements

- Return `409 Conflict` for duplicates instead of silently returning the existing record
- Add filtering by status and automated tests for each endpoint
- Add Docker files for one-command setup

---

**Kousalya Kadimella** · M.S. Computer Science, CSU Dominguez Hills
