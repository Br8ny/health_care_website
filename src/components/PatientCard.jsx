import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

const PatientCard = ({ patient, onAction }) => {
  const isHighRisk = patient.risk === 'HIGH';
  const isMediumRisk = patient.risk === 'MEDIUM';

  const badgeStyles = {
    HIGH: 'bg-[#DC2626] text-white shadow-sm shadow-red-500/30',
    MEDIUM: 'bg-[#F59E0B] text-white shadow-sm shadow-yellow-500/30',
    LOW: 'bg-[#16A34A] text-white shadow-sm shadow-green-500/20',
  };

  const rowBg = isHighRisk
    ? 'bg-red-50/60 hover:bg-red-50 border-l-4 border-l-[#DC2626]'
    : isMediumRisk
    ? 'bg-amber-50/30 hover:bg-amber-50/50 border-l-4 border-l-[#F59E0B]'
    : 'bg-white hover:bg-slate-50 border-l-4 border-l-[#16A34A]';

  const timerColor = isHighRisk
    ? 'text-[#DC2626] font-extrabold'
    : isMediumRisk
    ? 'text-[#D97706] font-bold'
    : 'text-slate-400 font-semibold';

  const waitMins = patient.WaitTimeMinutes || 0;
  const waitDisplay = `${waitMins}m`;

  return (
    <div
      onClick={() => onAction(patient)}
      className={`px-6 py-4 flex items-center gap-5 cursor-pointer transition-all duration-150 border-b border-slate-100 last:border-b-0 group ${rowBg}`}
    >
      {/* Risk badge */}
      <div className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase w-[90px] flex-shrink-0 ${badgeStyles[patient.risk]}`}>
        {isHighRisk && (
          <span className="w-[5px] h-[5px] rounded-full bg-white animate-pulse flex-shrink-0" />
        )}
        {patient.risk}
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-[15px] font-bold leading-tight mb-0.5 group-hover:text-[#2563EB] transition-colors ${isHighRisk ? 'text-slate-900' : 'text-slate-800'}`}>
          {patient.name}
        </h4>
        <p className="text-[12.5px] text-slate-400 font-medium truncate">{patient.symptoms}</p>
      </div>

      {/* Right: timer + ID */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className={`flex items-center gap-1.5 text-[13.5px] ${timerColor}`}>
          <Clock className="w-4 h-4" strokeWidth={isHighRisk ? 2.5 : 2} />
          <span className="tabular-nums">{waitDisplay}</span>
          {isHighRisk && (
            <span className="text-[10px] font-extrabold bg-red-600 text-white px-1.5 py-0.5 rounded ml-1 tracking-wider animate-pulse">
              URGENT
            </span>
          )}
        </div>
        <div className="text-[12px] text-slate-300 font-bold font-mono tracking-wider w-16 text-right">
          #{patient.id.toString().slice(-4)}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};

export default PatientCard;
