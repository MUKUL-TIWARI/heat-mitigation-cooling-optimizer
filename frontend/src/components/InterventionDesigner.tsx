import React, { useState } from 'react';
import { CloudRain, Target, DollarSign, Layers } from 'lucide-react';

interface Props {
  treeCanopy: number; setTreeCanopy: (v: number) => void;
  coolRoofs: number; setCoolRoofs: (v: number) => void;
  albedo: number; setAlbedo: (v: number) => void;
}

const InterventionDesigner: React.FC<Props> = ({
  treeCanopy, setTreeCanopy, coolRoofs, setCoolRoofs, albedo, setAlbedo
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setResults({
        tempReduction: 2.4,
        heatStressDrop: 34,
        cost: 7.3
      });
    }, 1500);
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
              <DollarSign size={14} /> Budget
            </span>
            <span className="text-sm font-mono text-white">₹10 Cr</span>
          </div>
          
          <button 
            onClick={handleSimulate}
            className={`w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]
              ${isSimulating ? 'bg-emerald-700 cursor-wait' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Simulating Physics...
              </span>
            ) : (
              <>
                <CloudRain size={20} /> SIMULATE IMPACT
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className={`pointer-events-auto w-full max-w-sm bg-black/60 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-3xl shadow-2xl flex flex-col transition-all duration-500 ${results ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target size={16} /> AI Optimization Result
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
