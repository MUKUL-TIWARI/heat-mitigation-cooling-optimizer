from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.data.demo import DemoSatelliteProvider
from app.data.earth_engine import EarthEngineProvider
from app.data.offline import OfflineStaticProvider
from app.data.base import DataIngestionPipeline
from app.geospatial.hotspots import HeatHotspotDetector
from app.geospatial.features import FeatureEngineer
import json
import os

router = APIRouter()
generator = DemoSatelliteProvider()
hotspot_detector = HeatHotspotDetector()
feature_engineer = FeatureEngineer()

class AOIRequest(BaseModel):
    geojson: Optional[Dict[str, Any]] = None
    rows: int = 20
    cols: int = 20

def get_active_provider():
    if os.getenv("USE_EARTH_ENGINE", "false").lower() == "true":
        return EarthEngineProvider()
    return OfflineStaticProvider()

@router.post("/process")
def process_live_data(request: AOIRequest) -> Dict[str, Any]:
    """Generates and processes live or fallback data based on an AOI."""
    provider = get_active_provider()
    
    # Extract bbox from geojson if available
    bbox = (77.1, 28.5, 77.3, 28.7)
    if request.geojson and "geometry" in request.geojson:
        import numpy as np
        coords = np.array(request.geojson["geometry"]["coordinates"][0])
        minx, miny = coords.min(axis=0)
        maxx, maxy = coords.max(axis=0)
        bbox = (minx, miny, maxx, maxy)

    raw_data = provider.fetch(bbox=bbox)
    gdf = provider.transform(raw_data)
    
    # 2. Hotspot Detection
    gdf = hotspot_detector.detect(gdf)
    summary_stats = hotspot_detector.get_summary_statistics(gdf)
    
    # 3. Feature Engineering
    df_engineered = feature_engineer.engineer_features(gdf)
    
    for col in df_engineered.columns:
        if col not in gdf.columns:
            gdf[col] = df_engineered[col]
            
    geojson_data = json.loads(gdf.to_json())
    
    return {
        "status": "success",
        "provider": raw_data.get("source", "UNKNOWN"),
        "stats": summary_stats,
        "data": geojson_data
    }

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
