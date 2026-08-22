from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.data.demo import DemoSatelliteProvider
from app.geospatial.hotspots import HeatHotspotDetector
from app.geospatial.features import FeatureEngineer
import json

router = APIRouter()
generator = DemoSatelliteProvider()
hotspot_detector = HeatHotspotDetector()
feature_engineer = FeatureEngineer()

class AOIRequest(BaseModel):
    geojson: Optional[Dict[str, Any]] = None
    rows: int = 20
    cols: int = 20

@router.post("/process/demo")
def process_demo_data(request: AOIRequest) -> Dict[str, Any]:
    """Generates and processes demo data based on an AOI."""
    # 1. Generate Demo Data within AOI
    gdf = generator.generate_city_grid(
        geojson_aoi=request.geojson, 
        rows=request.rows, 
        cols=request.cols
    )
    
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
