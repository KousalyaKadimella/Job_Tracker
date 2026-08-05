# Full-Stack Job Application Tracker

A clean, responsive, full-stack CRUD application built with React and FastAPI to manage your recruitment pipeline, featuring strict duplicate detection logic and local database persistence.

---

##  Project Overview

**Job_Tracker** is a personal pipeline manager that allows applicants to track their job search lifecycle. The system provides a seamless Single-Page Application (SPA) experience for adding, updating, and deleting applications, backed by strict relational verification layers to prevent messy spreadsheet or dashboard duplicates.

### Key Technical Achievements
* **Decoupled Architecture:** Full-stack isolation featuring a fast, asynchronous FastAPI backend and a component-driven React frontend.
* **Idempotent Data Integrity:** Programmatic backend verification intercepts entries to block duplicate submissions matching on the combination of `Company` + `Role`.
* **State Persistence:** Implements relational mapping via SQLAlchemy ORM pushing down into a lightweight SQLite transactional file database.

---

##  Tech Stack & Dependencies

### Frontend Layout
* **Framework:** React.js (Component-based architecture)
* **Language/Styles:** JavaScript, CSS-in-JS inline layouts

### Backend Services
* **Framework:** FastAPI (Python ASGI framework)
* **ORM Infrastructure:** SQLAlchemy
* **Database Engine:** SQLite 

---

##  Repository Structure

```text
Job_Tracker/
├── backend/
│   ├── main.py          # FastAPI application routes & server definition
│   ├── database.py      # SQLAlchemy connection engine & session factories
│   ├── models.py        # Database schema definitions (SQLite tables)
│   ├── schemas.py       # Pydantic data validation & serialization models
│   └── job_tracker.db   # Persistent local SQLite storage file
├── frontend/
│   ├── src/
│   │   └── App.js       # Core React pipeline and user interface components
│   └── package.json     # Node script definitions and dependencies
├── .gitignore           # Excludes virtual environments and database binaries
└── README.md            # Technical documentation
```

---

##  Local Installation & Execution

Deploy the full application stack locally using two simple terminal sessions:

### Prerequisite Checklist
* **Python 3.10+** installed locally
* **Node.js (v16+)** & npm package manager installed

---

### Step 1: Initialize the Backend Server

Open your terminal, navigate to the backend directory, isolate dependencies, and start the development engine:

```bash
# 1. Clone the project and step into the backend folder
git clone https://github.com/KousalyaKadimella/Job_Tracker
cd Job_Tracker/backend

# 2. Spin up a clean Python virtual environment
python -m venv venv

# 3. Activate the environment
# For Mac/Linux:
source venv/bin/activate
# For Windows:
venv\Scripts\activate

# 4. Install backend framework and dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# 5. Boot up the live reload ASGI server
uvicorn main:app --reload
```
*The API interface will now spin up locally at `http://127.0.0.1:8000`.*

---

### Step 2: Initialize the Frontend UI

Open a **second terminal window**, navigate to the frontend directory, install the required packages, and launch the single-page application:

```bash
# 1. Access the frontend root folder
cd Job_Tracker/frontend

# 2. Pull down web packages and dependencies
npm install

# 3. Run the development browser server
npm start
```
*Your interactive dashboard will automatically mount and open at `http://localhost:3000`.*

---

##  Core Application Features

* **Complete CRUD Matrix:** Add, view, modify status paths via custom dropdowns, and purge job columns seamlessly.
* **Visual Status Management:** Dropdown interfaces enforce uniform state tags (e.g., *Applied, Interviewing, Offered, Rejected*) preventing inconsistent spelling inputs.
* **Toast Notification Pipeline:** Real-time user interface responses alert you immediately regarding creation successes or duplicated submission warnings.

---

##  Author

**Kousalya Kadimella**  
*MS in Computer Science*  
California State University, Dominguez Hills
