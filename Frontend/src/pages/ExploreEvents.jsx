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
        }  else {
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
      `}</style>

      <main className="mt-20 flex flex-col sm:flex-row">
        {/* Filters Sidebar - Mobile Responsive */}
        <aside className="w-full sm:w-72 bg-gray-50 p-4 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-300 static sm:fixed left-0 top-20 sm:top-20 bottom-0 z-40 sm:z-auto overflow-y-auto sm:h-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              className="sm:hidden text-2xl font-bold"
              style={{ color: primaryColor }}
            >
              Filters {mobileFiltersOpen ? '▲' : '▼'}
            </button>
            <span className="hidden sm:inline text-2xl font-bold" style={{ color: primaryColor }}>
              Filters
            </span>
            <a
              href="#"
              onClick={handleClearAll}
              className="text-base hover:underline"
              style={{ color: primaryColor }}
            >
              Clear All
            </a>
          </div>

          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} sm:block`}>
            {/* Category */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Category</h3>
              {categoriesList.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center py-3 cursor-pointer select-none text-base"
                >
                  <input
                    type="checkbox"
                    checked={tempCategories[cat]}
                    onChange={() =>
                      setTempCategories({ ...tempCategories, [cat]: !tempCategories[cat] })
                    }
                    className="hidden"
                  />
                  <span
                    className="relative w-6 h-6 border-2 rounded-md mr-4 transition-all"
                    style={{
                      borderColor: primaryColor,
                      backgroundColor: tempCategories[cat] ? primaryColor : 'white',
                    }}
                  >
                    {tempCategories[cat] && (
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                        ✓
                      </span>
                    )}
                  </span>
                  {cat}
                </label>
              ))}
            </div>

            {/* Date */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Date</h3>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTempDate(tempDate === opt ? null : opt)}
                  className="block w-full text-left py-3 px-5 rounded-full mb-2 font-medium transition-colors hover:opacity-90 cursor-pointer"
                  style={{
                    backgroundColor: tempDate === opt ? primaryColor : '#e0f4f7',
                    color: tempDate === opt ? 'white' : primaryColor,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Price Range</h3>
              <div className="relative h-16 mx-2 my-8">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={tempMinPrice}
                  step="5"
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  className="min-thumb absolute w-full z-20"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={tempMaxPrice}
                  step="5"
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="absolute w-full z-20"
                />
                <div className="absolute h-1.5 bg-gray-300 rounded-full top-1/2 left-0 right-0 -translate-y-1/2 " />
                <div
                  ref={filledTrackRef}
                  className="absolute h-1.5 rounded-full top-1/2 -translate-y-1/2 z-10 "
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <div className="text-center font-bold text-lg" style={{ color: primaryColor }}>
                ${tempMinPrice} – ${tempMaxPrice === 500 ? '500+' : tempMaxPrice}
              </div>
            </div>

            {/* Location */}
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Location</h3>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setTempLocation(tempLocation === loc ? null : loc)}
                  className="block w-full text-left py-3 px-5 rounded-full mb-2 font-medium transition-colors hover:opacity-90 cursor-pointer"
                  style={{
                    backgroundColor: tempLocation === loc ? primaryColor : '#e0f4f7',
                    color: tempLocation === loc ? 'white' : primaryColor,
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full py-4 text-white rounded-full text-lg font-bold mt-10 transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 sm:ml-72 p-4 md:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
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
                        src= {`http://localhost:5000/${event.profileImage}`}
                      />
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{new Date(event.date).toLocaleDateString()} • {event.time || 'Time TBA'}</p>
                        <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:py-5 transition-all duration-500 bg-gray-50 border-t border-gray-200">
                          <p className="mb-3">
                            <strong style={{ color: primaryColor }}>Price:</strong>{' '}
                           {event.prices?.Standard === 0 ? 'Free Entry' : `Starts from $${event.prices?.Standard }`}
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
                             onClick={() =>navigate(`/event/${event.id}`)}
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
                        src= {`http://localhost:5000/${event.profileImage}`}
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