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
  const [visibleUpcomingCount, setVisibleUpcomingCount] = useState(3);
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

  // Filter events based on search query and exclude specific mock/invalid titles
  const invalidTitles = ['Grand Caribbean Cruise', 'Sunset Jazz Night', 'Comedy on the Ocean'];

  const filteredUpcomingEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !invalidTitles.includes(event.title)
  );

  const filteredTrendingEvents = trendingEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !invalidTitles.includes(event.title)
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
  const [tempDate, setTempDate] = useState(() => localStorage.getItem('eventFilters_date') || null);
  const [tempLocation, setTempLocation] = useState(() => localStorage.getItem('eventFilters_location') || null);
  const [tempMinPrice, setTempMinPrice] = useState(() => parseInt(localStorage.getItem('eventFilters_minPrice')) || 0);
  const [tempMaxPrice, setTempMaxPrice] = useState(() => parseInt(localStorage.getItem('eventFilters_maxPrice')) || 500);

  const filledTrackRef = useRef(null);
  const GAP = 30;
  const MAX = 500;

  const updateSlider = () => {
    let minVal = parseInt(tempMinPrice);
    let maxVal = parseInt(tempMaxPrice);

    if (maxVal - minVal < GAP) {
      if (document.activeElement?.classList.contains('min-thumb')) minVal = maxVal - GAP;
      else maxVal = minVal + GAP;
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

  useEffect(() => { updateSlider(); }, [tempMinPrice, tempMaxPrice]);

  useEffect(() => { localStorage.setItem('eventFilters_categories', JSON.stringify(tempCategories)); }, [tempCategories]);
  useEffect(() => { localStorage.setItem('eventFilters_date', tempDate || ''); }, [tempDate]);
  useEffect(() => { localStorage.setItem('eventFilters_location', tempLocation || ''); }, [tempLocation]);
  useEffect(() => { localStorage.setItem('eventFilters_minPrice', tempMinPrice.toString()); }, [tempMinPrice]);
  useEffect(() => { localStorage.setItem('eventFilters_maxPrice', tempMaxPrice.toString()); }, [tempMaxPrice]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/getuser");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const filterTrending = (eventList) => {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);
    return eventList.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= threeDaysLater;
    });
  };

  useEffect(() => {
    console.log("fetching events")
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/event');
        console.log(response.data);
        if (response.data) {
          setUpcomingEvents(response.data);
          setTrendingEvents(filterTrending(response.data));
        } else throw new Error('Unexpected data format');
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const selectedCats = Object.entries(tempCategories).filter(([, isSelected]) => isSelected).map(([category]) => category);
      const filters = {
        category: selectedCats.length > 0 ? selectedCats.join(',') : undefined,
        minPrice: tempMinPrice,
        maxPrice: tempMaxPrice,
        location: tempLocation,
        date: tempDate
      };

      Object.keys(filters).forEach(key => (filters[key] === null || filters[key] === undefined || filters[key] === '') && delete filters[key]);

      if (Object.keys(filters).length === 0) {
        const response = await api.get('/event');
        setUpcomingEvents(response.data);
        setTrendingEvents(filterTrending(response.data));
        return;
      }

      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`/api/events/filter?${queryParams}`);
      setUpcomingEvents(response.data);
      setTrendingEvents(filterTrending(response.data));
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setTempCategories({ Music: false, Sports: false, Family: false, Art: false });
    setTempDate(null);
    setTempLocation(null);
    setTempMinPrice(0);
    setTempMaxPrice(500);

    localStorage.removeItem('eventFilters_categories');
    localStorage.removeItem('eventFilters_date');
    localStorage.removeItem('eventFilters_location');
    localStorage.removeItem('eventFilters_minPrice');
    localStorage.removeItem('eventFilters_maxPrice');

    try {
      setLoading(true);
      const response = await api.get('/event');
      setUpcomingEvents(response.data);
      setTrendingEvents(filterTrending(response.data));
    } catch (error) {
      console.error('Error fetching all events:', error);
      setError('Failed to clear filters');
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = ['Music', 'Sports', 'Family', 'Art'];
  const dateOptions = ['Today', 'Tomorrow', 'This Week', 'This Month'];
  const locations = ['Hyatt Hotel', 'Plaza Auditorium', 'Dasrath Stadium', 'National Gallery', 'Thundikhel'];

  return (
    <>
      <style>{`
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 28px; width: 28px; border-radius: 50%; background: white; border: 4px solid ${primaryColor}; box-shadow: 0 4px 12px rgba(53, 147, 166, 0.4); cursor: pointer; }
        input[type="range"]::-moz-range-thumb { height: 28px; width: 28px; border-radius: 50%; background: white; border: 4px solid ${primaryColor}; box-shadow: 0 4px 12px rgba(53, 147, 166, 0.4); cursor: pointer; border: none; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-in { animation: fadeIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <main className="mt-20 flex flex-col sm:flex-row">
        <aside ref={filterRef} className="w-full sm:w-[380px] bg-transparent p-4 sm:p-8 static sm:fixed left-0 top-20 bottom-0 z-40 overflow-visible">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-slate-900">Filters</h2>
              <button onClick={handleClearAll} className="text-sm font-semibold text-[#3593A6] hover:underline">Clear All</button>
            </div>

            <div className="relative">
              <button onClick={() => setActiveFlyout(activeFlyout === 'type' ? null : 'type')} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'type' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]"><span className="material-symbols-outlined">category</span></div>
                <div className="flex-1 text-left"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p><p className="text-sm font-bold text-slate-900 truncate">{Object.entries(tempCategories).filter(([, v]) => v).map(([k]) => k).join(', ') || 'All Categories'}</p></div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>
              {activeFlyout === 'type' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Category</p>
                  <div className="flex flex-col gap-1">
                    {categoriesList.map(cat => (
                      <label key={cat} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer group">
                        <input type="checkbox" checked={tempCategories[cat]} onChange={() => setTempCategories({ ...tempCategories, [cat]: !tempCategories[cat] })} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#3593A6] focus:ring-[#3593A6] cursor-pointer" />
                        <span className={`text-sm font-semibold transition-colors ${tempCategories[cat] ? 'text-[#3593A6]' : 'text-slate-600'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setActiveFlyout(activeFlyout === 'date' ? null : 'date')} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'date' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]"><span className="material-symbols-outlined">calendar_today</span></div>
                <div className="flex-1 text-left"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p><p className="text-sm font-bold text-slate-900">{tempDate || 'Any dates'}</p></div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>
              {activeFlyout === 'date' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Period</p>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setTempDate(null)} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${!tempDate ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!tempDate ? 'border-[#3593A6]' : 'border-slate-300'}`}>{!tempDate && <div className="w-2.5 h-2.5 rounded-full bg-[#3593A6]" />}</div>
                      <span className="text-sm font-semibold">Any dates</span>
                    </button>
                    {dateOptions.map(opt => (
                      <button key={opt} onClick={() => setTempDate(opt)} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${tempDate === opt ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tempDate === opt ? 'border-[#3593A6]' : 'border-slate-300'}`}>{tempDate === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#3593A6]" />}</div>
                        <span className="text-sm font-semibold">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setActiveFlyout(activeFlyout === 'price' ? null : 'price')} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'price' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]"><span className="material-symbols-outlined">payments</span></div>
                <div className="flex-1 text-left"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p><p className="text-sm font-bold text-slate-900">${tempMinPrice} - ${tempMaxPrice === 500 ? '500+' : tempMaxPrice}</p></div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>
              {activeFlyout === 'price' && (
                <div className="absolute left-[105%] top-0 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Price Range</p>
                  <div className="relative h-12 mx-2 mb-8">
                    <input type="range" min="0" max="500" value={tempMinPrice} step="5" onChange={(e) => setTempMinPrice(parseInt(e.target.value))} className="min-thumb absolute w-full z-20 pointer-events-auto" />
                    <input type="range" min="0" max="500" value={tempMaxPrice} step="5" onChange={(e) => setTempMaxPrice(parseInt(e.target.value))} className="absolute w-full z-20 pointer-events-auto" />
                    <div className="absolute h-1.5 bg-slate-100 rounded-full top-1/2 left-0 right-0 -translate-y-1/2" />
                    <div ref={filledTrackRef} className="absolute h-1.5 rounded-full top-1/2 -translate-y-1/2 z-10" style={{ backgroundColor: primaryColor }} />
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#3593A6]"><span>${tempMinPrice}</span><span>${tempMaxPrice === 500 ? '500+' : tempMaxPrice}</span></div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setActiveFlyout(activeFlyout === 'location' ? null : 'location')} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${activeFlyout === 'location' ? 'bg-[#3593A6]/10 shadow-inner' : 'hover:bg-slate-50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-[#3593A6]/10 flex items-center justify-center text-[#3593A6]"><span className="material-symbols-outlined">location_on</span></div>
                <div className="flex-1 text-left"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p><p className="text-sm font-bold text-slate-900 truncate">{tempLocation || 'Anywhere'}</p></div>
                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
              </button>
              {activeFlyout === 'location' && (
                <div className="absolute left-[105%] top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Location</p>
                  <div className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                    <button onClick={() => setTempLocation(null)} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${!tempLocation ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}>Anywhere</button>
                    {locations.map(loc => (
                      <button key={loc} onClick={() => setTempLocation(loc)} className={`w-full p-3 text-left rounded-2xl transition-colors ${tempLocation === loc ? 'bg-[#3593A6]/10 text-[#3593A6]' : 'text-slate-600 hover:bg-slate-50'}`}>{loc}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => { handleApplyFilters(); setActiveFlyout(null); }} className="w-full h-16 bg-[#3593A6] text-white rounded-3xl mt-4 shadow-xl shadow-[#3593A6]/30 hover:shadow-2xl hover:bg-[#0a0f18] transition-all flex items-center justify-center active:scale-95"><span className="material-symbols-outlined text-3xl">search</span></button>
          </div>
        </aside>

        <div className="flex-1 sm:ml-[380px] p-4 md:p-6 lg:p-10 bg-slate-50">
          <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0a0f18] text-white shadow-2xl mb-12" style={{ maxHeight: '420px' }}>
            <div className="absolute inset-0">
              <img src={soonestEvent?.profileImage ? `http://localhost:5000/${soonestEvent.profileImage}` : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1920&q=80"} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1920&q=80"; }} className="w-full h-full object-cover blur-[12px] scale-110 brightness-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18]/95 via-[#0a0f18]/75 to-[#0a0f18]/50"></div>
            </div>
            {soonestEvent && (
              <div className="relative z-10 p-6 md:p-10 flex flex-col items-center">
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300"><span className="material-symbols-outlined text-[#3593A6] text-lg">calendar_today</span>{new Date(soonestEvent.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300"><span className="material-symbols-outlined text-[#3593A6] text-lg">schedule</span>{soonestEvent.time}</div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300"><span className="material-symbols-outlined text-[#3593A6] text-lg">location_on</span>{soonestEvent.location}</div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-center mb-6 uppercase tracking-tight leading-tight">{soonestEvent.title}</h1>
                <div className="flex gap-3 md:gap-4 mb-8">
                  {[{ label: 'Days', value: countdown.days }, { label: 'Hours', value: countdown.hours }, { label: 'Mins', value: countdown.mins }, { label: 'Sec', value: countdown.secs }].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-16 md:w-20 md:h-24 bg-[#0a0f18]/80 border-2 border-slate-800 rounded-xl flex items-center justify-center relative group overflow-hidden">
                        <span className="text-xl md:text-4xl font-black text-white relative z-10">{String(item.value).padStart(2, '0')}</span>
                      </div>
                      <span className="mt-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#3593A6]">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button onClick={() => navigate(`/event/${soonestEvent.id}`)} className="flex-1 py-3 border-2 border-[#3593A6] text-[#3593A6] font-black rounded-xl hover:bg-[#0a0f18] hover:border-[#0a0f18] hover:text-white transition-all uppercase tracking-widest text-xs">View Details</button>
                  <button onClick={() => navigate(`/event/${soonestEvent.id}`)} className="flex-1 py-3 bg-[#3593A6] text-white font-black rounded-xl shadow-xl hover:bg-[#0a0f18] transition-all uppercase tracking-widest text-xs border-2 border-[#3593A6] hover:border-[#0a0f18]">Buy Ticket</button>
                </div>
              </div>
            )}
          </section>

          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Upcoming Cruises</h2>
              <p className="text-slate-500 font-medium">Join the wave of high-energy nautical events</p>
            </div>
            <div className="relative w-full md:w-80">
              <input type="text" placeholder="Search events..." className="w-full py-4 px-6 pr-12 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3593A6]/20 transition-all font-medium shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
          </div>

          {!loading && !error && (
            <>
              {filteredUpcomingEvents.length === 0 ? (
                <p className="col-span-full py-20 text-center text-gray-500 italic bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">No upcoming events available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredUpcomingEvents.slice(0, visibleUpcomingCount).map((event, idx) => (
                    <div key={event.id || idx} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col group h-full">
                      <div className="relative h-44 overflow-hidden">
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" src={`http://localhost:5000/${event.profileImage}`} alt={event.title} />
                        <div className="absolute top-3 left-3 bg-[#0a0f18]/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{event.category || 'EVENT'}</div>
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#3593A6] transition-all border border-white/20"><span className="material-symbols-outlined text-lg">favorite</span></button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2">
                          <h3 className="text-lg font-extrabold text-[#0a0f18] leading-tight group-hover:text-[#3593A6] transition-colors line-clamp-1">{event.title}</h3>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-slate-500 font-bold"><span className="material-symbols-outlined text-[#3593A6] text-base">calendar_today</span><span className="text-[10px]">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {event.time || '8:00 PM'}</span></div>
                          <div className="flex items-center gap-2 text-slate-500 font-bold"><span className="material-symbols-outlined text-[#3593A6] text-base">location_on</span><span className="text-[10px] line-clamp-1">{event.location}</span></div>
                        </div>
                        <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-50">
                          <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">FROM</p><p className="text-xl font-black text-[#0a0f18]">${event.prices?.Standard || 0}</p></div>
                          <button onClick={() => navigate(`/event/${event.id}`)} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3593A6] text-white text-[9px] font-black rounded-lg hover:bg-[#0a0f18] transition-all uppercase tracking-widest shadow-xl active:scale-95">TICKETS <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Buttons */}
              <div className="flex justify-center gap-4 mb-12">
                {filteredUpcomingEvents.length > visibleUpcomingCount && (
                  <button
                    onClick={() => setVisibleUpcomingCount(prev => prev + 3)}
                    className="px-10 py-4 bg-[#3593A6] text-white font-black rounded-full hover:bg-[#0a0f18] transition-all uppercase tracking-widest text-xs active:scale-95 flex items-center gap-2 shadow-lg shadow-[#3593A6]/10"
                  >
                    Show More <span className="material-symbols-outlined text-lg">expand_more</span>
                  </button>
                )}
                {visibleUpcomingCount > 3 && (
                  <button
                    onClick={() => setVisibleUpcomingCount(3)}
                    className="px-10 py-4 border-2 border-slate-300 text-slate-500 font-black rounded-full hover:bg-[#0a0f18] hover:text-white hover:border-[#0a0f18] transition-all uppercase tracking-widest text-xs active:scale-95 flex items-center gap-2"
                  >
                    Show Less <span className="material-symbols-outlined text-lg">expand_less</span>
                  </button>
                )}
              </div>

              {/* TRENDING EVENTS - Widened and thicker */}
              <div className="overflow-hidden -mx-4 md:-mx-6 lg:-mx-10">
                <section className="bg-white px-2 md:px-4 py-8 md:py-12 -mx-2 md:-mx-4 mt-12 mb-[-64px] rounded-t-[4rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
                  <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                      <div>
                        <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-[#3593A6] text-lg">flash_on</span><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3593A6]">Featured</p></div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Trending Events</h2>
                      </div>
                      <button onClick={() => { setSearchQuery(''); handleClearAll(); }} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#3593A6] transition-colors">View All Events <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span></button>
                    </div>

                    {filteredTrendingEvents.length === 0 ? (
                      <p className="text-center text-gray-500 py-20 italic bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">No trending events in the next 3 days.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTrendingEvents.map((event, idx) => (
                          <div key={event.id || idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                              <img src={event.profileImage?.startsWith('http') ? event.profileImage : `http://localhost:5000/${event.profileImage}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">{event.title}</h3>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-slate-600 text-sm"><span className="material-symbols-outlined text-base">calendar_today</span><span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm"><span className="material-symbols-outlined text-base">location_on</span><span className="line-clamp-1">{event.location}</span></div>
                              </div>
                              <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-50">
                                <span className="text-xl font-black text-slate-900">${event.prices?.Standard || 0}</span>
                                <button onClick={() => navigate(`/event/${event.id}`)} className="px-5 py-2 bg-[#3593A6] text-white text-xs font-bold rounded-xl hover:bg-[#0a0f18] transition-colors uppercase tracking-widest">BOOK TICKET</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ExploreEvents;