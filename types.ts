import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  path?: string;
  subItems?: NavItem[];
  badge?: string;
  badgeColor?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subText: string;
  icon: LucideIcon;
  colorClass: string;
  iconColorClass?: string;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  boys: number;
  girls: number;
  na: number;
  subjects: string[];
  subjectTeachers?: Record<string, string>; // subjectName -> teacherId
}

export interface EmployeeData {
  id: string;
  name: string;
  department?: string;
  email?: string;
  image?: string;
  // Auth
  username?: string;
  password?: string;
  hasLoginAccess?: boolean;
}

export interface StudentData {
  id: string;
  registrationNumber: string;
  name: string;
  fatherName: string;
  classId: string;
  className: string;
  admissionDate: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  feesStatus: 'Paid' | 'Unpaid' | 'Partial';
  hasLoginAccess: boolean;
  password?: string;
  image?: string;
  
  // Extended Profile Fields (Bulk Import)
  discountFee?: string;
  dob?: string;
  birthId?: string; // NIC/Birth Certificate
  cast?: string;
  orphan?: string;
  obc?: string;
  identificationMark?: string;
  previousSchool?: string;
  religion?: string;
  bloodGroup?: string;
  previousId?: string;
  disease?: string;
  additionalNote?: string;
  siblings?: string;
  address?: string;
  
  // Father Details
  fatherId?: string;
  fatherOccupation?: string;
  fatherEducation?: string;
  fatherMobile?: string;
  fatherIncome?: string;
  
  // Mother Details
  motherName?: string;
  motherId?: string;
  motherOccupation?: string;
  motherEducation?: string;
  motherMobile?: string;
  motherProfession?: string;
  motherIncome?: string;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectName: string;
  teacherId: string;
  marksObtained: number;
  maxMarks: number;
  remarks?: string;
  date: string;
}

export type UserRole = "admin" | "employee" | "student";

export interface UserSession {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  studentId?: string; // For student role
}

export interface CalendarEvent {
  title: string;
  date: string;
  time: string;
  type: string;
}

export interface Notice {
  id: string;
  title: string;
  type: string;
  date: string;
}

export interface SchoolTimings {
  days: string;
  hours: string;
}

export interface DepartmentDetails {
  phone: string;
  email: string;
  location: string;
  headOfDept: string;
}

export interface SchoolConfig {
  schoolName: string;
  departmentName: string;
  departmentLogo?: string;
  departmentDetails?: DepartmentDetails;
  vision?: string;
  mission?: string;
  chairmanMessage?: string;
  chairmanImage?: string;
  timings: SchoolTimings;
  events: CalendarEvent[];
}

export interface ClassAttendanceSummary {
  className: string;
  percentage: number;
}
