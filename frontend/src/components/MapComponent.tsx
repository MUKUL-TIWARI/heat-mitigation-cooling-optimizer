import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  activeTab: string;
  onCellSelect: (cell: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ activeTab, onCellSelect }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch demo data from API
    const fetchDemoData = async () => {
      try {
        setLoading(true);
        // We will call the actual endpoint when the backend is running.
        // For now, simulate loading the grid.
        const response = await fetch('http://localhost:8000/api/analysis/process/demo?rows=15&cols=15', {
          method: 'POST'
        });
        if(response.ok) {
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

  // Demo center (Delhi)
  const center: [number, number] = [28.6, 77.2];

  return (
    <div className="w-full h-full bg-neutral-900 relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {geoData && geoData.features && geoData.features.map((feature: any, idx: number) => {
           // Color based on LST Anomaly
           const lst = feature.properties.lst;
           // Simple color scale: Blue -> Red (25C to 45C)
           const normalized = Math.max(0, Math.min(1, (lst - 25) / 20));
           const r = Math.floor(normalized * 255);
           const b = Math.floor((1 - normalized) * 255);
           
           return (
             <Polygon
               key={idx}
               positions={feature.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]])}
               pathOptions={{ 
                 color: 'transparent',
                 fillColor: `rgb(${r}, 0, ${b})`, 
                 fillOpacity: 0.6 
               }}
               eventHandlers={{
                 click: () => {
                   onCellSelect(feature.properties);
                 },
               }}
             />
           )
        })}
      </MapContainer>
      
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
             <p className="text-rose-400 font-medium">Generating Urban Heat Data...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
