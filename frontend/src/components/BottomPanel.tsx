import React, { useState } from 'react';
import { Sliders, DollarSign, CloudRain } from 'lucide-react';

interface BottomPanelProps {
  selectedCell: any;
}

const BottomPanel: React.FC<BottomPanelProps> = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`absolute bottom-0 w-full transition-all duration-500 ease-in-out z-10 ${expanded ? 'h-64' : 'h-14'}`}>
      
      {/* Tab Header */}
      <div 
        className="h-14 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center px-6 justify-between cursor-pointer hover:bg-black/90 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-6">
           <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
             <Sliders size={16} className="text-emerald-400" />
             Intervention Scenarios
           </h3>
           <div className="h-4 w-px bg-white/20"></div>
           <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
             <span className="flex items-center gap-1"><TreeIcon /> Target: Max Cooling</span>
             <span className="flex items-center gap-1"><DollarSign size={14} /> Budget: ₹10 Cr</span>
           </div>
        </div>
        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
          {expanded ? 'Hide Panel' : 'Configure Scenarios'}
        </div>
      </div>

      {/* Expanded Content */}
      <div className="h-50 bg-neutral-950/95 backdrop-blur-xl border-t border-white/5 p-6 flex gap-8">
        
        {/* Sliders */}
        <div className="flex-1 space-y-5">
           <ScenarioSlider label="Increase Tree Canopy" value={30} unit="%" color="bg-emerald-500" />
           <ScenarioSlider label="Apply Cool Roofs" value={45} unit="%" color="bg-cyan-500" />
           <ScenarioSlider label="Pavement Albedo" value={0.3} unit="" color="bg-orange-500" />
        </div>
        
        {/* Simulation Button */}
        <div className="w-48 flex flex-col justify-center">
           <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex flex-col items-center gap-1 transform hover:scale-105 active:scale-95">
             <CloudRain size={20} />
             <span>SIMULATE</span>
           </button>
           <p className="text-[10px] text-center mt-3 text-slate-500 uppercase tracking-wider">Physics + ML Blended</p>
        </div>
        
        {/* Results Mock */}
        <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Estimated Cooling Benefit</p>
           <div className="flex items-baseline gap-2">
             <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">-1.8</h2>
             <span className="text-emerald-500 font-bold">°C</span>
           </div>
           <div className="mt-3 flex gap-4 text-xs text-slate-400">
             <div><span className="text-slate-300 font-medium">Cost:</span> ₹4.2 Cr</div>
             <div><span className="text-slate-300 font-medium">Area:</span> 120 ha</div>
           </div>
        </div>

      </div>
    </div>
  );
};

const ScenarioSlider = ({ label, value, unit, color }: {label: string, value: number, unit: string, color: string}) => (
  <div>
     <div className="flex justify-between text-xs font-medium mb-2">
       <span className="text-slate-300">{label}</span>
       <span className="text-slate-100">{value}{unit}</span>
     </div>
     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
       <div className={`h-full ${color}`} style={{ width: '60%' }}></div>
     </div>
  </div>
);

const TreeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <path d="M12 2v20"></path><path d="m17 7-5-5-5 5"></path><path d="m17 14-5-5-5 5"></path>
  </svg>
)

export default BottomPanel;
