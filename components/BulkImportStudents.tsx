
import React, { useState, useRef } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, ShieldAlert, FileSpreadsheet, Info, ShieldCheck } from 'lucide-react';
import { ClassData, StudentData } from '../types';

interface BulkImportStudentsProps {
  classes: ClassData[];
  existingStudents: StudentData[];
  onImport: (students: StudentData[]) => void;
  userRole?: string | null;
}

const REQUIRED_HEADERS = ["Student Name", "Class"];
const OPTIONAL_HEADERS = ["Father Name", "Registration No.", "Gender", "Contact Number"];
const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

interface ImportFailure {
  row_number: number;
  student_name: string;
  reason: string;
}

interface ImportReport {
  total_rows: number;
  successful_imports: number;
  failed_rows: number;
  failures: ImportFailure[];
}

const BulkImportStudents: React.FC<BulkImportStudentsProps> = ({ classes, existingStudents, onImport, userRole }) => {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (userRole !== 'admin') {
     return (
         <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-[3rem] shadow-sm border border-slate-100">
             <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                <ShieldAlert size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Access Denied</h2>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Only administrators can perform student bulk imports.</p>
         </div>
     );
  }

  const handleDownloadSample = () => {
    const header = ALL_HEADERS.join(',');
    const exampleRow = "John Doe,BS-I ZOO,Robert Doe,,Male,03001234567";
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + exampleRow;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Invalid file format. Only CSV files are supported.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setReport(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const validStudents: StudentData[] = [];
    const failures: ImportFailure[] = [];
    const existingRegNos = new Set(existingStudents.map(s => s.registrationNumber.toLowerCase().trim()));
    const newRegNosInFile = new Set<string>();

    let startIndex = 0;
    if (lines[0].toLowerCase().includes('student name')) {
        startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
        const rowNum = i + 1;
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));

        const name = cols[0];
        const className = cols[1];
        const fatherName = cols[2] || '';
        const regNo = cols[3] || '';
        const gender = cols[4] || '';
        const contact = cols[5] || '';

        if (!name || !className) {
            failures.push({
                row_number: rowNum,
                student_name: name || 'Unknown',
                reason: !name ? "Missing Name" : "Missing Class"
            });
            continue;
        }

        const targetClass = classes.find(c => c.name.toLowerCase() === className.toLowerCase());
        if (!targetClass) {
            failures.push({
                row_number: rowNum,
                student_name: name,
                reason: `Class '${className}' not found`
            });
            continue;
        }

        let finalRegNo = regNo;
        if (regNo) {
            if (existingRegNos.has(regNo.toLowerCase()) || newRegNosInFile.has(regNo.toLowerCase())) {
                failures.push({ row_number: rowNum, student_name: name, reason: `Duplicate Reg No: ${regNo}` });
                continue;
            }
            newRegNosInFile.add(regNo.toLowerCase());
        } else {
            const autoReg = `${targetClass.name.replace(/\s/g, '')}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
            finalRegNo = autoReg;
            newRegNosInFile.add(finalRegNo.toLowerCase());
        }

        const newStudent: StudentData = {
            id: `imp-${Date.now()}-${i}`,
            name,
            className: targetClass.name,
            classId: targetClass.id,
            fatherName,
            registrationNumber: finalRegNo,
            gender: (gender === 'Female' ? 'Female' : 'Male'),
            contactNumber: contact,
            feesStatus: 'Unpaid',
            admissionDate: new Date().toISOString().split('T')[0],
            hasLoginAccess: true,
            password: '123456' // Default Password for Bulk Import
        };

        validStudents.push(newStudent);
    }

    setReport({
        total_rows: validStudents.length + failures.length,
        successful_imports: validStudents.length,
        failed_rows: failures.length,
        failures
    });

    if (validStudents.length > 0) {
        onImport(validStudents);
    }
  };

  const handleImport = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Bulk Enrollment</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Administrator Registry Tools</p>
        </div>
        <button onClick={handleDownloadSample} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-colors">
          <Download size={16} className="text-blue-600" />
          Get CSV Template
        </button>
      </div>

      <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
         <div className="relative z-10">
            <h3 className="font-black text-lg mb-4 flex items-center gap-3">
               <ShieldCheck size={24} />
               Security Enforcement Active
            </h3>
            <p className="text-sm font-medium opacity-90 max-w-2xl leading-relaxed">
                Every student imported via this tool will be granted immediate portal access with the system default credentials (Password: <span className="font-black underline">123456</span>). You can manage or revoke these access rights at any time through the 'Manage Login' section.
            </p>
         </div>
         <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <FileSpreadsheet size={200} />
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 p-8">
           <h3 className="font-black text-gray-800 mb-8 flex items-center gap-3 text-lg uppercase tracking-widest">
               <Upload size={20} className="text-blue-600" />
               Upload Registry
           </h3>

           <div className="space-y-6">
              <div className="relative group">
                  <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".csv"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer py-10 px-4 text-center hover:border-blue-400 transition-all"
                  />
                  {!file && <p className="absolute inset-x-0 bottom-6 text-center text-[10px] font-black text-gray-300 pointer-events-none uppercase tracking-widest">Drag or Click to Select CSV</p>}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-start gap-3 border border-red-100">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
              )}

              <button 
                  onClick={handleImport}
                  disabled={!file}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                  <ShieldCheck size={18} />
                  Confirm & Sync Students
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 p-8 flex flex-col h-full">
           <h3 className="font-black text-gray-800 mb-6 text-lg uppercase tracking-widest">Import Status</h3>
           
           {report ? (
               <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                   <div className="grid grid-cols-3 gap-4 mb-6">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                           <div className="text-2xl font-black text-slate-800">{report.total_rows}</div>
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</div>
                       </div>
                       <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                           <div className="text-2xl font-black text-green-600">{report.successful_imports}</div>
                           <div className="text-[9px] font-black text-green-600/60 uppercase tracking-widest">Saved</div>
                       </div>
                       <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                           <div className="text-2xl font-black text-red-600">{report.failed_rows}</div>
                           <div className="text-[9px] font-black text-red-600/60 uppercase tracking-widest">Skipped</div>
                       </div>
                   </div>

                   {report.failures.length > 0 && (
                       <div className="flex-1 bg-red-50/50 rounded-2xl border border-red-100 p-4 overflow-y-auto max-h-[250px] custom-scrollbar">
                           <div className="space-y-2">
                               {report.failures.map((fail, idx) => (
                                   <div key={idx} className="p-3 bg-white rounded-xl border border-red-100 text-[10px] font-bold">
                                       <span className="text-red-300 mr-2">ROW {fail.row_number}</span>
                                       <span className="text-gray-800">{fail.student_name}:</span>
                                       <span className="text-red-600 ml-1">{fail.reason}</span>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
                   <Info size={48} className="mb-4 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No Active Process</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportStudents;
