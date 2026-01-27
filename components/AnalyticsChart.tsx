
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { REVENUE_DATA } from '../constants';

const AnalyticsChart: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-black uppercase text-slate-500">Income</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black uppercase text-slate-500">Expenses</span>
            </div>
            <select className="ml-4 rounded-xl border-none bg-slate-50 dark:bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>Q1-Q2 Overview</option>
              <option>Annual Report</option>
            </select>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={REVENUE_DATA}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#2563eb" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#e11d48" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorExpense)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
