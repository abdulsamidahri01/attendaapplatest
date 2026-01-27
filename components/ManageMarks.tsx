
import React, { useState, useEffect } from 'react';
import { Award, Filter, Save, CheckCircle, User, BookOpen } from 'lucide-react';
import { ClassData, StudentData, EmployeeData, MarkRecord } from '../types';

interface ManageMarksProps {
  employee: EmployeeData;
  classes: ClassData[];
  students: StudentData[];
  marks: MarkRecord[];
  onSaveMarks: (updatedMarks: MarkRecord[]) => void;
}

const ManageMarks: React.FC<ManageMarksProps> = ({ employee, classes, students, marks, onSaveMarks }) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [localMarks, setLocalMarks] = useState<Record<string, { obtained: string; max: string; remarks: string }>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter classes teacher is assigned to
  const myClasses = classes.filter(c => 
    c.subjectTeachers && Object.values(c.subjectTeachers).includes(employee.id)
  );

  const selectedClass = classes.find(c => c.id === selectedClassId);
  
  // Filter subjects in selected class assigned to this teacher
  const mySubjects = selectedClass?.subjectTeachers 
    ? Object.entries(selectedClass.subjectTeachers)
        .filter(([_, tId]) => tId === employee.id)
        .map(([subj, _]) => subj)
    : [];

  // Robust filtering (id or name) to ensure all relevant students are found
  const classStudents = students.filter(s => 
    s.classId === selectedClassId || (selectedClass && s.className === selectedClass.name)
  );

  useEffect(() => {
    if (selectedClassId && selectedSubject) {
      const initial: Record<string, any> = {};
      classStudents.forEach(s => {
        const existing = marks.find(m => 
          String(m.studentId) === String(s.id) && 
          m.classId === selectedClassId && 
          m.subjectName === selectedSubject
        );
        initial[s.id] = {
          obtained: existing ? existing.marksObtained.toString() : '',
          max: existing ? existing.maxMarks.toString() : '100',
          remarks: existing?.remarks || ''
        };
      });
      setLocalMarks(initial);
    }
  }, [selectedClassId, selectedSubject, marks, classStudents.length]);

  const handleInputChange = (studentId: string, field: 'obtained' | 'max' | 'remarks', value: string) => {
    setLocalMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedSubject) return;

    // Filter out previous entries for this specific class/subject/teacher combo
    const filteredGlobalMarks = marks.filter(m => 
      !(m.classId === selectedClassId && m.subjectName === selectedSubject && m.teacherId === employee.id)
    );

    const newEntries: MarkRecord[] = [];
    Object.keys(localMarks).forEach((studentId) => {
      const data = localMarks[studentId];
      if (data.obtained !== '') {
        newEntries.push({
          id: `${studentId}_${selectedClassId}_${selectedSubject}`,
          studentId,
          classId: selectedClassId,
          subjectName: selectedSubject,
          teacherId: employee.id,
          marksObtained: parseFloat(data.obtained) || 0,
          maxMarks: parseFloat(data.max) || 100,
          remarks: data.remarks,
          date: new Date().toISOString()
        });
      }
    });

    onSaveMarks([...filteredGlobalMarks, ...newEntries]);
    setMessage({ type: 'success', text: 'Marks updated and synchronized successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Complete UI and fix missing default export
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Results & Grading</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Record and manage academic performance</p>
        </div>
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={16} />
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 h-fit">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Filter size={18} className="text-blue-500" />
              Criteria Selection
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Class</label>
                <select 
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedSubject('');
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold dark:text-white appearance-none outline-none"
                >
                  <option value="">Select Class...</option>
                  {myClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                <div className="relative">
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-bold dark:text-white disabled:opacity-50 appearance-none outline-none"
                  >
                    <option value="">Select Subject...</option>
                    {mySubjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-lg">Marking Sheet</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">
                  {selectedClass ? `${selectedClass.name} • ${selectedSubject || 'Selection Required'}` : 'Academic Entry Mode'}
                </p>
              </div>
              {selectedClassId && selectedSubject && (
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none transition-all flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>

            <div className="flex-1 overflow-x-auto">
              {selectedClassId && selectedSubject ? (
                classStudents.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/30 dark:bg-slate-800/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">
                        <th className="px-8 py-5">Identity</th>
                        <th className="px-6 py-5">Obtained</th>
                        <th className="px-6 py-5">Maximum</th>
                        <th className="px-8 py-5">Feedback / Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                      {classStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">{s.name}</p>
                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{s.registrationNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number"
                              value={localMarks[s.id]?.obtained || ''}
                              onChange={(e) => handleInputChange(s.id, 'obtained', e.target.value)}
                              className="w-20 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-bold text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number"
                              value={localMarks[s.id]?.max || ''}
                              onChange={(e) => handleInputChange(s.id, 'max', e.target.value)}
                              className="w-20 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-bold text-center"
                              placeholder="100"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input 
                              type="text"
                              value={localMarks[s.id]?.remarks || ''}
                              onChange={(e) => handleInputChange(s.id, 'remarks', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-sm"
                              placeholder="Add internal note..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-300">
                    <User size={48} className="opacity-20 mb-4" />
                    <p className="font-black text-xs uppercase tracking-widest">No Student Data Found</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-slate-300 p-10 text-center">
                  <Award size={64} className="opacity-20 mb-6" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Initialize Record Entry</h3>
                  <p className="text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">Please select a class and subject from the console to start recording student performance.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMarks;
