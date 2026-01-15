import { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ChevronDown,
  Hammer,
  X,
  ArrowLeft,
} from 'lucide-react';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';


const RegistrationForm = () => {
  usePageTitle('خۆ تۆمارکردن');
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'client' | 'worker'>(searchParams.get('role') === 'worker' ? 'worker' : 'client');
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl p-8 md:p-12 border border-slate-100 transition-all duration-500 ease-in-out">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/loginK')}
          aria-label="Back"
          className="absolute left-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate('/K')}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>
        
        {/* Header & Role Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {role === 'client' ? 'چوونەژوورەوە وەك بەکارهێنەر' : 'چوونەژوورەوە وەك وەستا'}
            </h2>
          </div>

          {/* Role Toggle Pill */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full md:w-auto min-w-[320px]">
            <button
              id='user' 
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                role === 'client' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              <User size={18} />
              وەستام پێویستە
            </button>
            <button 
              id='worker'
              type="button"
              onClick={() => setRole('worker')}
              className={`worker flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                role === 'worker' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              <Briefcase size={18} />
              من وەستام
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Row 1: Names */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">ناوی یەکەم</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Kamal" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">ناوی دووەم</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ahmed" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Row 2: Contact Info */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">ئیمەیڵ</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Kamal@example.com" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">ژمارەی مۆبایل</label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="tel" 
                placeholder="+964 123 456 7890" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* CONDITIONAL FIELD: Profession (Only for Workers) */}
          {role === 'worker' && (
            <div className="md:col-span-2 space-y-2 animate-fadeIn">
              <label className="text-sm font-bold text-slate-900 ml-1">پیشە</label>
              <div className="relative group">
                <Hammer className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 appearance-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium transition-all outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled className="text-slate-400">پیشەکەت هەڵبژێرە</option>
                  <option value="plumber">بۆڕیچی</option>
                  <option value="electrician">کارەباچی</option>
                  <option value="carpenter">فەرششۆر</option>
                  <option value="mechanic">مێکانیک</option>
                  <option value="painter">بۆیاغچی</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>
          )}

          {/* Row 3: Security */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">پاسوۆرد</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="پاسوۆردێك دروست بکە" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">دڵنیاکردنەوەی پاسوۆرد</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="دڵنیاکردنەوەی پاسوۆرد" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
              <button 
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <Eye size={20} />
              </button>
            </div>
          </div>

          {/* Row 4: Action Area */}
          <div dir='ltr' className="md:col-span-2 mt-4 flex flex-col items-center gap-6">
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
              دروستکردنی ئەکاونت
              <ArrowRight size={20} />
            </button>
            
            <p className="text-slate-500 font-medium">
            ئەکاونتت هەیە؟{' '}
              <Link to="/loginK" className="text-blue-500 font-bold hover:text-blue-600 hover:underline">
                چوونە ژوورەوە
              </Link>
            </p>
          </div>

        </form>
      </div>
      
      {/* Simple fadeIn animation for the profession field */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;