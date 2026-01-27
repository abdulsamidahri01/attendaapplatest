
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, ChevronDown, Trash2, User, Layout, ArrowRight, CheckCircle } from 'lucide-react';
import { ClassData, EmployeeData } from '../types';

interface AssignSubjectsProps {
  classes: ClassData[];
  employees: EmployeeData[];
  onUpdateClass: (updatedClass: ClassData) => void;
}

const AssignSubjects: React.FC<AssignSubjectsProps> = ({ classes, employees, onUpdateClass }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState("");

  // Auto-select first class on mount if available
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes.length]); // Only run when classes length changes to avoid loop if selectedClassId changes

  const selectedClassData = classes.find(c => c.id === selectedClassId);

  const handleAddSubject = () => {
    if (!selectedClassData || !subjectInput.trim()) return;
    
    const newSubject = subjectInput.trim();
    const currentSubjects = selectedClassData.subjects || [];

    // Prevent duplicates
    if (currentSubjects.some(s => s.toLowerCase() === newSubject.toLowerCase())) {
       alert("Subject already exists in this class curriculum.");
       return;
    }

    const updatedClass = {
        ...selectedClassData,
        subjects: [...currentSubjects, newSubject]
    };

    onUpdateClass(updatedClass);
    setSubjectInput("");
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    if (!selectedClassData) return;

    const updatedSubjects = selectedClassData.subjects.filter(s => s !== subjectToRemove);
    const updatedTeachers = { ...(selectedClassData.subjectTeachers || {}) };
    
    if (updatedTeachers[subjectToRemove]) {
        delete updatedTeachers[subjectToRemove];
    }

    onUpdateClass({
        ...selectedClassData,
        subjects: updatedSubjects,
        subjectTeachers: updatedTeachers
    });
  };

  const handleAssignTeacher = (subject: string, teacherId: string) => {
    if (!selectedClassData) return;

    const updatedTeachers = { ...(selectedClassData.subjectTeachers || {}) };
    
    if (teacherId) {
        updatedTeachers[subject] = teacherId;
    } else {
        delete updatedTeachers[subject];
    }

    onUpdateClass({
        ...selectedClassData,
        subjectTeachers: updatedTeachers
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Academic Curriculum</h1>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Subjects & Assignments</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Manage course allocation and faculty responsibilities</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Panel: Class Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Selection Console</h3>
            <div className="space-y-4">
              {classes.map(cls => (
                <button 
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${
                    selectedClassId === cls.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/20' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                        selectedClassId === cls.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}>
                      <Layout size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{cls.name}</span>
                  </div>
                  {selectedClassId === cls.id && <ArrowRight size={16} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1e40af] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-4">Faculty Linkage</h3>
              <p className="text-xs text-blue-100/80 leading-relaxed mb-6 font-medium">Assigning specific teachers to subjects ensures data integrity in portal results and attendance logging.</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <CheckCircle size={12} strokeWidth={3} /> Synchronized
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <User size={160} />
            </div>
          </div>
        </div>

        {/* Right Panel: Subject Editor */}
        <div className="lg:col-span-8">
          {selectedClassData ? (
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-full">
               <div className="p-10 border-b border-slate-50 dark:border-slate-700">
                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter mb-2">{selectedClassData.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Management</p>
                        </div>
                         <div className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-800 self-start sm:self-center">
                             {selectedClassData.subjects.length} Subjects
                         </div>
                   </div>
               </div>

               <div className="p-10 flex-1 space-y-12">
                  {/* Add New Subject */}
                  <div className="flex flex-col md:flex-row gap-4 p-2 bg-slate-50 dark:bg-slate-900/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                    <input 
                      type="text" 
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSubject();
                      }}
                      placeholder="Identify new subject (e.g. BIOLOGY)"
                      className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-bold uppercase placeholder:text-slate-300 dark:text-white shadow-sm"
                    />
                    <button 
                      type="button"
                      onClick={handleAddSubject}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest active:scale-95 transform duration-200"
                    >
                      <Plus size={18} strokeWidth={3} />
                      Add Unit
                    </button>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Allocated Curriculum</h4>
                    
                    {selectedClassData.subjects.length > 0 ? (
                      <div className="space-y-4">
                        {selectedClassData.subjects.map((subject) => (
                          <div 
                            key={subject} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-900/20 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg hover:shadow-blue-500/5 transition-all gap-6 group"
                          >
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-900/30">
                                    <BookOpen size={20} strokeWidth={2.5} />
                                </div>
                                <span className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">{subject}</span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <select 
                                        value={selectedClassData.subjectTeachers?.[subject] || ''}
                                        onChange={(e) => handleAssignTeacher(subject, e.target.value)}
                                        className="w-full text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 py-3 pl-4 pr-10 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600/10 outline-none transition-all dark:text-white hover:bg-white dark:hover:bg-slate-700"
                                    >
                                        <option value="">Select Instructor...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>

                                <button 
                                  onClick={() => handleRemoveSubject(subject)}
                                  className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-3 rounded-xl transition-all"
                                  title="Remove Subject"
                                >
                                  <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <BookOpen size={48} className="mx-auto mb-6 text-slate-200" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Curriculum is empty. Add subjects above.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center p-10 border border-slate-100 dark:border-slate-700">
               <div className="h-24 w-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-10 text-slate-200">
                  <Layout size={48} />
               </div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">No Active Context</h3>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest max-w-xs mx-auto">Select an academic unit from the selection console to manage its subjects and instructors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignSubjects;
