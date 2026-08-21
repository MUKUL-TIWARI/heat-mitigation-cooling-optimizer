# UrbanHeat AI

**Intelligent Urban Heat Hotspot Detection, Driver Analysis & Cooling Optimization Platform**

UrbanHeat AI is a geospatial AI/ML-based system, backed with physics-informed decision making, to identify urban heat stress hotspots, quantify key drivers of urban heating, and generate optimized, scenario-based cooling interventions for mitigating urban heat impacts.

## Architecture

```text
             SATELLITE / WEATHER / URBAN MORPHOLOGY
                               |
                       DATA PROCESSING
                               |
                      FEATURE ENGINEERING
                               |
      +------------------------+------------------------+
      |                                                 |
   ML MODEL                                       PHYSICS MODEL
      |                                                 |
      +------------------------+------------------------+
                               |
                        HEAT PREDICTION
                               |
                        DRIVER ANALYSIS
                               |
                     COUNTERFACTUAL ENGINE
                               |
                     INTERVENTION SCENARIOS
                               |
                          OPTIMIZATION
                               |
                    RECOMMENDED COOLING PLAN
```

## Features

- **Heat Hotspot Detection**: Statistical identification of severe urban heat clusters.
- **AI Driver Attribution**: SHAP-based feature importance explaining why an area is hot.
- **Physics-Informed ML**: Constraints to ensure counterfactual predictions align with physical realities.
- **Cooling Scenario Lab**: Simulate the effects of Tree Planting, Cool Roofs, and Albedo modification.
- **Spatial Optimization**: Greedy optimization to maximize cooling under a specified budget.
- **Demo Mode**: Built-in synthetic dataset generator for immediate demonstration.

## Scientific Methodology

1. **Observations**: Captures surface temperature (LST) and urban features (NDVI, NDBI, Albedo).
2. **Modeling**: An XGBoost model predicts LST based on urban morphology and meteorology.
3. **Physics constraints**: Expected cooling (e.g. from increased vegetation) is governed by physical heuristics to prevent ML extrapolation errors.
4. **Counterfactuals**: Estimates ∆LST for interventions.
5. **Optimization**: Targets the highest vulnerability zones with the most cost-effective interventions.

## Installation & Running

### Requirements
- Python 3.10+
- Node.js 20+

### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend API will be available at `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## Demo Mode

The application operates in Demo Mode by default if external datasets are missing. It generates a synthetic 400-cell urban grid with realistic environmental correlations (e.g., higher built-up density correlates with higher LST).

## Environment Variables

Copy `.env.example` to `.env` and fill in API keys if connecting to live datasets in the future.

## Limitations & Future Work

- **Limitations**: The demo uses random-seed synthetic data. True physical constraints require complex energy-balance models. Intervention costs are mock estimations.
- **Future Work**: Connect to Google Earth Engine API, implement graph neural networks for spatial dependencies, and incorporate high-res population vulnerability data.
