
import React, { useState } from 'react';
import { Search, Lock, Unlock, Key, Eye, EyeOff, Save, LogIn, ShieldCheck, X } from 'lucide-react';
import { StudentData, UserSession } from '../types';

interface StudentLoginProps {
  students: StudentData[];
  onUpdate: (student: StudentData) => void;
  onLoginSuccess: (session: UserSession) => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ students, onUpdate, onLoginSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const toggleVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAccess = (student: StudentData) => {
    onUpdate({ ...student, hasLoginAccess: !student.hasLoginAccess });
  };

  const startPasswordEdit = (studentId: string) => {
    setEditingPassword(studentId);
    setNewPassword('');
  };

  const savePassword = (student: StudentData) => {
    if (newPassword.trim()) {
        onUpdate({ ...student, password: newPassword });
        setEditingPassword(null);
        setNewPassword('');
    }
  };

  const handleImpersonate = (student: StudentData) => {
    onLoginSuccess({
      isAuthenticated: true,
      role: 'student',
      username: student.registrationNumber || student.name,
      studentId: student.id
    });
  };

  const filteredStudents = students.filter(s => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (s.name || '').toLowerCase().includes(term);
    const regMatch = (s.registrationNumber || '').toLowerCase().includes(term);
    const idMatch = (s.id || '').toLowerCase().includes(term);
    return nameMatch || regMatch || idMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Access Control</h1>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Student Portals</h2>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or roll number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm font-bold shadow-sm leading-tight"
            />
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
              <ShieldCheck size={14} strokeWidth={3} /> {students.filter(s => s.hasLoginAccess).length} Authorized Accounts
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-6">Student Identity</th>
                <th className="px-6 py-6">Username (Reg. No)</th>
                <th className="px-6 py-6">Access Key</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-50 shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{student.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{student.className}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="font-mono text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                        {student.registrationNumber || student.id}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                    {editingPassword === student.id ? (
                        <div className="flex items-center gap-2 animate-in zoom-in-95">
                            <input 
                                type="text" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-32 h-10 px-4 py-0 text-xs font-black border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 bg-white leading-none"
                                placeholder="New Pass"
                                autoFocus
                            />
                            <button onClick={() => savePassword(student)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-md transition-all active:scale-90"><Save size={14} strokeWidth={3} /></button>
                            <button onClick={() => setEditingPassword(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200"><X size={14} /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 group/row">
                            <div className="flex items-center gap-2">
                                <Key size={14} className="text-slate-300" />
                                <span className="text-sm font-black text-slate-600 font-mono tracking-tight">
                                    {visiblePasswords[student.id] ? (student.password || '123456') : '••••••••'}
                                </span>
                            </div>
                            <button onClick={() => toggleVisibility(student.id)} className="text-slate-300 hover:text-slate-600 opacity-0 group-hover/row:opacity-100 transition-all">{visiblePasswords[student.id] ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                            <button onClick={() => startPasswordEdit(student.id)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover/row:opacity-100 hover:underline">Change</button>
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                        onClick={() => handleToggleAccess(student)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border
                        ${student.hasLoginAccess 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                    >
                        {student.hasLoginAccess ? <Unlock size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={3} />}
                        {student.hasLoginAccess ? 'Active' : 'Locked'}
                    </button>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <button onClick={() => handleImpersonate(student)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90" title="Mirror Student Portal"><LogIn size={20} /></button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No students found in registry.
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

export default StudentLogin;
