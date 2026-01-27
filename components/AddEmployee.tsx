
import React, { useState, useEffect } from 'react';
import { Save, UserPlus, X, Briefcase, Mail, Hash, Check, PenTool, ShieldCheck } from 'lucide-react';
import { EmployeeData } from '../types';

interface AddEmployeeProps {
  onAdd: (employee: EmployeeData) => void;
  onUpdate: (employee: EmployeeData) => void;
  initialData?: EmployeeData | null;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onAdd, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    id: '' 
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        department: initialData.department || '',
        email: initialData.email || '',
        id: initialData.id
      });
    } else {
      setFormData({ name: '', department: '', email: '', id: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
        setMessage({ type: 'error', text: 'Employee Name is required.' });
        return;
    }

    if (initialData) {
        onUpdate({
            ...initialData,
            name: formData.name,
            department: formData.department,
            email: formData.email,
        });
        setMessage({ type: 'success', text: `Profile updated successfully!` });
    } else {
        const newId = formData.id || `EMP-${Math.floor(100 + Math.random() * 899)}`;
        onAdd({
            id: newId,
            name: formData.name,
            department: formData.department,
            email: formData.email,
            username: newId,        
            password: '123456',     // Default Password for Staff
            hasLoginAccess: true    
        });
        setMessage({ type: 'success', text: `Success! Login: ${newId} / 123456` });
        setFormData({ name: '', department: '', email: '', id: '' });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const isEditing = !!initialData;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{isEditing ? 'Modify Personnel' : 'Faculty Onboarding'}</h1>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Institutional Resource Management</p>
      </div>

      {message && (
        <div className={`mb-8 p-5 rounded-[1.5rem] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {message.type === 'success' ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
            {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <UserPlus size={18} className="text-blue-600" />
                Employment Particulars
            </h3>
            {!isEditing && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 border border-blue-200">
                <ShieldCheck size={12} /> Auto-Auth Active
              </div>
            )}
        </div>
        
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Legal Full Identity *</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none text-sm font-bold transition-all"
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Academic Department</label>
                <div className="relative">
                    <input 
                        type="text" 
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none text-sm font-bold transition-all"
                        placeholder="e.g. Zoology"
                    />
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Official Email</label>
                <div className="relative">
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none text-sm font-bold transition-all"
                        placeholder="faculty@school.edu"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Employee Identifier</label>
                <div className="relative">
                    <input 
                        type="text" 
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled={isEditing} 
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none text-sm font-bold transition-all disabled:opacity-50"
                        placeholder="Leave blank for auto-gen"
                    />
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>
            
            {!isEditing && (
                <div className="md:col-span-2 p-5 bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl flex items-start gap-4">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium leading-relaxed">
                        <strong className="font-black uppercase tracking-widest block mb-1">Credential Summary</strong>
                        The employee ID will serve as the system username. The default access key for new staff is <span className="font-black underline">123456</span>. Staff are encouraged to update this upon first login.
                    </p>
                </div>
            )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" onClick={() => setFormData({ name: '', department: '', email: '', id: '' })} className="px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all active:scale-95">Reset</button>
            <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-3">
                {isEditing ? <PenTool size={18} /> : <Save size={18} />}
                {isEditing ? 'Commit Update' : 'Initialize Staff'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
