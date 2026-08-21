import numpy as np
import pandas as pd
import geopandas as gpd
from typing import Dict, Any

class HeatHotspotDetector:
    """Detects and categorizes urban heat hotspots."""

    def __init__(self, method: str = 'threshold'):
        self.method = method

    def detect(self, gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
        """
        Detect hotspots and calculate LST anomaly.
        """
        # Calculate LST Anomaly (reference: median LST of the area)
        baseline_lst = gdf['lst'].median()
        gdf['lst_anomaly'] = gdf['lst'] - baseline_lst

        # Calculate Z-score for hotspot classification
        lst_mean = gdf['lst'].mean()
        lst_std = gdf['lst'].std()
        gdf['lst_zscore'] = (gdf['lst'] - lst_mean) / lst_std

        # Categorize Heat Severity
        def categorize(z: float) -> str:
            if z > 2.0: return 'EXTREME'
            elif z > 1.0: return 'SEVERE'
            elif z > 0.5: return 'HIGH'
            elif z > -0.5: return 'MODERATE'
            else: return 'LOW'

        gdf['heat_category'] = gdf['lst_zscore'].apply(categorize)
        
        # Calculate a simplified "Heat Vulnerability Score" (0-100)
        # Higher temperature + higher built up density = more vulnerable
        vulnerability_raw = (
            (gdf['lst_anomaly'] / gdf['lst_anomaly'].max()) * 0.5 + 
            gdf['built_up_fraction'] * 0.5
        )
        gdf['vulnerability_score'] = np.clip(vulnerability_raw * 100, 0, 100)

        return gdf

    def get_summary_statistics(self, gdf: gpd.GeoDataFrame) -> Dict[str, Any]:
        """Return summary statistics of the detected hotspots."""
        return {
            "mean_lst": float(gdf['lst'].mean()),
            "max_lst": float(gdf['lst'].max()),
            "extreme_cells_count": int((gdf['heat_category'] == 'EXTREME').sum()),
            "severe_cells_count": int((gdf['heat_category'] == 'SEVERE').sum()),
            "hottest_cell_id": str(gdf.loc[gdf['lst'].idxmax(), 'cell_id']),
            "average_anomaly": float(gdf['lst_anomaly'].mean())
        }
