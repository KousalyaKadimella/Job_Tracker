from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base
from main import app, get_db

# Use a separate in-memory database so tests never touch job_tracker.db
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

SAMPLE = {"company": "Acme Corp", "role": "Backend Engineer", "status": "Applied", "notes": "Referral"}


def setup_function():
    # Fresh, empty tables before every test
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)


def test_root_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert "running" in response.json()["message"]


def test_create_application():
    response = client.post("/applications", json=SAMPLE)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["company"] == "Acme Corp"
    assert data["status"] == "Applied"


def test_list_applications():
    client.post("/applications", json=SAMPLE)
    client.post("/applications", json={**SAMPLE, "company": "Globex"})
    response = client.get("/applications")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_duplicate_company_and_role_is_not_saved_twice():
    first = client.post("/applications", json=SAMPLE).json()
    second = client.post("/applications", json=SAMPLE).json()
    assert first["id"] == second["id"]
    assert len(client.get("/applications").json()) == 1


def test_get_one_application():
    created = client.post("/applications", json=SAMPLE).json()
    response = client.get(f"/applications/{created['id']}")
    assert response.status_code == 200
    assert response.json()["role"] == "Backend Engineer"


def test_get_missing_application_returns_404():
    response = client.get("/applications/999")
    assert response.status_code == 404


def test_update_application_status():
    created = client.post("/applications", json=SAMPLE).json()
    response = client.put(f"/applications/{created['id']}", json={**SAMPLE, "status": "Interview"})
    assert response.status_code == 200
    assert response.json()["status"] == "Interview"


def test_update_missing_application_returns_404():
    response = client.put("/applications/999", json=SAMPLE)
    assert response.status_code == 404


def test_delete_application():
    created = client.post("/applications", json=SAMPLE).json()
    response = client.delete(f"/applications/{created['id']}")
    assert response.status_code == 200
    assert client.get("/applications").json() == []


def test_delete_missing_application_returns_404():
    response = client.delete("/applications/999")
    assert response.status_code == 404


def test_missing_required_field_returns_422():
    response = client.post("/applications", json={"company": "Acme Corp"})
    assert response.status_code == 422
