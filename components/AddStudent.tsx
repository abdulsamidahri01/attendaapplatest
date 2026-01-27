
import React, { useState, useEffect } from 'react';
import { Save, UserPlus, X, Calendar, Check, PenTool, DollarSign, ShieldCheck } from 'lucide-react';
import { ClassData, StudentData } from '../types';

interface AddStudentProps {
  classes: ClassData[];
  onAdd: (student: StudentData) => void;
  onUpdate?: (student: StudentData) => void;
  initialData?: StudentData | null;
}

const AddStudent: React.FC<AddStudentProps> = ({ classes, onAdd, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    classId: '',
    gender: 'Male',
    contactNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    registrationNumber: '',
    feesStatus: 'Unpaid'
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        fatherName: initialData.fatherName,
        classId: initialData.classId,
        gender: initialData.gender,
        contactNumber: initialData.contactNumber,
        admissionDate: initialData.admissionDate,
        registrationNumber: initialData.registrationNumber,
        feesStatus: initialData.feesStatus || 'Unpaid'
      });
    } else {
      setFormData({
        name: '',
        fatherName: '',
        classId: '',
        gender: 'Male',
        contactNumber: '',
        admissionDate: new Date().toISOString().split('T')[0],
        registrationNumber: '',
        feesStatus: 'Unpaid'
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.classId) {
        setMessage({ type: 'error', text: 'Please fill in all required fields.' });
        return;
    }

    const selectedClass = classes.find(c => c.id === formData.classId);
    
    if (!selectedClass) {
        setMessage({ type: 'error', text: 'Invalid Class selection.' });
        return;
    }

    if (initialData && onUpdate) {
        // UPDATE EXISTING
        const updatedStudent: StudentData = {
            ...initialData,
            name: formData.name,
            fatherName: formData.fatherName,
            classId: formData.classId,
            className: selectedClass.name,
            admissionDate: formData.admissionDate,
            gender: formData.gender as 'Male' | 'Female',
            contactNumber: formData.contactNumber,
            registrationNumber: formData.registrationNumber,
            feesStatus: formData.feesStatus as 'Paid' | 'Unpaid' | 'Partial'
        };

        onUpdate(updatedStudent);
        setMessage({ type: 'success', text: `Student ${formData.name} updated successfully!` });
    } else {
        // ADD NEW
        const regNo = formData.registrationNumber || `${selectedClass.name.replace(/\s/g, '')}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        const newStudent: StudentData = {
            id: Date.now().toString(),
            name: formData.name,
            fatherName: formData.fatherName,
            classId: formData.classId,
            className: selectedClass.name,
            admissionDate: formData.admissionDate,
            gender: formData.gender as 'Male' | 'Female' | 'Other',
            contactNumber: formData.contactNumber,
            registrationNumber: regNo,
            feesStatus: formData.feesStatus as 'Paid' | 'Unpaid' | 'Partial',
            // Default Auth Requirements
            hasLoginAccess: true,
            password: '123456'
        };

        onAdd(newStudent);
        setMessage({ type: 'success', text: `Student added! Default Password: 123456` });
        
        setFormData({
            name: '',
            fatherName: '',
            classId: '',
            gender: 'Male',
            contactNumber: '',
            admissionDate: new Date().toISOString().split('T')[0],
            registrationNumber: '',
            feesStatus: 'Unpaid'
        });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const isEditing = !!initialData;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Modify Registry' : 'Establish New Student'}</h1>
        <p className="text-sm text-gray-500">{isEditing ? 'Update existing academic record' : 'Register a new student with default credentials'}</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
            {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <UserPlus size={18} className="text-[#5e81f4]" />
                Primary Particulars
            </h3>
            {!isEditing && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 border border-blue-200">
                <ShieldCheck size={12} /> Auto-Auth Active
              </div>
            )}
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Identity *</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold transition-all"
                    placeholder="Student full name"
                    required
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Guardian Identity</label>
                <input 
                    type="text" 
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold transition-all"
                    placeholder="Father/Guardian name"
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Academic Allocation *</label>
                <select 
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                    required
                >
                    <option value="">Choose Class...</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Registration Identifier</label>
                <input 
                    type="text" 
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold transition-all"
                    placeholder="System will auto-gen if blank"
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Enrolled Date</label>
                <div className="relative">
                    <input 
                        type="date" 
                        name="admissionDate"
                        value={formData.admissionDate}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold transition-all"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Financial Status</label>
                <div className="relative">
                    <select 
                        name="feesStatus"
                        value={formData.feesStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                    >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                    </select>
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Primary Contact</label>
                <input 
                    type="tel" 
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e81f4]/20 outline-none text-sm font-bold transition-all"
                    placeholder="e.g. +92 3XX XXXXXXX"
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Gender Specification</label>
                <div className="flex gap-4 pt-1">
                    {['Male', 'Female'].map(g => (
                      <label key={g} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer ${formData.gender === g ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                          <input 
                              type="radio" 
                              name="gender" 
                              value={g} 
                              checked={formData.gender === g} 
                              onChange={handleChange}
                              className="hidden"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest">{g}</span>
                      </label>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            {!isEditing && (
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <Check size={14} strokeWidth={3} /> Initial Password: 123456
              </p>
            )}
            <div className="flex gap-3 w-full sm:w-auto">
                <button 
                    type="button" 
                    onClick={() => setFormData({ name: '', fatherName: '', classId: '', gender: 'Male', contactNumber: '', admissionDate: new Date().toISOString().split('T')[0], registrationNumber: '', feesStatus: 'Unpaid' })}
                    className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                >
                    Clear
                </button>
                <button 
                    type="submit" 
                    className="flex-1 sm:flex-none px-10 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    {isEditing ? <PenTool size={18} strokeWidth={2.5} /> : <Save size={18} strokeWidth={2.5} />}
                    {isEditing ? 'Commit Changes' : 'Confirm Registry'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
