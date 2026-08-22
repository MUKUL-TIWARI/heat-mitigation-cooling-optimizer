from fastapi import APIRouter
from typing import Dict, Any
import json
import pandas as pd
from app.schemas.scenario import Scenario
from app.schemas.optimization import OptimizationRequest, OptimizationResult
from app.optimization.scenario import InterventionEngine
from app.optimization.optimizer import SpatialOptimizer, CostModel
from app.physics.engine import PhysicsEngine
from app.ml.model import HeatPredictor
from app.data.demo import DemoSatelliteProvider
from app.geospatial.hotspots import HeatHotspotDetector
from app.geospatial.features import FeatureEngineer
from app.api.analysis import get_active_provider

router = APIRouter()

# Initialize modules
hotspot_detector = HeatHotspotDetector()
feature_engineer = FeatureEngineer()
predictor = HeatPredictor(model_type='xgboost')
physics = PhysicsEngine()
intervention_engine = InterventionEngine(ml_predictor=predictor, physics_engine=physics)
optimizer = SpatialOptimizer(cost_model=CostModel())

def get_current_baseline(bbox=None):
    provider = get_active_provider()
    if bbox is None:
        bbox = (77.1, 28.5, 77.3, 28.7)
    raw_data = provider.fetch(bbox=bbox)
    gdf = provider.transform(raw_data)
    gdf = hotspot_detector.detect(gdf)
    df_engineered = feature_engineer.engineer_features(gdf)
    for col in df_engineered.columns:
        if col not in gdf.columns:
            gdf[col] = df_engineered[col]
    return gdf

@router.post("/simulate")
def simulate_scenario(scenario: Scenario) -> Dict[str, Any]:
    """Simulates a cooling intervention scenario."""
    # Simulate
    bbox = tuple(scenario.bbox) if scenario.bbox else None
    gdf_baseline = get_current_baseline(bbox)
    df_baseline = pd.DataFrame(gdf_baseline.drop(columns=['geometry']))
    
    # Train the predictor on the current baseline (normally would use a pre-trained model)
    predictor.train(df_baseline, target='lst')
    
    df_results = intervention_engine.simulate(df_baseline, scenario)
    
    # Merge results back with geometry for map display
    gdf_results = gdf_baseline.copy()
    gdf_results['scenario_lst_pred'] = df_results['scenario_lst_pred']
    gdf_results['ml_cooling'] = df_results['ml_cooling']
    gdf_results['physics_cooling'] = df_results['physics_cooling']
    gdf_results['blended_cooling'] = df_results['blended_cooling']
    gdf_results['physically_consistent'] = df_results['physically_consistent']
    
    return {
        "status": "success",
        "scenario": scenario.name,
        "avg_cooling": float(df_results['blended_cooling'].mean()),
        "data": json.loads(gdf_results.to_json())
    }

@router.post("/optimize", response_model=OptimizationResult)
def optimize_interventions(request: OptimizationRequest) -> OptimizationResult:
    """Run spatial optimization for cooling interventions."""
    bbox = tuple(request.bbox) if request.bbox else None
    gdf_baseline = get_current_baseline(bbox)
    df_baseline = pd.DataFrame(gdf_baseline.drop(columns=['geometry']))
    predictor.train(df_baseline, target='lst')
    
    result = optimizer.optimize(df_baseline, request)
    return result
