import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Loader2, PlaySquare } from 'lucide-react';
import { assignRisk, predictDiseases } from '../utils/triageLogic';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NewPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    symptoms: '',
    vitals: {
      bp: '',
      hr: '',
      temp: '',
      o2: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['bp', 'hr', 'temp', 'o2'].includes(name)) {
      setFormData(prev => ({ ...prev, vitals: { ...prev.vitals, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success("Voice transcribed successfully!");
      setFormData(prev => ({ 
        ...prev, 
        symptoms: prev.symptoms + (prev.symptoms ? " " : "") + "Patient reports severe chest pain radiating to left arm, shortness of breath, and nausea." 
      }));
    } else {
      setIsRecording(true);
      toast("Recording audio...", { icon: '🎙️' });
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Analysis
    setTimeout(() => {
      const riskData = assignRisk(formData.symptoms, {
        bloodPressure: formData.vitals.bp || "120/80",
        heartRate: parseInt(formData.vitals.hr) || 80,
        temperature: parseFloat(formData.vitals.temp) || 98.6,
        oxygen: parseInt(formData.vitals.o2) || 99
      });
      const diseases = predictDiseases(formData.symptoms);
      
      const analysisResult = {
        patient: formData,
        risk: riskData.level,
        action: riskData.action,
        predictions: diseases
      };
      
      localStorage.setItem('temp_analysis', JSON.stringify(analysisResult));
      navigate('/results');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-8 py-5">
        <h2 className="text-xl font-bold text-slate-800">New Patient Intake</h2>
        <p className="text-sm text-slate-500 mt-1">Enter patient details to AI analyze risk priority</p>
      </div>
      
      <form onSubmit={handleAnalyze} className="p-8 space-y-8">
        {/* Personal Details */}
        <div>
          <h3 className="text-md font-semibold text-slate-700 border-b border-slate-100 pb-2 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
              <input type="number" required name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g. 45" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
            <h3 className="text-md font-semibold text-slate-700">Symptoms & Chief Complaint</h3>
            <button 
              type="button" 
              onClick={toggleRecording}
              className={`text-sm flex items-center font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-700 animate-pulse border border-red-200' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
              }`}
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-bounce' : ''}`} /> 
              {isRecording ? "Stop Recording" : "Voice Input"}
            </button>
          </div>
          
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 flex items-center justify-center space-x-1 overflow-hidden"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['10px', '40px', '10px'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-blue-500 rounded-full"
                  />
                ))}
                <span className="ml-4 text-white text-sm font-medium animate-pulse">Listening... Speak now</span>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea 
            required
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows="4" 
            className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" 
            placeholder="Describe the patient's symptoms in detail..."
          ></textarea>
        </div>

        {/* Vitals */}
        <div>
          <h3 className="text-md font-semibold text-slate-700 border-b border-slate-100 pb-2 mb-4">Vitals (Optional, assists AI)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Blood Pressure</label>
              <input type="text" name="bp" value={formData.vitals.bp} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary" placeholder="120/80" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Heart Rate (bpm)</label>
              <input type="number" name="hr" value={formData.vitals.hr} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary" placeholder="80" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Temp (°F)</label>
              <input type="number" step="0.1" name="temp" value={formData.vitals.temp} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary" placeholder="98.6" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">SpO2 (%)</label>
              <input type="number" name="o2" value={formData.vitals.o2} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary" placeholder="99" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              "Analyze & Assign Priority ->"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPatient;
