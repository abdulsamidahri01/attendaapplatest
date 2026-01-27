
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Save, CheckCircle, XCircle, User, Check, BookOpen } from 'lucide-react';
import { dashboardNavState } from './Dashboard';
import { ClassData, StudentData } from '../types';

const storedAttendance = localStorage.getItem('attenda_attendance');
export const ATTENDANCE_STORE: Record<string, Record<string, 'present' | 'absent'>> = storedAttendance ? JSON.parse(storedAttendance) : {};

interface StudentsAttendanceProps {
  students?: StudentData[];
  classes?: ClassData[];
  currentEmployeeId?: string;
}

const StudentsAttendance: React.FC<StudentsAttendanceProps> = ({ students = [], classes = [], currentEmployeeId }) => {
  const today = new Date().toISOString().split('T')[0];
  const preselectedClass = dashboardNavState?.className || "";
  const preselectedDate = dashboardNavState?.date || today;

  const [selectedClass, setSelectedClass] = useState<string>(preselectedClass);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(preselectedDate);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      dashboardNavState.className = '';
      dashboardNavState.date = '';
    };
  }, []);

  const filteredStudents = students.filter(s => s.className === selectedClass);
  const classData = classes.find(c => c.name === selectedClass);
  let subjects = classData?.subjects || [];

  if (currentEmployeeId && classData?.subjectTeachers) {
    subjects = subjects.filter(subject => classData.subjectTeachers?.[subject] === currentEmployeeId);
  }

  // Effect to handle subject selection when class or employee changes
  useEffect(() => {
    if (currentEmployeeId && selectedClass) {
        // For employees, default to the first subject if available
        if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
        } else {
            setSelectedSubject('');
        }
    } else {
        // For admin, reset to general
        setSelectedSubject('');
    }
  }, [selectedClass, currentEmployeeId, subjects.length]);

  useEffect(() => {
    if (!selectedClass) {
        setAttendance({});
        return;
    }
    const key = selectedSubject 
        ? `${selectedClass}_${selectedSubject}_${selectedDate}`
        : `${selectedClass}_${selectedDate}`;
    const storedData = ATTENDANCE_STORE[key];
    if (storedData) {
        setAttendance({ ...storedData });
    } else {
        const initialStatus: Record<string, 'present' | 'absent'> = {};
        filteredStudents.forEach(s => {
            initialStatus[s.id] = 'present'; 
        });
        setAttendance(initialStatus);
    }
  }, [selectedClass, selectedSubject, selectedDate, filteredStudents.length]);

  const handleSaveAttendance = () => {
    if (!selectedClass) return;
    const key = selectedSubject 
        ? `${selectedClass}_${selectedSubject}_${selectedDate}`
        : `${selectedClass}_${selectedDate}`;
    ATTENDANCE_STORE[key] = { ...attendance };
    localStorage.setItem('attenda_attendance', JSON.stringify(ATTENDANCE_STORE));
    setSaveMessage("Attendance saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const markAll = (status: 'present' | 'absent') => {
    const newAttendance = { ...attendance };
    filteredStudents.forEach(s => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    total: filteredStudents.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daily Attendance</h1>
          <p className="text-sm text-gray-500">Manage student attendance records</p>
        </div>
        {saveMessage && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <Check size={16} />
              {saveMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <Filter size={18} className="text-[#5e81f4]" />
                 Select Criteria
              </h3>
              <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Date</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm text-gray-700 bg-white"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Class</label>
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm text-gray-700 bg-white appearance-none"
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Subject</label>
                    <div className="relative">
                        <select 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
                        >
                             {/* Only show 'General Attendance' option if NOT a subject teacher restricted view */}
                            {!currentEmployeeId && <option value="">-- General Attendance --</option>}
                            
                            {subjects.map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                            ))}
                        </select>
                        <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
              </div>

              {selectedClass && filteredStudents.length > 0 && (
                 <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Summary</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 py-4 px-2 rounded-xl border border-green-100 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-green-600 mb-1">{stats.present}</span>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Present</span>
                        </div>
                        <div className="bg-red-50 py-4 px-2 rounded-xl border border-red-100 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-red-600 mb-1">{stats.absent}</span>
                            <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Absent</span>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500">
                        Total Students: {stats.total}
                    </div>
                 </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                  <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        Attendance Sheet
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                         {selectedClass ? (
                            <>
                                <span className="font-medium text-[#5e81f4]">{selectedClass}</span>
                                <span>•</span>
                                <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                {selectedSubject && (
                                    <>
                                        <span>•</span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedSubject}</span>
                                    </>
                                )}
                            </>
                         ) : 'Please select a class'}
                      </p>
                  </div>
                  {selectedClass && filteredStudents.length > 0 && (
                      <div className="flex gap-3">
                          <button onClick={() => markAll('present')} className="text-xs font-semibold text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg border border-green-200 transition-colors bg-white">
                              Mark All Present
                          </button>
                          <button onClick={() => markAll('absent')} className="text-xs font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition-colors bg-white">
                              Mark All Absent
                          </button>
                      </div>
                  )}
              </div>

              <div className="flex-1 overflow-x-auto bg-white">
                 {selectedClass ? (
                     filteredStudents.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Roll No</th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-xs text-gray-500">{student.registrationNumber}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                                                    ${attendance[student.id] === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                                                `}>
                                                    {student.name.substring(0,2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all
                                                ${attendance[student.id] === 'present' 
                                                    ? 'bg-green-50 text-green-600 border border-green-200' 
                                                    : 'bg-red-50 text-red-600 border border-red-200'}
                                            `}>
                                                {attendance[student.id]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: 'present' }))}
                                                    title="Mark Present"
                                                    className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                                        attendance[student.id] === 'present' 
                                                        ? 'bg-green-500 text-white shadow-md shadow-green-200 scale-105' 
                                                        : 'bg-white text-gray-300 border border-gray-200 hover:border-green-300 hover:text-green-500'
                                                    }`}
                                                >
                                                    <CheckCircle size={20} className={attendance[student.id] === 'present' ? 'fill-current' : ''} />
                                                </button>
                                                <button 
                                                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: 'absent' }))}
                                                    title="Mark Absent"
                                                    className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                                        attendance[student.id] === 'absent' 
                                                        ? 'bg-red-500 text-white shadow-md shadow-red-200 scale-105' 
                                                        : 'bg-white text-gray-300 border border-gray-200 hover:border-red-300 hover:text-red-500'
                                                    }`}
                                                >
                                                    <XCircle size={20} className={attendance[student.id] === 'absent' ? 'fill-current' : ''} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                             <User size={48} className="mb-4 opacity-20" />
                             <p className="font-medium text-gray-500">No students found</p>
                             <p className="text-sm">There are no students enrolled in {selectedClass}.</p>
                        </div>
                     )
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                        <Filter size={48} className="mb-4 opacity-20" />
                        <p className="font-medium text-gray-500">Select Criteria</p>
                        <p className="text-sm">Please select a class from the left panel to view students.</p>
                    </div>
                 )}
              </div>
              {selectedClass && filteredStudents.length > 0 && (
                  <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                      <button 
                          onClick={handleSaveAttendance}
                          className="flex items-center gap-2 px-6 py-3 bg-[#5e81f4] hover:bg-[#4b69c6] text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                      >
                          <Save size={18} />
                          Save Attendance Record
                      </button>
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendance;
