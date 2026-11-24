import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../components/Cards';
import PatientCard from '../components/PatientCard';
import PatientDetailsModal from '../components/PatientDetailsModal';
import { getPatients, savePatients } from '../data/mockPatients';
import { Users, AlertOctagon, AlertTriangle, CheckCircle, UserPlus, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterByRisk, setFilterByRisk] = useState(null);
  const navigate = useNavigate();

  const fetchData = () => {
    const data = getPatients();
    const updated = data.map(p => {
      if (p.status === 'WAITING') {
        return { ...p, WaitTimeMinutes: Math.floor((Date.now() - p.timestamp) / 60000) };
      }
      return p;
    });
    setPatients(updated);
    savePatients(updated);
  };

  useEffect(() => {
    // Polling refresh of the live wait-time counters (intentional setState in effect).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const waitingPatients = patients.filter(p => p.status === 'WAITING');
  const filteredQueue = filterByRisk 
    ? waitingPatients.filter(p => p.risk === filterByRisk)
    : waitingPatients;
    
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    const riskScore = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (riskScore[b.risk] !== riskScore[a.risk]) return riskScore[b.risk] - riskScore[a.risk];
    return b.WaitTimeMinutes - a.WaitTimeMinutes;
  });

  const stats = {
    total: patients.length,
    high: patients.filter(p => p.risk === 'HIGH').length,
    medium: patients.filter(p => p.risk === 'MEDIUM').length,
    low: patients.filter(p => p.risk === 'LOW').length,
  };

  const highRiskPatients = waitingPatients.filter(p => p.risk === 'HIGH');
  const hasHighRisk = highRiskPatients.length > 0;

  const handleCardClick = (riskLevel) => {
    setFilterByRisk(filterByRisk === riskLevel ? null : riskLevel);
    if (filterByRisk === riskLevel) {
      toast.success('Filter cleared');
    } else {
      toast.success(`Showing ${riskLevel} risk patients`);
    }
  };

  return (
    <div className="space-y-7 pb-10">

      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hospital Overview</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[13px] font-medium text-slate-400">Real-time facility status and priority queue</p>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-green-600">Live</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchData();
              toast.success('Data refreshed');
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => navigate('/new-patient')}
            className="flex items-center gap-2 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add New Patient
          </button>
        </div>
      </div>

      {/* HIGH RISK ALERT BANNER */}
      {hasHighRisk && (
        <div className="relative rounded-2xl overflow-hidden cursor-pointer group" onClick={() => navigate('/queue')}>
          {/* Glow layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#b91c1c] rounded-2xl shadow-[0_8px_40px_-4px_rgba(220,38,38,0.55)] group-hover:shadow-[0_12px_50px_-4px_rgba(220,38,38,0.65)] transition-shadow" />
          {/* Animated pulse ring */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-red-400/40 animate-pulse" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
            }}
          />
          <div className="relative px-7 py-5 flex items-center justify-between group-hover:translate-x-1 transition-transform">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[17px] font-extrabold text-white uppercase tracking-widest drop-shadow-sm">
                    🚨 {stats.high} HIGH RISK PATIENT{stats.high !== 1 ? 'S' : ''} WAITING
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highRiskPatients.slice(0, 2).map(p => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/25 transition-colors">
                      <span className="text-white font-bold text-[12.5px]">{p.name}</span>
                      <span className="text-red-200 text-[12px]">· {p.WaitTimeMinutes}m waiting</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/queue');
              }}
              className="flex items-center gap-2 bg-white text-[#DC2626] font-extrabold text-[13px] px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all shadow-lg shadow-black/10 flex-shrink-0 ml-6 active:scale-95"
            >
              View Queue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Cards 
          title="Total Patients" 
          value={stats.total} 
          icon={<Users className="w-5 h-5" />} 
          textColor="text-[#3b82f6]" 
          iconBg="bg-blue-50"
          onClick={() => {
            setFilterByRisk(null);
            toast.success('Filter cleared');
          }}
        />
        <Cards 
          title="High Risk" 
          value={stats.high} 
          icon={<AlertOctagon className="w-5 h-5" />} 
          textColor="text-[#ef4444]" 
          iconBg="bg-red-50"
          onClick={() => handleCardClick('HIGH')}
        />
        <Cards 
          title="Medium Risk" 
          value={stats.medium} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          textColor="text-[#f59e0b]" 
          iconBg="bg-yellow-50"
          onClick={() => handleCardClick('MEDIUM')}
        />
        <Cards 
          title="Low Risk" 
          value={stats.low} 
          icon={<CheckCircle className="w-5 h-5" />} 
          textColor="text-[#10b981]" 
          iconBg="bg-green-50"
          onClick={() => handleCardClick('LOW')}
        />
      </div>

      {/* Filter Info */}
      {filterByRisk && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
          <p className="text-blue-800 font-semibold">Showing <span className="font-bold text-blue-900">{filterByRisk}</span> risk patients only</p>
          <button 
            onClick={() => {
              setFilterByRisk(null);
              toast.success('Filter cleared');
            }}
            className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-white px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Live Patient Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
        {/* Queue header */}
        <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm shadow-blue-500/50 animate-pulse" />
            <h3 className="text-[15px] font-extrabold text-slate-800 tracking-tight">Live Patient Queue {filterByRisk && `(${filterByRisk})`}</h3>
            <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {sortedQueue.length} waiting
            </span>
          </div>
          <button
            onClick={() => navigate('/queue')}
            className="text-[13.5px] font-bold text-[#2563EB] hover:text-[#1d4ed8] transition-colors flex items-center gap-1.5 hover:gap-2 group"
          >
            View All
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Column headers */}
        <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 grid grid-cols-[90px_1fr_auto] gap-5">
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">Priority</span>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">Patient</span>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest text-right pr-12">Wait · ID</span>
        </div>

        {/* Queue rows */}
        <div className="flex flex-col">
          {sortedQueue.slice(0, 6).map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onAction={() => setSelectedPatient(patient)}
            />
          ))}
          {sortedQueue.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-500 font-semibold text-[15px]">No patients in queue</p>
              <p className="text-slate-400 text-[13px] mt-1">All caught up! Add a new patient to get started.</p>
              <button
                onClick={() => navigate('/new-patient')}
                className="mt-5 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-[13.5px] hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-500/20 active:scale-95"
              >
                + Add Patient
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {sortedQueue.length > 6 && (
          <div className="px-7 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="text-[12.5px] text-slate-400 font-medium">Showing 6 of {sortedQueue.length} patients</span>
            <button
              onClick={() => navigate('/queue')}
              className="text-[13px] font-bold text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
            >
              See all patients →
            </button>
          </div>
        )}
      </div>

      <PatientDetailsModal
        isOpen={selectedPatient !== null}
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
};

export default Dashboard;
