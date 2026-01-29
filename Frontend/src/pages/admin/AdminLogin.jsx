import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate credentials (hardcoded for now, but matching seed data)
      const validAdminUsers = ['admin', 'admin@example.com'];
      const adminPassword = 'admin123';

      if (!(email === 'admin' || username === 'admin' || email === 'admin@example.com' || username === 'admin@example.com') || password !== adminPassword) {
        throw new Error('Invalid credentials. Please try again.');
      }

      // Generate a mock token
      const mockToken = 'admin_token_' + Date.now();

      // Save admin token and user info
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminUser', JSON.stringify({
        username: username || 'admin',
        email: email || 'admin@cruise.local',
        role: 'Admin'
      }));

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3593A6] to-[#2d7a8a]">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] px-6 py-8 sm:px-8 sm:py-12">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Cruise Admin</h1>
                {/* <p className="text-[#e0f2f1] text-sm font-medium">Secure Admin Portal</p> */}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="px-6 py-8 sm:px-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {/* Email/Username */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#111418]">
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your username"
                    value={email || username}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setUsername(e.target.value);
                    }}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 transition-all text-[#111418] placeholder-[#99a0a7]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-[#111418]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 transition-all text-[#111418] placeholder-[#99a0a7]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-[#e5e7eb] text-[#3593A6] focus:ring-[#3593A6] cursor-pointer"
                      defaultChecked={false}
                    />
                    <span className="text-[#617589] font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-[#3593A6] hover:text-[#2d7a8a] font-semibold transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#245d6f] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m0-4V7a3 3 0 013-3h6a3 3 0 013 3v4m-6 4h6" />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e5e7eb]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#617589] font-medium">Admin Access Only</span>
                  </div>
                </div>

                {/* Info Message */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-xs font-medium flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Only authorized administrators can access this portal. Please enter your credentials.</span>
                  </p>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-[#f6f7f8] px-6 py-4 sm:px-8 border-t border-[#e5e7eb]">
              <p className="text-center text-sm text-[#617589] font-medium">
                Cruise Event Management System
              </p>
              <p className="text-center text-xs text-[#99a0a7] mt-1">
                © 2026 All rights reserved. Secure connection required.
              </p>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
