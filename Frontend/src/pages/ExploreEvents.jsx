import React, { useState, useEffect, useRef } from 'react';

const primaryColor = '#3593A6';

const ExploreEvents = () => {
  // Applied filters
  const [appliedCategories, setAppliedCategories] = useState({
    Music: false,
    Sports: false,
    Family: false,
    Arts: false,
  });
  const [appliedDate, setAppliedDate] = useState(null);
  const [appliedLocation, setAppliedLocation] = useState(null);
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(500);

  // Temporary filters
  const [tempCategories, setTempCategories] = useState(appliedCategories);
  const [tempDate, setTempDate] = useState(appliedDate);
  const [tempLocation, setTempLocation] = useState(appliedLocation);
  const [tempMinPrice, setTempMinPrice] = useState(appliedMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(appliedMaxPrice);

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

  const handleApplyFilters = () => {
    setAppliedCategories({ ...tempCategories });
    setAppliedDate(tempDate);
    setAppliedLocation(tempLocation);
    setAppliedMinPrice(tempMinPrice);
    setAppliedMaxPrice(tempMaxPrice);
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    const reset = { Music: false, Sports: false, Family: false, Arts: false };

    setTempCategories(reset);
    setTempDate(null);
    setTempLocation(null);
    setTempMinPrice(0);
    setTempMaxPrice(500);

    setAppliedCategories(reset);
    setAppliedDate(null);
    setAppliedLocation(null);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(500);
  };

  const categoriesList = ['Music', 'Sports', 'Family', 'Arts'];
  const dateOptions = ['Today', 'Tomorrow', 'This Week', 'This Month'];

  const locations = [
    'Hyatt Hotel',
    'Plaza Auditorium',
    'Dasrath Stadium',
    'National Gallery',
    'Thundikhel',
  ];

  const allEvents = [
    // Upcoming Events
    {
      title: 'Taylor Swift – The Eras Tour',
      date: 'Friday, 12 Sep • Hyatt Hotel',
      rawDate: '2025-09-12',
      price: 68,
      location: 'Hyatt Hotel, Grand Ballroom',
      category: 'Music',
      section: 'upcoming',
      image: 'https://source.unsplash.com/random/800x600/?taylor-swift,concert',
    },
    {
      title: 'Abhishek Upmanyu Live',
      date: '19 Dec • Plaza Auditorium',
      rawDate: '2025-12-19',
      price: 45,
      location: 'Plaza Auditorium',
      category: 'Arts',
      section: 'upcoming',
      image: 'https://source.unsplash.com/random/800x600/?standup-comedy',
    },
    {
      title: 'Nepal vs India – T20',
      date: '27 Oct • Dasrath Stadium',
      rawDate: '2025-10-27',
      price: 25,
      location: 'Dasrath Stadium',
      category: 'Sports',
      section: 'upcoming',
      image: 'https://source.unsplash.com/random/800x600/?cricket,stadium',
    },
    {
      title: 'Modern Art Exhibition 2025',
      date: '10–31 Dec • National Gallery',
      rawDate: '2025-12-10',
      price: 0,
      location: 'National Gallery',
      category: 'Arts',
      section: 'upcoming',
      image: 'https://source.unsplash.com/random/800x600/?art,exhibition',
      btnText: 'Register Now',
    },
    // Trending Events
    {
      title: 'Coldplay Live 2026',
      date: '18 Jan 2026 • Wembley Stadium',
      rawDate: '2026-01-18',
      price: 99,
      location: 'Wembley Stadium, London',
      category: 'Music',
      section: 'trending',
      image: 'https://source.unsplash.com/random/800x600/?coldplay,concert',
    },
    {
      title: 'Ed Sheeran Mathematics Tour',
      date: '5 Feb • National Stadium',
      rawDate: '2026-02-05',
      price: 85,
      location: 'National Stadium, Singapore',
      category: 'Music',
      section: 'trending',
      image: 'https://source.unsplash.com/random/800x600/?edsheeran,concert',
    },
    {
      title: 'Tomorrowland 2026',
      date: 'Jul 2026 • De Schorre',
      rawDate: '2026-07-20',
      price: 265,
      location: 'De Schorre, Boom, Belgium',
      category: 'Music',
      section: 'trending',
      image: 'https://source.unsplash.com/random/800x600/?tomorrowland,festival',
    },
  ];

  // NOW USING REAL CURRENT DATE
  const today = new Date(); // Automatically gets today's real date from the user's device

  const filterEvents = (events) => {
    return events.filter((event) => {
      // Category filter
      const selectedCats = Object.keys(appliedCategories).filter(
        (cat) => appliedCategories[cat]
      );
      if (selectedCats.length > 0 && !selectedCats.includes(event.category))
        return false;

      // Location filter (partial match)
      if (
        appliedLocation &&
        !event.location.toLowerCase().includes(appliedLocation.toLowerCase())
      )
        return false;

      // Price filter
      if (event.price < appliedMinPrice || event.price > appliedMaxPrice)
        return false;

      // Date filter
      if (appliedDate) {
        const eventDate = new Date(event.rawDate);

        if (appliedDate === 'Today' && eventDate.toDateString() !== today.toDateString())
          return false;

        if (appliedDate === 'Tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
        }

        if (appliedDate === 'This Week') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); // Sunday
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          if (eventDate < weekStart || eventDate > weekEnd) return false;
        }

        if (appliedDate === 'This Month') {
          if (
            eventDate.getMonth() !== today.getMonth() ||
            eventDate.getFullYear() !== today.getFullYear()
          )
            return false;
        }
      }

      return true;
    });
  };

  const filteredUpcoming = filterEvents(
    allEvents.filter((e) => e.section === 'upcoming')
  );
  const filteredTrending = filterEvents(
    allEvents.filter((e) => e.section === 'trending')
  );

  return (
    <>
      <style jsx>{`
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
          pointer-events: auto;
        }
        input[type="range"]::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: white;
          border: 4px solid ${primaryColor};
          box-shadow: 0 4px 12px rgba(53, 147, 166, 0.4);
          cursor: pointer;
          pointer-events: auto;
          border: none;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 flex items-center justify-between py-4 px-10">
        <div className="flex items-center gap-10">
          <a href="#" className="font-bold text-3xl" style={{ color: primaryColor }}>
            Cruise
          </a>
          <a href="#" className="font-bold text-lg" style={{ color: primaryColor }}>
            Event
          </a>
          <a href="#" className="font-bold text-lg" style={{ color: primaryColor }}>
            Categories
          </a>
          <a href="#" className="font-bold text-lg" style={{ color: primaryColor }}>
            For Artist
          </a>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Events"
              className="w-full py-3 px-5 border border-gray-300 rounded-full text-base focus:outline-none"
            />
          </div>
          {/* Profile Picture (DP) - Added Here */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img
              src="https://source.unsplash.com/random/100x100/?portrait"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>

      <main className="mt-20 flex">
        {/* Filters Sidebar */}
        <aside className="w-72 bg-gray-50 p-8 border-r border-gray-300 fixed left-0 top-20 bottom-0 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-bold" style={{ color: primaryColor }}>
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
                className="block w-full text-left py-3 px-5 rounded-full mb-2 font-medium transition-colors hover:opacity-90"
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
              <div className="absolute h-1.5 bg-gray-300 rounded-full top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none" />
              <div
                ref={filledTrackRef}
                className="absolute h-1.5 rounded-full top-1/2 -translate-y-1/2 z-10 pointer-events-none"
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
                className="block w-full text-left py-3 px-5 rounded-full mb-2 font-medium transition-colors hover:opacity-90"
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
            className="w-full py-4 text-white rounded-full text-lg font-bold mt-10 transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Apply Filters
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-72 p-10 bg-cyan-50">
          {/* Hero */}
          <div
            className="text-white py-16 px-10 rounded-2xl text-center mb-10"
            style={{ background: `linear-gradient(to right, ${primaryColor}, #66c7d6)` }}
          >
            <h1 className="text-5xl font-bold mb-4">
              Explore Live Events<br />Near You
            </h1>
       
          </div>

          {/* Upcoming Events */}
          <h2 className="text-4xl font-bold my-8" style={{ color: primaryColor }}>
            Upcoming Events
          </h2>
          <p className="text-gray-600 mb-8">
            Showing {filteredUpcoming.length} event{filteredUpcoming.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mb-16">
            {filteredUpcoming.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-xl">
                No upcoming events match your filters.
              </p>
            ) : (
              filteredUpcoming.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer"
                >
                  <div
                    className="h-52 bg-cover bg-center transition-transform duration-400 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.date}</p>
                    <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:py-5 transition-all duration-500 bg-gray-50 border-t border-gray-200">
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Price:</strong>{' '}
                        {event.price === 0 ? 'Free Entry' : `Starts from $${event.price}`}
                      </p>
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Location:</strong> {event.location}
                      </p>
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Category:</strong> {event.category}
                      </p>
                      <button
                        className="w-full py-3.5 text-white rounded-full font-bold mt-4 transition hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {event.btnText || 'Book Ticket'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trending Events */}
          <h2 className="text-4xl font-bold my-8" style={{ color: primaryColor }}>
            Trending Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredTrending.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-xl">
                No trending events match your filters.
              </p>
            ) : (
              filteredTrending.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer"
                >
                  <div
                    className="h-52 bg-cover bg-center transition-transform duration-400 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.date}</p>
                    <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:py-5 transition-all duration-500 bg-gray-50 border-t border-gray-200">
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Price:</strong> ${event.price}+
                      </p>
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Location:</strong> {event.location}
                      </p>
                      <p className="mb-3">
                        <strong style={{ color: primaryColor }}>Category:</strong> {event.category}
                      </p>
                      <button
                        className="w-full py-3.5 text-white rounded-full font-bold mt-4 transition hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Book Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ExploreEvents;