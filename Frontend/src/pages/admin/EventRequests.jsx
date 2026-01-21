import { useState, useEffect } from 'react';

function EventRequests({ onNavigate, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status?.toLowerCase() === "pending review" || r.status?.toLowerCase() === "pending").length;
  const approvedThisMonth = requests.filter(r => r.status?.toLowerCase() === "approved").length;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/event-requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data.data || data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm('Are you sure you want to accept this event hosting request?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/event-requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      setRequests(requests.filter(req => req.id !== id));
      alert('Event hosting request accepted successfully!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Are you sure you want to decline this event hosting request?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/event-requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to decline request');
      }

      setRequests(requests.filter(req => req.id !== id));
      alert('Event hosting request declined.');
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    if (onLogout) {
      onLogout();
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending Review" || status === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status === "New" || status === "new") return "bg-blue-100 text-blue-800 border-blue-200";
    if (status === "Approved" || status === "approved") return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(r => {
      const status = r.status?.toLowerCase();
      if (activeFilter === 'pending review') {
        return status === 'pending review' || status === 'pending';
      }
      return status === activeFilter;
    });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f7f8]">
      <aside className="flex w-64 flex-col bg-white border-r border-[#e5e7eb] shrink-0">
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col px-2">
              <h1 className="text-[#3593A6] text-xl font-bold leading-normal tracking-tight">Cruise Admin</h1>
              <p className="text-[#617589] text-xs font-medium uppercase tracking-wider mt-1">Event Requests</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button onClick={() => onNavigate && onNavigate('dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-[#f0f2f4] transition-colors group cursor-pointer">
                <svg className="w-6 h-6 group-hover:text-[#3593A6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#3593A6]/10 text-[#3593A6]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Event Requests</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('user-problems')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-[#f0f2f4] transition-colors group w-full text-left"
              >
                <svg className="w-6 h-6 group-hover:text-[#3593A6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-[#e5e7eb] shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#111418]">Event Hosting Requests</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 relative text-gray-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#111418] text-3xl font-black leading-tight tracking-tight">Event Hosting Submissions</h1>
                <p className="text-[#617589] text-base font-normal">Review artist event hosting proposals and manage event approvals.</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#111418] hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#3593A6] hover:bg-[#2d7a8a] text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Request
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#e5e7eb] bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-[#3593A6]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Requests</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{totalRequests}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-l-4 border-[#e5e7eb] border-l-yellow-500 bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Pending Review</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{pendingCount}</p>
                  {pendingCount > 0 && (
                    <span className="text-yellow-600 text-sm font-medium mb-1 bg-yellow-50 px-2 py-0.5 rounded-full">Needs Action</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#e5e7eb] bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Approved</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{approvedThisMonth}</p>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-2 gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'all'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                All Status
              </button>
              <button
                onClick={() => setActiveFilter('pending review')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'pending review'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Pending
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'pending review' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{pendingCount}</span>
              </button>
              <button
                onClick={() => setActiveFilter('approved')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'approved'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveFilter('declined')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'declined'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Declined
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center col-span-1">
                  <p className="text-[#617589]">Loading requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center col-span-1">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-[#111418] text-xl font-semibold mb-2">All caught up!</h3>
                  <p className="text-[#617589] text-sm">No event hosting requests at the moment.</p>
                </div>
              ) : (
                filteredRequests.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-xl hover:border-[#3593A6]/30 transition-all duration-300 overflow-hidden hover:scale-[1.02] transform">
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-72 shrink-0">
                        <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3] w-full">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-125"
                            style={{ backgroundImage: `url(${event.profileImage ? `/${event.profileImage}` : event.images?.[0] ? `/${event.images[0]}` : 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'})` }}
                          ></div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-lg group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-[#111418] hover:text-[#3593A6] transition-colors cursor-pointer">
                                {event.title || 'Untitled Event'}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="w-5 h-5 rounded-full bg-cover bg-center border border-gray-200"
                                  style={{ backgroundImage: `url(${event.artist?.profileImage ? `/${event.artist.profileImage}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'})` }}
                                ></div>
                                <p className="text-sm text-[#617589]">
                                  Submitted by <span className="font-medium text-[#111418]">{event.artist?.name || 'Unknown Artist'}</span> • {new Date(event.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(event.status)}`}>
                              {event.status || 'Pending'}
                            </span>
                          </div>

                          <p className="text-[#617589] text-sm leading-relaxed line-clamp-2 mb-3">
                            {event.description || 'No description provided.'}
                          </p>

                          {event.eventType && Array.isArray(event.eventType) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {event.eventType.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-[#f0f2f4] rounded text-xs font-medium text-[#617589]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-4 text-sm text-[#617589]">
                            {event.attendees && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {event.attendees} attendees
                              </span>
                            )}
                            {event.duration && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#e5e7eb] pt-4 mt-4 gap-4 sm:gap-0">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#617589] font-medium uppercase tracking-wide">Event Budget</span>
                            <span className="text-2xl font-bold text-[#3593A6] tracking-tight">{event.budget || event.price || 'N/A'}</span>
                          </div>

                          <div className="flex gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => handleDecline(event.id)}
                              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border-2 border-red-500 bg-white text-red-600 hover:bg-red-50 hover:border-red-600 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Decline
                            </button>
                            <button
                              onClick={() => handleAccept(event.id)}
                              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#3593A6] hover:bg-[#2d7a8a] text-white font-medium text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Accept Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredRequests.length > 0 && (
              <div className="flex items-center justify-center pt-6">
                <nav className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#3593A6] text-white font-medium text-sm">1</button>
                  <button className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-600 font-medium text-sm transition-colors">2</button>
                  <button className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-600 font-medium text-sm transition-colors">3</button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventRequests;
