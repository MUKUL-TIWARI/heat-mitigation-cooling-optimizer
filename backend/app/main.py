from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import data, analysis, model

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
app.include_router(model.router, prefix="/api/model", tags=["Model"])

@app.get("/")
def read_root():
    return {"message": "Welcome to UrbanHeat AI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

