import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProblems({ onNavigate, onLogout }) {
  const [problems, setProblems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState({}); // { problemId: replyText }

  const totalProblems = problems.length;
  const openCount = problems.filter(p => p.status === "Open" || p.status === "open").length;
  const inProgressCount = problems.filter(p => p.status === "In Progress" || p.status === "in progress").length;
  const verifiedCount = problems.filter(p => p.status === "Verified" || p.status === "verified").length;
  const resolvedCount = problems.filter(p => p.status === "Resolved" || p.status === "resolved").length;
  const rejectedCount = problems.filter(p => p.status === "Rejected" || p.status === "rejected").length;

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/user-problems', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyData(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const adminNotes = replyData[id] || '';
    
    try {
      const response = await fetch(`http://localhost:5000/api/user-problems/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus, adminNotes })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setProblems(problems.map(p => p.id === id ? { ...p, status: newStatus, adminNotes } : p));
      setReplyData(prev => ({ ...prev, [id]: '' }));
      
      if (newStatus === 'Resolved') {
        toast.success('Problem marked as Solved!');
      } else if (newStatus === 'Rejected') {
        toast.info('Problem marked as Rejected.');
      } else {
        toast.warning('Problem marked as Unfixed.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user-problems/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete problem');
      }

      setProblems(problems.filter(p => p.id !== id));
      toast.success('Problem report deleted.');
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('Failed to delete problem. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    if (onLogout) {
      onLogout();
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "High" || priority === "high") return "text-red-600 bg-red-50 border-red-200";
    if (priority === "Medium" || priority === "medium") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (priority === "Low" || priority === "low") return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "open") return "bg-red-100 text-red-800 border-red-200";
    if (s === "in progress") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "verified") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "resolved") return "bg-green-100 text-green-800 border-green-200";
    if (s === "rejected") return "bg-gray-100 text-gray-800 border-gray-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredProblems = activeFilter === 'all'
    ? problems
    : problems.filter(p => p.status.toLowerCase() === activeFilter);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f7f8]">
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className="flex w-64 flex-col bg-white border-r border-[#e5e7eb] shrink-0">
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col px-2">
              <h1 className="text-[#3593A6] text-xl font-bold leading-normal tracking-tight">Cruise Admin</h1>
              <p className="text-[#617589] text-xs font-medium uppercase tracking-wider mt-1">User Problems</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button onClick={() => onNavigate && onNavigate('dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-[#f0f2f4] transition-colors group cursor-pointer">
                <svg className="w-6 h-6 group-hover:text-[#3593A6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('event-requests')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] hover:bg-[#f0f2f4] transition-colors group w-full text-left"
              >
                <svg className="w-6 h-6 group-hover:text-[#3593A6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Event Requests</span>
              </button>

              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#3593A6]/10 text-[#3593A6]">
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

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-[#e5e7eb] shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#111418]">User Problems & Complaints</h2>
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
                <h1 className="text-[#111418] text-3xl font-black leading-tight tracking-tight">User Issues & Complaints</h1>
                <p className="text-[#617589] text-base font-normal">Review and manage user-reported problems and complaints from the platform.</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#111418] hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#e5e7eb] bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-[#3593A6]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Total Problems</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{totalProblems}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-l-4 border-[#e5e7eb] border-l-red-500 bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Open Issues</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{openCount}</p>
                  {openCount > 0 && (
                    <span className="text-red-600 text-sm font-medium mb-1 bg-red-50 px-2 py-0.5 rounded-full">Needs Action</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#e5e7eb] bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[#617589] text-sm font-medium uppercase tracking-wider">Resolved</p>
                <div className="flex items-end gap-3">
                  <p className="text-[#111418] text-3xl font-bold leading-tight">{resolvedCount}</p>
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
                onClick={() => setActiveFilter('open')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'open'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Open
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'open' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{openCount}</span>
              </button>
              <button
                onClick={() => setActiveFilter('in progress')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'in progress'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                In Progress
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'in progress' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{inProgressCount}</span>
              </button>
              <button
                onClick={() => setActiveFilter('verified')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'verified'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Verified
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'verified' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{verifiedCount}</span>
              </button>
              <button
                onClick={() => setActiveFilter('resolved')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'resolved'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Resolved
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'resolved' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{resolvedCount}</span>
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'rejected'
                  ? 'bg-[#111418] text-white'
                  : 'bg-white border border-gray-300 text-[#111418] hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                Rejected
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === 'rejected' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>{rejectedCount}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center col-span-1">
                  <p className="text-[#617589]">Loading problems...</p>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center col-span-1">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-[#111418] text-xl font-semibold mb-2">No issues reported</h3>
                  <p className="text-[#617589] text-sm">All user problems have been resolved or there are currently no reports.</p>
                </div>
              ) : (
                              filteredProblems.map((problem) => (
                  <div key={problem.id} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm hover:shadow-md hover:border-[#3593A6]/30 transition-all duration-300 p-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-[#111418]">
                            {problem.subject || 'No Subject'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(problem.status)}`}>
                              {problem.status || 'Open'}
                            </span>
                            {problem.priority && (
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityColor(problem.priority)}`}>
                                {problem.priority} Priority
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-[#617589] mb-3">
                          <p>
                            <span className="font-medium text-[#111418]">{problem.name || 'Anonymous'}</span>
                            {' '}&bull;{' '}
                            <span className="text-[#3593A6]">{problem.email}</span>
                          </p>
                          <p className="text-xs">
                            {problem.reporter?.name ? `Registered User: ${problem.reporter.name}` : 'Guest User'}
                            {' '}&bull;{' '}
                            {new Date(problem.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <p className="text-sm text-[#111418] leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg">
                          {problem.message || 'No message provided.'}
                        </p>

                        {problem.adminNotes && (
                          <div className="text-xs text-[#617589] bg-blue-50 p-2 rounded-lg border border-blue-100">
                            <span className="font-medium text-blue-700">Admin Reply:</span> {problem.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reply Text Input */}
                    {problem.status?.toLowerCase() !== 'resolved' && problem.status?.toLowerCase() !== 'rejected' && (
                      <div className="mb-3">
                        <textarea
                          value={replyData[problem.id] || ''}
                          onChange={(e) => handleReplyChange(problem.id, e.target.value)}
                          placeholder="Write your solution or reply here..."
                          rows="2"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3593A6] focus:border-transparent resize-none"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {problem.status?.toLowerCase() !== 'resolved' && problem.status?.toLowerCase() !== 'rejected' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(problem.id, 'Resolved')}
                            className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Solved
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(problem.id, 'In Progress')}
                            className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Unfixed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(problem.id, 'Rejected')}
                            className="px-3 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Rejected
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(problem.id)}
                        className="px-3 py-2 rounded-lg border border-red-300 bg-white text-red-600 hover:bg-red-50 font-medium text-sm transition-all duration-200 flex items-center gap-2 ml-auto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProblems;
