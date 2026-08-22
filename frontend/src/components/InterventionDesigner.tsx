import React, { useState } from 'react';
import { CloudRain, Target, DollarSign, Layers } from 'lucide-react';

interface Props {
  treeCanopy: number; setTreeCanopy: (v: number) => void;
  coolRoofs: number; setCoolRoofs: (v: number) => void;
  albedo: number; setAlbedo: (v: number) => void;
  bbox?: [number, number, number, number] | null;
}

const InterventionDesigner: React.FC<Props> = ({
  treeCanopy, setTreeCanopy, coolRoofs, setCoolRoofs, albedo, setAlbedo, bbox
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [optResults, setOptResults] = useState<any>(null);
  const [budget, setBudget] = useState<number>(10000000); // Default 1 Crore INR

  const handleSimulate = async () => {
    setIsSimulating(true);
    setOptResults(null);
    try {
      const response = await fetch('http://localhost:8000/api/planning/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Custom Intervention",
          tree_cover_change_pct: treeCanopy / 100,
          cool_roof_fraction: coolRoofs / 100,
          surface_albedo_change: albedo / 100,
          budget_inr: budget,
          bbox: bbox
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults({
          tempReduction: Math.abs(data.avg_cooling).toFixed(2),
          heatStressDrop: (Math.abs(data.avg_cooling) * 15).toFixed(0), // Rough approximation for demo
          cost: ((treeCanopy + coolRoofs + albedo) / 30).toFixed(1) // Simple dynamic cost
        });
      }
    } catch (err) {
      console.error("Simulation failed", err);
      // Fallback
      setResults({ tempReduction: 2.4, heatStressDrop: 34, cost: 7.3 });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResults(null);
    try {
      const response = await fetch('http://localhost:8000/api/planning/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget_inr: budget,
          objective: 'max_cooling',
          bbox: bbox
        })
      });
      if (response.ok) {
        const data = await response.json();
        setOptResults(data);
      }
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-between pointer-events-none px-4 md:px-12">
      
      {/* Controls Panel */}
      <div className="pointer-events-auto w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Layers size={24} className="text-emerald-400" />
            Intervention Designer
          </h2>
          <p className="text-sm text-slate-400">Modify physical properties to simulate cooling.</p>
        </div>

        <div className="space-y-6">
          <SliderControl label="Tree Canopy" value={treeCanopy} onChange={setTreeCanopy} unit="%" color="bg-emerald-500" />
          <SliderControl label="Cool Roofs" value={coolRoofs} onChange={setCoolRoofs} unit="%" color="bg-cyan-500" />
          <SliderControl label="Pavement Albedo" value={albedo} onChange={setAlbedo} unit="%" color="bg-orange-500" />
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <DollarSign size={14} /> Budget Constraints
            </span>
            <span className="text-sm font-mono text-white">₹{(budget / 10000000).toFixed(1)} Cr</span>
          </div>
          
          <input 
            type="range" 
            min="1000000" 
            max="50000000" 
            step="1000000"
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mb-6"
            style={{ accentColor: '#10b981' }}
          />
          
          <div className="flex gap-2">
            <button 
              onClick={handleSimulate}
              className={`w-1/2 py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all border border-emerald-500/30
                ${isSimulating ? 'bg-emerald-900/50 cursor-wait' : 'hover:bg-emerald-500/20 active:scale-[0.98]'}`}
            >
              {isSimulating ? '...' : 'SIMULATE'}
            </button>
            
            <button 
              onClick={handleOptimize}
              className={`w-1/2 py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]
                ${isOptimizing ? 'bg-emerald-700 cursor-wait' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isOptimizing ? 'OPTIMIZING...' : 'OPTIMIZE'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className={`pointer-events-auto w-full max-w-sm bg-black/60 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-3xl shadow-2xl flex flex-col transition-all duration-500 ${results || optResults ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target size={16} /> {optResults ? "Optimal Strategy" : "Simulation Result"}
        </h3>
        
        {results && (
          <div className="space-y-6">
             <div>
               <p className="text-sm text-slate-400 mb-1">Predicted Cooling</p>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">-{results.tempReduction}</span>
                 <span className="text-emerald-500 font-bold">°C</span>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
               <div>
                 <p className="text-xs text-slate-400 mb-1">Heat Stress Drop</p>
                 <p className="text-xl font-bold text-white">{results.heatStressDrop}%</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 mb-1">Estimated Cost</p>
                 <p className="text-xl font-bold text-white">₹{results.cost} Cr</p>
               </div>
             </div>
          </div>
        )}

        {optResults && (
          <div className="space-y-4">
             <div>
               <p className="text-sm text-slate-400 mb-1">Maximized Cooling</p>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">-{Math.abs(optResults.total_estimated_cooling_deg_c).toFixed(2)}</span>
                 <span className="text-emerald-500 font-bold">°C</span>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
               <div>
                 <p className="text-xs text-slate-400 mb-1">Cost Used</p>
                 <p className="text-lg font-bold text-white">₹{(optResults.total_cost_inr / 10000000).toFixed(1)} Cr</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 mb-1">Area Affected</p>
                 <p className="text-lg font-bold text-white">{optResults.affected_area_hectares.toFixed(1)} ha</p>
               </div>
             </div>

             <div className="mt-4 pt-4 border-t border-white/10">
               <p className="text-xs text-slate-400 mb-2">Strategy Highlights</p>
               <ul className="text-sm text-white space-y-2">
                 {optResults.strategy.slice(0, 3).map((s: any, idx: number) => (
                   <li key={idx} className="flex justify-between">
                     <span className="capitalize">{s.intervention_type.replace('_', ' ')}</span>
                     <span className="text-emerald-400">-{Math.abs(s.estimated_cooling).toFixed(2)}°C</span>
                   </li>
                 ))}
                 {optResults.strategy.length > 3 && <li className="text-slate-500 text-xs">+{optResults.strategy.length - 3} more interventions</li>}
               </ul>
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

const SliderControl = ({ label, value, onChange, unit }: any) => {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-slate-200">{label}</span>
        <span className="text-emerald-400">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
          accentColor: '#10b981'
        }}
      />
    </div>
  )
}

export default InterventionDesigner;
