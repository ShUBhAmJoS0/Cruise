import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function LandingPage() {
  const navigate = useNavigate()
  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-6 py-1">
          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-10">
            <img src="images/cruise logo.png" className="h-10" alt="Cruise Logo" />
            <div className="hidden md:flex gap-6">
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} className="text-[#3593A6] font-bold hover:text-[#2d7a8a] transition">Event</button>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/categories') }} className="text-[#3593A6] font-bold hover:text-[#2d7a8a] transition">Categories</button>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/artist-dashboard') }} className="text-[#3593A6] font-bold hover:text-[#2d7a8a] transition">For Artist</button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <input type="search" className="hidden md:block w-40 px-4 py-2 border border-[#3593A6] rounded-full text-sm" placeholder="Search Events" />
            <button onClick={() => navigate("/login")} className="px-3 md:px-5 py-2 bg-[#3593A6]/20 text-[#3593A6] rounded-full font-bold text-sm md:text-base hover:scale-105 transition">Login</button>
            <button onClick={() => navigate("/signup")} className="px-3 md:px-5 py-2 bg-[#3593A6] text-white rounded-full font-bold text-sm md:text-base hover:bg-[#2d7a8a] transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="fixed top-16 left-0 w-full h-full -z-10">
          <img src="/images/heroimage.png" alt="Hero Background" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-center h-full">
          <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} className="px-7 py-3 bg-[#3593A6] text-white rounded-full font-bold text-lg hover:bg-[#2d7a8a] hover:scale-110 transition z-10 shadow-lg hover:shadow-2xl">Explore Event</button>
        </div>
        <div className="absolute bottom-0 w-full z-20">
          <img src="/images/scrap.png" alt="Scrap Design" className="w-full" />
        </div>
      </section>

      {/* TRENDING EVENTS */}
      <section className="bg-gray-100 px-4 md:px-8 py-10 md:py-16 z-10 relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-[#111418]">Trending Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 hover:scale-[1.02] transform border border-gray-200 cursor-pointer group">
            <div className="relative overflow-hidden h-48">
              <img src="https://ca-times.brightspotcdn.com/dims4/default/f3116da/2147483647/strip/true/crop/5616x3744+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fb9%2F47%2F3c51991c44b798e0beda7e4b85f5%2Ftaylor-swift-eras-tour-opener-glendale-ariz-07236.jpg" alt="Taylor Swift Concert" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg mb-2 text-[#111418]">Taylor Swift</h4>
              <p className="text-gray-600 text-sm mb-4">December 15 • Hyatt Palace</p>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/1') }} className="w-full py-2 bg-[#3593A6] text-white rounded-lg font-bold hover:bg-[#2d7a8a] transition-all duration-200 hover:shadow-md">Get Ticket</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 hover:scale-[1.02] transform border border-gray-200 cursor-pointer group">
            <div className="relative overflow-hidden h-48">
              <img src="https://i.ytimg.com/vi/c7QYEedjb_o/maxresdefault.jpg" alt="Abhishek Upmanyu Comedy" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg mb-2 text-[#111418]">Abhishek Upmanyu</h4>
              <p className="text-gray-600 text-sm mb-4">December 09 • Plaza</p>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/2') }} className="w-full py-2 bg-[#3593A6] text-white rounded-lg font-bold hover:bg-[#2d7a8a] transition-all duration-200 hover:shadow-md">Get Ticket</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 hover:scale-[1.02] transform border border-gray-200 cursor-pointer group">
            <div className="relative overflow-hidden h-48">
              <img src="https://imgs.search.brave.com/dhUQqiXE67ta1MsgHaBI_7CT2ZcdSgzZptn52r-qdc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcx/LmhzY2ljZG4uY29t/L2ltYWdlL3VwbG9h/ZC9mX2F1dG8sdF9k/c193Xzk2MCxxXzUw/L2xzY2kvZGIvUElD/VFVSRVMvQ01TLzM4/MTAwMC8zODEwNDMu/anBn" alt="Nepal VS India Match" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg mb-2 text-[#111418]">Nepal VS India</h4>
              <p className="text-gray-600 text-sm mb-4">October 27 • Dasrath Stadium</p>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/3') }} className="w-full py-2 bg-[#3593A6] text-white rounded-lg font-bold hover:bg-[#2d7a8a] transition-all duration-200 hover:shadow-md">Get Ticket</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 hover:scale-[1.02] transform border border-gray-200 cursor-pointer group">
            <div className="relative overflow-hidden h-48">
              <img src="https://mir-s3-cdn-cf.behance.net/projects/808/1f6927232447599.Y3JvcCwzODM1LDMwMDAsMzcwLDA.png" alt="Tech X Conference" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg mb-2 text-[#111418]">Tech X</h4>
              <p className="text-gray-600 text-sm mb-4">December 01 • Softwarica</p>
              <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/event/4') }} className="w-full py-2 bg-[#3593A6] text-white rounded-lg font-bold hover:bg-[#2d7a8a] transition-all duration-200 hover:shadow-md">Get Ticket</button>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="bg-gray-100 px-4 md:px-8 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-[#111418]">Event Categories</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 md:gap-6 pb-4">
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/music') }} className="flex-shrink-0 flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#3593A6] transition-all duration-300 hover:scale-110 transform min-w-max border border-gray-200 cursor-pointer group">
              <img src="https://imgs.search.brave.com/DX5lnxp2JSTn0DPFxvD0wJAHLttHN5w4wVtS4S632-8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdG9yemU5/OWltYWdlcy5jb20vc3lzdGVtL3Jlc291cmNlcy90aHVtYm5haWxzLzA1OS80OTIvMDE3L3NtYWxsL211c2ljLW5vdGUtaWNvbi13aXRoLXN0YXJzLW9uLWl0LWZyZWUtcG5nLnBuZw" alt="Music Icon" className="h-12 w-12 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-bold text-sm text-center text-[#111418]">Music</span>
            </button>
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/sports') }} className="flex-shrink-0 flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#3593A6] transition-all duration-300 hover:scale-110 transform min-w-max border border-gray-200 cursor-pointer group">
              <img src="https://imgs.search.brave.com/8qxJ66lt7GoK_iUa6q0qd0xx5hFba97Qbc_kPkZmI_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvc3Bv/cnRzLTNkLWljb24t/cG5nLWRvd25sb2Fk/LTgzODI4NjAucG5n" alt="Sports Icon" className="h-12 w-12 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-bold text-sm text-center text-[#111418]">Sports</span>
            </button>
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/festivals') }} className="flex-shrink-0 flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#3593A6] transition-all duration-300 hover:scale-110 transform min-w-max border border-gray-200 cursor-pointer group">
              <img src="https://imgs.search.brave.com/sm9r2AjEltlDEEMh8d86LofhOfyAbkpc_ftNbRFucs4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9mZXN0aXZh/bC1zdGlja2VyLWlj/b24tc3ZnLXBuZy1k/b3dubG9hZC04NTQ1/ODEyLnBuZz9mPXdl/YnAmdz0xMjg" alt="Festival Icon" className="h-12 w-12 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-bold text-sm text-center text-[#111418]">Festivals</span>
            </button>
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/comedy') }} className="flex-shrink-0 flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#3593A6] transition-all duration-300 hover:scale-110 transform min-w-max border border-gray-200 cursor-pointer group">
              <img src="https://imgs.search.brave.com/v8Zy_w8n_fscDzglTcElDENQaMVlzVwGs45rIcH8Djc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9jb21lZHkt/aWNvbi1zdmctZG93/bmxvYWQtcG5nLTc1/Mzg1ODMucG5nP2Y9/d2VicCZ3PTEyOA" alt="Comedy Icon" className="h-12 w-12 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-bold text-sm text-center text-[#111418]">Comedy</span>
            </button>
            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/category/theater') }} className="flex-shrink-0 flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl hover:border-[#3593A6] transition-all duration-300 hover:scale-110 transform min-w-max border border-gray-200 cursor-pointer group">
              <img src="https://imgs.search.brave.com/nrsLmYJSjeZRTKseHGqQcS-QfcnKJhGTFUJtdlBmULA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdG9yemU5/OWltYWdlcy5jb20vc3lzdGVtL3Jlc291cmNlcy90aHVtYm5haWxzLzAyOC84NjYvMDg1L3NtYWxsL3RoZWF0ZXItM2QtcmVuZGVyaW5nLWljb24taWxsdXN0cmF0aW9uLXBuZy5wbmc" alt="Theater Icon" className="h-12 w-12 group-hover:scale-125 transition-transform duration-300" />
              <span className="font-bold text-sm text-center text-[#111418]">Theater</span>
            </button>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1 bg-[#3593A6] w-full"></div>

      {/* HOW IT WORKS */}
      <section className="bg-gray-100 px-4 md:px-8 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-[#111418]">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Attendees Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
            <p className="text-xl md:text-2xl font-bold text-[#3593A6] mb-6">For Attendees</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <img src="https://imgs.search.brave.com/L3hamAPlR5lyVT3buX591kjwHxkgD-6ZKGyv62qk50s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdG9yemU5/OWltYWdlcy5jb20vc3lzdGVtL3Jlc291cmNlcy90aHVtYm5haWxzLzAyOC84NjYvMTI3L3NtYWxsL3NlYXJjaC0zZC1pY29uLWlsbHVzdHJhdGlvbi1wbmcucG5n" alt="Browse Icon" className="h-12 w-12 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">Browse and Discover</p>
                </div>
              </div>
              <div className="flex gap-4">
                <img src="https://imgs.search.brave.com/I3c8c8u3r1qErJPOqyC2xtEzcbr4GKdUipEyJeuBbrw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDQv/ODEyLzA3MS9zbWFs/bC91c2VyLXByb2Zp/bGUtb3ItYWNjb3Vu/dC1pY29uLW9uLXRy/YW5zcGFyZW50LWJh/Y2tncm91bmQtcG5n/LnBuZw" alt="Book Icon" className="h-12 w-12 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">Book and Enjoy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artists Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
            <p className="text-xl md:text-2xl font-bold text-[#3593A6] mb-6">For Artists</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <img src="https://imgs.search.brave.com/I3c8c8u3r1qErJPOqyC2xtEzcbr4GKdUipEyJeuBbrw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDQv/ODEyLzA3MS9zbWFs/bC91c2VyLXByb2Zp/bGUtb3ItYWNjb3Vu/dC1pY29uLW9uLXRy/YW5zcGFyZW50LWJh/Y2tncm91bmQtcG5n/LnBuZw" alt="Create Profile Icon" className="h-12 w-12 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">Create Profile</p>
                </div>
              </div>
              <div className="flex gap-4">
                <img src="https://imgs.search.brave.com/x_4uJEow0K8HcNYS8ATkhGRe6q2GQD_LhVG6mfpM-v8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdG9yemU5/OWltYWdlcy5jb20vc3lzdGVtL3Jlc291cmNlcy90aHVtYm5haWxzLzAyMi8zNTIvNDYzL3NtYWxsLzNkLWNhbGVuZGFyLWljb24tZXZlbnQtZGF0ZS1wbmcucG5n" alt="List Events Icon" className="h-12 w-12 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">List Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/artist-dashboard') }} className="px-8 py-3 bg-[#3593A6] text-white rounded-full font-bold text-lg hover:bg-[#2d7a8a] hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">Get Started</button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default LandingPage;
