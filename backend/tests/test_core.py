import pytest
import pandas as pd
import numpy as np
import geopandas as gpd
from shapely.geometry import Polygon
from app.geospatial.hotspots import HeatHotspotDetector
from app.physics.engine import PhysicsEngine

def test_hotspot_detector():
    detector = HeatHotspotDetector()
    
    # Create dummy GeoDataFrame
    data = {
        'cell_id': ['1', '2', '3'],
        'lst': [25.0, 35.0, 45.0],
        'built_up_fraction': [0.1, 0.5, 0.9]
    }
    geoms = [Polygon([(0,0), (1,0), (1,1), (0,1)]) for _ in range(3)]
    gdf = gpd.GeoDataFrame(data, geometry=geoms)
    
    result = detector.detect(gdf)
    
    assert 'heat_category' in result.columns
    assert 'lst_anomaly' in result.columns
    assert result['heat_category'].iloc[2] in ['EXTREME', 'SEVERE', 'HIGH']

def test_physics_engine_vegetation_cooling():
    physics = PhysicsEngine()
    
    # Baseline
    df_base = pd.DataFrame({'vegetation_fraction': [0.1]})
    # Scenario: +50% vegetation
    df_scen = pd.DataFrame({'vegetation_fraction': [0.6]})
    
    cooling = physics.calculate_physics_cooling(df_base, df_scen)
    
    # Should be negative (cooling)
    assert cooling.iloc[0] < 0
    # Specifically, 0.5 * -4.0 = -2.0
    assert np.isclose(cooling.iloc[0], -2.0)
