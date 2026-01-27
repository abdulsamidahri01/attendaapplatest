
import React, { useState } from 'react';
import { Search, Lock, Unlock, Key, Eye, EyeOff, Save, LogIn, ShieldCheck, X } from 'lucide-react';
import { EmployeeData, UserSession } from '../types';

interface EmployeeLoginProps {
  employees: EmployeeData[];
  onUpdate: (employee: EmployeeData) => void;
  onLoginSuccess: (session: UserSession) => void;
}

const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ employees, onUpdate, onLoginSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const toggleVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAccess = (employee: EmployeeData) => {
    onUpdate({ ...employee, hasLoginAccess: !employee.hasLoginAccess });
  };

  const startPasswordEdit = (id: string) => {
    setEditingPassword(id);
    setNewPassword('');
  };

  const savePassword = (employee: EmployeeData) => {
    if (newPassword.trim()) {
        onUpdate({ ...employee, password: newPassword });
        setEditingPassword(null);
        setNewPassword('');
    }
  };

  const handleImpersonate = (employee: EmployeeData) => {
    onLoginSuccess({
      isAuthenticated: true,
      role: 'employee',
      username: employee.username || employee.name
    });
  };

  const filteredEmployees = employees.filter(e => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (e.name || '').toLowerCase().includes(term);
    const deptMatch = (e.department || '').toLowerCase().includes(term);
    const userMatch = (e.username || '').toLowerCase().includes(term);
    return nameMatch || deptMatch || userMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Access Control</h1>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Staff Portals</h2>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm font-bold shadow-sm leading-tight"
            />
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <ShieldCheck size={14} strokeWidth={3} /> {employees.filter(e => e.hasLoginAccess).length} Staff Verified
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-6">Faculty Profile</th>
                <th className="px-6 py-6">Portal ID (Username)</th>
                <th className="px-6 py-6">Access Key</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-50 shadow-sm">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{employee.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{employee.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="font-mono text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                        {employee.username || employee.id}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                    {editingPassword === employee.id ? (
                        <div className="flex items-center gap-2 animate-in zoom-in-95">
                            <input 
                                type="text" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-32 h-10 px-4 py-0 text-xs font-black border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 bg-white leading-none"
                                placeholder="New Pass"
                                autoFocus
                            />
                            <button onClick={() => savePassword(employee)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-md transition-all active:scale-90"><Save size={14} strokeWidth={3} /></button>
                            <button onClick={() => setEditingPassword(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200"><X size={14} /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 group/row">
                            <div className="flex items-center gap-2">
                                <Key size={14} className="text-slate-300" />
                                <span className="text-sm font-black text-slate-600 font-mono tracking-tight">
                                    {visiblePasswords[employee.id] ? (employee.password || '123456') : '••••••••'}
                                </span>
                            </div>
                            <button onClick={() => toggleVisibility(employee.id)} className="text-slate-300 hover:text-slate-600 opacity-0 group-hover/row:opacity-100 transition-all">{visiblePasswords[employee.id] ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                            <button onClick={() => startPasswordEdit(employee.id)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover/row:opacity-100 hover:underline">Change</button>
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                        onClick={() => handleToggleAccess(employee)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border
                        ${employee.hasLoginAccess 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                    >
                        {employee.hasLoginAccess ? <Unlock size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={3} />}
                        {employee.hasLoginAccess ? 'Active' : 'Locked'}
                    </button>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <button onClick={() => handleImpersonate(employee)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90" title="Mirror Staff Portal"><LogIn size={20} /></button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No faculty found in registry.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
