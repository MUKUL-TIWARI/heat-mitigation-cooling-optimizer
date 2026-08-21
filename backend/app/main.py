from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import data, analysis

app = FastAPI(
    title="UrbanHeat AI",
    description="AI/ML-Based Urban Heat Mitigation & Cooling Optimization Platform API",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router, prefix="/api/data", tags=["Data"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])

@app.get("/")
def read_root():
    return {"message": "Welcome to UrbanHeat AI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

