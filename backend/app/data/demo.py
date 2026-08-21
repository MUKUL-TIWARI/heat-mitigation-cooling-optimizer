import numpy as np
import geopandas as gpd
from shapely.geometry import Polygon
import uuid

class DemoDataGenerator:
    """Generates synthetic geospatial data for the Demo City."""

    def __init__(self, seed: int = 42):
        self.seed = seed
        np.random.seed(self.seed)

    def generate_city_grid(self, 
                           bbox: tuple[float, float, float, float] = (77.1, 28.5, 77.3, 28.7),
                           rows: int = 20, 
                           cols: int = 20) -> gpd.GeoDataFrame:
        """
        Generate a synthetic city grid with correlated environmental variables.
        bbox format: (min_lon, min_lat, max_lon, max_lat)
        """
        minx, miny, maxx, maxy = bbox
        width = (maxx - minx) / cols
        height = (maxy - miny) / rows

        polygons = []
        data = []

        # Create spatial patterns
        # Urban center (high built-up, low vegetation) around center of grid
        center_x = cols / 2
        center_y = rows / 2

        for i in range(rows):
            for j in range(cols):
                # Geometry
                x1 = minx + j * width
                y1 = miny + i * height
                x2 = x1 + width
                y2 = y1 + height
                poly = Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])
                polygons.append(poly)

                # Distance from urban core
                dist_to_center = np.sqrt((j - center_x)**2 + (i - center_y)**2)
                normalized_dist = np.clip(dist_to_center / (max(rows, cols) / 2), 0, 1)

                # Features with realistic correlations
                # Urban core has high built-up fraction, periphery has lower
                built_up_fraction = np.clip(1.0 - normalized_dist + np.random.normal(0, 0.1), 0.1, 0.95)
                impervious_fraction = np.clip(built_up_fraction + np.random.normal(0.05, 0.05), 0.1, 0.98)
                
                # Vegetation is inversely correlated with built-up
                vegetation_fraction = np.clip(1.0 - built_up_fraction - np.random.normal(0, 0.1), 0.0, 0.8)
                ndvi = np.clip(vegetation_fraction * 0.8 + np.random.normal(0, 0.05), -0.1, 0.8)
                
                # Water body in a specific area (e.g., a river cutting through)
                water_fraction = 0.0
                if abs(j - i) < 2:  # Diagonal river
                    water_fraction = np.clip(0.8 + np.random.normal(0, 0.1), 0.5, 1.0)
                    built_up_fraction = np.clip(built_up_fraction - 0.5, 0.0, 0.4)
                    vegetation_fraction = np.clip(vegetation_fraction + 0.2, 0.0, 0.6)
                ndwi = np.clip(water_fraction * 0.8 + np.random.normal(0, 0.05), -0.2, 0.8)
                
                # NDBI correlated with built-up
                ndbi = np.clip(built_up_fraction * 0.6 + np.random.normal(0, 0.1), -0.5, 0.6)
                
                # Albedo
                albedo = np.clip(0.15 + 0.1 * built_up_fraction - 0.05 * vegetation_fraction + np.random.normal(0, 0.02), 0.05, 0.3)
                
                building_density = built_up_fraction * 1.2
                road_density = impervious_fraction * 0.8

                # Base meteorology
                air_temperature = 32.0 + np.random.normal(0, 0.5) + (built_up_fraction * 1.5)  # UHI effect on air temp
                humidity = 40.0 + np.random.normal(0, 2.0) + (water_fraction * 10) + (vegetation_fraction * 5)
                wind_speed = np.clip(3.0 - (built_up_fraction * 1.5) + np.random.normal(0, 0.5), 0.5, 5.0)

                # Land Surface Temperature (LST) - The Target Variable
                # High built up -> higher LST
                # High vegetation -> lower LST
                # High water -> much lower LST
                # High albedo -> lower LST
                base_lst = 35.0
                lst = (
                    base_lst 
                    + (built_up_fraction * 8.0) 
                    - (vegetation_fraction * 5.0) 
                    - (water_fraction * 6.0) 
                    - (albedo * 10.0)
                    + (air_temperature - 32.0) * 0.5
                    + np.random.normal(0, 0.8) # spatial noise
                )

                data.append({
                    "cell_id": str(uuid.uuid4()),
                    "latitude": poly.centroid.y,
                    "longitude": poly.centroid.x,
                    "lst": lst,
                    "air_temperature": air_temperature,
                    "humidity": humidity,
                    "wind_speed": wind_speed,
                    "ndvi": ndvi,
                    "ndwi": ndwi,
                    "ndbi": ndbi,
                    "vegetation_fraction": vegetation_fraction,
                    "built_up_fraction": built_up_fraction,
                    "impervious_fraction": impervious_fraction,
                    "water_fraction": water_fraction,
                    "albedo": albedo,
                    "building_density": building_density,
                    "road_density": road_density
                })

        gdf = gpd.GeoDataFrame(data, geometry=polygons, crs="EPSG:4326")
        return gdf

if __name__ == "__main__":
    generator = DemoDataGenerator()
    gdf = generator.generate_city_grid()
    print(f"Generated {len(gdf)} synthetic grid cells.")
    print(gdf.head())
