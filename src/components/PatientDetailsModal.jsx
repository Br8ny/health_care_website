import React, { useState } from 'react';
import { X, Activity, Thermometer, Droplets, HeartPulse, Clock, User, Phone, Edit3, CheckCircle, AlertCircle, Printer, Share2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const riskConfig = {
  HIGH: {
    badge: 'bg-[#DC2626] text-white',
    headerBg: 'bg-gradient-to-r from-red-50 to-white',
    border: 'border-t-4 border-t-[#DC2626]',
    labelColor: 'text-[#DC2626]',
  },
  MEDIUM: {
    badge: 'bg-[#F59E0B] text-white',
    headerBg: 'bg-gradient-to-r from-amber-50 to-white',
    border: 'border-t-4 border-t-[#F59E0B]',
    labelColor: 'text-[#D97706]',
  },
  LOW: {
    badge: 'bg-[#16A34A] text-white',
    headerBg: 'bg-gradient-to-r from-green-50 to-white',
    border: 'border-t-4 border-t-[#16A34A]',
    labelColor: 'text-[#16A34A]',
  },
};

const PatientDetailsModal = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');

  if (!isOpen || !patient) return null;
  const config = riskConfig[patient.risk] || riskConfig.LOW;

  const handleAssignDoctor = () => {
    toast.success('Doctor assignment dialog opened');
  };

  const handleCallDoctor = () => {
    toast.success('Calling Emergency Department Doctor...');
  };

  const handlePrintReport = () => {
    toast.success('Printing patient report...');
    setTimeout(() => window.print(), 500);
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      toast.success('Note added successfully');
      setNotes('');
    } else {
      toast.error('Please enter a note');
    }
  };

  const handleShare = () => {
    toast.success('Copied record to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden ${config.border} transform transition-all my-4`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-start p-6 border-b border-slate-100 ${config.headerBg}`}>
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${config.badge}`}>
                  {patient.risk} RISK
                </span>
              </div>
              <p className="text-[13px] text-slate-500 font-medium mt-0.5">ID #{patient.id?.toString().slice(-6)} · {patient.gender} · {patient.age} yrs old</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          {['overview', 'notes', 'actions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[13px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-b-[#2563EB] text-[#2563EB]'
                  : 'border-b-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Key metrics row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                  <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-1">Age</p>
                  <p className="font-extrabold text-slate-800 text-xl">{patient.age}</p>
                  <p className="text-[11px] text-slate-400">years</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                  <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                  <p className="font-extrabold text-slate-800 text-xl">{patient.gender}</p>
                  <p className="text-[11px] text-slate-400">biological</p>
                </div>
                <div className={`p-4 rounded-xl border text-center hover:shadow-md transition-all cursor-pointer ${patient.risk === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wait Time</p>
                  <p className={`font-extrabold text-xl ${patient.risk === 'HIGH' ? 'text-[#DC2626]' : 'text-slate-800'}`}>{patient.WaitTimeMinutes}m</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Clock className={`w-3 h-3 ${patient.risk === 'HIGH' ? 'text-[#DC2626]' : 'text-slate-400'}`} />
                    <p className={`text-[11px] ${patient.risk === 'HIGH' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                      {patient.WaitTimeMinutes > 10 ? 'Overdue' : 'waiting'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-slate-300 inline-block" />
                  Chief Complaint
                  <span className="flex-1 h-px bg-slate-100 inline-block" />
                </h3>
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 cursor-pointer hover:bg-blue-100/40 transition-colors">
                  <p className="text-slate-700 font-medium text-[14px] italic leading-relaxed">"{patient.symptoms}"</p>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-slate-300 inline-block" />
                  Vitals Snapshot
                  <span className="flex-1 h-px bg-slate-100 inline-block" />
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Activity, label: 'Blood Pressure', value: patient.vitals?.bp || 'N/A', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
                    { icon: HeartPulse, label: 'Heart Rate', value: patient.vitals?.hr ? `${patient.vitals.hr} bpm` : 'N/A', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
                    { icon: Thermometer, label: 'Temperature', value: patient.vitals?.temp ? `${patient.vitals.temp}°F` : 'N/A', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
                    { icon: Droplets, label: 'SpO2', value: patient.vitals?.o2 ? `${patient.vitals.o2}%` : 'N/A', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                  ].map(({ icon: Icon, label, value, color, bg, border }) => (
                    <div key={label} className={`flex flex-col items-center p-4 rounded-xl ${bg} border ${border} text-center hover:shadow-md transition-all cursor-pointer hover:scale-105`}>
                      <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-semibold text-center leading-tight mb-1">{label}</p>
                      <p className="font-extrabold text-slate-800 text-[15px]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Add Clinical Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter observations, clinical notes, or assessment..."
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={5}
                />
              </div>
              <button
                onClick={handleAddNote}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Note
              </button>
              
              <div className="mt-6">
                <h4 className="font-bold text-slate-700 mb-3">Previous Notes</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-400 mb-1">Dr. Sarah Mitchell • 2 hours ago</p>
                    <p className="text-slate-700">Initial assessment complete. Patient stable but requires closer monitoring. Vitals within normal range.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleCallDoctor}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all active:scale-95 group"
              >
                <Phone className="w-5 h-5 text-blue-600 group-hover:animate-bounce" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Call Doctor</p>
                  <p className="text-xs text-slate-600">Emergency Department</p>
                </div>
              </button>

              <button
                onClick={handleAssignDoctor}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                <User className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Assign Doctor</p>
                  <p className="text-xs text-slate-600">Assign specialist</p>
                </div>
              </button>

              <button
                onClick={() => toast.success('Patient marked as in treatment')}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Start Treatment</p>
                  <p className="text-xs text-slate-600">Mark as in-treatment</p>
                </div>
              </button>

              <button
                onClick={() => toast.success('Patient priority updated')}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Change Priority</p>
                  <p className="text-xs text-slate-600">Reassign risk level</p>
                </div>
              </button>

              <button
                onClick={handlePrintReport}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                <Printer className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Print Report</p>
                  <p className="text-xs text-slate-600">Generate PDF</p>
                </div>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                <Share2 className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Share Record</p>
                  <p className="text-xs text-slate-600">Copy to clipboard</p>
                </div>
              </button>

              <button
                onClick={() => toast.success('Message sent to specialist')}
                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl hover:shadow-lg transition-all active:scale-95 md:col-span-2"
              >
                <MessageSquare className="w-5 h-5 text-rose-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-800">Send Message</p>
                  <p className="text-xs text-slate-600">Notify medical team</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[13.5px] hover:bg-white transition-colors active:scale-95"
          >
            Close
          </button>
          <button 
            onClick={() => {
              handleAssignDoctor();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-[13.5px] hover:bg-[#1d4ed8] transition-colors shadow-sm shadow-blue-500/20 active:scale-95"
          >
            Assign Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
