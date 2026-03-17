from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str
    notes: str

class ApplicationResponse(ApplicationCreate):
    id: int

    class Config:
        from_attributes = True