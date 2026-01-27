
import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Briefcase, 
  Bookmark, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { ClassAttendanceSummary, CalendarEvent, SchoolTimings, Notice, StudentData } from '../types';
import StatCard from './StatCard';
import NoticeBoard from './NoticeBoard';
import RecentTable from './RecentTable';

export const dashboardNavState = {
  className: '',
  date: ''
};

interface DashboardProps {
  onNavigate?: (path: string) => void;
  attendanceSummary?: Record<string, ClassAttendanceSummary[]>;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  totalSubjects?: number;
  events?: CalendarEvent[];
  schoolTimings?: SchoolTimings;
  notices?: Notice[];
  students?: StudentData[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate,
  totalStudents = 0,
  totalTeachers = 0,
  totalClasses = 0,
  totalSubjects = 0,
  notices,
  students = []
}) => {
  const stats = [
    { 
      title: "Active Students", 
      value: totalStudents, 
      icon: GraduationCap, 
      colorClass: "bg-blue-600",
      subText: "Verified profiles"
    },
    { 
      title: "Faculty Staff", 
      value: totalTeachers, 
      icon: Briefcase, 
      colorClass: "bg-purple-600",
      subText: "Academic teachers"
    },
    { 
      title: "Active Classes", 
      value: totalClasses, 
      icon: Layers, 
      colorClass: "bg-emerald-600",
      subText: "Semester sessions"
    },
    { 
      title: "Core Subjects", 
      value: totalSubjects, 
      icon: Bookmark, 
      colorClass: "bg-rose-600",
      subText: "Curriculum total"
    },
  ];

  const headerDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-3">Institutional Overview</h1>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Intelligence Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <Calendar size={14} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{headerDate}</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Admin Console</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorClass={stat.colorClass}
            subText={stat.subText}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Tables) */}
        <div className="lg:col-span-2 space-y-8">
            {/* Recent Admissions Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-8 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Admissions</h3>
                </div>
                <RecentTable students={students} onNavigate={onNavigate} />
            </div>
        </div>

        {/* Right Column (Notices & Extras) */}
        <div className="lg:col-span-1 space-y-8">
             {/* Notices */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                 <NoticeBoard notices={notices} />
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
