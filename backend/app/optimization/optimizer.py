import pandas as pd
import numpy as np
from app.schemas.optimization import OptimizationRequest, OptimizationResult, InterventionAction

class CostModel:
    def __init__(self):
        # Demo configurable unit costs (per hectare)
        self.costs = {
            'tree_planting': 500000.0,   # 5 Lakh INR / hectare
            'cool_roof': 800000.0,       # 8 Lakh INR / hectare
            'surface_albedo': 300000.0,  # 3 Lakh INR / hectare
            'water_restoration': 1000000.0 # 10 Lakh INR / hectare
        }

class SpatialOptimizer:
    """Greedy spatial optimization engine for intervention planning."""
    
    def __init__(self, cost_model: CostModel):
        self.cost_model = cost_model

    def optimize(self, gdf: pd.DataFrame, request: OptimizationRequest) -> OptimizationResult:
        """
        Runs a greedy optimization to find the best interventions given a budget.
        For demo purposes, we will rank cells by vulnerability and pick the most cost-effective intervention.
        """
        budget_remaining = request.budget_inr
        strategy = []
        total_cooling = 0.0
        affected_area = 0.0
        
        # Sort areas by heat category or vulnerability score (assuming these exist in gdf)
        if 'vulnerability_score' in gdf.columns:
            candidates = gdf.sort_values(by='vulnerability_score', ascending=False)
        elif 'lst' in gdf.columns:
            candidates = gdf.sort_values(by='lst', ascending=False)
        else:
            candidates = gdf
            
        # Simplified greedy approach
        # For each top vulnerable cell (approx 1 hectare each for demo), evaluate best intervention
        # We assume 1 cell = 1 hectare for cost calculations
        cell_area_ha = 1.0 
        
        for idx, row in candidates.iterrows():
            if budget_remaining <= 0:
                break
                
            cell_id = row.get('cell_id', f"cell_{idx}")
            
            # Evaluate potential (mock logic for demo: trees work best if low veg, cool roof if high built_up)
            options = []
            
            # Option 1: Trees
            if row.get('vegetation_fraction', 0.5) < 0.4 and budget_remaining >= self.cost_model.costs['tree_planting'] * cell_area_ha:
                cooling = 1.2 # °C (mock estimation)
                options.append(('tree_planting', self.cost_model.costs['tree_planting'] * cell_area_ha, cooling))
                
            # Option 2: Cool roofs
            if row.get('built_up_fraction', 0.5) > 0.6 and budget_remaining >= self.cost_model.costs['cool_roof'] * cell_area_ha:
                cooling = 0.8 # °C
                options.append(('cool_roof', self.cost_model.costs['cool_roof'] * cell_area_ha, cooling))
                
            if not options:
                continue
                
            # Pick best option by cooling per cost
            options.sort(key=lambda x: x[2]/x[1], reverse=True)
            best_opt = options[0]
            
            intervention_type, cost, cooling_effect = best_opt
            
            strategy.append(InterventionAction(
                zone_id=str(cell_id),
                intervention_type=intervention_type,
                area_hectares=cell_area_ha,
                estimated_cooling=-cooling_effect,
                cost=cost
            ))
            
            budget_remaining -= cost
            total_cooling -= cooling_effect
            affected_area += cell_area_ha

        # Average cooling across affected area
        avg_cooling = (total_cooling / len(strategy)) if strategy else 0.0

        return OptimizationResult(
            strategy=strategy,
            total_estimated_cooling_deg_c=avg_cooling,
            total_cost_inr=request.budget_inr - budget_remaining,
            affected_area_hectares=affected_area,
            population_exposure_reduced_pct=15.5 if strategy else 0.0, # Mock value
            confidence_interval=[avg_cooling - 0.2, avg_cooling + 0.2],
            reasoning="Greedy optimization selected highly vulnerable zones and applied the most cost-effective interventions (trees for low vegetation, cool roofs for dense built-up)."
        )
