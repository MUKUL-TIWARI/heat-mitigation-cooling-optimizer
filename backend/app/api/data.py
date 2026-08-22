from fastapi import APIRouter
from typing import Dict, Any
from app.data.demo import DemoSatelliteProvider
import json

router = APIRouter()
router = APIRouter()
generator = DemoSatelliteProvider()

@router.post("/ingest/demo")
def generate_demo_data(rows: int = 20, cols: int = 20) -> Dict[str, Any]:
    """Generates synthetic Demo City geospatial data."""
    gdf = generator.generate_city_grid(rows=rows, cols=cols)
    
    # Convert GeoDataFrame to GeoJSON dictionary
    geojson_data = json.loads(gdf.to_json())
    
    return {
        "status": "success",
        "message": f"Generated {len(gdf)} demo grid cells",
        "data": geojson_data
    }
