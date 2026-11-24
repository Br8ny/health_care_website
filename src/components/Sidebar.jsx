import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ClipboardList, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Patient', path: '/new-patient', icon: UserPlus },
    { name: 'Patient Queue', path: '/queue', icon: ClipboardList },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#060e1e] h-screen flex flex-col text-slate-300 shadow-2xl z-20 border-r border-white/5">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="bg-white/5 rounded-2xl p-3 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="HEALTHRISE Hospital & Medical Center"
            className="h-14 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB]/20 to-[#1d4ed8]/10 text-white border border-[#2563EB]/25 shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className={`mr-3 transition-colors ${isActive ? 'text-[#60a5fa]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[14px] font-semibold tracking-tight ${isActive ? 'text-white' : ''}`}>{link.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user panel */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center px-3 py-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center text-white mr-3 text-xs font-bold flex-shrink-0">
            DS
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white truncate">Dr. Sarah M.</p>
            <p className="text-[11px] text-slate-500">Hospital & Medical Center</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0 shadow-sm shadow-green-400/80" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
