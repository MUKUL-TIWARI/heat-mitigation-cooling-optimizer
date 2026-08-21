import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

class FeatureEngineer:
    """Prepares and engineers features for ML modeling."""

    def __init__(self):
        self.scaler = StandardScaler()
        self.numerical_features = [
            'ndvi', 'ndwi', 'ndbi', 'albedo', 
            'vegetation_fraction', 'built_up_fraction', 'impervious_fraction', 'water_fraction',
            'building_density', 'road_density', 
            'air_temperature', 'humidity', 'wind_speed'
        ]

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates derived features and prepares the dataset.
        """
        df_out = df.copy()

        # Add any advanced derived features here
        # Example: Urban cooling capacity index proxy
        df_out['cooling_capacity'] = df_out['vegetation_fraction'] * 0.7 + df_out['water_fraction'] * 0.3

        # Example: Heat storage proxy
        df_out['heat_storage_proxy'] = df_out['built_up_fraction'] * (1.0 - df_out['albedo'])

        return df_out

    def scale_features(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        Scales numerical features for ML models that require it (e.g. Neural Nets, Ridge).
        """
        df_out = df.copy()
        
        # Only scale if features exist
        cols_to_scale = [col for col in self.numerical_features if col in df.columns]
        
        if not cols_to_scale:
            return df_out
            
        if fit:
            df_out[cols_to_scale] = self.scaler.fit_transform(df[cols_to_scale])
        else:
            df_out[cols_to_scale] = self.scaler.transform(df[cols_to_scale])
            
        return df_out
