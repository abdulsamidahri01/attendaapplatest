
import React, { useState } from 'react';
import { BookOpen, Pencil, Plus, X, Check, Trash2, AlertCircle } from 'lucide-react';
import { ClassData } from '../types';

interface ShowSubjectsProps {
  classes: ClassData[];
  onUpdateClass: (updatedClass: ClassData) => void;
}

const ShowSubjects: React.FC<ShowSubjectsProps> = ({ classes, onUpdateClass }) => {
  // Local UI State
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = (cls: ClassData) => {
    if (!newSubject.trim()) {
      setAddingToId(null);
      return;
    }
    
    // Prevent duplicates
    if (cls.subjects.some(s => s.toLowerCase() === newSubject.trim().toLowerCase())) {
      setNewSubject('');
      setAddingToId(null);
      return;
    }

    const updated = {
      ...cls,
      subjects: [...cls.subjects, newSubject.trim()]
    };
    onUpdateClass(updated);
    setNewSubject('');
    setAddingToId(null);
  };

  const handleRemoveSubject = (cls: ClassData, subject: string) => {
    const updated = {
      ...cls,
      subjects: cls.subjects.filter(s => s !== subject)
    };
    onUpdateClass(updated);
  };

  const handleSaveClassName = () => {
    if (editingClass && editClassName.trim()) {
      onUpdateClass({ ...editingClass, name: editClassName.trim() });
      setEditingClass(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Academic Curriculum</h1>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Classes With Subjects</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Manage course allocations per academic unit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.length > 0 ? classes.map((cls) => (
          <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black tracking-tight">{cls.name}</h3>
                <div className="flex gap-2">
                   <button 
                    onClick={() => { setEditingClass(cls); setEditClassName(cls.name); }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    title="Edit Class Name"
                   >
                     <Pencil size={14} />
                   </button>
                   <button 
                    onClick={() => setAddingToId(cls.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    title="Add Subject"
                   >
                     <Plus size={14} />
                   </button>
                </div>
              </div>
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">{cls.subjects.length} Subjects Assigned</p>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6 text-slate-400 dark:text-slate-500">
                <BookOpen size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Subject Inventory</span>
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
                {cls.subjects.map((subject, idx) => (
                  <div 
                    key={idx} 
                    className="group/badge relative px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    {subject}
                    <button 
                      onClick={() => handleRemoveSubject(cls, subject)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}

                {addingToId === cls.id ? (
                  <div className="w-full mt-4 flex gap-2 animate-in zoom-in-95 duration-200">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Subject name..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubject(cls)}
                      className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button 
                      onClick={() => handleAddSubject(cls)}
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => setAddingToId(null)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-xl hover:bg-slate-200"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingToId(cls.id)}
                    className="w-full mt-4 py-3 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} strokeWidth={3} />
                    Add Subject
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
            <div className="col-span-full py-24 text-center text-slate-300 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-700 shadow-sm">
                <BookOpen size={48} className="mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">No Curriculums Defined</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Go to All Classes to initialize academic units</p>
            </div>
        )}
      </div>

      {/* Edit Class Name Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-white dark:border-slate-700">
            <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-700">
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-[10px] tracking-widest">Update Class Designation</h3>
              <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-rose-500 p-2 bg-slate-50 dark:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10">
              <div className="mb-6">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Institutional Label</label>
                <input 
                  type="text" 
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-all text-slate-700 dark:text-slate-200 shadow-inner font-bold"
                  placeholder="e.g. CLASS 10-A"
                  autoFocus
                />
              </div>
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-start gap-3 border border-blue-100 dark:border-blue-900/30">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>Renaming academic units synchronizes across all registries and portals.</p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingClass(null)}
                className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveClassName}
                className="px-8 py-3 text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center gap-2"
              >
                Apply Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowSubjects;
