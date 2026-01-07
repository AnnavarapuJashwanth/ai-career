import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

function saveUserToLocalStorage(user) {
  localStorage.setItem('careerai_user', JSON.stringify(user));
}

function getUserFromLocalStorage() {
  const user = localStorage.getItem('careerai_user');
  return user ? JSON.parse(user) : null;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signupSuccess = location?.state?.signupSuccess;
  const fromRoleDiscovery = location?.state?.fromRoleDiscovery;

  const normalizeAxiosError = (err) => {
    const detail = err?.response?.data?.detail;
    if (!detail) return 'Something went wrong. Please try again.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((d) => (typeof d === 'string' ? d : d?.msg))
        .filter(Boolean);
      return msgs.length ? msgs.join('\n') : 'Request validation failed.';
    }
    if (typeof detail === 'object' && detail.msg) return detail.msg;
    return 'Request failed.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('careerai_user', JSON.stringify(data.user));
      let redirectState = null;
      let redirectPath = '/dashboard';
      try {
        const pendingRole = sessionStorage.getItem('pendingRoleDiscovery');
        if (pendingRole) {
          const parsed = JSON.parse(pendingRole);
          redirectPath = parsed?.nextRoute || '/dashboard';
          redirectState = parsed?.state || {
            discoveredRole: parsed?.recommended_role,
            fromRoleDiscovery: true,
            roleDiscoveryResult: parsed?.result,
          };
        }
      } catch (_) {
        // ignore parse errors
      } finally {
        sessionStorage.removeItem('pendingRoleDiscovery');
      }

      if (redirectState) {
        navigate(redirectPath, { state: redirectState });
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      const msg = normalizeAxiosError(err) || 'Invalid credentials';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Login Card with Shine Border */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[350px] mx-4"
      >
        {/* Animated Shine Border */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #A07CFE 0%, #FE8FB5 50%, #FFBE7B 100%)',
              'linear-gradient(180deg, #FE8FB5 0%, #FFBE7B 50%, #A07CFE 100%)',
              'linear-gradient(270deg, #FFBE7B 0%, #A07CFE 50%, #FE8FB5 100%)',
              'linear-gradient(360deg, #A07CFE 0%, #FE8FB5 50%, #FFBE7B 100%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[2px] rounded-lg opacity-60 blur-[2px]"
        />
        
        {/* Card Content */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleLogin} className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Login
              </h2>
              <p className="text-sm text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Success / Error Messages */}
            {signupSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                Account created successfully. Please sign in.
              </div>
            )}
            {fromRoleDiscovery && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-700 text-sm">
                Please sign in so we can save your recommended role and build the roadmap.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {String(error)}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
            >
              Sign In
            </motion.button>

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700 font-medium transition"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const normalizeAxiosError = (err) => {
    const detail = err?.response?.data?.detail;
    if (!detail) return 'Something went wrong. Please try again.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((d) => (typeof d === 'string' ? d : d?.msg))
        .filter(Boolean);
      return msgs.length ? msgs.join('\n') : 'Request validation failed.';
    }
    if (typeof detail === 'object' && detail.msg) return detail.msg;
    return 'Request failed.';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      // Redirect to login after successful signup
      navigate('/login', { state: { signupSuccess: true } });
    } catch (err) {
      const msg = normalizeAxiosError(err) || 'Signup failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Signup Card with Shine Border */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[350px] mx-4"
      >
        {/* Animated Shine Border */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #A07CFE 0%, #FE8FB5 50%, #FFBE7B 100%)',
              'linear-gradient(180deg, #FE8FB5 0%, #FFBE7B 50%, #A07CFE 100%)',
              'linear-gradient(270deg, #FFBE7B 0%, #A07CFE 50%, #FE8FB5 100%)',
              'linear-gradient(360deg, #A07CFE 0%, #FE8FB5 50%, #FFBE7B 100%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[2px] rounded-lg opacity-60 blur-[2px]"
        />
        
        {/* Card Content */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSignup} className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Sign Up
              </h2>
              <p className="text-sm text-gray-600">
                Create an account to start your career journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {String(error)}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
            >
              Create Account
            </motion.button>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-700 font-medium transition"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
