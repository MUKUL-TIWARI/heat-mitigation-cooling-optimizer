import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import RightPanel from './components/RightPanel';
import BottomPanel from './components/BottomPanel';
import { Layers, ThermometerSun, Leaf, Droplets } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [selectedCell, setSelectedCell] = useState<any>(null);
  
  return (
    <div className="flex h-screen bg-neutral-950 text-slate-200 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 relative">
        
        {/* HEADER */}
        <header className="absolute top-0 w-full z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ThermometerSun className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-300">
                UrbanHeat AI
              </h1>
              <p className="text-xs text-slate-400">Intelligent Cooling Optimization Platform</p>
            </div>
          </div>
          
          <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Demo Mode Active</span>
          </div>
        </header>

        {/* MAP CONTAINER (CENTER) */}
        <div className="flex-1 relative">
          <MapComponent 
            activeTab={activeTab} 
            onCellSelect={setSelectedCell}
          />
        </div>
        
        {/* BOTTOM PANEL */}
        <BottomPanel selectedCell={selectedCell} />
        
      </div>
      
      {/* RIGHT PANEL (ANALYSIS) */}
      <RightPanel selectedCell={selectedCell} />
      
    </div>
  );
}

export default App;
