import { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const RegistrationForm = () => {
  usePageTitle('Register');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'client' | 'worker'>(
    searchParams.get('role') === 'worker' ? 'worker' : 'client'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    password: '',
    confirmPassword: ''
  });

  interface Service {
    id: string,
    name: string
  }
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/category');
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Available services:', data);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again later.');
      }
    }
    fetchServices();
  }, [])
  // const positions = ['Plumber', 'Electrician', 'Carpenter', 'Mechanic', 'Painter'];

  // Reset form when role changes
  const handleRoleChange = (newRole: 'client' | 'worker') => {
    setRole(newRole);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    // Validate phone has country code 964
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!cleanedPhone.startsWith('964')) {
      setError('Phone number must start with country code 964');
      return false;
    }
    if (cleanedPhone.length < 12) {
      setError('Phone number must be 12 digits (964 + 9 digits)');
      return false;
    }
    if (role === 'worker' && !formData.position) {
      setError('Please select your profession');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firebaseUid: formData.email, // or generate a proper Firebase UID
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        password: formData.password, // ADD THIS
        role: role === 'worker' ? 'WORKER' : 'USER',
        ...(role === 'worker' && { position: formData.position })
      };

      console.log('Sending payload:', payload);

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/login');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir='ltr' className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl p-8 md:p-12 border border-slate-100 transition-all duration-500 ease-in-out">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          aria-label="Back"
          className="absolute left-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          disabled={loading}
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          disabled={loading}
        >
          <X size={20} />
        </button>
        
        {/* Header & Role Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {role === 'client' ? 'Join as User' : 'Join as Worker'}
            </h2>
            <p className="text-slate-500 mt-1">
              {role === 'client' ? 'Find the perfect professional.' : 'Find your next job.'}
            </p>
          </div>

          {/* Role Toggle Pill */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full md:w-auto min-w-[320px]">
            <button
              id='user' 
              type="button"
              onClick={() => handleRoleChange('client')}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                role === 'client' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-200/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <User size={18} />
              I need workers
            </button>
            <button 
              id='worker'
              type="button"
              onClick={() => handleRoleChange('worker')}
              disabled={loading}
              className={`worker flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                role === 'worker' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-200/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Briefcase size={18} />
              I'm a worker
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Row 1: Names */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Kamal" 
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ahmed"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={loading}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 2: Contact Info */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Kamal@example.com" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="tel" 
                placeholder="964 750 123 4567" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  // Auto-prefix with 964 if user starts typing without it
                  if (value && !value.startsWith('964')) {
                    value = '964' + value;
                  }
                  setFormData({ ...formData, phone: value });
                }}
                maxLength={13}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* CONDITIONAL FIELD: Profession (Only for Workers) */}
          {role === 'worker' && (
            <div className="md:col-span-2 space-y-2 animate-fadeIn">
              <label className="text-sm font-bold text-slate-900 ml-1">
                Profession <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Hammer className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 appearance-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium transition-all outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  disabled={loading}
                  required
                >
                  <option value="" className="text-slate-400">Select your profession</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>
          )}

          {/* Row 3: Security */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Create a password" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
                minLength={6}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 ml-1">Must be at least 6 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password" 
                className={`w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.confirmPassword && formData.confirmPassword !== formData.password 
                    ? 'ring-2 ring-red-500/20' 
                    : ''
                }`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
                required
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
              <p className="text-xs text-red-500 ml-1">Passwords do not match</p>
            )}
          </div>

          {/* Row 4: Action Area */}
          <div className="md:col-span-2 mt-4 flex flex-col items-center gap-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className={`text-blue-500 font-bold hover:text-blue-600 hover:underline ${loading ? 'pointer-events-none opacity-50' : ''}`}
              >
                Sign in
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;