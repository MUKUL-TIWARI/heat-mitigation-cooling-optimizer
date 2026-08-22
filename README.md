# heat-mitigation-cooling-optimizer

**Intelligent Urban Heat Hotspot Detection, Driver Analysis & Cooling Optimization Platform**

heat-mitigation-cooling-optimizer is a physics-informed, geospatial AI/ML platform engineered as an interactive 3D urban digital twin. It identifies urban heat stress hotspots, quantifies key drivers of urban heating, and generates optimized, scenario-based cooling interventions for mitigating urban heat impacts.

## Experience the 3D Digital Twin

The frontend has been completely redesigned into a responsive, cinematic, scroll-driven 3D experience. As you scroll, the camera intelligently flies through the city to highlight thermal layers, explain urban drivers, and allow interactive scenario design.

### Features

- **Cinematic 3D Scroll Storytelling**: Built with MapLibre GL JS and GSAP ScrollTrigger for seamless spatial narrative.
- **Heat Hotspot Detection**: Statistical identification of severe urban heat clusters with a custom 3D heat layer.
- **AI Driver Attribution**: SHAP-based feature importance explaining why an area is hot.
- **Cooling Scenario Lab**: An interactive Intervention Designer panel allowing you to simulate the effects of Tree Canopy, Cool Roofs, and Albedo modification on the fly.
- **Real-Time Map Visualization**: Adjusting intervention parameters instantly updates the geospatial data layers to preview cooling impacts.
- **Demo Mode**: Built-in mock models for immediate demonstration when backend models aren't active.

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
                HEAT PREDICTION & INTERVENTION
                               |
           CINEMATIC 3D DIGITAL TWIN (FRONTEND)
```

## Scientific Methodology

1. **Observations**: Captures surface temperature (LST) and urban features (NDVI, NDBI, Albedo).
2. **Modeling**: An XGBoost model predicts LST based on urban morphology and meteorology.
3. **Physics constraints**: Expected cooling (e.g., from increased vegetation) is governed by physical heuristics to prevent ML extrapolation errors.
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
The 3D dashboard will be available at `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env` and fill in API keys if connecting to live datasets in the future.

## Limitations & Future Work

- **Limitations**: The demo mode uses static representations of scientific calculations. True physical constraints require complex energy-balance models. Intervention costs are mock estimations.
- **Future Work**: Connect the 3D Intervention Designer directly to the backend Python Optimizer to stream real Pareto frontiers for budget analysis.
