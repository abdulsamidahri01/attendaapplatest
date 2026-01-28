
import React, { useState } from 'react';
import { User, ArrowRight, AlertCircle, Lock, RefreshCw, KeyRound, GraduationCap, Shield, Briefcase, UserSquare } from 'lucide-react';
import { UserRole, UserSession } from '../types';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LandingLoginProps {
  onLoginSuccess: (session: UserSession) => void;
  adminCreds?: { username: string; password: string };
}

const LandingLogin: React.FC<LandingLoginProps> = ({ onLoginSuccess, adminCreds }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'employee' | 'student'>('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputId = identifier.trim();
    const inputPass = password.trim();

    // 1. Check for Legacy Master Admin Bypass
    if (activeTab === 'admin') {
      const rootUser = adminCreds?.username || 'admin';
      const rootPass = adminCreds?.password || 'admin123';

      if (inputId === rootUser && inputPass === rootPass) {
        onLoginSuccess({
          isAuthenticated: true,
          role: 'admin',
          username: 'Administrator'
        });
        setLoading(false);
        return;
      }
    }

    // 2. Otherwise, attempt Firebase Authentication (requires email format)
    try {
      if (!inputId.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, inputId, inputPass);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role as UserRole;

        // Check if the user's role matches the active tab
        if (userRole !== activeTab) {
          setError(`You are not registered as a ${activeTab}.`);
          setLoading(false);
          return;
        }

        onLoginSuccess({
          isAuthenticated: true,
          role: userRole,
          username: user.email?.split('@')[0] || 'User',
          studentId: userData.studentId
        });
      } else {
        // Fallback for newly created Firebase users (if they are admin)
        if(activeTab === 'admin') {
            onLoginSuccess({
                isAuthenticated: true,
                role: 'admin',
                username: user.email?.split('@')[0] || 'User'
            });
        } else {
            setError(`You are not registered as a ${activeTab}.`);
        }
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError('Credentials invalid. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const renderTab = (role: 'admin' | 'employee' | 'student', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(role)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl w-full transition-all duration-300 ${
        activeTab === role ? 'bg-[#2546b5] text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7ff] relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[140px]"></div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 relative z-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-12">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-[#2546b5] rounded-2xl flex items-center justify-center text-white shadow-xl transform hover:rotate-2 transition-all">
                  <GraduationCap size={40} strokeWidth={2.5} />
                </div>
                <span className="text-6xl font-black text-[#2546b5] tracking-tighter">Attenda</span>
             </div>
             <div className="bg-[#2546b5]/10 backdrop-blur-md border border-[#2546b5]/20 px-8 py-2 rounded-full">
                <p className="text-[#2546b5] text-[10px] font-black tracking-[0.3em] uppercase">
                  Smart Learning Ecosystem
                </p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(37,70,181,0.15)] border border-white">
            <div className="text-center mb-8">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Portal Access</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
                {renderTab('admin', <Shield size={20}/>, 'Admin')}
                {renderTab('employee', <Briefcase size={20}/>, 'Employee')}
                {renderTab('student', <UserSquare size={20}/>, 'Student')}
            </div>


            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-[#f8fafc] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#2546b5] focus:border-transparent transition-all text-sm placeholder:text-slate-400 text-slate-700 shadow-inner font-bold"
                  placeholder={activeTab === 'admin' ? 'admin' : activeTab === 'employee' ? 'Employee Email' : 'Student Email'}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-[#f8fafc] border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#2546b5] focus:border-transparent transition-all text-sm placeholder:text-slate-400 text-slate-700 shadow-inner font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 border border-rose-100">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="pt-2">
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#2546b5] hover:bg-blue-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-sm shadow-xl active:scale-[0.98] disabled:opacity-70"
                  >
                      {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                      <>
                          Sign In <ArrowRight size={20} strokeWidth={3} />
                      </>
                      )}
                  </button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-black text-slate-400 hover:text-[#2546b5] transition-colors uppercase tracking-[0.2em]"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>
         <div className="w-full max-w-sm mt-8 text-center">
            <p className="text-xs text-slate-400">© 2024 Educational Intelligence Portal. All Rights Reserved.</p>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-blue-50 text-[#2546b5] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <KeyRound size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">Request Access</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                To reset your password or gain access, please contact the administration. They will provide you with the necessary credentials or reset instructions.
              </p>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-4 bg-[#2546b5] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingLogin;
