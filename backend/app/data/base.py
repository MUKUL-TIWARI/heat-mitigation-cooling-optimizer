from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
import geopandas as gpd

class SatelliteProvider(ABC):
    """Base interface for all satellite data sources."""

    @abstractmethod
    def fetch(self, bbox: tuple[float, float, float, float], **kwargs) -> Any:
        """Fetch raw data for a given bounding box."""
        pass

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Validate the fetched data."""
        pass

    @abstractmethod
    def preprocess(self, data: Any) -> Any:
        """Preprocess the data (e.g., cloud masking)."""
        pass

    @abstractmethod
    def transform(self, data: Any, target_crs: str = "EPSG:4326") -> gpd.GeoDataFrame:
        """Transform data into a standardized GeoDataFrame."""
        pass

class DataIngestionPipeline:
    """Manages data fetching from multiple sources and merging."""
    
    def __init__(self):
        self.providers: Dict[str, SatelliteProvider] = {}

    def register_provider(self, name: str, provider: SatelliteProvider):
        self.providers[name] = provider

    def run(self, geojson_aoi: Dict[str, Any]) -> gpd.GeoDataFrame:
        # Implementation for real data merging will go here
        pass
