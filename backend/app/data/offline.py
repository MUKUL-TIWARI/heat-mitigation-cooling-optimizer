import os
from typing import Any, Dict
import geopandas as gpd
from app.data.base import SatelliteProvider
from app.data.demo import DemoSatelliteProvider

class OfflineStaticProvider(SatelliteProvider):
    """
    Offline fallback provider that supplies a pre-downloaded or locally synthesized dataset
    when Google Earth Engine credentials are not available.
    Explicitly labeled as OFFLINE DATA.
    """
    
    def __init__(self):
        # We reuse the demo generator's logic to produce a statistically viable dataframe
        # but mark it explicitly as offline fallback data.
        self._generator = DemoSatelliteProvider(seed=42)

    def fetch(self, bbox: tuple[float, float, float, float], **kwargs) -> Any:
        return {
            "bbox": bbox,
            "source": "OFFLINE FALLBACK DATASET"
        }

    def validate(self, data: Any) -> bool:
        return True

    def preprocess(self, data: Any) -> Any:
        return data

    def transform(self, data: Any, target_crs: str = "EPSG:4326") -> gpd.GeoDataFrame:
        """
        Generate the local fallback grid matching the requested bbox.
        """
        bbox = data["bbox"]
        gdf = self._generator.generate_city_grid(bbox=bbox, rows=20, cols=20)
        # Explicitly flag all rows with the source to enforce the UI requirement
        gdf["data_source"] = data["source"]
        return gdf
