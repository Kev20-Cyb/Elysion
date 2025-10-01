from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
import hashlib
security = HTTPBearer()
SECRET_KEY = "elysion-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the main app without a prefix
app = FastAPI(title="Elysion Retirement Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# User Profile Types
class UserType(str, Enum):
    EMPLOYEE = "employee"
    FREELANCER = "freelancer"
    BUSINESS_OWNER = "business_owner"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    user_type: UserType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: UserType

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class RetirementProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    current_age: int
    target_retirement_age: int = 65
    monthly_income: float
    current_savings: float = 0
    monthly_contributions: float = 0
    estimated_pension: float = 0
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class DashboardData(BaseModel):
    user: User
    retirement_profile: Optional[RetirementProfile] = None
    projected_retirement_age: int = 65
    estimated_monthly_pension: float = 0
    savings_progress: float = 0
    recommendations: List[str] = []
    recent_documents: List[dict] = []

# Utility Functions
def get_password_hash(password: str) -> str:
    # Simple SHA-256 hash for MVP (in production, use bcrypt or argon2)
    return hashlib.sha256((password + "elysion_salt").encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify against SHA-256 hash
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_reset_token(email: str) -> str:
    # Create a reset token valid for 1 hour
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode = {"email": email, "exp": expire, "type": "reset"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        token_type: str = payload.get("type")
        if email is None or token_type != "reset":
            return None
        return email
    except jwt.PyJWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    return User(**user)

# Generate mock retirement data based on user profile
def generate_mock_retirement_data(user: User, profile: Optional[RetirementProfile] = None):
    recommendations = []
    projected_age = 65
    estimated_pension = 0
    savings_progress = 0
    
    if user.user_type == UserType.EMPLOYEE:
        projected_age = 62
        estimated_pension = 1800
        savings_progress = 65
        recommendations = [
            "Maximize your employer's 401(k) matching",
            "Consider increasing contributions by 2% annually",
            "Review your portfolio allocation quarterly"
        ]
    elif user.user_type == UserType.FREELANCER:
        projected_age = 67
        estimated_pension = 1200
        savings_progress = 45
        recommendations = [
            "Set up a SEP-IRA for tax-advantaged savings",
            "Build an emergency fund of 6-12 months expenses",
            "Consider diversifying income streams"
        ]
    elif user.user_type == UserType.BUSINESS_OWNER:
        projected_age = 60
        estimated_pension = 2500
        savings_progress = 80
        recommendations = [
            "Explore business succession planning options",
            "Maximize tax-deferred retirement accounts",
            "Consider establishing a defined benefit plan"
        ]
    
    return {
        "projected_retirement_age": projected_age,
        "estimated_monthly_pension": estimated_pension,
        "savings_progress": savings_progress,
        "recommendations": recommendations,
        "recent_documents": [
            {"name": "Tax Return 2023", "type": "tax", "date": "2024-03-15"},
            {"name": "401k Statement", "type": "retirement", "date": "2024-09-01"},
            {"name": "Pay Stub", "type": "income", "date": "2024-09-15"}
        ]
    }

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        user_type=user_data.user_type
    )
    
    # Store user with hashed password
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": user_data.email})
    if not user_doc or not verify_password(user_data.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = User(**user_doc)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, user=user)

@api_router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    # Check if user exists
    user = await db.users.find_one({"email": request.email})
    
    if not user:
        # For security, don't reveal if email exists or not
        return {"message": "Si cette adresse email est enregistrée, vous recevrez un lien de réinitialisation"}
    
    # Generate reset token
    reset_token = create_reset_token(request.email)
    
    # In production, send email here. For MVP, we'll return the reset link
    reset_link = f"https://future-ready-9.preview.emergentagent.com/reset-password?token={reset_token}"
    
    # Store reset token in database (optional for tracking)
    await db.password_resets.insert_one({
        "email": request.email,
        "token": reset_token,
        "created_at": datetime.utcnow(),
        "used": False
    })
    
    return {
        "message": "Si cette adresse email est enregistrée, vous recevrez un lien de réinitialisation",
        "reset_link": reset_link  # Remove this in production
    }

@api_router.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    # Verify reset token
    email = verify_reset_token(request.token)
    
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Token de réinitialisation invalide ou expiré"
        )
    
    # Check if token was already used
    reset_record = await db.password_resets.find_one({
        "token": request.token,
        "used": False
    })
    
    if not reset_record:
        raise HTTPException(
            status_code=400,
            detail="Token de réinitialisation invalide ou déjà utilisé"
        )
    
    # Update password
    hashed_password = get_password_hash(request.new_password)
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=400,
            detail="Erreur lors de la mise à jour du mot de passe"
        )
    
    # Mark token as used
    await db.password_resets.update_one(
        {"token": request.token},
        {"$set": {"used": True, "used_at": datetime.utcnow()}}
    )
    
    return {"message": "Mot de passe réinitialisé avec succès"}

# Dashboard Routes
@api_router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(current_user: User = Depends(get_current_user)):
    # Get or create retirement profile
    retirement_profile = await db.retirement_profiles.find_one({"user_id": current_user.id})
    
    # Generate mock data based on user type
    mock_data = generate_mock_retirement_data(current_user, retirement_profile)
    
    return DashboardData(
        user=current_user,
        retirement_profile=RetirementProfile(**retirement_profile) if retirement_profile else None,
        **mock_data
    )

@api_router.get("/user/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "Elysion Retirement Platform API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
