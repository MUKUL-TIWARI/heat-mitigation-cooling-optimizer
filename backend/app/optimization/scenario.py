import pandas as pd
import numpy as np
from app.schemas.scenario import Scenario
from app.physics.engine import PhysicsEngine

class InterventionEngine:
    """Simulates cooling interventions (Counterfactual ML + Physics)."""

    def __init__(self, ml_predictor, physics_engine: PhysicsEngine):
        self.ml_predictor = ml_predictor
        self.physics = physics_engine

    def simulate(self, df_baseline: pd.DataFrame, scenario: Scenario, ml_weight: float = 0.7) -> pd.DataFrame:
        """
        Applies scenario parameters to baseline features and predicts counterfactual LST.
        """
        df_scenario = df_baseline.copy()
        
        # 1. Modify relevant features based on scenario
        
        # Tree planting
        if scenario.tree_cover_change_pct > 0:
            # Increase vegetation, cap at 1.0
            df_scenario['vegetation_fraction'] = np.clip(
                df_scenario['vegetation_fraction'] + (scenario.tree_cover_change_pct / 100.0), 
                0.0, 1.0
            )
            # Trees might slightly reduce built-up/impervious fraction
            df_scenario['impervious_fraction'] = np.clip(
                df_scenario['impervious_fraction'] - (scenario.tree_cover_change_pct / 200.0), 
                0.0, 1.0
            )

        # Cool roofs (increases albedo proportionally to built-up area)
        if scenario.cool_roof_fraction > 0:
            albedo_increase = (df_scenario['built_up_fraction'] * scenario.cool_roof_fraction * scenario.roof_albedo_change)
            df_scenario['albedo'] = np.clip(df_scenario['albedo'] + albedo_increase, 0.0, 1.0)
            
        # General surface albedo change
        if scenario.surface_albedo_change > 0:
            df_scenario['albedo'] = np.clip(df_scenario['albedo'] + scenario.surface_albedo_change, 0.0, 1.0)
            
        # Water bodies
        if scenario.water_area_change_pct > 0:
            df_scenario['water_fraction'] = np.clip(
                df_scenario['water_fraction'] + (scenario.water_area_change_pct / 100.0),
                0.0, 1.0
            )

        # 2. ML Prediction
        ml_baseline_lst = self.ml_predictor.predict(df_baseline)
        ml_scenario_lst = self.ml_predictor.predict(df_scenario)
        ml_cooling = ml_scenario_lst - ml_baseline_lst  # Negative means cooling

        # 3. Physics Estimate
        phys_cooling = self.physics.calculate_physics_cooling(df_baseline, df_scenario)

        # 4. Blended Estimate
        blended_cooling = self.physics.blend_predictions(pd.Series(ml_cooling), phys_cooling, ml_weight)

        # Build result dataframe
        df_results = pd.DataFrame(index=df_baseline.index)
        df_results['baseline_lst_pred'] = ml_baseline_lst
        df_results['scenario_lst_pred'] = ml_baseline_lst + blended_cooling
        df_results['ml_cooling'] = ml_cooling
        df_results['physics_cooling'] = phys_cooling
        df_results['blended_cooling'] = blended_cooling
        
        # Physical consistency check
        df_results['physically_consistent'] = self.physics.check_physical_consistency(df_baseline, df_scenario, pd.Series(ml_cooling))
        
        return df_results
