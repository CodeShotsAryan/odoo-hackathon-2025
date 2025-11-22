from pydantic import BaseModel, EmailStr

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
