import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export const LineChartWidget = () => {
  const data = [
    { name: 'Sep', income: 0, expense: 0 },
    { name: 'Oct', income: 0, expense: 0 },
    { name: 'Nov', income: 0, expense: 0 },
    { name: 'Dec', income: 0, expense: 0 },
    { name: 'Jan', income: 0, expense: 0 },
  ];

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="flex items-center">
                <div className={`w-2 h-[2px] ${entry.value === 'expense' ? 'bg-[#ff808b]' : 'bg-[#5e81f4]'}`}></div>
                <div className={`w-2 h-2 rounded-full border-[2px] ${entry.value === 'expense' ? 'border-[#ff808b]' : 'border-[#5e81f4]'}`}></div>
                <div className={`w-2 h-[2px] ${entry.value === 'expense' ? 'bg-[#ff808b]' : 'bg-[#5e81f4]'}`}></div>
            </div>
            <span className="capitalize">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#5e81f4', strokeWidth: 1.5 }}
            tickLine={false} 
            tick={{fontSize: 12, fill: '#666', dy: 10}} 
          />
          <Tooltip />
          <Legend content={renderLegend} />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#ff808b" 
            strokeWidth={0} 
            dot={{r: 4, strokeWidth: 2, fill: 'white', stroke: '#ff808b'}} 
            activeDot={{r: 6}} 
          />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#5e81f4" 
            strokeWidth={3} 
            dot={{r: 4, strokeWidth: 2, fill: 'white', stroke: '#5e81f4'}} 
            activeDot={{r: 6}} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartWidget = () => {
  const data = [
    { name: 'BS-I MBO', students: 0 },
    { name: 'BS-II MBO', students: 26 },
    { name: 'BS-III MBO', students: 33 },
    { name: 'BS-IV MBO', students: 0 },
    { name: 'BS-I ZOO', students: 0 },
    { name: 'BS-II ZOO', students: 0 },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fill: '#666'}} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="students" barSize={10} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#5e81f4' : '#ff808b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DonutChartWidget = () => {
  const data = [
    { name: 'Collections', value: 50 },
    { name: 'Remainings', value: 50 },
  ];
  const COLORS = ['#Cacccd', '#E0e5e6'];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative h-32 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
           <span className="text-gray-400 text-xs">Hidden</span>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
         <div className="text-center">
             <div className="text-sm font-bold text-gray-400">Hidden</div>
             <div className="text-[10px] text-green-500 uppercase">Collections</div>
         </div>
         <div className="text-center">
             <div className="text-sm font-bold text-gray-400">Hidden</div>
             <div className="text-[10px] text-red-400 uppercase">Remainings</div>
         </div>
      </div>
    </div>
  );
};