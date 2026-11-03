"""Load demo data into the database. Safe to run more than once:
it only adds records when the table is empty.

All companies below are made-up demo names, not real applications."""
import models
from database import SessionLocal, engine

DEMO_APPLICATIONS = [
    ("Acme Corp", "Backend Engineer", "Applied", "Applied through careers page"),
    ("Globex", "Software Engineer I", "Interview", "Phone screen scheduled"),
    ("Initech", "Production Support Engineer", "Rejected", "Position filled"),
    ("Umbrella Labs", "Cloud Support Associate", "Applied", "Referral from a classmate"),
    ("Stark Systems", "Full Stack Developer", "Interview", "Take-home assignment sent"),
    ("Wayne Tech", "Site Reliability Engineer", "Applied", "Follow up in 1 week"),
    ("Hooli", "Technical Support Engineer", "Offer", "Offer received, reviewing"),
    ("Pied Piper", "Python Developer", "Rejected", "No response after 3 weeks"),
    ("Vandelay Industries", "Application Support Analyst", "Applied", "Applied on job board"),
    ("Soylent Co", "DevOps Engineer", "Interview", "Onsite next week"),
    ("Cyberdyne", "Software Engineer", "Applied", "Tailored resume for role"),
    ("Tyrell Corp", "Integration Engineer", "Rejected", "Needed more years of experience"),
    ("Wonka Works", "QA Engineer", "Applied", "Recruiter reached out"),
    ("Oscorp", "Systems Engineer", "Interview", "Second round pending"),
    ("Gringotts Data", "Data Engineer", "Applied", "Applied via LinkedIn"),
]


def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.ApplicationModel).count() > 0:
            print("Database already has data. Skipping seed.")
            return
        for company, role, status, notes in DEMO_APPLICATIONS:
            db.add(models.ApplicationModel(company=company, role=role, status=status, notes=notes))
        db.commit()
        print(f"Added {len(DEMO_APPLICATIONS)} demo applications.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
