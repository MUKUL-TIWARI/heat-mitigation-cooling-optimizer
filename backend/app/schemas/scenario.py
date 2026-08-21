from pydantic import BaseModel
from typing import Optional

class Scenario(BaseModel):
    name: str
    tree_cover_change_pct: float = 0.0      # Increase in vegetation fraction
    cool_roof_fraction: float = 0.0         # Fraction of built up converted to high albedo
    roof_albedo_change: float = 0.5         # Delta albedo for cool roofs
    surface_albedo_change: float = 0.0      # General surface albedo change
    water_area_change_pct: float = 0.0      # Increase in water fraction
    budget_inr: Optional[float] = None
    target_area_id: Optional[str] = None
