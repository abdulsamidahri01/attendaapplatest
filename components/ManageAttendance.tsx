
import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Filter, AlertTriangle, CheckCircle, Search, BookOpen } from 'lucide-react';
import { ClassData } from '../types';
import { ATTENDANCE_STORE } from './StudentsAttendance';

interface ManageAttendanceProps {
  classes: ClassData[];
}

const ManageAttendance: React.FC<ManageAttendanceProps> = ({ classes }) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedClassData = classes.find(c => c.name === selectedClass);
  const subjects = selectedClassData?.subjects || [];

  useEffect(() => {
    setSelectedSubject('');
    setMessage(null);
  }, [selectedClass]);

  useEffect(() => {
    setMessage(null);
  }, [startDate, endDate, selectedSubject]);

  const getKeysInRange = () => {
    if (!selectedClass) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const keys: string[] = [];
    const loopDate = new Date(start);
    
    while (loopDate <= end) {
      const dateStr = loopDate.toISOString().split('T')[0];
      const key = selectedSubject 
        ? `${selectedClass}_${selectedSubject}_${dateStr}` 
        : `${selectedClass}_${dateStr}`;
      
      if (ATTENDANCE_STORE[key]) {
        keys.push(key);
      }
      loopDate.setDate(loopDate.getDate() + 1);
    }
    return keys;
  };

  const matchingKeys = getKeysInRange();

  const handleDeleteAttendance = () => {
    if (!selectedClass) {
      setMessage({ type: 'error', text: 'Please select a class first.' });
      return;
    }

    if (matchingKeys.length === 0) {
      setMessage({ type: 'warning', text: 'No attendance records found for the selected range.' });
      return;
    }

    matchingKeys.forEach(key => {
      delete ATTENDANCE_STORE[key];
    });
    
    localStorage.setItem('attenda_attendance', JSON.stringify(ATTENDANCE_STORE));
    
    setMessage({ type: 'success', text: `Attendance records for ${matchingKeys.length} dates deleted successfully.` });
    setShowConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reset Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete attendance records for a class or subject across a date range.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Filter size={20} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white">Delete Filter</h3>
        </div>

        <div className="p-8 space-y-8">
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 
                    message.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                    'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Start Date</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none dark:text-white"
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">End Date</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none dark:text-white"
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Class</label>
                    <div className="relative">
                        <select 
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none appearance-none cursor-pointer dark:text-white"
                        >
                            <option value="">-- Select --</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                    <div className="relative">
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none appearance-none cursor-pointer disabled:opacity-50 dark:text-white"
                        >
                            <option value="">General Attendance</option>
                            {subjects.map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                            ))}
                        </select>
                        <BookOpen size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700">
                {!selectedClass ? (
                    <p className="text-gray-400 text-sm italic font-medium">Configure criteria to analyze system records.</p>
                ) : matchingKeys.length > 0 ? (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-green-100 dark:border-green-800 shadow-sm">
                            <CheckCircle size={14} /> {matchingKeys.length} Sessions Found
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                            Found marked attendance for <span className="font-bold text-gray-800 dark:text-white">{selectedClass}</span> across the selected dates.
                        </p>
                        <button 
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-3 px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-200 dark:shadow-rose-900/20 active:scale-95"
                        >
                            <Trash2 size={18} />
                            Purge Records
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-gray-200 dark:border-slate-700">
                            <XCircle size={14} className="opacity-50" /> No Records Found
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">The system has no attendance logs for this specific period and class.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-white dark:border-slate-700">
                <div className="p-10 text-center">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">Confirm Reset?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 leading-relaxed px-2">
                        You are about to delete <span className="font-bold text-slate-800 dark:text-white">{matchingKeys.length} dates</span> of attendance logs. This action is irreversible.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleDeleteAttendance}
                            className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-200 dark:shadow-rose-900/20 active:scale-95"
                        >
                            Purge
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const XCircle = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);

export default ManageAttendance;
