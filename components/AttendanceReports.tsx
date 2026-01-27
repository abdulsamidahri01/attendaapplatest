
import React, { useState, useEffect } from 'react';
import { Download, FileText, AlertCircle, Calendar } from 'lucide-react';
import { ClassData, StudentData } from '../types';
import { ATTENDANCE_STORE } from './StudentsAttendance';

interface AttendanceReportsProps {
  students: StudentData[];
  classes: ClassData[];
  currentEmployeeId?: string;
}

const AttendanceReports: React.FC<AttendanceReportsProps> = ({ students, classes, currentEmployeeId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const selectedClassData = classes.find(c => c.name === selectedClass);
  let subjects = selectedClassData?.subjects || [];

  if (currentEmployeeId && selectedClassData?.subjectTeachers) {
    subjects = subjects.filter(subject => selectedClassData.subjectTeachers?.[subject] === currentEmployeeId);
  }

  // Effect to handle subject selection when class or employee changes
  useEffect(() => {
    if (currentEmployeeId && selectedClass) {
        // For employees, default to the first subject if available, and ensure valid selection
        if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
        } else {
            setSelectedSubject('');
        }
    } else {
        // For admin, reset to general/all
        setSelectedSubject('');
    }
  }, [selectedClass, currentEmployeeId, subjects.length]);

  const generateCSV = () => {
    setMessage(null);
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates.' });
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setMessage({ type: 'error', text: 'End date cannot be before start date.' });
      return;
    }
    if (!selectedClass) {
      setMessage({ type: 'error', text: 'Please select a class.' });
      return;
    }

    // Extra validation for employees to prevent downloading unassigned data
    if (currentEmployeeId) {
        if (!selectedSubject) {
             setMessage({ type: 'error', text: 'Please select a subject.' });
             return;
        }
        // Verify subject assignment
        if (!subjects.includes(selectedSubject)) {
             setMessage({ type: 'error', text: 'Invalid subject selection.' });
             return;
        }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange: string[] = [];
    const loopDate = new Date(start);
    
    while (loopDate <= end) {
      dateRange.push(loopDate.toISOString().split('T')[0]);
      loopDate.setDate(loopDate.getDate() + 1);
    }

    const classStudents = students.filter(s => s.className === selectedClass);
    if (classStudents.length === 0) {
       setMessage({ type: 'error', text: `No students found in class ${selectedClass}.` });
       return;
    }

    const headers = ['Roll No', 'Student Name', 'Class', 'Subject', 'Total Present', 'Total Absent', 'Total Days', 'Attendance %'];
    const rows: string[] = [];
    let recordsFound = 0;

    classStudents.forEach(student => {
        let present = 0;
        let absent = 0;
        let total = 0;
        dateRange.forEach(date => {
            const key = selectedSubject 
                ? `${selectedClass}_${selectedSubject}_${date}` 
                : `${selectedClass}_${date}`;
            const dailyRecord = ATTENDANCE_STORE[key];
            if (dailyRecord && dailyRecord[student.id]) {
                const status = dailyRecord[student.id];
                if (status === 'present') present++;
                else if (status === 'absent') absent++;
                total++;
            }
        });
        if (total > 0) {
            recordsFound++;
            const ratio = ((present / total) * 100).toFixed(1) + '%';
            rows.push([
                student.registrationNumber,
                `"${student.name}"`,
                selectedClass,
                selectedSubject || 'General',
                present.toString(),
                absent.toString(),
                total.toString(),
                ratio
            ].join(','));
        }
    });

    if (recordsFound === 0) {
        setMessage({ type: 'error', text: 'No attendance records found for the selected criteria.' });
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileNameSubjectPart = selectedSubject ? `_${selectedSubject.replace(/\s+/g, '')}` : '';
    const fileName = `attendance_report_${selectedClass.replace(/\s+/g, '')}${fileNameSubjectPart}_${startDate}_to_${endDate}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage({ type: 'success', text: `Successfully exported records for ${recordsFound} students.` });
  };

  return (
    <div className="space-y-6">
       <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Attendance Reports</h1>
         <p className="text-sm text-gray-500">Generate and download attendance records.</p>
       </div>
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
           <div className="flex flex-col items-center text-center mb-8">
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <FileText size={28} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Attendance Reports</h2>
                <p className="text-sm text-gray-500">Download attendance records as CSV</p>
           </div>
           {message && (
             <div className={`max-w-4xl mx-auto mb-6 p-4 rounded-lg flex items-center gap-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <AlertCircle size={18} />
                {message.text}
             </div>
           )}
           <div className="max-w-5xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Start Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-11 pl-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm"
                            />
                            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">End Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-11 pl-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm"
                            />
                            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class</label>
                        <select 
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm bg-white"
                        >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                            className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4] focus:border-transparent text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            {/* Only show 'General Attendance' option if NOT a subject teacher restricted view */}
                            {!currentEmployeeId && <option value="">-- General Attendance --</option>}
                            
                            {subjects.map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button 
                            onClick={generateCSV}
                            className="w-full h-11 flex items-center justify-center gap-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            Download CSV
                        </button>
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};

export default AttendanceReports;
