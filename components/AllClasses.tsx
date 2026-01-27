
import React, { useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, X, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { ClassData } from '../types';

interface AllClassesProps {
  classes: ClassData[];
  onAddClass: (newClass: ClassData) => void;
  onUpdateClass: (updatedClass: ClassData) => void;
  onDeleteClass: (id: string) => void;
  onClearAll?: () => void;
  userRole?: string | null;
}

const StatCircle = ({ label, count, total, colorClass, ringColor }: { label: string, count: number, total: number, colorClass: string, ringColor: string }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-14 mb-3 flex items-center justify-center">
        <svg className="transform -rotate-90 w-14 h-14" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${ringColor} transition-all duration-700 ease-in-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[10px] font-black ${colorClass}`}>
              {percentage}%
            </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-black text-slate-900 dark:text-white">{count}</p>
      </div>
    </div>
  );
};

const AllClasses: React.FC<AllClassesProps> = ({ classes, onAddClass, onUpdateClass, onDeleteClass, onClearAll, userRole }) => {
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; classId: string | null; className: string }>({
    isOpen: false,
    classId: null,
    className: ''
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const isAdmin = userRole === 'admin';
  const isEmployee = userRole === 'employee';

  const handleEditClick = (cls: ClassData) => {
    setEditingClass(cls);
    setEditName(cls.name);
  };

  const handleSaveEdit = () => {
    if (editingClass) {
      onUpdateClass({ ...editingClass, name: editName });
      setEditingClass(null);
    }
  };

  const handleSaveNewClass = () => {
    if (newClassName.trim()) {
      onAddClass({
        id: Date.now().toString(),
        name: newClassName.toUpperCase(),
        studentCount: 0,
        boys: 0,
        girls: 0,
        na: 0,
        subjects: [],
        subjectTeachers: {}
      });
      setIsAdding(false);
      setNewClassName('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Classes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">All Registered Classes</p>
        </div>
        
        {isAdmin && classes.length > 0 && (
            <button 
                onClick={() => setShowClearConfirm(true)}
                className="px-6 py-2.5 bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition-all flex items-center gap-2"
            >
                <Trash2 size={14} /> Clear All Classes
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="bg-[#2563eb] p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-1 uppercase">{cls.name}</h3>
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">{cls.studentCount} Students Enrolled</p>
                </div>
                {!isEmployee && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(cls)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Pencil size={14} strokeWidth={3} />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, classId: cls.id, className: cls.name })} className="p-2 bg-white/10 hover:bg-rose-500 rounded-xl transition-colors">
                      <Trash2 size={14} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Gender Distribution */}
              <div className="flex justify-between items-center mb-10 px-4">
                 <StatCircle label="Boys" count={cls.boys} total={cls.studentCount} colorClass="text-blue-600" ringColor="text-blue-600" />
                 <StatCircle label="Girls" count={cls.girls} total={cls.studentCount} colorClass="text-pink-600" ringColor="text-pink-600" />
                 <StatCircle label="Other" count={cls.na} total={cls.studentCount} colorClass="text-slate-400" ringColor="text-slate-400" />
              </div>

              {/* Subjects Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <BookOpen size={16} className="text-blue-600" strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Subjects</span>
                </div>
                
                {cls.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cls.subjects.map((subj, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded-xl border border-slate-100 dark:border-slate-700 uppercase tracking-tighter">
                        {subj}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Subjects Assigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Create New Class Placeholder */}
        {!isEmployee && (
          <div 
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50/20 transition-all duration-300 group"
          >
            <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 shadow-sm">
                <Plus size={32} className="text-slate-300 group-hover:text-white" strokeWidth={3} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-blue-600 transition-colors">Create New Class</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Establish New Class</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Institutional Label</label>
                            <input 
                                autoFocus
                                type="text"
                                placeholder="e.g. BS-I ZOO"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold uppercase transition-all"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Cancel</button>
                            <button onClick={handleSaveNewClass} className="flex-1 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Create Class</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-10 text-center">
                <Trash2 size={48} className="mx-auto text-rose-500 mb-6" />
                <h3 className="text-xl font-black mb-2">Wipe Registry?</h3>
                <p className="text-sm text-slate-500 mb-8">Permanently delete all class records from the cloud database.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase">Cancel</button>
                    <button onClick={() => { onClearAll?.(); setShowClearConfirm(false); }} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase">Clear All</button>
                </div>
            </div>
        </div>
      )}

      {/* Edit Modal (Reuse Add Styling) */}
      {editingClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Update Class Label</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">New Identity</label>
                            <input 
                                autoFocus
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold uppercase transition-all"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setEditingClass(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Cancel</button>
                            <button onClick={handleSaveEdit} className="flex-1 py-4 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10 text-center">
                    <div className="h-20 w-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
                        <AlertTriangle size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Remove Class?</h3>
                    <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">Permanently delete <span className="font-bold text-slate-900">"{deleteModal.className}"</span> and all associated academic data?</p>
                    <div className="flex gap-4">
                        <button onClick={() => setDeleteModal({ isOpen: false, classId: null, className: '' })} className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">Cancel</button>
                        <button onClick={() => {
                          if (deleteModal.classId) onDeleteClass(deleteModal.classId);
                          setDeleteModal({ isOpen: false, classId: null, className: '' });
                        }} className="flex-1 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all">Delete</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AllClasses;
