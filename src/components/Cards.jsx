import React from 'react';

const Cards = ({ title, value, icon, textColor, iconBg, onClick }) => {
  const colorMap = {
    'text-[#3b82f6]': { gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-100', ring: 'ring-blue-500/10', glow: 'shadow-blue-500/10' },
    'text-[#ef4444]': { gradient: 'from-red-500/10 to-red-600/5', border: 'border-red-100', ring: 'ring-red-500/10', glow: 'shadow-red-500/10' },
    'text-[#f59e0b]': { gradient: 'from-yellow-500/10 to-yellow-600/5', border: 'border-yellow-100', ring: 'ring-yellow-500/10', glow: 'shadow-yellow-500/10' },
    'text-[#10b981]': { gradient: 'from-green-500/10 to-green-600/5', border: 'border-green-100', ring: 'ring-green-500/10', glow: 'shadow-green-500/10' },
  };

  const style = colorMap[textColor] || colorMap['text-[#3b82f6]'];

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border ${style.border} p-6 flex flex-col justify-between min-h-[152px] cursor-pointer hover:-translate-y-1 hover:shadow-xl ${style.glow} transition-all duration-300 shadow-sm group active:scale-95`}
    >
      <div className="flex justify-between items-start">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed group-hover:text-slate-600 transition-colors">{title}</p>
        <div className={`p-2.5 rounded-xl ${iconBg} ${textColor} bg-gradient-to-br ${style.gradient} ring-1 ${style.ring} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className={`text-[48px] leading-none font-extrabold tracking-tight ${textColor} group-hover:text-opacity-80 transition-opacity`}>{value}</h3>
        <p className="text-[11px] text-slate-400 font-medium mt-1.5 group-hover:text-slate-500 transition-colors">
          {title === 'Total Patients' ? 'All registered today' :
           title === 'High Risk' ? 'Immediate attention needed' :
           title === 'Medium Risk' ? 'Monitor closely' :
           'Stable condition'}
        </p>
      </div>
    </div>
  );
};

export default Cards;
