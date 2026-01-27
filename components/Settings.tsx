
import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, Database, Trash2, AlertTriangle, Download, 
  Upload, CheckCircle, Eye, EyeOff, Layout, Camera, Cloud, CloudOff, Server, Shield, Globe, Cpu, ExternalLink, RefreshCw, FileCode
} from 'lucide-react';
import { SchoolConfig } from '../types';

interface SettingsProps {
  onExport?: () => void;
  onImport?: (file: File) => Promise<string>;
  onResetAttendance?: () => string;
  onFactoryReset?: () => string;
  onChangePassword?: (current: string, newPass: string) => string | void;
  schoolConfig?: SchoolConfig;
  onUpdateSchoolConfig?: (config: SchoolConfig) => void;
  onCloudSync?: () => Promise<void>;
  isSyncing?: boolean;
  userRole?: string | null;
}

const Settings: React.FC<SettingsProps> = ({
  onExport,
  onImport,
  onResetAttendance,
  onFactoryReset,
  onChangePassword,
  schoolConfig,
  onUpdateSchoolConfig,
  onCloudSync,
  isSyncing = false,
  userRole = 'admin'
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'cloud' | 'security'>('general');
  
  const [configForm, setConfigForm] = useState<SchoolConfig>(schoolConfig || {
    schoolName: '',
    departmentName: '',
    timings: { days: '', hours: '' },
    events: []
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (schoolConfig) setConfigForm(schoolConfig);
  }, [schoolConfig]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
        try {
            const message = await onImport(file);
            showMessage('success', message);
        } catch (err: any) {
            showMessage('error', err);
        }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Control Console</h1>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">System Infrastructure</h2>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveTab('general')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>System</button>
            <button onClick={() => setActiveTab('cloud')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cloud' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>Cloud DB</button>
            <button onClick={() => setActiveTab('security')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>Security</button>
        </div>
      </div>

      {msg && (
        <div className={`p-5 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2 border ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
          {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="text-sm font-bold">{msg.text}</span>
        </div>
      )}

      {activeTab === 'general' && (
        <div className="space-y-8 animate-in slide-in-from-left-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3"><Layout className="text-blue-600" size={24} /> Branding</h3>
                    <button onClick={() => onUpdateSchoolConfig?.(configForm)} className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl">Apply Changes</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Institutional Name</label>
                        <input type="text" value={configForm.schoolName} onChange={(e) => setConfigForm(p => ({...p, schoolName: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Department Label</label>
                        <input type="text" value={configForm.departmentName} onChange={(e) => setConfigForm(p => ({...p, departmentName: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3"><Database className="text-indigo-500" size={24} /> JSON Data Transfer</h3>
                    <p className="text-xs text-slate-400 mt-1">Export your registry to a JSON file or restore from a previous backup.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={onExport}
                        className="flex items-center justify-between p-6 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-all group"
                    >
                        <div className="text-left">
                            <h4 className="font-black text-indigo-700 dark:text-indigo-400 uppercase text-[10px] tracking-widest mb-1">Export Registry</h4>
                            <p className="text-[9px] text-indigo-600/60 uppercase font-bold">Generate local JSON backup</p>
                        </div>
                        <Download className="text-indigo-500 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="relative">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleJsonImport}
                            accept=".json"
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group"
                        >
                            <div className="text-left">
                                <h4 className="font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-widest mb-1">Restore from JSON</h4>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Import data through json file</p>
                            </div>
                            <Upload className="text-slate-400 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'cloud' && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-xl">
                            <Cloud size={32} />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl tracking-tighter">Firestore Connectivity</h3>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Live Database Status</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="font-black text-lg mb-1">Database Migration</h4>
                                <p className="text-xs text-white/40">Sync all existing local records (Students, Teachers, Classes) to your Firestore Project.</p>
                            </div>
                            <button 
                                onClick={onCloudSync}
                                disabled={isSyncing}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Database size={16} />}
                                Initialize Firestore with Local Data
                            </button>
                        </div>
                        
                        <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                            <Shield className="text-blue-400 shrink-0 mt-0.5" size={18} />
                            <p className="text-[11px] leading-relaxed text-blue-100/70">
                                Clicking this button will push your current application state into the cloud. This will create the <b>students</b>, <b>employees</b>, and <b>classes</b> collections in your Firebase console automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 mb-8"><Shield className="text-rose-500" size={24} /> Security Credentials</h3>
            <div className="p-6 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                <h4 className="font-black text-rose-600 mb-2">System Reset</h4>
                <p className="text-xs text-rose-600/70 mb-6">Deleting all local and cloud records is irreversible.</p>
                <button onClick={() => setShowResetConfirm(true)} className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">Factory Reset</button>
            </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-10 text-center">
                <Trash2 size={48} className="mx-auto text-rose-500 mb-6" />
                <h3 className="text-xl font-black mb-2">Confirm Wipe?</h3>
                <p className="text-sm text-slate-500 mb-8">This deletes all students and staff from the cloud and local storage.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase">Cancel</button>
                    <button onClick={() => { onFactoryReset?.(); setShowResetConfirm(false); }} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase">Wipe All</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
