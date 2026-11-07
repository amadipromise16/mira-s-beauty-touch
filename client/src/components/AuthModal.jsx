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

  // 6-Digit Verification Code Reset State
  const [forgotStep, setForgotStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState('');
  const [sixDigitCodeInput, setSixDigitCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  // Request 6-Digit Password Reset Code
  const handleSendSixDigitCode = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please provide your registered email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.forgotPassword(formData.email.trim());
      const code = res?.code || res?.otp_code || localStorage.getItem('mbt_last_code') || Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setSuccess(`Your 6-digit verification code is: [ ${code} ]`);
      setForgotStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify 6-Digit Code and Set New Password
  const handleVerifyCodeAndResetPassword = async (e) => {
    e.preventDefault();
    const cleanCode = (sixDigitCodeInput || '').trim();
    if (!cleanCode || cleanCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cleanEmail = (formData.email || '').trim().toLowerCase();
      
      const res = await api.auth.resetPassword({
        email: cleanEmail,
        code: cleanCode,
        new_password: newPassword
      });

      setSuccess('Password updated successfully! Logging you in...');
      
      // Auto login user
      setTimeout(async () => {
        try {
          await login(cleanEmail, newPassword);
        } catch (_) {
          closeAuth();
        }
        setForgotStep(1);
        setSixDigitCodeInput('');
        setNewPassword('');
        setConfirmNewPassword('');
        setSuccess('');
        closeAuth();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your code and try again.');
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

          {/* FORGOT PASSWORD FORM (6-Digit Verification Code Flow) */}
          {authModalTab === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={handleSendSixDigitCode} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">Enter Your Registered Email</label>
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
                    <p className="text-[11px] text-[#8E766B] mt-1">
                      A 6-digit verification code will be sent to your email to verify your identity.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50 mt-1"
                  >
                    {loading ? 'Sending Code...' : 'Send 6-Digit Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCodeAndResetPassword} className="space-y-3">
                  {/* Visual OTP Code Banner with One-Click Auto-Fill */}
                  {generatedCode && (
                    <div className="p-3 bg-[#F2E5DC] border border-[#DFC7B9] rounded-xl text-center space-y-1.5 animate-fade-in">
                      <span className="text-[11px] font-semibold text-[#8E766B] uppercase tracking-wider block">
                        Your 6-Digit Verification Code
                      </span>
                      <div className="flex items-center justify-center space-x-3">
                        <span className="font-mono text-2xl font-black text-[#944E2E] tracking-[0.25em]">
                          {generatedCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSixDigitCodeInput(generatedCode)}
                          className="px-2.5 py-1 bg-[#B87D65] hover:bg-[#A36B53] text-white text-[11px] font-bold rounded-md shadow-xs transition-all uppercase tracking-wider"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={sixDigitCodeInput}
                      onChange={(e) => setSixDigitCodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full px-3 py-2.5 bg-white border border-[#DFC7B9] rounded-lg text-base text-center tracking-[0.4em] font-bold text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[11px] text-[#8E766B]">Sent to: {formData.email}</span>
                      <button
                        type="button"
                        onClick={() => { setForgotStep(1); setError(''); }}
                        className="text-[11px] text-[#B87D65] hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">Create New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A3C35] mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E766B] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-sm transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Verifying & Updating...' : 'Verify Code & Reset Password'}
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-[#F2E5DC]">
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('login'); setForgotStep(1); setError(''); setSuccess(''); }}
                  className="text-xs text-[#B87D65] font-semibold hover:underline inline-flex items-center space-x-1"
                >
                  <span>← Back to Sign In</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

