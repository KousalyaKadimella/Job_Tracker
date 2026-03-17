# Job Application Tracker

A full-stack web application to manage job applications in one place. Users can add, view, update, and delete job applications through a React frontend connected to a FastAPI backend with SQLite for persistent storage.

## Features

- Add new job applications
- View all saved applications
- Update application status
- Delete applications
- Prevent duplicate applications based on company and role
- Store data persistently using SQLite
- Show success and error messages in the UI
- Use dropdown-based status selection for consistency

## Tech Stack

### Frontend
- React
- JavaScript
- CSS-in-JS using inline styles

### Backend
- FastAPI
- Python
- SQLAlchemy

### Database
- SQLite

## Project Structure

```bash
Job_Tracker/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── job_tracker.db
│
├── frontend/
│   ├── src/
│   │   └── App.js
│   └── package.json
│
└── README.mdpwd
# Job_Tracker
