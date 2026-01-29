import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const LoginForm = () => {
  usePageTitle('Login');
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  
  // Forgot password modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('Email is required'));
      return;
    }
    if (!password.trim()) {
      setError(t('Password is required'));
      return;
    }

    setLoading(true);

    try {
      // Firebase login - this will trigger onAuthStateChanged which fetches user data
      await authService.login(email, password);
      
      console.log('✅ Login successful');

      // No need to call refreshUser() - onAuthStateChanged will handle it
      // Just navigate
      navigate('/');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError(t('No account found with this email. Please sign up first.'));
      } else if (error.code === 'auth/wrong-password') {
        setError(t('Incorrect password. Please try again.'));
      } else if (error.code === 'auth/invalid-email') {
        setError(t('Invalid email address format.'));
      } else if (error.code === 'auth/too-many-requests') {
        setError(t('Too many failed login attempts. Please try again later.'));
      } else if (error.code === 'auth/invalid-credential') {
        setError(t('Invalid email or password. Please check your credentials.'));
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(t('Login failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
    setResetEmail(email); // Pre-fill with login email if available
    setResetError('');
    setResetSuccess('');
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetEmail.trim()) {
      setResetError(t('Email is required'));
      return;
    }

    setResetLoading(true);

    try {
      await authService.resetPassword(resetEmail);
      setResetSuccess(t('Password reset email sent! Please check your inbox and follow the instructions to reset your password.'));
      setResetError('');
      // Clear the form after 3 seconds and close modal
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setResetEmail('');
        setResetSuccess('');
      }, 4000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setResetError(t('No account found with this email address.'));
      } else if (error.code === 'auth/invalid-email') {
        setResetError(t('Invalid email address format.'));
      } else if (error.code === 'auth/too-many-requests') {
        setResetError(t('Too many requests. Please try again later.'));
      } else {
        setResetError(t('Failed to send reset email. Please try again.'));
      }
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    if (!resetLoading) {
      setShowForgotPasswordModal(false);
      setResetEmail('');
      setResetError('');
      setResetSuccess('');
    }
  };

  return (
    <div {...(i18n.language === 'ar' || i18n.language === 'ku' ? { dir: 'rtl' } : { dir: 'ltr' })} className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-10 border border-slate-100">
        
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

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">{t('Welcome Back')}</h2>
          <p className="text-slate-500 mt-2">{t('Sign in to your account')}</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              {t('Email Address')} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder={t('Enter your email')} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">
              {t('Password')} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder={t('Enter your password')} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-12 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={handleForgotPasswordClick}
              disabled={loading}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              {t('Forgot your password?')}
            </button>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('Signing In...')}
              </>
            ) : (
              t('Sign In')
            )}
          </button>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-500 font-medium">
              {t("Don't have an account?")}{' '}
              <Link 
                to="/register" 
                className={`text-blue-500 font-bold hover:text-blue-600 hover:underline ${loading ? 'pointer-events-none opacity-50' : ''}`}
              >  
                {t('Sign up')}     
              </Link>
            </p>
          </div>

        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-10 border border-slate-100 animate-scaleIn">
            
            {/* Close button */}
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              aria-label="Close"
              className="absolute right-4 top-4 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              disabled={resetLoading}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-blue-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('Reset Password')}</h2>
              <p className="text-slate-500 mt-2 text-sm">
                {t("Enter your email and we'll send you instructions to reset your password")}
              </p>
            </div>

            {/* Success Alert */}
            {resetSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl animate-fadeIn">
                <p className="text-green-800 font-medium text-sm text-center">{resetSuccess}</p>
              </div>
            )}

            {/* Error Alert */}
            {resetError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-red-800 font-medium text-sm">{resetError}</p>
                </div>
                <button 
                  onClick={() => setResetError('')}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  {t("Email Address")} <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder={t("Enter your email")} 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={resetLoading}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-5 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {resetLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {t("Sending...")}
                  </>
                ) : (
                  t('Send Reset Link')
                )}
              </button>

              {/* Back to Login */}
              <button 
                type="button"
                onClick={closeForgotPasswordModal}
                disabled={resetLoading}
                className="w-full text-slate-600 hover:text-slate-900 font-semibold py-2 transition-colors disabled:opacity-50"
              >
                {t("Back to Login")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
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

export default LoginForm;
