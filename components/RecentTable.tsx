
import React from 'react';
import { MoreHorizontal, ExternalLink, Search } from 'lucide-react';
import { StudentData } from '../types';

interface RecentTableProps {
  students: StudentData[];
  onNavigate?: (path: string) => void;
}

const RecentTable: React.FC<RecentTableProps> = ({ students, onNavigate }) => {
  // Get last 5 students, reversed (newest first assuming array order)
  const recentStudents = [...students].reverse().slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-end">
        <button 
          onClick={() => onNavigate && onNavigate('allstudents')}
          className="flex items-center gap-2 px-6 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-all"
        >
            Full Registry <ExternalLink size={12} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-700">
              <th className="pb-6 pl-2">Identity</th>
              <th className="pb-6">Academic Unit</th>
              <th className="pb-6">Enrollment Date</th>
              <th className="pb-6">Financials</th>
              <th className="pb-6 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {recentStudents.length > 0 ? recentStudents.map((student) => (
              <tr key={student.id} className="group hover:bg-blue-50/20 transition-all">
                <td className="py-5 pl-2">
                  <div className="flex items-center gap-4">
                    {student.image ? (
                        <img 
                            src={student.image} 
                            alt={student.name} 
                            className="h-10 w-10 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:scale-110 transition-transform">
                            {student.name.charAt(0)}
                        </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{student.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{student.registrationNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{student.className}</span>
                </td>
                <td className="py-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.admissionDate}</span>
                </td>
                <td className="py-5">
                  <span 
                    className={`inline-flex items-center rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-widest
                      ${student.feesStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        student.feesStatus === 'Unpaid' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                        'bg-amber-50 text-amber-600 border border-amber-100'}`}
                  >
                    {student.feesStatus}
                  </span>
                </td>
                <td className="py-5 text-right pr-2">
                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                 <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    No recent admissions found
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTable;
