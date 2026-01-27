
import React from 'react';
import { Users, BookOpen, Clock, Calendar, Bell, ClipboardList, FileText } from 'lucide-react';
import { ClassData, CalendarEvent, EmployeeData, Notice } from '../types';
// Fix: Changed NOTICES to SEED_NOTICES as per constants.tsx exports
import { SEED_NOTICES as DEFAULT_NOTICES } from '../constants';

interface EmployeeDashboardProps {
  employee: EmployeeData;
  classes: ClassData[];
  events: CalendarEvent[];
  onNavigate: (path: string) => void;
  notices?: Notice[];
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ 
  employee, 
  classes, 
  events, 
  onNavigate,
  notices 
}) => {
  const displayNotices = notices || DEFAULT_NOTICES;

  // Filter classes where this teacher is assigned to at least one subject
  const myClasses = classes.filter(c => 
    c.subjectTeachers && Object.values(c.subjectTeachers).includes(employee.id)
  );
  
  // Use myClasses if available.
  const displayClasses = myClasses; 

  const totalStudents = displayClasses.reduce((acc, curr) => acc + curr.studentCount, 0);

  // Helper to calculate real attendance rate from localStorage
  const getClassAttendanceRate = (className: string) => {
    try {
        const stored = localStorage.getItem('attenda_attendance');
        const data = stored ? JSON.parse(stored) : {};
        let totalRecords = 0;
        let presentCount = 0;

        Object.keys(data).forEach(key => {
            // Check if key belongs to this class (starts with ClassName_)
            if (key.startsWith(`${className}_`)) {
                const record = data[key];
                Object.values(record).forEach((status: any) => {
                    totalRecords++;
                    if (status === 'present') presentCount++;
                });
            }
        });

        return totalRecords === 0 ? 0 : Math.round((presentCount / totalRecords) * 100);
    } catch (e) {
        return 0;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#5e81f4] to-[#7191f6] dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome, {employee.name}</h1>
          <p className="text-blue-100 opacity-90 max-w-xl">
            You have <span className="font-bold text-white">{displayClasses.length} classes</span> and <span className="font-bold text-white">{totalStudents} students</span> under your supervision today.
          </p>
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => onNavigate('studentsattandance')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/20"
            >
              <ClipboardList size={16} /> Mark Attendance
            </button>
            <button 
              onClick={() => onNavigate('studentattendancereport')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/20"
            >
              <FileText size={16} /> Attendance Report
            </button>
          </div>
        </div>
        
        {/* Decor */}
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Users size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-colors">
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Students</p>
             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalStudents}</h3>
           </div>
           <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
             <Users size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-colors">
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Assigned Classes</p>
             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{displayClasses.length}</h3>
           </div>
           <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
             <BookOpen size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-colors">
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending Tasks</p>
             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">0</h3>
           </div>
           <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
             <Clock size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Classes */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">My Classes Overview</h3>
              {displayClasses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayClasses.map(cls => {
                        const assignedSubjects = cls.subjectTeachers && Object.values(cls.subjectTeachers).includes(employee.id)
                            ? Object.entries(cls.subjectTeachers).filter(([_, id]) => id === employee.id).map(e => e[0])
                            : [];
                        
                        const attendanceRate = getClassAttendanceRate(cls.name);
                        
                        // Dynamic Color Logic for Attendance Rate
                        let progressColor = "bg-green-500";
                        let textColor = "text-green-600 dark:text-green-400";
                        
                        if (attendanceRate === 0) {
                            progressColor = "bg-gray-300 dark:bg-gray-600";
                            textColor = "text-gray-400 dark:text-gray-500";
                        } else if (attendanceRate < 50) {
                            progressColor = "bg-red-500";
                            textColor = "text-red-600 dark:text-red-400";
                        } else if (attendanceRate < 75) {
                            progressColor = "bg-amber-500";
                            textColor = "text-amber-600 dark:text-amber-400";
                        }

                        return (
                            <div key={cls.id} className="p-5 border border-gray-100 dark:border-slate-600 rounded-xl hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all cursor-pointer group hover:shadow-md flex flex-col h-full" onClick={() => onNavigate('studentsattandance')}>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#5e81f4] dark:group-hover:text-blue-300 transition-colors">{cls.name}</h4>
                                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full uppercase tracking-wide">{cls.studentCount} Students</span>
                                </div>
                                
                                <div className="mb-4 flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Assigned Subjects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {assignedSubjects.length > 0 ? (
                                            assignedSubjects.map((subject, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg shadow-sm">
                                                    {subject}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Class Teacher</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-700/50">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Attendance Rate</span>
                                        <span className={`font-bold ${textColor}`}>
                                            {attendanceRate > 0 ? `${attendanceRate}%` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div 
                                            className={`${progressColor} h-full rounded-full transition-all duration-1000 ease-out`} 
                                            style={{ width: `${attendanceRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50">
                    <BookOpen size={40} className="text-gray-300 mb-3" />
                    <h4 className="text-gray-900 dark:text-white font-medium">No Classes Assigned</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">Contact the administrator to get your class and subject assignments.</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: Notices/Events */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Bell size={18} /> Notice Board
              </h3>
              <div className="space-y-4">
                 {displayNotices.slice(0, 3).map((notice, i) => (
                    <div key={i} className="pb-3 border-b border-gray-50 dark:border-slate-700 last:border-0 last:pb-0">
                       <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{notice.title}</p>
                       <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{notice.date}</span>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors">
               <h3 className="font-bold text-gray-800 dark:text-white mb-4">Upcoming Events</h3>
               <div className="space-y-4">
                   {events.slice(0, 2).map((event, i) => (
                        <div key={i} className="flex gap-3 items-center">
                             <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex flex-col items-center justify-center text-xs font-bold leading-none">
                                <span>{event.date.split(' ')[0]}</span>
                                <span className="text-[9px] uppercase">{event.date.split(' ')[1]}</span>
                             </div>
                             <div>
                                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{event.title}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                             </div>
                        </div>
                   ))}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
