import { useState, useEffect, useRef } from 'react';
import api from "../api/axios";

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const primaryColor = '#3593A6';

const ExploreEvents = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Data states
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState(null);
  const filterRef = useRef(null);

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFlyout(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter events based on search query (title only)
  const filteredUpcomingEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrendingEvents = trendingEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter states with localStorage persistence
  const [tempCategories, setTempCategories] = useState(() => {
    const saved = localStorage.getItem('eventFilters_categories');
    return saved ? JSON.parse(saved) : {
      Music: false,
      Sports: false,
      Family: false,
      Art: false,
    };
  });
  const [tempDate, setTempDate] = useState(() => {
    return localStorage.getItem('eventFilters_date') || null;
  });
  const [tempLocation, setTempLocation] = useState(() => {
    return localStorage.getItem('eventFilters_location') || null;
  });
  const [tempMinPrice, setTempMinPrice] = useState(() => {
    return parseInt(localStorage.getItem('eventFilters_minPrice')) || 0;
  });
  const [tempMaxPrice, setTempMaxPrice] = useState(() => {
    return parseInt(localStorage.getItem('eventFilters_maxPrice')) || 500;
  });

  const filledTrackRef = useRef(null);
  const GAP = 30;
  const MAX = 500;

  const updateSlider = () => {
    let minVal = parseInt(tempMinPrice);
    let maxVal = parseInt(tempMaxPrice);

    if (maxVal - minVal < GAP) {
      if (document.activeElement?.classList.contains('min-thumb')) {
        minVal = maxVal - GAP;
      } else {
        maxVal = minVal + GAP;
      }
      setTempMinPrice(minVal);
      setTempMaxPrice(maxVal);
    }

    const percentMin = (minVal / MAX) * 100;
    const percentMax = (maxVal / MAX) * 100;

    if (filledTrackRef.current) {
      filledTrackRef.current.style.left = `${percentMin}%`;
      filledTrackRef.current.style.width = `${percentMax - percentMin}%`;
    }
  };

  useEffect(() => {
    updateSlider();
  }, [tempMinPrice, tempMaxPrice]);

  // Save filter states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('eventFilters_categories', JSON.stringify(tempCategories));
  }, [tempCategories]);

  useEffect(() => {
    localStorage.setItem('eventFilters_date', tempDate || '');
  }, [tempDate]);

  useEffect(() => {
    localStorage.setItem('eventFilters_location', tempLocation || '');
  }, [tempLocation]);

  useEffect(() => {
    localStorage.setItem('eventFilters_minPrice', tempMinPrice.toString());
  }, [tempMinPrice]);

  useEffect(() => {
    localStorage.setItem('eventFilters_maxPrice', tempMaxPrice.toString());
  }, [tempMaxPrice]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/getuser");
        setUser(res.data);
        console.log(res.data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/event/');


        const eventData = response.data


        if (eventData && eventData) {
          setUpcomingEvents(eventData);

          // Filter events for today
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const todayEvents = eventData.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === today.getTime();
          });

          setTrendingEvents(todayEvents);
          console.log('All events:', eventData);
          console.log('Today events:', todayEvents);
        } else {
          throw new Error('Unexpected data format');
        }


      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto-apply saved filters on component mount
  useEffect(() => {
    const hasSavedFilters = localStorage.getItem('eventFilters_categories') ||
      localStorage.getItem('eventFilters_date') ||
      localStorage.getItem('eventFilters_location') ||
      localStorage.getItem('eventFilters_minPrice') ||
      localStorage.getItem('eventFilters_maxPrice');

    if (hasSavedFilters) {
      // Small delay to ensure events are loaded first
      setTimeout(() => {
        handleApplyFilters();
      }, 100);
    }
  }, []);

  const handleApplyFilters = async () => {
    try {
      setLoading(true);

      // Get selected categories
      const selectedCats = Object.entries(tempCategories)
        .filter(([_, isSelected]) => isSelected)
        .map(([category]) => category);

      // Prepare filters
      const filters = {
        category: selectedCats.length > 0 ? selectedCats.join(',') : undefined,
        minPrice: tempMinPrice,
        maxPrice: tempMaxPrice,
        location: tempLocation,
        date: tempDate
      };

      // Remove empty/undefined filters
      Object.keys(filters).forEach(key =>
        (filters[key] === null || filters[key] === undefined || filters[key] === '') && delete filters[key]
      );

      // If no filters are applied, fetch all events
      if (Object.keys(filters).length === 0) {
        const response = await api.get('/event');
        setUpcomingEvents(response.data);

        // Filter trending events to show only today's events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEvents = response.data.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
        setTrendingEvents(todayEvents);
        return;
      }

      // Apply filters via API call
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`/api/events/filter?${queryParams}`);
      setUpcomingEvents(response.data);

      // Filter trending events to show only today's events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEvents = response.data.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      });
      setTrendingEvents(todayEvents);
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };
  const handleClearAll = async (e) => {
    e.preventDefault();
    setTempCategories({ Music: false, Sports: false, Family: false, Art: false });
    setTempDate(null);
    setTempLocation(null);
    setTempMinPrice(0);
    setTempMaxPrice(500);

    // Clear localStorage
    localStorage.removeItem('eventFilters_categories');
    localStorage.removeItem('eventFilters_date');
    localStorage.removeItem('eventFilters_location');
    localStorage.removeItem('eventFilters_minPrice');
    localStorage.removeItem('eventFilters_maxPrice');

    try {
      setLoading(true);
      const response = await api.get('/event');
      setUpcomingEvents(response.data);

      // Filter trending events to show only today's events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEvents = response.data.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      });
      setTrendingEvents(todayEvents);
    } catch (error) {
      console.error('Error fetching all events:', error);
      setError('Failed to clear filters');
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = ['Music', 'Sports', 'Family', 'Art'];
  const dateOptions = ['Today', 'Tomorrow', 'This Week', 'This Month'];
  const locations = [
    'Hyatt Hotel',
    'Plaza Auditorium',
    'Dasrath Stadium',
    'National Gallery',
    'Thundikhel',
  ];

  return (
    <>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: white;
          border: 4px solid ${primaryColor};
          box-shadow: 0 4px 12px rgba(53, 147, 166, 0.4);
          cursor: pointer;
         
        }
        input[type="range"]::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: white;
          border: 4px solid ${primaryColor};
          box-shadow: 0 4px 12px rgba(53, 147, 166, 0.4);
          cursor: pointer;
       
          border: none;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <main className="mt-20 flex flex-col sm:flex-row">
        {/* Filters Sidebar - Mobile Responsive */}
        {/* Premium Filter Card */}
        <aside
          ref={filterRef}
          className="w-full sm:w-[400px] bg-transparent p-4 sm:p-8 static sm:fixed left-0 top-20 bottom-0 z-40 overflow-visible"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-slate-900">Filters</h2>
              <button
                onClick={handleClearAll}
                className="text-sm font-semibold text-[#3593A6] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* TYPE FILTER */}
            <div className="relative">
              <button
                onClick={() => setActiveFlyout(activeFlyout === 'type' ? null : 'type')}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'type' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {Object.entries(tempCategories).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'All Categories'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>

              {activeFlyout === 'type' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-left-4 duration-300">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Category</p>
                  <div className="flex flex-col gap-1">
                    {categoriesList.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={tempCategories[cat]}
                          onChange={() => setTempCategories({ ...tempCategories, [cat]: !tempCategories[cat] })}
                          className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#3593A6] focus:ring-[#3593A6] cursor-pointer"
                        />
                        <span className={`text-sm font-semibold transition-colors ${tempCategories[cat] ? 'text-[#3593A6]' : 'text-slate-600'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DATE FILTER */}
            <div className="relative">
              <button
                onClick={() => setActiveFlyout(activeFlyout === 'date' ? null : 'date')}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'date' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-bold text-slate-900">{tempDate || 'Any dates'}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>

              {activeFlyout === 'date' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-left-4 duration-300">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Period</p>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setTempDate(null)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${!tempDate ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!tempDate ? 'border-[#3593A6]' : 'border-slate-300'}`}>
                        {!tempDate && <div className="w-2.5 h-2.5 rounded-full bg-[#3593A6]" />}
                      </div>
                      <span className="text-sm font-semibold">Any dates</span>
                    </button>
                    {dateOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTempDate(opt)}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${tempDate === opt ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tempDate === opt ? 'border-[#3593A6]' : 'border-slate-300'}`}>
                          {tempDate === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#3593A6]" />}
                        </div>
                        <span className="text-sm font-semibold">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PRICE FILTER */}
            <div className="relative">
              <button
                onClick={() => setActiveFlyout(activeFlyout === 'price' ? null : 'price')}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'price' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                  <p className="text-sm font-bold text-slate-900">${tempMinPrice} - ${tempMaxPrice === 500 ? '500+' : tempMaxPrice}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>

              {activeFlyout === 'price' && (
                <div className="absolute left-[105%] top-0 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-left-4 duration-300">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Price Range</p>
                  <div className="relative h-12 mx-2 mb-8">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={tempMinPrice}
                      step="5"
                      onChange={(e) => setTempMinPrice(parseInt(e.target.value))}
                      className="min-thumb absolute w-full z-20 pointer-events-auto"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={tempMaxPrice}
                      step="5"
                      onChange={(e) => setTempMaxPrice(parseInt(e.target.value))}
                      className="absolute w-full z-20 pointer-events-auto"
                    />
                    <div className="absolute h-1.5 bg-slate-100 rounded-full top-1/2 left-0 right-0 -translate-y-1/2" />
                    <div
                      ref={filledTrackRef}
                      className="absolute h-1.5 rounded-full top-1/2 -translate-y-1/2 z-10"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                  <div className="flex justify-between text-center font-bold text-sm text-[#3593A6]">
                    <span>${tempMinPrice}</span>
                    <span>${tempMaxPrice === 500 ? '500+' : tempMaxPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LOCATION FILTER */}
            <div className="relative">
              <button
                onClick={() => setActiveFlyout(activeFlyout === 'location' ? null : 'location')}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'location' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{tempLocation || 'Anywhere'}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>

              {activeFlyout === 'location' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-left-4 duration-300">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Location</p>
                  <div className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                    <button
                      onClick={() => setTempLocation(null)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${!tempLocation ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="text-sm font-semibold">Anywhere</span>
                    </button>
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setTempLocation(loc)}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${tempLocation === loc ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50 text-left'}`}
                      >
                        <span className="text-sm font-semibold text-left">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <button
              onClick={() => {
                handleApplyFilters();
                setActiveFlyout(null);
              }}
              className="w-full h-16 bg-[#3593A6] text-white rounded-3xl flex items-center justify-center shadow-xl shadow-[#3593A6]/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 mt-4 active:scale-95"
            >
              <span className="material-symbols-outlined text-3xl font-bold">search</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 sm:ml-[400px] p-4 md:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
          {/* Hero */}
          <div
            className="text-white py-18 px-12 rounded-3xl text-center mb-12 shadow-lg"
            style={{ background: primaryColor }}
          >
            <h1 className="text-6xl font-bold mb-2">Explore Live Events Near You</h1>
            <p className="text-lg opacity-90">Discover amazing experiences in your city</p>
          </div>
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full md:w-80 py-3 px-6 border-2 border-gray-300 rounded-full focus:outline-none focus:border-teal-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {loading && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-2xl text-red-600">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Upcoming Events */}
              <h2 className="text-5xl font-bold mb-3" style={{ color: primaryColor }}>Upcoming Events</h2>
              <p className="text-gray-500 mb-8">Showing {filteredUpcomingEvents.length} event{filteredUpcomingEvents.length !== 1 ? 's' : ''}</p>
              {filteredUpcomingEvents.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-10">
                  No upcoming events available at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mb-16 auto-rows-max">
                  {filteredUpcomingEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-400 hover:shadow-2xl hover:bg-blue-50 group cursor-pointer h-fit border border-gray-200 hover:border-[#3593A6]"
                    >
                      <img
                        className="h-52 bg-cover bg-center transition-transform duration-400 group-hover:scale-105"
                        src={`http://localhost:5000/${event.profileImage}`}
                      />
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{new Date(event.date).toLocaleDateString()} • {event.time || 'Time TBA'}</p>
                        <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:py-5 transition-all duration-500 bg-gray-50 border-t border-gray-200">
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Price:</strong>{' '}
                            {event.prices?.Standard === 0 ? 'Free Entry' : `Starts from $${event.prices?.Standard}`}
                          </p>
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Location:</strong> {event.location}
                          </p>
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Category:</strong> {event.category}
                          </p>
                          <button
                            className="w-full py-3.5 text-white rounded-full font-bold mt-4 transition hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => navigate(`/event/${event.id}`)}
                          >
                            {event.btnText || 'Book Ticket'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trending Events */}
              <h2 className="text-5xl font-bold mb-3" style={{ color: primaryColor }}>Trending Events</h2>
              <p className="text-gray-500 mb-8">Today's hottest events - {filteredTrendingEvents.length} live</p>
              {filteredTrendingEvents.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-10">
                  No trending events available at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 auto-rows-max">

                  {filteredTrendingEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-400 hover:shadow-2xl hover:bg-blue-50 group cursor-pointer h-fit border border-gray-200 hover:border-[#3593A6]"
                    >
                      <img
                        className="h-52 bg-cover bg-center transition-transform duration-400 group-hover:scale-105"
                        src={`http://localhost:5000/${event.profileImage}`}
                      />
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{new Date(event.date).toLocaleDateString()} • {event.time || 'Time TBA'}</p>
                        <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:py-5 transition-all duration-500 bg-gray-50 border-t border-gray-200">
                          <p className="mb-3">
                            {event.prices?.Standard === 0 ? 'Free Entry' : `Starts from $${event.prices?.Standard}`}
                          </p>
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Location:</strong> {event.location}
                          </p>
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Category:</strong> {event.category}
                          </p>
                          <button
                            className="w-full py-3.5 text-white rounded-full font-bold mt-4 transition hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Book Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ExploreEvents;