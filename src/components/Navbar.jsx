import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Settings, HelpCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = localStorage.getItem('triage_user') || 'Dr. Sarah Mitchell';
  const displayName = userName === 'EMERGENCY_OVERRIDE' ? 'Dr. Staff' : 'Dr. Sarah Mitchell';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleLogout = () => {
    localStorage.removeItem('triage_user');
    localStorage.removeItem('temp_analysis');
    setShowProfileMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"`);
      // Search functionality can be expanded
    }
  };

  const notifications = [
    { id: 1, message: '2 High-Risk Patients Waiting', time: '2 min ago', type: 'urgent' },
    { id: 2, message: 'Dr. Smith approved your decision', time: '15 min ago', type: 'info' },
  ];

  return (
    <div className="h-[70px] bg-white border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      {/* Search */}
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 w-[380px] group focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200 hover:border-slate-300">
        <Search className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search patients, symptoms, IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          className="bg-transparent border-none outline-none text-[13.5px] w-full font-medium placeholder-slate-400 text-slate-700"
        />
        <kbd className="text-[10px] font-semibold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 ml-2 hidden lg:block">⌘K</kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Live indicator */}
        <div className="hidden xl:flex items-center space-x-2 bg-green-50 border border-green-200/70 rounded-full px-3 py-1.5 hover:bg-green-100 transition-colors cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Live</span>
        </div>

        {/* Time */}
        <div className="hidden lg:flex flex-col items-end pr-3 border-r border-slate-200">
          <span className="text-[14px] font-bold text-slate-700 font-mono tabular-nums">{timeStr}</span>
          <span className="text-[11px] text-slate-400 font-medium">{dateStr}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full transition-colors hover:text-slate-700"
          >
            <Bell className="w-[20px] h-[20px]" />
            <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-[#DC2626] rounded-full text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-white shadow-sm">
              {notifications.length}
            </span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors ${notif.type === 'urgent' ? 'bg-red-50/30' : ''}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 pl-3 border-l border-slate-200 cursor-pointer group hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white flex items-center justify-center text-[13px] font-extrabold shadow-sm shadow-blue-500/30 border-2 border-white">
              {initials}
            </div>
            <div className="hidden lg:block">
              <p className="text-[14px] font-bold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-[11px] text-slate-400 font-medium">Emergency Dept.</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors hidden lg:block" />
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-100">
                <p className="font-bold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-400">Emergency Department</p>
              </div>
              <button 
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button 
                onClick={() => toast.success('Help documentation opened')}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors border-t border-slate-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
