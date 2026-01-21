import { useState, useEffect } from 'react';
import EventRequests from './EventRequests';
import UserProblems from './UserProblems';
import NotificationDropdown from '../../components/NotificationDropdown';

function AdminDashboard({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    artistsLoggedIn: 0,
    upcomingEvents: 0,
    totalEvents: 0,
    totalRevenue: 0,
    bookingsThisMonth: 0,
    pendingEventRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values if API fails - you can remove this after backend is working

    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // If on different pages, render those components
  if (currentPage === 'event-requests') {
    return <EventRequests onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (currentPage === 'user-problems') {
    return <UserProblems onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f7f8]">
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col bg-white border-r border-[#e5e7eb] shrink-0">
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col px-2">
              <h1 className="text-[#3593A6] text-xl font-bold leading-normal tracking-tight">Cruise Admin</h1>
              <p className="text-[#617589] text-xs font-medium uppercase tracking-wider mt-1">Dashboard</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button onClick={() => handleNavigate('dashboard')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left ${currentPage === 'dashboard' ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-[#617589] hover:bg-[#f0f2f4]'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button onClick={() => handleNavigate('event-requests')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left ${currentPage === 'event-requests' ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-[#617589] hover:bg-[#f0f2f4]'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Event Requests</span>
              </button>

              <button onClick={() => handleNavigate('user-problems')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left ${currentPage === 'user-problems' ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-[#617589] hover:bg-[#f0f2f4]'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium">User Problems</span>
              </button>

              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-[#f0f2f4] transition-colors group w-full text-left">
                <svg className="w-6 h-6 group-hover:text-[#3593A6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Settings</span>
              </button>
            </nav>
          </div>

          <div className="flex flex-col gap-1 border-t border-[#e5e7eb] pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-[#e5e7eb] shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#111418]">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown onNavigate={handleNavigate} />
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Users Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Users</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.totalUsers}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-[#3593A6]/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#3593A6]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">Updated today</p>
              </div>

              {/* Artists Logged In Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Artists Online</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.artistsLoggedIn}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">Active now</p>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Upcoming Events</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.upcomingEvents}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">Next 30 days</p>
              </div>

              {/* Total Events Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Events</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.totalEvents}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">All time</p>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">${loading ? '-' : (dashboardStats.totalRevenue / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">This year</p>
              </div>

              {/* Bookings This Month Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Bookings</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.bookingsThisMonth}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4v12H8V4h8m2-2H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[#617589]">This month</p>
              </div>

              {/* Pending Event Requests Card */}
              <div
                onClick={() => handleNavigate('event-requests')}
                className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-[#3593A6]/50 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Pending Requests</p>
                    <p className="text-[#111418] text-3xl font-bold leading-tight mt-2">{loading ? '-' : dashboardStats.pendingEventRequests}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <svg className="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#617589]">Awaiting approval</p>
                  {dashboardStats.pendingEventRequests > 0 && (
                    <span className="text-xs font-medium text-[#3593A6] group-hover:underline">View all →</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-sm">
              <h3 className="text-lg font-bold text-[#111418] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => handleNavigate('event-requests')} className="p-4 rounded-xl bg-[#3593A6]/10 hover:bg-[#3593A6]/20 transition-colors text-left">
                  <p className="font-semibold text-[#3593A6] mb-1">View Event Requests</p>
                  <p className="text-sm text-[#617589]">Review pending artist requests</p>
                </button>
                <button onClick={() => handleNavigate('user-problems')} className="p-4 rounded-xl bg-red-100/20 hover:bg-red-100/40 transition-colors text-left">
                  <p className="font-semibold text-red-600 mb-1">User Issues</p>
                  <p className="text-sm text-[#617589]">Check reported problems</p>
                </button>
                <button className="p-4 rounded-xl bg-blue-100/20 hover:bg-blue-100/40 transition-colors text-left">
                  <p className="font-semibold text-blue-600 mb-1">View Reports</p>
                  <p className="text-sm text-[#617589]">Generate analytics report</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
