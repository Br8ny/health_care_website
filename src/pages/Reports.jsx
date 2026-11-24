import React, { useState } from 'react';
import { getPatients } from '../data/mockPatients';
import Cards from '../components/Cards';
import { Users, Timer, Target, Heart, Download, Filter, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [dateRange, setDateRange] = useState('today');
  const patients = getPatients();
  
  const totalToday = patients.length;
  const treatedPatients = patients.filter(p => p.status === 'TREATED');
  
  // Calculate average wait time (excluding those who just arrived)
  const totalWait = patients.reduce((acc, p) => acc + (p.WaitTimeMinutes || 0), 0);
  const avgWait = totalToday > 0 ? Math.round(totalWait / totalToday) : 0;

  const totalHighRisk = patients.filter(p => p.risk === 'HIGH').length;
  const handledHighRisk = treatedPatients.filter(p => p.risk === 'HIGH').length;
  const mediumRisks = totalToday - totalHighRisk - (patients.filter(p => p.risk === 'LOW').length);
  const lowRisks = patients.filter(p => p.risk === 'LOW').length;
  
  const highRiskPercent = totalHighRisk > 0 ? Math.round((handledHighRisk / totalHighRisk) * 100) : 100;

  const handleDownloadReport = () => {
    toast.success('Report downloading as PDF...');
    // Simulate download
    setTimeout(() => {
      toast.success('Report downloaded successfully');
    }, 1000);
  };

  const handleExportCSV = () => {
    toast.success('Exporting data to CSV...');
    setTimeout(() => {
      toast.success('CSV exported successfully');
    }, 1000);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    toast.success(`Showing data for ${range}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Hospital Daily Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold text-sm active:scale-95"
          >
            <Filter className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-2 bg-white p-3 rounded-lg border border-slate-200">
        {['today', 'week', 'month'].map((range) => (
          <button
            key={range}
            onClick={() => handleDateRangeChange(range)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              dateRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Cards 
          title="Total Patients (Today)" 
          value={totalToday} 
          icon={<Users className="w-6 h-6" />} 
          textColor="text-[#3b82f6]"
          iconBg="bg-blue-50"
          onClick={() => toast.success(`${totalToday} patients registered today`)}
        />
        <Cards 
          title="Avg Wait Time" 
          value={`${avgWait} min`} 
          icon={<Timer className="w-6 h-6" />} 
          textColor="text-[#f59e0b]"
          iconBg="bg-yellow-50"
          onClick={() => toast.success(`Average wait time: ${avgWait} minutes`)}
        />
        <Cards 
          title="High Risk Handled %" 
          value={`${highRiskPercent}%`} 
          icon={<Target className="w-6 h-6" />} 
          textColor="text-[#10b981]"
          iconBg="bg-green-50"
          onClick={() => toast.success(`${highRiskPercent}% of high-risk patients handled`)}
        />
        <Cards 
          title="Potential Lives Saved" 
          value={handledHighRisk} 
          icon={<Heart className="w-6 h-6 fill-current" />} 
          textColor="text-[#ef4444]"
          iconBg="bg-red-50"
          onClick={() => toast.success(`${handledHighRisk} high-risk patients successfully treated`)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Daily Risk Distribution
            </h3>
            <span className="text-sm text-slate-500 font-semibold">{dateRange}</span>
          </div>
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-lg p-6 flex flex-col justify-end pb-8 hover:bg-slate-100/50 transition-colors">
            {totalToday === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">No patient data available today.</div>
            ) : (
              <div className="flex h-full items-end justify-around space-x-4">
                {/* High Risk Bar */}
                <div 
                  className="flex flex-col items-center w-full group cursor-pointer"
                  onMouseEnter={() => setHoveredBar('high')}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className={`w-16 bg-red-500 rounded-t-sm transition-all duration-300 ease-out ${hoveredBar === 'high' ? 'bg-red-600 shadow-lg shadow-red-500/50 scale-105' : 'group-hover:bg-red-600'}`}
                    style={{ height: `${Math.max(10, (totalHighRisk / totalToday) * 200)}px` }}
                  ></div>
                  <p className="text-xs font-bold text-slate-600 mt-3">HIGH RISK</p>
                  <p className="text-sm font-bold text-slate-800">{totalHighRisk}</p>
                  <p className="text-xs text-slate-400">{Math.round((totalHighRisk / totalToday) * 100)}% of total</p>
                </div>
                
                {/* Medium Risk Bar */}
                <div 
                  className="flex flex-col items-center w-full group cursor-pointer"
                  onMouseEnter={() => setHoveredBar('medium')}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className={`w-16 bg-yellow-400 rounded-t-sm transition-all duration-300 ease-out ${hoveredBar === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 scale-105' : 'group-hover:bg-yellow-500'}`}
                    style={{ height: `${Math.max(10, (mediumRisks / totalToday) * 200)}px` }}
                  ></div>
                  <p className="text-xs font-bold text-slate-600 mt-3">MEDIUM RISK</p>
                  <p className="text-sm font-bold text-slate-800">{mediumRisks}</p>
                  <p className="text-xs text-slate-400">{Math.round((mediumRisks / totalToday) * 100)}% of total</p>
                </div>
                
                {/* Low Risk Bar */}
                <div 
                  className="flex flex-col items-center w-full group cursor-pointer"
                  onMouseEnter={() => setHoveredBar('low')}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className={`w-16 bg-green-500 rounded-t-sm transition-all duration-300 ease-out ${hoveredBar === 'low' ? 'bg-green-600 shadow-lg shadow-green-500/50 scale-105' : 'group-hover:bg-green-600'}`}
                    style={{ height: `${Math.max(10, (lowRisks / totalToday) * 200)}px` }}
                  ></div>
                  <p className="text-xs font-bold text-slate-600 mt-3">LOW RISK</p>
                  <p className="text-sm font-bold text-slate-800">{lowRisks}</p>
                  <p className="text-xs text-slate-400">{Math.round((lowRisks / totalToday) * 100)}% of total</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Key Metrics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => toast.success(`${totalHighRisk} high-risk patients today`)}>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-red-700 transition-colors">High Risk Patients</p>
              <p className="text-2xl font-extrabold text-red-600 mt-2">{totalHighRisk}</p>
              <p className="text-xs text-red-500 mt-1">Require immediate attention</p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => toast.success(`${mediumRisks} medium-risk patients today`)}>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-yellow-700 transition-colors">Medium Risk Patients</p>
              <p className="text-2xl font-extrabold text-yellow-600 mt-2">{mediumRisks}</p>
              <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => toast.success(`${lowRisks} low-risk patients today`)}>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-green-700 transition-colors">Low Risk Patients</p>
              <p className="text-2xl font-extrabold text-green-600 mt-2">{lowRisks}</p>
              <p className="text-xs text-green-600 mt-1">Stable condition</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => toast.success(`Average wait time: ${avgWait} minutes`)}>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-blue-700 transition-colors">Average Wait Time</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-2">{avgWait}m</p>
              <p className="text-xs text-blue-600 mt-1">All patients included</p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => toast.success(`${treatedPatients.length} patients successfully treated`)}>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-purple-700 transition-colors">Treated Today</p>
              <p className="text-2xl font-extrabold text-purple-600 mt-2">{treatedPatients.length}</p>
              <p className="text-xs text-purple-600 mt-1">Discharged/Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
