import React from 'react';
import { Target, TrendingUp, Cpu, Leaf } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RightPanelProps {
  selectedCell: any;
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedCell }) => {
  return (
    <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col shadow-2xl">
      <div className="p-5 h-20 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <Target size={16} className="text-rose-400" />
          Zone Analysis
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
        {!selectedCell ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
               <Target size={24} className="opacity-50" />
            </div>
            <p className="text-sm text-center">Select a grid cell on the map to view detailed driver analysis.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* LST Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20">
               <p className="text-xs text-rose-300/70 font-semibold uppercase mb-1">Observed Surface Temp</p>
               <div className="flex items-baseline gap-2">
                 <h3 className="text-3xl font-bold text-white">{selectedCell.lst?.toFixed(1)}</h3>
                 <span className="text-rose-400 font-medium">°C</span>
               </div>
               <div className="mt-2 text-xs font-medium px-2 py-1 bg-rose-500/20 text-rose-300 rounded inline-block">
                 {selectedCell.heat_category || 'SEVERE'} HOTSPOT
               </div>
            </div>

            {/* Drivers */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Cpu size={14} /> AI Driver Attribution
              </h4>
              
              <div className="space-y-3">
                <DriverBar label="Built-up Density" value={selectedCell.built_up_fraction} max={1} color="bg-orange-500" />
                <DriverBar label="Vegetation (NDVI)" value={selectedCell.ndvi} max={1} color="bg-emerald-500" />
                <DriverBar label="Surface Albedo" value={selectedCell.albedo} max={1} color="bg-cyan-500" />
              </div>
            </div>

            {/* ML Explainability Mock Chart */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp size={14} /> Local SHAP Values
              </h4>
              <div className="h-48 w-full bg-white/5 rounded-xl border border-white/5 p-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Built-up', value: 2.4 },
                      { name: 'Veg', value: -1.2 },
                      { name: 'Albedo', value: -0.8 },
                      { name: 'Air Temp', value: 1.1 }
                    ]} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {
                          [2.4, -1.2, -0.8, 1.1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry > 0 ? '#f43f5e' : '#10b981'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <button className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                Run Counterfactual
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DriverBar = ({ label, value, max, color }: {label: string, value: number, max: number, color: string}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-mono">{value?.toFixed(2)}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: \`\${pct}%\` }}></div>
      </div>
    </div>
  )
}

export default RightPanel;
