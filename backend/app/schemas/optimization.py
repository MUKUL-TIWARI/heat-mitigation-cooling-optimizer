from pydantic import BaseModel
from typing import List, Dict, Optional

class OptimizationRequest(BaseModel):
    budget_inr: float
    objective: str = 'max_cooling' # max_cooling or max_population_protected
    target_area: Optional[str] = None
    bbox: Optional[list[float]] = None
    
class InterventionAction(BaseModel):
    zone_id: str
    intervention_type: str
    area_hectares: float
    estimated_cooling: float
    cost: float

class OptimizationResult(BaseModel):
    strategy: List[InterventionAction]
    total_estimated_cooling_deg_c: float
    total_cost_inr: float
    affected_area_hectares: float
    population_exposure_reduced_pct: Optional[float] = None
    confidence_interval: Optional[List[float]] = None
    reasoning: str
