from fastapi import APIRouter
from typing import Dict, Any
from app.data.demo import DemoDataGenerator
from app.geospatial.hotspots import HeatHotspotDetector
from app.geospatial.features import FeatureEngineer
import json

router = APIRouter()
generator = DemoDataGenerator()
hotspot_detector = HeatHotspotDetector()
feature_engineer = FeatureEngineer()

@router.post("/process/demo")
def process_demo_data(rows: int = 20, cols: int = 20) -> Dict[str, Any]:
    """Generates and processes demo data, returning engineered features and hotspots."""
    # 1. Generate Demo Data
    gdf = generator.generate_city_grid(rows=rows, cols=cols)
    
    # 2. Hotspot Detection
    gdf = hotspot_detector.detect(gdf)
    summary_stats = hotspot_detector.get_summary_statistics(gdf)
    
    # 3. Feature Engineering
    # We apply feature engineering but return the unscaled values for map display
    df_engineered = feature_engineer.engineer_features(gdf)
    
    # Update the GeoDataFrame with new features
    for col in df_engineered.columns:
        if col not in gdf.columns:
            gdf[col] = df_engineered[col]
            
    geojson_data = json.loads(gdf.to_json())
    
    return {
        "status": "success",
        "stats": summary_stats,
        "data": geojson_data
    }
