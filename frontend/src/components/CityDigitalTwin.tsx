import React, { useEffect, useState } from 'react';
import Map, { Source, Layer, MapProvider } from 'react-map-gl';
import StoryController from './StoryController';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface CityDigitalTwinProps {
  activeTab: string;
  onCellSelect: (cell: any) => void;
  interventionLevel?: number;
}

const CityDigitalTwin: React.FC<CityDigitalTwinProps> = ({ onCellSelect, interventionLevel = 1 }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch demo data from API
    const fetchDemoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/analysis/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rows: 20,
            cols: 20
          })
        });
        if (response.ok) {
           const result = await response.json();
           setGeoData(result.data);
        } else {
           console.log("Backend not running yet, using dummy data");
           setGeoData(null);
        }
      } catch (err) {
        console.log("Backend not reachable. Run backend to see actual map.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDemoData();
  }, []);

  // CARTO Dark Matter style for MapLibre
  const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  const dataLayerStyle: any = {
    id: 'heat-data',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'lst'],
        25, 'rgb(0, 0, 255)',
        45, 'rgb(255, 0, 0)'
      ],
      'fill-opacity': Math.max(0, 0.6 - (interventionLevel * 0.2))
    }
  };

  return (
    <MapProvider>
      <div className="w-full h-full bg-neutral-900 relative">
        <StoryController />
      <Map
        id="main-map"
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          longitude: 77.2,
          latitude: 28.6,
          zoom: 13,
          pitch: 45, // 3D pitch
          bearing: -17.6
        }}
        mapStyle={mapStyle}
        mapLib={maplibregl}
        interactiveLayerIds={['heat-data']}
        onClick={(e: any) => {
          if (e.features && e.features.length > 0) {
            onCellSelect(e.features[0].properties);
          }
        }}
      >
        {geoData && (
          <Source type="geojson" data={geoData}>
            <Layer {...dataLayerStyle} />
          </Source>
        )}
      </Map>

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
             <p className="text-rose-400 font-medium">Generating Urban Heat Data...</p>
           </div>
        </div>
        )}
      </div>
    </MapProvider>
  );
};

export default CityDigitalTwin;
