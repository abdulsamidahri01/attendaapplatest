
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AllClasses from './components/AllClasses';
import AssignSubjects from './components/AssignSubjects';
import AllStudents from './components/AllStudents';
import AddStudent from './components/AddStudent';
import BulkImportStudents from './components/BulkImportStudents';
import AllEmployees from './components/AllEmployees';
import AddEmployee from './components/AddEmployee';
import StudentLogin from './components/StudentLogin';
import EmployeeLogin from './components/EmployeeLogin';
import LandingLogin from './components/LandingLogin';
import StudentDashboard from './components/StudentDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManageMarks from './components/ManageMarks';
import StudentsAttendance from './components/StudentsAttendance';
import ManageAttendance from './components/ManageAttendance';
import AttendanceReports from './components/AttendanceReports';
import ManageNotices from './components/ManageNotices';
import Settings from './components/Settings';
import ProfileModal from './components/ProfileModal';
import { 
  NAV_ITEMS,
  ADMIN_CREDENTIALS,
  SEED_CLASSES,
  SEED_EMPLOYEES,
  SEED_STUDENTS,
  SEED_NOTICES,
  SEED_SCHOOL_CONFIG
} from './constants';
import { ClassData, EmployeeData, StudentData, UserSession, UserRole, NavItem, SchoolConfig, Notice, MarkRecord } from './types';
import { Home, ClipboardList, Bell, Settings as SettingsIcon, Award, RefreshCw, CloudLightning, AlertCircle, CheckCircle } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, deleteDoc, writeBatch, getDocs, query } from 'firebase/firestore';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({ isAuthenticated: false, role: null, username: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('dashboard');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  
  const [classes, setClasses] = useState<ClassData[]>(SEED_CLASSES);
  const [employees, setEmployees] = useState<EmployeeData[]>(SEED_EMPLOYEES);
  const [students, setStudents] = useState<StudentData[]>(SEED_STUDENTS);
  const [notices, setNotices] = useState<Notice[]>(SEED_NOTICES);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(SEED_SCHOOL_CONFIG);

  // Normalization Helper for Firestore Data
  const normalizeData = (data: any): any => {
    const normalized = { ...data };
    
    // Handle _id or id mapping
    if (!normalized.id && normalized._id) normalized.id = String(normalized._id);
    
    // Flatten nested classId objects if they exist
    if (typeof normalized.classId === 'object' && normalized.classId !== null) {
      normalized.classId = String(normalized.classId.id || normalized.classId._id || '');
    }

    // Ensure registrationNumber exists for StudentLogin listing
    if (!normalized.registrationNumber) {
      normalized.registrationNumber = normalized.id || normalized._id || 'N/A';
    }

    // Ensure username exists for EmployeeLogin listing
    if (!normalized.username) {
      normalized.username = normalized.id || normalized._id || 'staff';
    }

    return normalized;
  };

  // Firestore Real-time Listeners
  useEffect(() => {
    const unsubClasses = onSnapshot(collection(db, "classes"), (snapshot) => {
      const data = snapshot.docs.map(doc => normalizeData(doc.data()) as ClassData);
      setClasses(data.length > 0 ? data : SEED_CLASSES);
    });

    const unsubStudents = onSnapshot(collection(db, "students"), (snapshot) => {
      const data = snapshot.docs.map(doc => normalizeData(doc.data()) as StudentData);
      setStudents(data.length > 0 ? data : SEED_STUDENTS);
    });

    const unsubEmployees = onSnapshot(collection(db, "employees"), (snapshot) => {
      const data = snapshot.docs.map(doc => normalizeData(doc.data()) as EmployeeData);
      setEmployees(data.length > 0 ? data : SEED_EMPLOYEES);
    });

    const unsubNotices = onSnapshot(collection(db, "notices"), (snapshot) => {
      const data = snapshot.docs.map(doc => normalizeData(doc.data()) as Notice);
      setNotices(data.length > 0 ? data.sort((a,b) => b.id.localeCompare(a.id)) : SEED_NOTICES);
    });

    const unsubConfig = onSnapshot(doc(db, "settings", "schoolConfig"), (doc) => {
      if (doc.exists()) setSchoolConfig(doc.data() as SchoolConfig);
    });

    return () => {
      unsubClasses();
      unsubStudents();
      unsubEmployees();
      unsubNotices();
      unsubConfig();
    };
  }, []);

  const handleExportJSON = () => {
    const backupData = {
      config: schoolConfig,
      classes: classes,
      employees: employees,
      students: students,
      notices: notices,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attenda_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSyncSuccess("Backup file generated!");
    setTimeout(() => setSyncSuccess(null), 2000);
  };

  const handleImportJSON = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data.classes) setClasses(data.classes);
          if (data.students) setStudents(data.students);
          if (data.employees) setEmployees(data.employees);
          if (data.notices) setNotices(data.notices);
          if (data.config) setSchoolConfig(data.config);
          resolve("System registry restored from JSON. Ready for Cloud Sync.");
        } catch (err) {
          reject("Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    });
  };

  const syncToCloud = async (path: string, id: string, data: any) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      await setDoc(doc(db, path, id), data);
      setSyncSuccess(`Cloud Updated`);
      setTimeout(() => setSyncSuccess(null), 2000);
    } catch (err: any) {
      setSyncError(`Sync Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearClasses = async () => {
    setIsSyncing(true);
    try {
      const q = query(collection(db, "classes"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      setClasses([]);
      setSyncSuccess("Classes cleared.");
      setTimeout(() => setSyncSuccess(null), 2000);
    } catch (err: any) {
      setSyncError(`Clear Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualCloudSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const batch = writeBatch(db);
      classes.forEach(c => batch.set(doc(db, "classes", c.id), c));
      students.forEach(s => batch.set(doc(db, "students", s.id), s));
      employees.forEach(e => batch.set(doc(db, "employees", e.id), e));
      notices.forEach(n => batch.set(doc(db, "notices", n.id), n));
      batch.set(doc(db, "settings", "schoolConfig"), schoolConfig);
      await batch.commit();
      setSyncSuccess("Migration Successful!");
      setTimeout(() => setSyncSuccess(null), 3000);
    } catch (err: any) {
      setSyncError(`Migration Failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteFromCloud = async (path: string, id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err: any) {
      setSyncError(`Delete Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(prev => ({
          ...prev,
          isAuthenticated: true,
          username: user.email?.split('@')[0] || 'User',
          role: prev.role || 'admin'
        }));
      } else if (!session.isAuthenticated) {
        setSession({ isAuthenticated: false, role: null, username: null });
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [session.isAuthenticated]);

  const classesWithDynamicCounts = useMemo(() => {
    return classes.map(cls => {
      const classStudents = students.filter(s => String(s.classId) === String(cls.id) || s.className === cls.name);
      return { 
        ...cls, 
        studentCount: classStudents.length,
        boys: classStudents.filter(s => s.gender === 'Male').length,
        girls: classStudents.filter(s => s.gender === 'Female').length,
        na: classStudents.filter(s => s.gender === 'Other').length
      };
    });
  }, [classes, students]);

  const uniqueSubjectsCount = useMemo(() => {
    const allSubjects = new Set<string>();
    classes.forEach(c => c.subjects.forEach(s => allSubjects.add(s)));
    return allSubjects.size;
  }, [classes]);

  const handlePageChange = (path: string) => setActivePath(path);

  const renderContent = () => {
    switch (activePath) {
      case 'dashboard':
        return <Dashboard onNavigate={handlePageChange} totalStudents={students.length} totalTeachers={employees.length} totalClasses={classes.length} totalSubjects={uniqueSubjectsCount} notices={notices} students={students} />;
      case 'notices': return <ManageNotices notices={notices} onAdd={n => syncToCloud("notices", n.id, n)} onDelete={id => deleteFromCloud("notices", id)} />;
      case 'allclasses': return <AllClasses classes={classesWithDynamicCounts} onAddClass={c => syncToCloud("classes", c.id, c)} onUpdateClass={c => syncToCloud("classes", c.id, c)} onDeleteClass={id => deleteFromCloud("classes", id)} onClearAll={handleClearClasses} userRole={session.role} />;
      case 'assignsubjects': return <AssignSubjects classes={classesWithDynamicCounts} employees={employees} onUpdateClass={c => syncToCloud("classes", c.id, c)} />;
      case 'allstudents': return <AllStudents students={students} onDelete={id => deleteFromCloud("students", id)} onNavigate={handlePageChange} onImport={handleImportJSON} userRole={session.role} />;
      case 'addnewstudent': return <AddStudent classes={classesWithDynamicCounts} onAdd={s => syncToCloud("students", s.id, s)} onUpdate={s => syncToCloud("students", s.id, s)} />;
      case 'allemployees': return <AllEmployees employees={employees} onDelete={id => deleteFromCloud("employees", id)} onNavigate={handlePageChange} />;
      case 'addnewteacher': return <AddEmployee onAdd={e => syncToCloud("employees", e.id, e)} onUpdate={e => syncToCloud("employees", e.id, e)} />;
      case 'slogin': return <StudentLogin students={students} onUpdate={s => syncToCloud("students", s.id, s)} onLoginSuccess={s => setSession(s)} />;
      case 'elogin': return <EmployeeLogin employees={employees} onUpdate={e => syncToCloud("employees", e.id, e)} onLoginSuccess={s => setSession(s)} />;
      case 'studentsattandance': return <StudentsAttendance students={students} classes={classesWithDynamicCounts} />;
      case 'manageattendance': return <ManageAttendance classes={classesWithDynamicCounts} />;
      case 'studentattendancereport': return <AttendanceReports students={students} classes={classesWithDynamicCounts} />;
      case 'settings': return <Settings schoolConfig={schoolConfig} onUpdateSchoolConfig={c => syncToCloud("settings", "schoolConfig", c)} onCloudSync={handleManualCloudSync} onExport={handleExportJSON} onImport={handleImportJSON} isSyncing={isSyncing} userRole={session.role} />;
      default: return <Dashboard onNavigate={handlePageChange} totalStudents={students.length} totalTeachers={employees.length} totalClasses={classes.length} totalSubjects={uniqueSubjectsCount} notices={notices} students={students} />;
    }
  };

  if (isAuthChecking) return <div className="min-h-screen flex items-center justify-center bg-[#f0f7ff]"><RefreshCw className="animate-spin text-[#2546b5]" size={40} /></div>;
  if (!session.isAuthenticated) return <LandingLogin onLoginSuccess={s => setSession(s)} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full shadow-lg border border-blue-100 text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
          <CloudLightning size={14} /> Cloud Syncing...
        </div>
      )}
      {syncSuccess && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest text-white animate-in slide-in-from-right-4">
          <CheckCircle size={14} /> {syncSuccess}
        </div>
      )}
      {syncError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-rose-600 px-6 py-3 rounded-2xl shadow-2xl text-white text-[11px] font-black uppercase tracking-widest border border-rose-500 animate-in slide-in-from-top-4">
          <AlertCircle size={18} /> {syncError}
          <button onClick={() => setSyncError(null)} className="ml-4 hover:scale-110">OK</button>
        </div>
      )}
      <Sidebar schoolName={schoolConfig.schoolName} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activePath={activePath} onNavigate={handlePageChange} userName={session.username || 'User'} />
      <div className="lg:pl-[260px]">
        <Header departmentName={schoolConfig.departmentName} onMenuClick={() => setIsSidebarOpen(true)} onLogout={() => signOut(auth)} currentUser={{ name: session.username || 'Admin', role: 'Administrator' }} />
        <main className="p-4 md:p-8 lg:p-12 mx-auto w-full max-w-7xl pb-24 lg:pb-12">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
