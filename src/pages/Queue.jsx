import React, { useState, useEffect } from 'react';
import PatientCard from '../components/PatientCard';
import PatientDetailsModal from '../components/PatientDetailsModal';
import { getPatients, savePatients } from '../data/mockPatients';
import { Filter, Search, ArrowUpDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Queue = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sortBy, setSortBy] = useState('priority'); // priority or waitTime
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
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

    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleAction = (patient) => {
    setSelectedPatient(patient);
  };

  const markAsTreated = (patientId) => {
    const updated = patients.map(p => p.id === patientId ? {...p, status: 'TREATED'} : p);
    setPatients(updated);
    savePatients(updated);
    setSelectedPatient(null);
    setConfirmAction(null);
    toast.success("Patient marked as treated! ✓");
  };

  const filtered = patients.filter(p => p.status === 'WAITING')
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filterRisk === 'ALL' || p.risk === filterRisk);

  const sortedQueue = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      const riskScore = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      if (riskScore[b.risk] !== riskScore[a.risk]) {
        return riskScore[b.risk] - riskScore[a.risk];
      }
      return b.WaitTimeMinutes - a.WaitTimeMinutes;
    } else {
      return b.WaitTimeMinutes - a.WaitTimeMinutes;
    }
  });

  const stats = {
    total: sortedQueue.length,
    high: sortedQueue.filter(p => p.risk === 'HIGH').length,
    medium: sortedQueue.filter(p => p.risk === 'MEDIUM').length,
    low: sortedQueue.filter(p => p.risk === 'LOW').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            Emergency Patient Queue
            <span className="ml-3 bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full font-bold">
              {sortedQueue.length} Waiting
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Real-time patient management and priority handling</p>
        </div>
        
        <button
          onClick={() => {
            setSearch('');
            setFilterRisk('ALL');
            setSortBy('priority');
            toast.success('Filters reset');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group">
          <p className="text-xs font-semibold text-slate-500">Total Waiting</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</p>
          <p className="text-xs text-blue-500 mt-1 group-hover:text-blue-700">patients in queue</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => filterRisk !== 'HIGH' && setFilterRisk('HIGH')}>
          <p className="text-xs font-semibold text-slate-500">High Risk</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.high}</p>
          <p className="text-xs text-red-500 mt-1 group-hover:text-red-700">urgent</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => filterRisk !== 'MEDIUM' && setFilterRisk('MEDIUM')}>
          <p className="text-xs font-semibold text-slate-500">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.medium}</p>
          <p className="text-xs text-yellow-600 mt-1 group-hover:text-yellow-700">monitor</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => filterRisk !== 'LOW' && setFilterRisk('LOW')}>
          <p className="text-xs font-semibold text-slate-500">Low Risk</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.low}</p>
          <p className="text-xs text-green-600 mt-1 group-hover:text-green-700">stable</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex bg-slate-100 border border-slate-300 rounded-lg overflow-hidden">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(risk => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-4 py-2 text-sm font-semibold transition-all ${
                  filterRisk === risk 
                    ? (risk === 'HIGH' ? 'bg-red-500 text-white' : risk === 'MEDIUM' ? 'bg-yellow-500 text-white' : risk === 'LOW' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white')
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'priority' ? 'waitTime' : 'priority')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-semibold text-sm ${
                sortBy === 'priority'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortBy === 'priority' ? 'Priority' : 'Wait Time'}
            </button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="space-y-0">
          <AnimatePresence>
            {sortedQueue.length > 0 ? (
              sortedQueue.map((patient, index) => (
                <motion.div 
                  key={patient.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="relative group border-b last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <PatientCard patient={patient} onAction={handleAction} />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setConfirmAction(patient.id);
                        }}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95"
                      >
                        ✓ Treat
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(patient);
                        }}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95"
                      >
                        → Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500">No patients found</h3>
                <p className="text-slate-400 mt-2">Adjust your filters or check back soon.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mark Patient as Treated?</h3>
            <p className="text-slate-600 mb-6">
              This will remove the patient from the waiting queue and mark them as successfully treated.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => markAsTreated(confirmAction)}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-colors active:scale-95"
              >
                Yes, Mark as Treated
              </button>
            </div>
          </div>
        </div>
      )}

      <PatientDetailsModal 
        isOpen={selectedPatient !== null} 
        patient={selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
      />
    </div>
  );
};

export default Queue;
