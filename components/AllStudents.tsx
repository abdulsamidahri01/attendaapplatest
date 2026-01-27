
import React, { useState, useMemo, useRef } from 'react';
import { Search, Trash2, Edit2, Filter, Eye, Plus, FileSpreadsheet, User, Home, BookOpen, Heart, Briefcase, X, FileCode, Upload } from 'lucide-react';
import { StudentData } from '../types';

interface AllStudentsProps {
  students: StudentData[];
  onDelete: (id: string) => void;
  onNavigate?: (path: string, state?: any) => void;
  onEdit?: (student: StudentData) => void;
  onImport?: (file: File) => Promise<string>;
  userRole?: string | null;
}

const DetailItem = ({ label, value, colSpan = 1 }: { label: string; value?: string | number, colSpan?: number }) => {
  if (!value || value === "" || value === "N/A" || String(value).trim() === "") return null;
  return (
    <div className={`bg-slate-50 p-4 rounded-2xl border border-slate-100 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="font-bold text-slate-800 text-sm break-words">{value}</p>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100 mt-10 first:mt-0">
        <Icon size={18} className="text-blue-600" />
        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em]">{title}</h3>
    </div>
);

const StudentDetailModal = ({ student, onClose }: { student: StudentData; onClose: () => void }) => {
    if (!student) return null;

    const hasData = (fields: (string | number | undefined)[]) => {
      return fields.some(f => f !== undefined && f !== null && f !== "" && f !== "N/A" && String(f).trim() !== "");
    };

    const hasPersonal = hasData([student.gender, student.dob, student.bloodGroup, student.religion, student.cast, student.orphan, student.birthId, student.identificationMark, student.disease]);
    const hasContact = hasData([student.contactNumber, student.siblings, student.address]);
    const hasFather = hasData([student.fatherName, student.fatherId, student.fatherMobile, student.fatherOccupation, student.fatherEducation, student.fatherIncome]);
    const hasMother = hasData([student.motherName, student.motherId, student.motherMobile, student.motherOccupation, student.motherProfession, student.motherEducation, student.motherMobile, student.motherIncome]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
                
                <div className="relative shrink-0">
                    <div className="h-32 bg-blue-700 w-full"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all active:scale-95"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="px-10 flex items-end gap-8 -mt-12 mb-6 relative z-10">
                         <div className="h-32 w-32 rounded-[2.5rem] border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center p-1">
                            {student.image ? (
                                <img src={student.image} alt={student.name} className="h-full w-full object-cover rounded-[2.2rem]" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-200 rounded-[2.2rem]">
                                    <User size={64} />
                                </div>
                            )}
                        </div>
                        <div className="pb-4">
                             <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{student.name}</h2>
                             <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">{student.className}</span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">{student.registrationNumber}</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-2">
                            {hasPersonal && (
                                <div>
                                    <SectionHeader icon={User} title="Student Profile" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <DetailItem label="Gender" value={student.gender} />
                                        <DetailItem label="Birthday" value={student.dob} />
                                        <DetailItem label="Blood" value={student.bloodGroup} />
                                        <DetailItem label="Religion" value={student.religion} />
                                        <DetailItem label="Cast" value={student.cast} />
                                        <DetailItem label="Orphan" value={student.orphan} />
                                        <DetailItem label="Govt ID" value={student.birthId} colSpan={2} />
                                        <DetailItem label="Marks" value={student.identificationMark} colSpan={3} />
                                        <DetailItem label="Medical" value={student.disease} colSpan={3} />
                                    </div>
                                </div>
                            )}

                            {hasContact && (
                                <div>
                                    <SectionHeader icon={Home} title="Residence" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailItem label="Phone" value={student.contactNumber} />
                                        <DetailItem label="Siblings" value={student.siblings} />
                                        <DetailItem label="Home Address" value={student.address} colSpan={2} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div>
                                <SectionHeader icon={BookOpen} title="Academic Record" />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Allocated Class" value={student.className} />
                                    <DetailItem label="Reg No" value={student.registrationNumber} />
                                    <DetailItem label="Joined Date" value={student.admissionDate} />
                                    <DetailItem label="Fees Status" value={student.feesStatus || 'Unpaid'} />
                                    <DetailItem label="Old School" value={student.previousSchool} colSpan={2} />
                                </div>
                            </div>

                            {hasFather && (
                                <div>
                                    <SectionHeader icon={Briefcase} title="Father's Context" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <DetailItem label="Father Name" value={student.fatherName} />
                                        <DetailItem label="Father ID" value={student.fatherId} />
                                        <DetailItem label="Mobile" value={student.fatherMobile} />
                                        <DetailItem label="Role" value={student.fatherOccupation} />
                                        <DetailItem label="Education" value={student.fatherEducation} />
                                    </div>
                                </div>
                            )}

                            {hasMother && (
                                <div>
                                    <SectionHeader icon={Heart} title="Mother's Context" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <DetailItem label="Mother Name" value={student.motherName} />
                                        <DetailItem label="Role" value={student.motherOccupation || student.motherProfession} />
                                        <DetailItem label="Education" value={student.motherEducation} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-10 py-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-sm active:scale-95"
                    >
                        Exit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

const AllStudents: React.FC<AllStudentsProps> = ({ students, onDelete, onNavigate, onEdit, onImport, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEmployee = userRole === 'employee';

  const filteredStudents = students.filter(student => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = 
      student.name.toLowerCase().includes(searchLow) || 
      (student.registrationNumber && student.registrationNumber.toLowerCase().includes(searchLow)) ||
      (student.id && student.id.toLowerCase().includes(searchLow));
    const matchesClass = selectedClass === 'All' || student.className === selectedClass || student.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  const handleAddNew = () => {
    if (onEdit) onEdit(null as any); 
    if (onNavigate) onNavigate('addnewstudent');
  };

  const handleBulkImport = () => {
    if (onNavigate) onNavigate('bulkimport');
  };

  const handleJsonClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
        onImport(file).then(msg => alert(msg)).catch(err => alert(err));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {viewingStudent && <StudentDetailModal student={viewingStudent} onClose={() => setViewingStudent(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Student Registry</h1>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Student Management</h2>
        </div>
        {!isEmployee && (
            <div className="flex items-center gap-3">
                <input type="file" ref={fileInputRef} onChange={handleJsonClick} accept=".json" className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 shadow-sm transition-all active:scale-95"
                >
                    <FileCode size={16} />
                    Import JSON
                </button>
                <button 
                    onClick={handleBulkImport}
                    className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                >
                    <FileSpreadsheet size={16} className="text-emerald-500" />
                    Bulk CSV
                </button>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={16} />
                    New Student
                </button>
            </div>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, roll no, or cloud ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white text-sm font-bold text-slate-700 transition-all leading-tight"
            />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full md:w-auto">
                <Filter size={16} className="text-blue-600 shrink-0" />
                <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer w-full min-w-[140px]"
                >
                    <option value="All">All Categories</option>
                    {uniqueClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>
             </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Identity</th>
                <th className="px-6 py-6">Class Allocation</th>
                <th className="px-6 py-6">Registration</th>
                <th className="px-6 py-6">Access Status</th>
                <th className="px-10 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/20 group transition-all duration-300">
                    <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                           {student.image ? (
                              <img src={student.image} alt={student.name} className="h-12 w-12 rounded-2xl object-cover border-2 border-white shadow-md" />
                           ) : (
                              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-md">
                                {student.name.charAt(0)}
                              </div>
                           )}
                           <div>
                              <p className="font-black text-slate-900 tracking-tight text-sm group-hover:text-blue-700 transition-colors">{student.name}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{student.gender || 'Not Set'}</p>
                           </div>
                        </div>
                    </td>

                    <td className="px-6 py-5">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                            {student.className || 'Unknown'}
                        </span>
                    </td>

                    <td className="px-6 py-5">
                        <span className="text-[11px] font-black text-slate-500 font-mono tracking-tighter uppercase">{student.registrationNumber || student.id}</span>
                    </td>

                    <td className="px-6 py-5">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${student.hasLoginAccess ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                            <div className={`h-2 w-2 rounded-full ${student.hasLoginAccess ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{student.hasLoginAccess ? 'Active' : 'Offline'}</span>
                        </div>
                    </td>

                    <td className="px-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                            onClick={() => setViewingStudent(student)}
                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95" 
                            title="Quick View"
                        >
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        {!isEmployee && (
                            <>
                                <button 
                                    onClick={() => onEdit && onEdit(student)}
                                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95" 
                                    title="Edit Entry"
                                >
                                <Edit2 size={18} strokeWidth={2.5} />
                                </button>
                                <button 
                                    onClick={() => onDelete(student.id)}
                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-95" 
                                    title="Delete Entry"
                                >
                                <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                            </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center text-slate-300 bg-slate-50/20">
                    <Search size={48} className="mx-auto mb-6 opacity-20" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No matching records</h3>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">Adjust your search or filter to find specific students</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
