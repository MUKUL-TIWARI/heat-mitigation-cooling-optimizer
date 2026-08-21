from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.ml.model import HeatPredictor
from app.data.demo import DemoDataGenerator
import pandas as pd

router = APIRouter()
predictor = HeatPredictor(model_type='xgboost')

@router.post("/train")
def train_model() -> Dict[str, Any]:
    """Train the ML model on demo data."""
    # For demo, generate a dataset to train on
    generator = DemoDataGenerator(seed=100)
    gdf = generator.generate_city_grid(rows=30, cols=30)
    df = pd.DataFrame(gdf.drop(columns=['geometry']))
    
    metrics = predictor.train(df, target='lst')
    importance = predictor.get_global_importance(df)
    
    return {
        "status": "success",
        "message": "Model trained successfully",
        "metrics": metrics,
        "feature_importance": importance
    }

@router.get("/metrics")
def get_metrics() -> Dict[str, Any]:
    """Get metrics of the trained model."""
    if predictor.model is None:
        raise HTTPException(status_code=400, detail="Model not trained yet.")
        
    return {
        "status": "success",
        "model_type": predictor.model_type
    }
