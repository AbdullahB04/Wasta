import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-10 border border-slate-100">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6">
          
          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password" 
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="#" className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Forgot your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 font-bold py-4 rounded-2xl  transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
            Sign In
          </button>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              
              <Link to="/register" className='text-blue-500 font-bold hover:text-blue-600 hover:underline'>  
                Sign up     
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginForm;