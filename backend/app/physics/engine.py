import pandas as pd
import numpy as np

class PhysicsEngine:
    """Simplified physics-informed constraints and adjustments."""

    def __init__(self):
        # Configurable physics-based sensitivities (delta LST per unit change)
        self.sensitivities = {
            'vegetation_fraction': -4.0,   # 100% veg increase -> 4 degree cooling
            'albedo': -8.0,                # 1.0 albedo increase -> 8 degree cooling
            'water_fraction': -5.0,        # 100% water increase -> 5 degree cooling
            'built_up_fraction': 6.0       # 100% built up increase -> 6 degree warming
        }

    def calculate_physics_cooling(self, df_baseline: pd.DataFrame, df_scenario: pd.DataFrame) -> pd.Series:
        """
        Calculate expected cooling purely from physical rules based on feature deltas.
        """
        cooling = pd.Series(0.0, index=df_baseline.index)
        
        for feature, sensitivity in self.sensitivities.items():
            if feature in df_baseline.columns and feature in df_scenario.columns:
                delta = df_scenario[feature] - df_baseline[feature]
                # delta > 0 for veg means cooling (negative temperature change)
                temp_change = delta * sensitivity
                cooling += temp_change
                
        return cooling

    def blend_predictions(self, 
                          ml_cooling: pd.Series, 
                          physics_cooling: pd.Series, 
                          ml_weight: float = 0.7) -> pd.Series:
        """
        Blend ML counterfactual estimate with physics-based estimate.
        """
        physics_weight = 1.0 - ml_weight
        return (ml_cooling * ml_weight) + (physics_cooling * physics_weight)

    def check_physical_consistency(self, df_baseline: pd.DataFrame, df_scenario: pd.DataFrame, ml_cooling: pd.Series) -> pd.Series:
        """
        Flag predictions that violate basic physical laws.
        e.g. Vegetation increased but model predicted warming.
        Returns a boolean series where True means physically consistent.
        """
        # Calculate pure physical expected direction (sign)
        phys_cooling = self.calculate_physics_cooling(df_baseline, df_scenario)
        
        # If physics says it should cool significantly (< -0.2), but ML says it warms (> 0.1)
        # That's a violation.
        violation = (phys_cooling < -0.2) & (ml_cooling > 0.1)
        
        # Or if physics says it should warm significantly (> 0.2), but ML says it cools (< -0.1)
        violation = violation | ((phys_cooling > 0.2) & (ml_cooling < -0.1))
        
        return ~violation
