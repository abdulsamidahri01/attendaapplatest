
import { 
  Home, PencilRuler, Briefcase, Settings, Bell, GraduationCap, ClipboardList, BookOpen, Award
} from 'lucide-react';
import { NavItem, ClassData, EmployeeData, StudentData, Notice, SchoolConfig } from './types';

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: 'dashboard' },
  { id: 'notices', label: 'Notices', icon: Bell, path: 'notices' },
  {
    id: 'classes',
    label: 'Classes',
    icon: PencilRuler,
    subItems: [{ id: 'allclasses', label: 'All Classes', path: 'allclasses' }]
  },
  {
    id: 'subjects',
    label: 'Subjects',
    icon: BookOpen,
    subItems: [{ id: 'assignsubjects', label: 'All Subjects', path: 'assignsubjects' }]
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    subItems: [
      { id: 'allstudents', label: 'All Students', path: 'allstudents' },
      { id: 'addnewstudent', label: 'Add New', path: 'addnewstudent' },
      { id: 'slogin', label: 'Manage Login', path: 'slogin' },
    ]
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: Briefcase,
    subItems: [
      { id: 'allemployees', label: 'All Employees', path: 'allemployees' },
      { id: 'addnewteacher', label: 'Add New', path: 'addnewteacher' },
      { id: 'elogin', label: 'Manage Login', path: 'elogin' },
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: ClipboardList,
    subItems: [
      { id: 'studentsattandance', label: 'Mark Attendance', path: 'studentsattandance' },
      { id: 'manageattendance', label: 'Reset Attendance', path: 'manageattendance' },
      { id: 'studentattendancereport', label: 'Attendance Report', path: 'studentattendancereport' },
    ]
  },
  { id: 'settings', label: 'Settings', icon: Settings, path: 'settings' }
];

export const SEED_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'Attenda',
  departmentName: 'DEPARTMENT OF ZOOLOGY',
  timings: { days: 'Mon - Fri', hours: '08:00 AM - 02:00 PM' },
  events: [
    { title: "Parent Teacher Meeting", date: "12 Aug", time: "10:00 AM", type: "Meeting" },
    { title: "Annual Sports Day", date: "15 Aug", time: "09:00 AM", type: "Event" },
    { title: "Science Exhibition", date: "20 Sep", time: "09:00 AM", type: "Academic" },
    { title: "Faculty Training Workshop", date: "05 Oct", time: "11:00 AM", type: "Meeting" }
  ],
  vision: "To lead in biological excellence and institutional intelligence.",
  mission: "Empowering the next generation of zoologists through data-driven academic management."
};

// 1. SYSTEM SUBJECTS (Exactly 8)
export const SYSTEM_SUBJECTS = [
  "Zoology", "Botany", "Chemistry", "English", 
  "Genetics", "Ecology", "Wildlife", "Biostatistics"
];

// 2. SEED EMPLOYEES (Empty for Production Start)
export const SEED_EMPLOYEES: EmployeeData[] = [];

// 3. SEED CLASSES (Emptied per user request)
export const SEED_CLASSES: ClassData[] = [];

// 4. SEED STUDENTS (Empty for Production Start)
export const SEED_STUDENTS: StudentData[] = [];

export const SEED_NOTICES: Notice[] = [
  { id: '1', title: 'System Initialized. Welcome to Attenda.', type: 'General', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
];

export const REVENUE_DATA = [
  { name: 'Jan', income: 0, expense: 0 },
  { name: 'Feb', income: 0, expense: 0 },
  { name: 'Mar', income: 0, expense: 0 },
  { name: 'Apr', income: 0, expense: 0 },
  { name: 'May', income: 0, expense: 0 },
  { name: 'Jun', income: 0, expense: 0 },
];
