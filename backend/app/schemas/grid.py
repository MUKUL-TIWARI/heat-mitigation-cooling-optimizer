from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class GridCellBase(BaseModel):
    cell_id: str
    latitude: float
    longitude: float
    lst: float  # Land Surface Temperature
    air_temperature: float
    humidity: float
    wind_speed: float
    ndvi: float
    ndwi: float
    ndbi: float
    vegetation_fraction: float
    built_up_fraction: float
    impervious_fraction: float
    water_fraction: float
    albedo: float
    building_density: float
    road_density: float

    model_config = ConfigDict(from_attributes=True)

class GridCellFeature(GridCellBase):
    geometry: str  # WKT representation

class StudyAreaBase(BaseModel):
    name: str
    description: Optional[str] = None
    bbox: List[float] # [minx, miny, maxx, maxy]

class StudyAreaResponse(StudyAreaBase):
    id: str
    created_at: datetime
