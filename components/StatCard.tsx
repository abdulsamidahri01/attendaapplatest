
import React from 'react';
import { StatCardProps } from '../types';
import { TrendingUp } from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({ title, value, subText, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 rounded-3xl ${colorClass} bg-opacity-10 dark:bg-opacity-20 transition-all duration-500 group-hover:scale-110 shadow-sm`}>
          <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full">
            <TrendingUp size={10} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
        </div>
      </div>
      
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-black dark:text-white tracking-tighter mb-2">{value}</h3>
        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{subText || 'Analytics overall'}</p>
      </div>
    </div>
  );
};

export default StatCard;
