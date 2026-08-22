import { useState } from 'react';
import CityDigitalTwin from './components/CityDigitalTwin';
import { ThermometerSun, ChevronDown } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [selectedCell, setSelectedCell] = useState<any>(null);
  
  return (
    <div className="relative w-full h-[300vh] bg-neutral-950 text-slate-200 font-sans">
      
      {/* 3D Map Background (Fixed) */}
      <div className="fixed inset-0 z-0">
        <CityDigitalTwin 
          activeTab={activeTab} 
          onCellSelect={setSelectedCell}
        />
      </div>

      {/* Cinematic Overlays (Scrollable) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        
        {/* Header Overlay */}
        <header className="fixed top-0 w-full p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex justify-between items-start transition-all duration-500">
          <div className="pointer-events-auto flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 border border-white/10">
              <ThermometerSun className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-300 tracking-tight">
                UrbanHeat AI
              </h1>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Intelligent Cooling Optimization Platform</p>
            </div>
          </div>
          
          <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 flex items-center gap-3 shadow-2xl">
             <span className="flex h-2.5 w-2.5 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Demo Mode Active</span>
          </div>
        </header>

        {/* SCENE 01: HERO */}
        <section className="h-screen w-full flex flex-col justify-center items-center text-center px-4 relative bg-gradient-to-b from-black/40 via-transparent to-transparent">
          <div className="max-w-4xl mx-auto space-y-6 transform -translate-y-8">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-tight">
              Understand the heat.<br/>
              Design the cooling.<br/>
              Optimize the city.
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Physics-informed geospatial AI for urban heat mitigation and spatial decision support.
            </p>
            
            <div className="pt-12 pointer-events-auto flex justify-center">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] tracking-wide">
                EXPLORE THE CITY
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
            <span className="text-xs font-bold tracking-widest uppercase text-white drop-shadow-md">Scroll to begin</span>
            <ChevronDown className="text-white drop-shadow-md" size={24} />
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;
