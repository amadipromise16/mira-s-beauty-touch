import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Lock, Mail, User, Phone, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, closeAuth, authModalTab, setAuthModalTab, login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    reset_token: '',
    new_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please provide your registered email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.forgotPassword(formData.email);
      setSuccess(res.message);
      if (res.reset_token) {
        setFormData(prev => ({ ...prev, reset_token: res.reset_token }));
      }
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.reset_token || !formData.new_password) {
      setError('Reset token and new password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.resetPassword({
        token: formData.reset_token,
        new_password: formData.new_password
      });
      setSuccess(res.message);
      setTimeout(() => {
        setAuthModalTab('login');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-md shadow-2xl border border-[#EBDCD4] overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A6B63] hover:text-[#2C2420] hover:bg-[#F2E5DC] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F2E5DC] text-[#B87D65] mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#2C2420] font-semibold">
            {authModalTab === 'login' && 'Welcome Back'}
            {authModalTab === 'register' && 'Join Mira’s Beauty Touch'}
            {authModalTab === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-[#7A6B63] mt-1">
            {authModalTab === 'login' && 'Sign in to book appointments and save your favorites.'}
            {authModalTab === 'register' && 'Experience personalized beauty, easy bookings, and gallery likes.'}
            {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>

          {/* Header Description */}
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mx-6 my-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 my-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex border-b border-[#EBDCD4] px-6 mt-2">
          <button
            onClick={() => { setAuthModalTab('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              authModalTab === 'login'
                ? 'text-[#B87D65] border-b-2 border-[#B87D65]'
                : 'text-[#8E766B] hover:text-[#2C2420]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthModalTab('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              authModalTab === 'register'
                ? 'text-[#B87D65] border-b-2 border-[#B87D65]'
                : 'text-[#8E766B] hover:text-[#2C2420]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-4">
          
          {/* LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-[#4A3C35]">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthModalTab('forgot'); setError(''); setSuccess(''); }}
                    className="text-[11px] text-[#B87D65] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Amaka Johnson"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Phone Number (Nigeria)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 803 123 4567"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Confirm</label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalTab === 'forgot' && (
            <div className="space-y-4">
              {!formData.reset_token ? (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">Registered Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Get Reset Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">Reset Token</label>
                    <input
                      type="text"
                      name="reset_token"
                      required
                      value={formData.reset_token}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      required
                      value={formData.new_password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Resetting...' : 'Set New Password'}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('login'); setError(''); setSuccess(''); }}
                  className="text-xs text-[#B87D65] hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

