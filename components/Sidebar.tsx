
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { ChevronDown, GraduationCap, User, LogOut } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
  navItems?: NavItem[];
  schoolName?: string;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activePath, 
  onNavigate, 
  navItems, 
  schoolName = 'Attenda',
  userName = 'Administrator'
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['classes', 'students', 'employees', 'attendance', 'subjects']);

  const itemsToRender = navItems || NAV_ITEMS;

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: NavItem) => {
    if (item.subItems) {
      toggleExpand(item.id);
    } else if (item.path) {
      onNavigate(item.path);
      if (window.innerWidth < 1024) onClose();
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 touch-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`fixed top-0 left-0 z-[70] h-[100dvh] w-[280px] lg:w-[260px] bg-[#0f172a] text-slate-400 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        
        {/* Brand Area */}
        <div className="flex h-20 items-center px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#2563eb] rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              {schoolName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4 px-4 custom-scrollbar pb-24 lg:pb-10">
          <div className="mb-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Main Navigation</div>
          
          <div className="space-y-1.5">
            {itemsToRender.map((item) => {
              const isActive = activePath === item.path || item.subItems?.some(sub => sub.path === activePath);
              const isExpanded = expandedItems.includes(item.id);
              const Icon = item.icon;

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group active:scale-[0.98]
                      ${isActive 
                          ? 'text-white bg-white/5' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={20} className={isActive ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'} strokeWidth={2.5} />}
                      <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    </div>
                    {item.subItems && (
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.subItems && isExpanded && (
                    <div className="mt-1 ml-5 border-l border-slate-800/50 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleItemClick(subItem)}
                          className={`w-full text-left px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg active:bg-white/5
                            ${activePath === subItem.path 
                                ? 'text-blue-500 bg-blue-500/10' 
                                : 'text-slate-600 hover:text-slate-300'}`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Administrator profile section at bottom */}
        <div className="mt-auto p-4 border-t border-slate-800/50 bg-black/20 pb-safe">
           <div className="flex items-center gap-4 p-3 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 border border-slate-700/50">
                 <User size={20} />
              </div>
              <div className="overflow-hidden">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{userName}</p>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">System Root</p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
