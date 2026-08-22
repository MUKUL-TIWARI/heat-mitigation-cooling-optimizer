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

router = APIRouter()

# Initialize modules
# Initialize modules
generator = DemoSatelliteProvider(seed=42)
hotspot_detector = HeatHotspotDetector()
predictor = HeatPredictor(model_type='xgboost')
physics = PhysicsEngine()
intervention_engine = InterventionEngine(ml_predictor=predictor, physics_engine=physics)
optimizer = SpatialOptimizer(cost_model=CostModel())

# Initialize some demo state so it works out of the box
gdf_baseline = generator.generate_city_grid(rows=20, cols=20)
gdf_baseline = hotspot_detector.detect(gdf_baseline)
df_baseline = pd.DataFrame(gdf_baseline.drop(columns=['geometry']))
predictor.train(df_baseline) # Train the model once globally for demo

@router.post("/simulate")
def simulate_scenario(scenario: Scenario) -> Dict[str, Any]:
    """Simulates a cooling intervention scenario."""
    # Simulate
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
    result = optimizer.optimize(df_baseline, request)
    return result
