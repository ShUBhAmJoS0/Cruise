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
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [soonestEvent, setSoonestEvent] = useState(null);
  const filterRef = useRef(null);

  // Countdown Logic
  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const sorted = [...upcomingEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
      const soonest = sorted.find(e => new Date(e.date) > new Date());
      setSoonestEvent(soonest);
    }
  }, [upcomingEvents]);

  useEffect(() => {
    if (!soonestEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(soonestEvent.date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [soonestEvent]);

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
          className="w-full sm:w-[380px] bg-transparent p-4 sm:p-8 static sm:fixed left-0 top-20 bottom-0 z-40 overflow-visible"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 flex flex-col gap-2 relative">
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
        <div className="flex-1 sm:ml-[380px] p-4 md:p-6 lg:p-10 bg-slate-50 min-h-screen">

          {/* Hero Banner with Countdown */}
          <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0a0f18] text-white shadow-2xl mb-12">
            {/* Background Image/Overlay */}
            <div className="absolute inset-0 opacity-40">
              <img
                src={soonestEvent ? `http://localhost:5000/${soonestEvent.profileImage}` : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                className="w-full h-full object-cover"
                alt="Banner Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/60 to-transparent"></div>
            </div>

            {soonestEvent && (
              <div className="relative z-10 p-8 md:p-16 flex flex-col items-center">
                {/* Event Metadata */}
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300">
                    <span className="material-symbols-outlined text-[#3593A6] text-lg">calendar_today</span>
                    {new Date(soonestEvent.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="hidden md:block w-px h-4 bg-slate-700"></div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300">
                    <span className="material-symbols-outlined text-[#3593A6] text-lg">schedule</span>
                    {soonestEvent.time}
                  </div>
                  <div className="hidden md:block w-px h-4 bg-slate-700"></div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300">
                    <span className="material-symbols-outlined text-[#3593A6] text-lg">location_on</span>
                    {soonestEvent.location}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-7xl font-black text-center mb-10 tracking-tight leading-tight uppercase">
                  {soonestEvent.title}
                </h1>

                {/* Countdown */}
                <div className="flex gap-3 md:gap-5 mb-14">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Mins', value: countdown.mins },
                    { label: 'Sec', value: countdown.secs }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-20 md:w-24 md:h-28 bg-[#0a0f18]/80 backdrop-blur-xl border-2 border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                        <span className="text-2xl md:text-5xl font-black text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="mt-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#3593A6]">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={() => navigate(`/event/${soonestEvent.id}`)}
                    className="flex-1 py-4 border-2 border-white text-white font-black rounded-2xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/event/${soonestEvent.id}`)}
                    className="flex-1 py-4 bg-[#3593A6] text-white font-black rounded-2xl shadow-xl shadow-[#3593A6]/30 hover:shadow-2xl hover:bg-[#2d7a8a] transition-all uppercase tracking-widest text-sm border-2 border-[#3593A6]"
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            )}

            {!soonestEvent && !loading && (
              <div className="relative z-10 p-20 flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-black text-center mb-4 tracking-tight uppercase">
                  No Upcoming Events
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest">Check back later for more cruises</p>
              </div>
            )}
          </section>

          {/* Search and Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Upcoming Cruises</h2>
              <p className="text-slate-500 font-medium">Join the wave of high-energy nautical events</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full py-4 px-6 pr-12 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3593A6]/20 transition-all text-slate-900 font-medium shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              </div>

              <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                <button className="p-2 rounded-lg bg-slate-100 text-[#3593A6]">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>
            </div>
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
              {/* Upcoming Events Grid */}
              {filteredUpcomingEvents.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner italic">
                  No upcoming events available at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                  {filteredUpcomingEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={`http://localhost:5000/${event.profileImage}`}
                          alt={event.title}
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                          {event.category || 'General'}
                        </div>
                        {/* Favorite Button */}
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#3593A6] hover:text-white transition-all border border-white/20">
                          <span className="material-symbols-outlined text-xl">favorite</span>
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Floating Content Card Effect */}
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-50 -mt-16 relative z-10 mb-4">
                          <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#3593A6] transition-colors line-clamp-1 uppercase tracking-tight">
                            {event.title}
                          </h3>
                          <p className="text-[#3593A6] text-[10px] font-black uppercase tracking-widest">
                            {event.subCategory || (event.category === 'Music' ? 'Electronic & Dance' : 'Live Event')}
                          </p>
                        </div>

                        {/* Metadata Rows */}
                        <div className="space-y-4 mb-6 flex-1">
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#3593A6]">
                              <span className="material-symbols-outlined text-lg">calendar_month</span>
                            </div>
                            <span className="text-xs font-bold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {event.time || '7:00 PM'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#3593A6]">
                              <span className="material-symbols-outlined text-lg">location_on</span>
                            </div>
                            <span className="text-xs font-bold line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 pt-5 mt-auto">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                              <p className="text-xl font-black text-slate-900">${event.prices?.Standard || 0}</p>
                            </div>
                            <button
                              onClick={() => navigate(`/event/${event.id}`)}
                              className="px-6 py-3 bg-[#0a0f18] text-white text-xs font-black rounded-xl hover:bg-[#3593A6] transition-all uppercase tracking-widest border border-[#0a0f18] hover:border-[#3593A6] shadow-lg shadow-black/10 active:scale-95"
                            >
                              Tickets
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trending Events Header */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Trending Events</h2>
                  <p className="text-slate-500 font-medium">Wait and see what everyone is talking about today</p>
                </div>
              </div>

              {/* Trending Events Grid */}
              {filteredTrendingEvents.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner italic">
                  No trending events available at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredTrendingEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={`http://localhost:5000/${event.profileImage}`}
                          alt={event.title}
                        />
                        <div className="absolute top-4 left-4 bg-[#3593A6] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                          Trending
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-50 -mt-16 relative z-10 mb-4">
                          <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#3593A6] transition-colors line-clamp-1 uppercase tracking-tight">
                            {event.title}
                          </h3>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            {event.category} • Live Event
                          </p>
                        </div>

                        <div className="space-y-4 mb-6 flex-1">
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#3593A6]">
                              <span className="material-symbols-outlined text-lg">calendar_month</span>
                            </div>
                            <span className="text-xs font-bold">{new Date(event.date).toLocaleDateString()} • {event.time || '7:00 PM'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#3593A6]">
                              <span className="material-symbols-outlined text-lg">location_on</span>
                            </div>
                            <span className="text-xs font-bold line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-5 mt-auto text-center">
                          <button
                            onClick={() => navigate(`/event/${event.id}`)}
                            className="w-full py-3 bg-slate-50 text-slate-900 text-xs font-black rounded-xl hover:bg-[#3593A6] hover:text-white transition-all uppercase tracking-widest border border-slate-200 hover:border-[#3593A6]"
                          >
                            Explore Event
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
      </main >
    </>
  );
};

export default ExploreEvents;