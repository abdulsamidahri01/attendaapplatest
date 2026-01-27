
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User as UserIcon, Sun, Moon, Search, Info } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
  currentUser?: {
    name: string;
    role: string;
    image?: string;
  };
  onProfileClick?: () => void;
  departmentName?: string;
  departmentLogo?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onLogout, 
  currentUser, 
  onProfileClick, 
  departmentName = 'DEPARTMENT OF ZOOLOGY',
  departmentLogo
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 md:h-20 w-full items-center justify-between bg-[#1e40af] text-white px-4 md:px-8 border-b border-white/5 transition-all shadow-lg pb-safe-top pt-safe-top">
      <div className="flex items-center gap-2 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 -ml-2 hover:bg-white/10 rounded-xl transition-all active:scale-95 touch-manipulation"
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3 overflow-hidden">
            {departmentLogo ? (
                <div className="hidden sm:block h-10 w-10 p-1 bg-white/10 rounded-full border border-white/10 overflow-hidden shrink-0">
                    <img src={departmentLogo} alt="Logo" className="h-full w-full object-contain rounded-full bg-white" />
                </div>
            ) : (
                <div className="hidden sm:block p-2 bg-white/10 rounded-full border border-white/10">
                    <Info size={14} className="text-white" />
                </div>
            )}
            <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-blue-100/90 whitespace-nowrap truncate">
              {departmentName}
            </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center relative group mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={16} />
            <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-11 pr-4 py-2 bg-white/10 border-none rounded-2xl text-[11px] font-bold text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/20 transition-all w-48 lg:w-64"
            />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-3 md:p-2.5 hover:bg-white/10 rounded-xl transition-all touch-manipulation"
        >
          {isDark ? <Sun size={20} className="md:w-[18px] md:h-[18px]" /> : <Moon size={20} className="md:w-[18px] md:h-[18px]" />}
        </button>

        <div className="h-10 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

        <div 
          className="flex items-center gap-3 p-1.5 pl-3 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-transparent touch-manipulation"
          onClick={onProfileClick}
        >
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black leading-none uppercase tracking-widest">{currentUser?.name || 'Admin'}</p>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-tighter mt-1">System Root</p>
          </div>
          <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-white text-[#1e40af] flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
             {currentUser?.image ? (
                <img src={currentUser.image} alt="Profile" className="h-full w-full object-cover" />
             ) : (
                <UserIcon size={18} />
             )}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="p-3 md:p-2.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all touch-manipulation"
          aria-label="Sign Out"
        >
          <LogOut size={20} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
