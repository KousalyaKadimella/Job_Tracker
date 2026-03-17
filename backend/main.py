from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hello, Job Tracker backend is running with SQLite!"}

@app.post("/applications", response_model=schemas.ApplicationResponse)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    existing_application = db.query(models.ApplicationModel).filter(
        models.ApplicationModel.company == application.company,
        models.ApplicationModel.role == application.role
    ).first()

    if existing_application:
        return existing_application

    new_application = models.ApplicationModel(
        company=application.company,
        role=application.role,
        status=application.status,
        notes=application.notes
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

@app.get("/applications", response_model=list[schemas.ApplicationResponse])
def get_applications(db: Session = Depends(get_db)):
    applications = db.query(models.ApplicationModel).all()
    return applications

@app.get("/applications/{application_id}", response_model=schemas.ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.ApplicationModel).filter(
        models.ApplicationModel.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application

@app.put("/applications/{application_id}", response_model=schemas.ApplicationResponse)
def update_application(application_id: int, updated_application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    application = db.query(models.ApplicationModel).filter(
        models.ApplicationModel.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.company = updated_application.company
    application.role = updated_application.role
    application.status = updated_application.status
    application.notes = updated_application.notes

    db.commit()
    db.refresh(application)
    return application

@app.delete("/applications/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.ApplicationModel).filter(
        models.ApplicationModel.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()

    return {"message": "Application deleted successfully"}