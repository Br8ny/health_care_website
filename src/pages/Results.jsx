import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from '../data/mockPatients';
import RiskBadge from '../components/RiskBadge';
import { AlertCircle, FilePlus, RefreshCcw } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [data] = useState(() => {
    const raw = localStorage.getItem('temp_analysis');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!data) navigate('/new-patient');
  }, [data, navigate]);

  if (!data) return null;

  const isHighRisk = data.risk === 'HIGH';

  const handleAddToQueue = () => {
    addPatient({
      name: data.patient.name,
      age: data.patient.age,
      gender: data.patient.gender,
      symptoms: data.patient.symptoms,
      vitals: {
        bp: data.patient.vitals.bp || '120/80',
        hr: data.patient.vitals.hr || 80,
        temp: data.patient.vitals.temp || 98.6,
        o2: data.patient.vitals.o2 || 99
      },
      risk: data.risk
    });
    localStorage.removeItem('temp_analysis');
    navigate('/queue');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className={`rounded-xl p-6 text-white shadow-lg ${isHighRisk ? 'bg-red-600 animate-pulse' : data.risk === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-600'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wider">{data.risk} RISK</h2>
            <p className="font-medium mt-1 opacity-90">Patient Priority Assignment</p>
          </div>
          <AlertCircle className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Patient Profile</h3>
        <p className="text-slate-600 mb-2"><span className="font-semibold w-24 inline-block">Name:</span> {data.patient.name} ({data.patient.age}y, {data.patient.gender})</p>
        <p className="text-slate-600 mb-2"><span className="font-semibold w-24 inline-block">Symptoms:</span> {data.patient.symptoms}</p>
        <div className="bg-slate-50 p-3 rounded-lg mt-4 text-sm font-medium text-slate-600 flex space-x-6">
          <span>BP: {data.patient.vitals.bp || 'N/A'}</span>
          <span>HR: {data.patient.vitals.hr ? data.patient.vitals.hr+' bpm' : 'N/A'}</span>
          <span>Temp: {data.patient.vitals.temp ? data.patient.vitals.temp+'°F' : 'N/A'}</span>
          <span>SpO2: {data.patient.vitals.o2 ? data.patient.vitals.o2+'%' : 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Predicted Diseases</h3>
          <ul className="space-y-3">
            {data.predictions.map((p, idx) => (
              <li key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <span className="font-semibold text-slate-700">{p.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  p.probability > 75 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {p.probability}% Match
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Action Recommendation</h3>
            <div className={`p-4 rounded-lg font-medium ${isHighRisk ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
              <p className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                {data.action}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-4 italic">
              "Based on symptoms and vitals logic simulation."
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
             <button 
                onClick={() => navigate('/new-patient')}
                className="flex items-center justify-center p-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
             >
                <RefreshCcw className="w-4 h-4 mr-2" /> Re-analyze
             </button>
             <button 
                onClick={handleAddToQueue}
                className={`flex items-center justify-center p-3 rounded-lg text-white font-bold shadow-md transition-colors ${
                  isHighRisk ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-blue-700'
                }`}
             >
                <FilePlus className="w-4 h-4 mr-2" /> Add to Queue
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
