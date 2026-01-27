import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";

const slides = [
  {
    date: "17 NOV — 13 DEC",
    title: "The Cricket Fever is Here.",
    description: "Join thousands of fans for the most anticipated sporting event of the season. Experience the intensity live at the stadium.",
    image: "https://namastesindhupalchowk.com/uploads/nepal-premier-league-npl.png",
    athlete: "https://cricketvectors.akamaized.net/Series/1NY.png",
    badge: "NPL 2026",
    sponsor: "Siddhartha Bank",
    event: "Nepal Premier League",
    buttonText: "View Match Schedule",
    attendingText: "Attending the match",
    attendingCount: "2k"
  },
  {
    date: "05 JAN — 25 JAN",
    title: "Music Festival Extravaganza.",
    description: "Experience world-class performances from international and local artists. A festival you won't forget!",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    athlete: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop",
    badge: "MUSIC 2026",
    sponsor: "Prime Events",
    event: "Music Festival",
    buttonText: "View Lineup",
    attendingText: "Going to the festival",
    attendingCount: "5k"
  },
  {
    date: "15 FEB — 20 FEB",
    title: "Tech Summit 2026.",
    description: "Join industry leaders and innovators for the biggest tech conference of the year. Network, learn, and innovate!",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    athlete: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop",
    badge: "TECH 2026",
    sponsor: "Innovation Hub",
    event: "Tech Summit",
    buttonText: "View Agenda",
    attendingText: "Attending the summit",
    attendingCount: "3k"
  }
];

function LandingPage() {
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0)

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <div className="flex items-center">
                <img src="/images/cruise logo.png" alt="Cruise Logo" className="h-10" />
              </div>
              <div className="hidden md:flex items-center space-x-10">
                <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} className="text-sm font-semibold text-slate-600 hover:text-[#3593A6] transition-colors">Explore</button>
                <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/categories') }} className="text-sm font-semibold text-slate-600 hover:text-[#3593A6] transition-colors">Categories</button>
                <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/find-artists') }} className="text-sm font-semibold text-slate-600 hover:text-[#3593A6] transition-colors">Artists</button>
                <button className="text-sm font-semibold text-slate-600 hover:text-[#3593A6] transition-colors">Corporate</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                <input className="w-72 pl-11 pr-4 py-2.5 text-sm bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-[#3593A6]/30 transition-all" placeholder="Search events, artists, venues..." type="text"/>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              </div>
              <button onClick={() => navigate("/login")} className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-full transition-all">Login</button>
              <button onClick={() => navigate("/signup")} className="px-8 py-2.5 text-sm font-bold bg-[#3593A6] text-white hover:shadow-lg hover:shadow-[#3593A6]/30 transition-all rounded-full">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="py-6 overflow-hidden">
        <section className="relative max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Experience Premium Events</h1>
          </div>

          <div className="relative h-[520px] flex items-center justify-center" style={{perspective: '1500px'}}>
            {/* Stacked card left - hidden on mobile */}
            <div className="absolute w-full max-w-4xl h-[450px] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 pointer-events-none hidden lg:block"
              style={{
                transform: 'translateX(-65%) scale(0.85) rotateY(10deg)',
                opacity: 0.5,
                filter: 'blur(2px)'
              }}>
              <img alt="Previous Event" className="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop" />
            </div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-5xl h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden flex flex-col md:flex-row"
              style={{boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.08)'}}>
              
              {/* Left side - Image */}
              <div className="relative md:w-3/5 h-full bg-[#1a2c5b] overflow-hidden">
                <img alt={slides[activeSlide].event} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-700" 
                  src={slides[activeSlide].image} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2c5b]/80 via-transparent to-transparent"></div>
                
                {/* Athlete Image Overlay */}
                <img alt="Athletes" className="absolute bottom-0 left-0 h-[95%] w-auto object-contain transform translate-x-4 z-20" 
                  src={slides[activeSlide].athlete} />
                
                {/* Badge */}
                <div className="absolute top-8 left-8 z-30 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-[#1a2c5b] text-[10px] leading-tight text-center">{slides[activeSlide].badge.split(' ')[0]}<br/>{slides[activeSlide].badge.split(' ')[1]}</div>
                  <div className="text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{slides[activeSlide].sponsor}</p>
                    <p className="text-xs font-extrabold">{slides[activeSlide].event}</p>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="md:w-2/5 p-10 lg:p-14 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-[#3593A6] mb-3">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    <span className="text-sm font-bold tracking-wide">{slides[activeSlide].date}</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.1] mb-4">{slides[activeSlide].title}</h2>
                  <p className="text-slate-500 leading-relaxed text-sm">{slides[activeSlide].description}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} 
                    className="w-full py-4 bg-[#3593A6] text-white font-extrabold rounded-2xl shadow-xl shadow-[#3593A6]/20 hover:-translate-y-1 transition-all">
                    Book Your Tickets
                  </button>
                  <button className="w-full py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-200/50">
                    {slides[activeSlide].buttonText}
                  </button>
                </div>

                {/* Attendees */}
                <div className="mt-10 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img alt="user" src="https://i.pravatar.cc/40?img=1" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img alt="user" src="https://i.pravatar.cc/40?img=2" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img alt="user" src="https://i.pravatar.cc/40?img=3" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#3593A6] flex items-center justify-center text-[10px] text-white font-bold">
                      +{slides[activeSlide].attendingCount}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{slides[activeSlide].attendingText}</p>
                </div>
              </div>
            </div>

            {/* Stacked card right - hidden on mobile */}
            <div className="absolute w-full max-w-4xl h-[450px] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 pointer-events-none hidden lg:block"
              style={{
                transform: 'translateX(65%) scale(0.85) rotateY(-10deg)',
                opacity: 0.5,
                filter: 'blur(2px)'
              }}>
              <img alt="Next Event" className="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop" />
            </div>

            {/* Navigation arrows */}
            <button onClick={prevSlide} className="absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-800 hover:text-[#3593A6] transition-all group">
              <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back_ios_new</span>
            </button>
            <button onClick={nextSlide} className="absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-800 hover:text-[#3593A6] transition-all group">
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">arrow_forward_ios</span>
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-3 mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`rounded-full transition-all ${
                  activeSlide === index
                    ? 'w-12 h-1.5 bg-[#3593A6]'
                    : 'w-3 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              ></button>
            ))}
          </div>
        </section>
      </main>

      {/* TRENDING EVENTS */}
      <section className="bg-white px-4 md:px-8 py-10 md:py-16 z-10 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#3593A6] text-lg">flash_on</span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3593A6]">Featured</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Trending Events</h2>
            </div>
            <a href="#" className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#3593A6] transition-colors">
              View All Events <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </a>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Event Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src="https://ca-times.brightspotcdn.com/dims4/default/f3116da/2147483647/strip/true/crop/5616x3744+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fb9%2F47%2F3c51991c44b798e0beda7e4b85f5%2Ftaylor-swift-eras-tour-opener-glendale-ariz-07236.jpg" alt="Neon Music Festival" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl m-3" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-bold text-[#3593A6] uppercase tracking-wider mb-3">Music</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">Taylor Swift Comes Nepal</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Dec 24, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Dharahara, Sundhara</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">4500</span>
                  <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/1') }} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-[#3593A6] transition-colors">View Details</button>
                </div>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src="https://i.ytimg.com/vi/c7QYEedjb_o/maxresdefault.jpg" alt="Basketball Finals" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl m-3" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-bold text-[#3593A6] uppercase tracking-wider mb-3">Comedy</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">Abhishek Upamanyu TOXIC</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Dec 15, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Comedy Arena, NYC</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">1500</span>
                  <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/2') }} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-[#3593A6] transition-colors">View Details</button>
                </div>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src="https://imgs.search.brave.com/dhUQqiXE67ta1MsgHaBI_7CT2ZcdSgzZptn52r-qdc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcx/LmhzY2ljZG4uY29t/L2ltYWdlL3VwbG9h/ZC9mX2F1dG8sdF9k/c193Xzk2MCxxXzUw/L2xzY2kvZGIvUElD/VFVSRVMvQ01TLzM4/MTAwMC8zODEwNDMu/anBn" alt="Grand Circus" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl m-3" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-bold text-[#3593A6] uppercase tracking-wider mb-3">Sports</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">Nepal Vs India</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Feb 05, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Wankade, Mumbai</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">2900</span>
                  <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/3') }} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-[#3593A6] transition-colors">View Details</button>
                </div>
              </div>
            </div>

            {/* Event Card 4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src="https://mir-s3-cdn-cf.behance.net/projects/808/1f6927232447599.Y3JvcCwzODM1LDMwMDAsMzcwLDA.png" alt="Tech Summit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl m-3" />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-bold text-[#3593A6] uppercase tracking-wider mb-3">Art</span>
                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">Tech X Softwarica</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>Jan 12, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Dillibazar, Kathmandu</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">FREE</span>
                  <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/4') }} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-[#3593A6] transition-colors">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="bg-white px-4 md:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Explore Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Sports */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/sports') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#2d7a8a] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">sports_basketball</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#1a5a66] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Sports</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Arena Events</p>
                </div>
              </div>
            </button>
            
            {/* Festivals */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/festivals') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#c45c3e] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">celebration</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#a04830] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Festivals</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Global Culture</p>
                </div>
              </div>
            </button>
            
            {/* Comedy */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/comedy') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#9b59b6] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">mic</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#7d4692] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Comedy</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Stand-up Live</p>
                </div>
              </div>
            </button>
            
            {/* Arts */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/art') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#3498db] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">palette</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#2980b9] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Arts</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Exhibitions</p>
                </div>
              </div>
            </button>
            
            {/* Music */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/music') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#e74c3c] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">music_note</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#c0392b] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Music</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Live Concerts</p>
                </div>
              </div>
            </button>
            
            {/* Theatre */}
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/theatre') }} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-[#8e44ad] flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] relative overflow-hidden">
                <span className="material-symbols-outlined text-white text-8xl mb-auto mt-6 drop-shadow-lg">theater_comedy</span>
                <div className="mt-auto mb-0 text-left w-full bg-[#6c3483] -mx-4 px-4 py-3 rounded-b-2xl">
                  <p className="text-white font-bold text-sm">Theatre</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider">Stage Shows</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#3593A6] to-transparent w-full"></div>

      {/* HOW IT WORKS */}
      <section className="bg-white px-4 md:px-8 py-10 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-12">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Attendees Section */}
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-[#3593A6]/20 transition-all duration-300">
              <p className="text-2xl font-bold text-[#3593A6] mb-8">For Attendees</p>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#3593A6]/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3593A6]">search</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">Browse and Discover</p>
                    <p className="text-slate-600 text-sm mt-1">Explore thousands of events in your area and around the world</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#3593A6]/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3593A6]">shopping_cart</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">Book and Enjoy</p>
                    <p className="text-slate-600 text-sm mt-1">Secure your tickets and experience unforgettable moments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artists Section */}
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-[#3593A6]/20 transition-all duration-300">
              <p className="text-2xl font-bold text-[#3593A6] mb-8">For Artists</p>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#3593A6]/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3593A6]">person</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">Create Profile</p>
                    <p className="text-slate-600 text-sm mt-1">Set up your professional artist profile and showcase your work</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#3593A6]/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3593A6]">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">List Events</p>
                    <p className="text-slate-600 text-sm mt-1">Create and manage your events with powerful tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/artist-dashboard') }} className="px-10 py-4 bg-[#3593A6] text-white rounded-full font-bold text-lg hover:bg-[#2d7a8a] hover:shadow-lg hover:shadow-[#3593A6]/20 transition-all duration-300 shadow-lg">Get Started as Artist</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default LandingPage;
