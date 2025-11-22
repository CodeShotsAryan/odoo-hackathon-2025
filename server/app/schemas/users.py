from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role_id: int
    temp_password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role_id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True
