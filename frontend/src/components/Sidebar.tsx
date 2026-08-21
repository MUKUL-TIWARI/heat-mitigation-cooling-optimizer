import React from 'react';
import { Map, Layers, Activity, TreePine, Home, Wind } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'heatmap', icon: <Map size={20} />, label: 'Heat Map' },
    { id: 'drivers', icon: <Activity size={20} />, label: 'Driver Analysis' },
    { id: 'scenarios', icon: <TreePine size={20} />, label: 'Scenario Lab' },
    { id: 'optimization', icon: <Layers size={20} />, label: 'Optimization' },
  ];

  return (
    <div className="w-64 bg-neutral-950 border-r border-white/5 flex flex-col z-20">
      <div className="p-6 h-20 border-b border-white/5 flex items-center">
        <h2 className="text-sm font-semibold text-slate-400 tracking-widest uppercase">Navigation</h2>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-rose-500/10 text-rose-400 shadow-[inset_0_0_12px_rgba(244,63,94,0.1)] border border-rose-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
           <h3 className="text-xs font-semibold text-indigo-300 uppercase mb-2">City Profile</h3>
           <div className="space-y-2 text-sm text-slate-300">
             <div className="flex justify-between items-center"><span className="text-slate-500">Target Area</span> <span>Demo City Z</span></div>
             <div className="flex justify-between items-center"><span className="text-slate-500">Grid Res</span> <span>100m</span></div>
             <div className="flex justify-between items-center"><span className="text-slate-500">Baseline Temp</span> <span>35.2°C</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
