import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import shap

class HeatPredictor:
    """ML models for LST prediction and explainability."""

    def __init__(self, model_type: str = 'xgboost'):
        self.model_type = model_type
        self.model = None
        self.features = [
            'ndvi', 'ndwi', 'ndbi', 'albedo', 
            'vegetation_fraction', 'built_up_fraction', 'impervious_fraction', 'water_fraction',
            'air_temperature', 'humidity', 'wind_speed'
        ]
        self.explainer = None

    def train(self, df: pd.DataFrame, target: str = 'lst') -> Dict[str, Any]:
        """Train the model and return metrics."""
        # Extract features and target
        X = df[self.features]
        y = df[target]

        # Spatial split would be better, but for demo we use random split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Initialize and train model
        if self.model_type == 'xgboost':
            self.model = xgb.XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
        else:
            self.model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
            
        self.model.fit(X_train, y_train)

        # Predictions
        y_pred = self.model.predict(X_test)

        # Metrics
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        # Setup Explainer
        if self.model_type == 'xgboost':
            self.explainer = shap.TreeExplainer(self.model)
        else:
            self.explainer = shap.TreeExplainer(self.model)

        return {
            "rmse": float(rmse),
            "mae": float(mae),
            "r2": float(r2),
            "model_type": self.model_type,
            "status": "trained"
        }

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        """Generate predictions for new data."""
        if self.model is None:
            raise ValueError("Model must be trained before prediction.")
        return self.model.predict(df[self.features])

    def get_global_importance(self, df: pd.DataFrame) -> Dict[str, float]:
        """Calculate global feature importance using SHAP."""
        if self.explainer is None:
            raise ValueError("Model must be trained first.")
            
        X = df[self.features]
        shap_values = self.explainer.shap_values(X)
        
        # Mean absolute SHAP value for each feature
        mean_shap = np.abs(shap_values).mean(axis=0)
        
        # Normalize to percentages
        total_importance = np.sum(mean_shap)
        if total_importance > 0:
            percentages = (mean_shap / total_importance) * 100
        else:
            percentages = mean_shap
            
        importance_dict = {
            feat: float(pct) for feat, pct in zip(self.features, percentages)
        }
        
        # Sort by importance
        return dict(sorted(importance_dict.items(), key=lambda item: item[1], reverse=True))

    def get_local_explanation(self, df: pd.DataFrame, index: int) -> Dict[str, float]:
        """Calculate SHAP values for a specific observation."""
        if self.explainer is None:
            raise ValueError("Model must be trained first.")
            
        X = df[self.features]
        row = X.iloc[[index]]
        shap_values = self.explainer.shap_values(row)[0]
        
        return {
            feat: float(val) for feat, val in zip(self.features, shap_values)
        }
