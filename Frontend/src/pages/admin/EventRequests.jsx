import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventDetailsModal from '../../components/EventDetailsModal';
import Footer from '../../components/Footer';

function EventRequests({ onNavigate, onLogout }) {
  const [allRequests, setAllRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Calculate counts
  const totalRequests = allRequests.length;
  const pendingCount = allRequests.filter(r => r.status?.toLowerCase() === "pending").length;
  const approvedCount = allRequests.filter(r => r.status?.toLowerCase() === "approved").length;
  const rejectedCount = allRequests.filter(r => r.status?.toLowerCase() === "rejected").length;

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
      setAllRequests(data.data || data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load event requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
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

      // Update local state
      setAllRequests(allRequests.map(req =>
        req.id === id ? { ...req, status: 'Approved' } : req
      ));

      setSelectedEvent(null);
      toast.success('Event approved successfully! 🎉');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to approve event');
    }
  };

  const handleDecline = async (id) => {
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

      // Update local state
      setAllRequests(allRequests.map(req =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      ));

      setSelectedEvent(null);
      toast.info('Event request declined');
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error('Failed to decline event');
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
    const statusLower = status?.toLowerCase();
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (statusLower === "approved") return "bg-green-100 text-green-800 border-green-200";
    if (statusLower === "rejected") return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredRequests = activeFilter === 'all'
    ? allRequests
    : allRequests.filter(r => {
      const status = r.status?.toLowerCase();
      if (activeFilter === 'pending') return status === 'pending';
      if (activeFilter === 'approved') return status === 'approved';
      if (activeFilter === 'declined') return status === 'rejected';
      return true;
    });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f7f8]">
      <ToastContainer position="top-right" autoClose={3000} />

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
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#111418] text-3xl font-black leading-tight tracking-tight">Event Hosting Submissions</h1>
                <p className="text-[#617589] text-base font-normal">Review artist event hosting proposals and manage event approvals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#e5e7eb] bg-white shadow-sm">
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Requests</p>
                <p className="text-[#111418] text-3xl font-bold leading-tight">{totalRequests}</p>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-l-4 border-[#e5e7eb] border-l-yellow-500 bg-white shadow-sm">
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Pending Review</p>
                <p className="text-[#111418] text-3xl font-bold leading-tight">{pendingCount}</p>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-l-4 border-[#e5e7eb] border-l-green-500 bg-white shadow-sm">
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Approved</p>
                <p className="text-[#111418] text-3xl font-bold leading-tight">{approvedCount}</p>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-l-4 border-[#e5e7eb] border-l-red-500 bg-white shadow-sm">
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Rejected</p>
                <p className="text-[#111418] text-3xl font-bold leading-tight">{rejectedCount}</p>
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
                onClick={() => setActiveFilter('pending')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'pending'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Pending
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'pending' ? 'bg-white/20' : 'bg-gray-200'
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
                  <p className="text-[#617589] text-sm">No event hosting requests in this category.</p>
                </div>
              ) : (
                filteredRequests.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-xl hover:border-[#3593A6]/30 transition-all duration-300 overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-72 shrink-0">
                        <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3] w-full">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${event.profileImage ? `http://localhost:5000/${event.profileImage}` : event.images?.[0] ? `http://localhost:5000/${event.images[0]}` : 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'})` }}
                          ></div>
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
                                  style={{ backgroundImage: `url(${event.artist?.profileImage ? `http://localhost:5000/${event.artist.profileImage}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'})` }}
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

                          <div className="flex gap-4 text-sm text-[#617589]">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {event.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#e5e7eb] pt-4 mt-4 gap-4 sm:gap-0">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#617589] font-medium uppercase tracking-wide">Pricing</span>
                            <div className="flex gap-2 mt-1">
                              <span className="text-sm font-semibold text-[#3593A6]">VIP: ${event.prices?.VIP || 0}</span>
                              <span className="text-sm font-semibold text-[#3593A6]">Regular: ${event.prices?.Regular || 0}</span>
                              <span className="text-sm font-semibold text-[#3593A6]">Student: ${event.prices?.Student || 0}</span>
                            </div>
                          </div>

                          <div className="flex gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => setSelectedEvent(event)}
                              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border-2 border-[#3593A6] bg-white text-[#3593A6] hover:bg-[#3593A6]/10 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            {event.status?.toLowerCase() === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleDecline(event.id)}
                                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border-2 border-red-500 bg-white text-red-600 hover:bg-red-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleAccept(event.id)}
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#3593A6] hover:bg-[#2d7a8a] text-white font-medium text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Accept
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <Footer />
        </div>
      </main>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApprove={handleAccept}
          onReject={handleDecline}
        />
      )}
    </div>
  );
}

export default EventRequests;
