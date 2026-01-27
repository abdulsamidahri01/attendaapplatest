
import React, { useRef } from 'react';
import { User, Hash, Book, Calendar, Clock, BookOpen, LogOut, Bell, Camera, GraduationCap, ChevronRight, Sparkles, Award } from 'lucide-react';
import { ClassData, StudentData, CalendarEvent, Notice, MarkRecord, EmployeeData } from '../types';
import { ATTENDANCE_STORE } from './StudentsAttendance';
import { SEED_NOTICES as DEFAULT_NOTICES } from '../constants';

interface StudentDashboardProps {
  student: StudentData;
  studentClass?: ClassData;
  events?: CalendarEvent[];
  onLogout: () => void;
  notices?: Notice[];
  marks?: MarkRecord[];
  employees?: EmployeeData[];
  onImageUpload?: (file: File) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  student, 
  studentClass, 
  events = [], 
  onLogout, 
  notices,
  marks = [],
  employees = [],
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayNotices = notices || DEFAULT_NOTICES;

  // Filter marks for this student - Using String() for robust type comparison
  const myMarks = marks.filter(m => String(m.studentId) === String(student.id));

  // Attendance Logic
  const attendanceByDate: Record<string, string[]> = {}; 
  Object.keys(ATTENDANCE_STORE).forEach(key => {
      const record = ATTENDANCE_STORE[key];
      const status = record[student.id];
      if (status) {
          const parts = key.split('_');
          const dateStr = parts[parts.length - 1]; 
          if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
              if (!attendanceByDate[dateStr]) attendanceByDate[dateStr] = [];
              attendanceByDate[dateStr].push(status);
          }
      }
  });

  const uniqueDates = Object.keys(attendanceByDate);
  const totalDays = uniqueDates.length;
  const presentDays = uniqueDates.filter(date => attendanceByDate[date].includes('present')).length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors selection:bg-blue-500 selection:text-white pb-safe">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 transform transition-transform active:scale-95">
                <GraduationCap size={20} strokeWidth={2.5} />
             </div>
             <div>
                <h1 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg leading-tight tracking-tight">Student Portal</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:block">Academic Dashboard</p>
             </div>
          </div>
          <button 
              onClick={onLogout}
              className="p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
          >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:to-slate-900 rounded-[2rem] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            <div className="relative shrink-0" onClick={() => fileInputRef.current?.click()}>
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-[2rem] p-1 bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl">
                    <img 
                    src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                    alt={student.name}
                    className="h-full w-full rounded-[1.8rem] object-cover bg-slate-100" 
                    />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            
            <div className="text-center md:text-left flex-1 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Hello, {student.name.split(' ')[0]}!</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 flex items-center gap-2">
                      <Hash size={14} className="text-blue-300" /> {student.registrationNumber}
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 flex items-center gap-2">
                      <BookOpen size={14} className="text-blue-300" /> {student.className}
                  </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform duration-700">
            <Sparkles size={180} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white">{attendancePercentage}%</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                   <Clock size={20} />
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exam Entries</p>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white">{myMarks.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                   <Award size={20} />
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* MARKS SECTION */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2.5 uppercase text-[10px] tracking-widest">
                            <Award size={18} className="text-blue-500" /> My Results Portfolio
                        </h3>
                    </div>
                    <div className="p-8">
                        {myMarks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {myMarks.map((m, idx) => {
                                    const teacher = employees.find(e => String(e.id) === String(m.teacherId));
                                    const perc = Math.round((m.marksObtained / m.maxMarks) * 100);
                                    return (
                                        <div key={idx} className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                   <h4 className="font-black text-slate-800 dark:text-white text-base tracking-tight">{m.subjectName}</h4>
                                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">By {teacher?.name || 'Faculty Member'}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${perc >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                   {perc >= 50 ? 'Passed' : 'At Risk'}
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-1 mb-3">
                                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{m.marksObtained}</span>
                                                <span className="text-xs font-bold text-slate-400">/ {m.maxMarks}</span>
                                            </div>
                                            <div className="w-full bg-slate-50 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${perc >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                                    style={{ width: `${perc}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <Award size={48} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Publication</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <InfoItem label="Guardian Context" value={student.fatherName} />
                     <InfoItem label="Biological Gender" value={student.gender} />
                     <InfoItem label="Secure Contact" value={student.contactNumber} isMono />
                     <InfoItem label="Enrollment Timestamp" value={student.admissionDate} />
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-widest">Announcements</h3>
                        <Bell size={16} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {displayNotices.slice(0, 3).map((n, i) => (
                            <div key={i} className="pl-4 border-l-2 border-blue-500 py-1">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{n.title}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{n.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ label, value, isMono = false }: { label: string, value?: string, isMono?: boolean }) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className={`font-bold text-slate-800 dark:text-slate-200 text-sm ${isMono ? 'font-mono tracking-tight' : ''}`}>
            {value || 'Not Disclosed'}
        </p>
    </div>
);

export default StudentDashboard;
