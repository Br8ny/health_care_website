import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Loader2, Shield, Lock, User, Mail, Briefcase, Eye, EyeOff, Activity } from 'lucide-react';

const DEPARTMENTS = [
  'Emergency Dept.',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'ICU / Critical Care',
  'General Medicine',
  'Surgery',
  'Radiology',
];

const Login = () => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign-up specific fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('Doctor');
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('triage_user', email.split('@')[0] || 'Dr. Staff');
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setSignupError('');
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('triage_user', fullName || email.split('@')[0]);
      navigate('/dashboard');
    }, 1500);
  };

  const handleEmergencyMode = () => {
    localStorage.setItem('triage_user', 'EMERGENCY_OVERRIDE');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex overflow-hidden">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0d1f3c] to-[#060e1e] p-14 relative overflow-hidden border-r border-white/5">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[5%] right-0 w-[200px] h-[200px] rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo — animated */}
          <div className="mb-14 logo-entrance">
            <div className="logo-ring-pulse logo-shimmer-wrap inline-block rounded-2xl">
              <div className="logo-float bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-5 shadow-2xl shadow-black/30 border border-white/10">
                <img
                  src="/logo.png"
                  alt="HEALTHRISE Hospital & Medical Center"
                  className="h-24 w-auto object-contain brightness-110 drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[38px] font-extrabold text-white leading-tight mb-4">
              Smarter triage.<br />Faster care.
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
              AI-powered emergency department management. Prioritize patients, reduce wait times, and save lives.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              { icon: Shield, label: 'HIPAA Compliant', sub: 'Fully encrypted patient data' },
              { icon: Activity, label: 'Real-time Monitoring', sub: 'Live vital signs & queue updates' },
              { icon: Zap, label: 'AI Risk Assessment', sub: 'Instant triage classification' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-200">{label}</p>
                  <p className="text-[12px] text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[12px] text-slate-600 font-medium">
          © 2026 MedTriage Inc. · For authorized medical personnel only.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-[#F0F4FA] overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg px-5 py-3 mb-3">
              <img
                src="/logo.png"
                alt="HEALTHRISE Hospital & Medical Center"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 text-[13px] mt-1">AI-Powered Emergency Triage</p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 mb-8 shadow-sm">
            <button
              onClick={() => { setMode('signin'); setSignupError(''); }}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setSignupError(''); }}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* ── SIGN IN ── */}
          {mode === 'signin' && (
            <>
              <div className="mb-7">
                <h3 className="text-2xl font-extrabold text-slate-900">Welcome back</h3>
                <p className="text-slate-500 text-[14px] mt-1">Sign in to access the triage dashboard</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm"
                      placeholder="doctor@hospital.org"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <a href="#" className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1d4ed8]">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-[15px] font-extrabold text-white bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all hover:-translate-y-0.5 mt-2"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating…</> : 'Sign In to Dashboard'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-[12px]">
                  <span className="px-4 bg-[#F0F4FA] text-slate-400 font-semibold">or</span>
                </div>
              </div>

              <button
                onClick={handleEmergencyMode}
                className="w-full flex justify-center items-center gap-2.5 py-3.5 px-4 rounded-xl text-[14.5px] font-extrabold text-white bg-gradient-to-br from-[#DC2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                Emergency Mode — Skip Login
              </button>
              <p className="mt-3 text-center text-[12px] text-slate-400 font-medium">
                Emergency mode provides instant access for critical situations only
              </p>

              <p className="mt-6 text-center text-[13px] text-slate-500">
                New to MedTriage?{' '}
                <button onClick={() => setMode('signup')} className="font-bold text-[#2563EB] hover:text-[#1d4ed8]">
                  Create an account →
                </button>
              </p>
            </>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
            <>
              <div className="mb-7">
                <h3 className="text-2xl font-extrabold text-slate-900">Create account</h3>
                <p className="text-slate-500 text-[14px] mt-1">Register as a medical professional</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm"
                      placeholder="doctor@hospital.org"
                    />
                  </div>
                </div>

                {/* Role + Department */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="block w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm appearance-none"
                    >
                      <option>Doctor</option>
                      <option>Nurse</option>
                      <option>Paramedic</option>
                      <option>Admin</option>
                      <option>Specialist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Department</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="block w-full pl-9 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm appearance-none"
                      >
                        <option value="">Select…</option>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all shadow-sm"
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-[14px] text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-2 transition-all shadow-sm ${
                        signupError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : 'border-slate-200 focus:ring-[#2563EB]/25 focus:border-[#2563EB]'
                      }`}
                      placeholder="Re-enter password"
                    />
                  </div>
                  {signupError && (
                    <p className="mt-2 text-[12px] font-semibold text-red-500 flex items-center gap-1">
                      <span>⚠</span> {signupError}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  By creating an account you agree to the{' '}
                  <a href="#" className="text-[#2563EB] font-semibold hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-[#2563EB] font-semibold hover:underline">Privacy Policy</a>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-[15px] font-extrabold text-white bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all hover:-translate-y-0.5"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account…</> : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-slate-500">
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="font-bold text-[#2563EB] hover:text-[#1d4ed8]">
                  Sign in →
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
