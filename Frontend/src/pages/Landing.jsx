import "../styles/Landing.css";

function App() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left-wrapper">
          <img src="images/cruise logo.png" className="logo" alt="Cruise Logo" />
          <div className="nav-left">
            <a href="#" className="nav-link">Event</a>
            <a href="#" className="nav-link">Categories</a>
            <a href="#" className="nav-link">For Artist</a>
          </div>
        </div>
        <div className="nav-right-wrapper">
          <input type="search" className="search-input" placeholder="Search Events" />
          <button className="auth-btn login">Login</button>
          <button className="auth-btn signup">Sign Up</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-wrapper">
          <img src="/images/heroimage.png" alt="Hero Background" />
        </div>
        <button className="cta-btn">Explore Event</button>
        <div className="scrap-wrapper">
          <img src="/images/scrap.png" className="scrap-img" alt="Scrap Design" />
        </div>
      </section>

      {/* TRENDING EVENTS */}
      <section className="trending-section">
        <h2>Trending Events</h2>
        <div className="cards-wrapper">
          <div className="event-card">
            <img src="https://ca-times.brightspotcdn.com/dims4/default/f3116da/2147483647/strip/true/crop/5616x3744+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fb9%2F47%2F3c51991c44b798e0beda7e4b85f5%2Ftaylor-swift-eras-tour-opener-glendale-ariz-07236.jpg" alt="Taylor Swift Concert" />
            <div className="event-card-text">
              <h4>Taylor Swift</h4>
              <p>December 15 • Hyatt Palace</p>
              <button className="ticket-btn">Get Ticket</button>
            </div>
          </div>
          <div className="event-card">
            <img src="https://i.ytimg.com/vi/c7QYEedjb_o/maxresdefault.jpg" alt="Abhishek Upmanyu Comedy" />
            <div className="event-card-text">
              <h4>Abhishek Upmanyu</h4>
              <p>December 09 • Plaza</p>
              <button className="ticket-btn">Get Ticket</button>
            </div>
          </div>
          <div className="event-card">
            <img src="https://imgs.search.brave.com/dhUQqiXE67ta1MsgHaBI_7CT2ZcdSgzZptn52r-qdc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcx/LmhzY2ljZG4uY29t/L2ltYWdlL3VwbG9h/ZC9mX2F1dG8sdF9k/c193Xzk2MCxxXzUw/L2xzY2kvZGIvUElD/VFVSRVMvQ01TLzM4/MTAwMC8zODEwNDMu/anBn" alt="Nepal VS India Match" />
            <div className="event-card-text">
              <h4>Nepal VS India</h4>
              <p>October 27 • Dasrath Stadium</p>
              <button className="ticket-btn">Get Ticket</button>
            </div>
          </div>
          <div className="event-card">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/808/1f6927232447599.Y3JvcCwzODM1LDMwMDAsMzcwLDA.png" alt="Tech X Conference" />
            <div className="event-card-text">
              <h4>Tech X</h4>
              <p>December 01 • Softwarica</p>
              <button className="ticket-btn">Get Ticket</button>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="event-section">
        <h2>Event Categories</h2>
        <div className="event-wrapper">
          <div className="marquee">
            {/* First set */}
            <div className="event-category-card">
              <img src="https://imgs.search.brave.com/DX5lnxp2JSTn0DPFxvD0wJAHLttHN5w4wVtS4S632-8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTkv/NDkyLzAxNy9zbWFs/bC9tdXNpYy1ub3Rl/LWljb24td2l0aC1z/dGFycy1vbi1pdC1m/cmVlLXBuZy5wbmc" alt="Music Icon" />
              Music
            </div>
            <div className="event-category-card">
              <img src="https://imgs.search.brave.com/8qxJ66lt7GoK_iUa6q0qd0xx5hFba97Qbc_kPkZmI_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvc3Bv/cnRzLTNkLWljb24t/cG5nLWRvd25sb2Fk/LTgzODI4NjAucG5n" alt="Sports Icon" />
              Sports
            </div>
            <div className="event-category-card">
              <img src="https://imgs.search.brave.com/sm9r2AjEltlDEEMh8d86LofhOfyAbkpc_ftNbRFucs4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9mZXN0aXZh/bC1zdGlja2VyLWlj/b24tc3ZnLXBuZy1k/b3dubG9hZC04NTQ1/ODEyLnBuZz9mPXdl/YnAmdz0xMjg" alt="Festival Icon" />
              Festivals
            </div>
            <div className="event-category-card">
              <img src="https://imgs.search.brave.com/v8Zy_w8n_fscDzglTcElDENQaMVlzVwGs45rIcH8Djc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9jb21lZHkt/aWNvbi1zdmctZG93/bmxvYWQtcG5nLTc1/Mzg1ODMucG5nP2Y9/d2VicCZ3PTEyOA" alt="Comedy Icon" />
              Comedy
            </div>
            <div className="event-category-card">
              <img src="https://imgs.search.brave.com/nrsLmYJSjeZRTKseHGqQcS-QfcnKJhGTFUJtdlBmULA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjgv/ODY2LzA4NS9zbWFs/bC90aGVhdGVyLTNk/LXJlbmRlcmluZy1p/Y29uLWlsbHVzdHJh/dGlvbi1wbmcucG5n" alt="Theater Icon" />
              Theater
            </div>

            
          </div>
        </div>
      </section>

      <div className="green-line"></div>

      {/* HOW IT WORKS */}
      <section className="procedure">
        <h2>How it Works</h2>
        <div className="for-box">
          <div className="box-type">
            <p className="box-topic">For Attendees</p>
            <div className="steps-holder">
              <div className="first-option">
                <img src="https://imgs.search.brave.com/L3hamAPlR5lyVT3buX591kjwHxkgD-6ZKGyv62qk50s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjkv/NDQ0LzQ3My9zbWFs/bC8zZC1yZW5kZXIt/c2VhcmNoLWVsZW1l/bnQtcG5nLnBuZw" alt="Browse Icon" />
                <p>Browse and Discover</p>
              </div>
              <div className="second-option">
                <img src="https://imgs.search.brave.com/99oIJQjkOyw0SOh5uPi4XhN_wxvc6HGTmD0Ce90OIoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LWxpdGVyYXR1cmUt/aWNvbi1kb3dubG9h/ZC1pbi1zdmctcG5n/LWdpZi1maWxlLWZv/cm1hdHMtLW9wZW4t/Ym9vay1yZWFkaW5n/LXJlYWQtZXZlbnQt/cGFjay1taXNjZWxs/YW5lb3VzLWljb25z/LTc1Mzg2MTAucG5n/P2Y9d2VicCZ3PTEy/OA" alt="Book Icon" />
                <p>Book and Enjoy</p>
              </div>
            </div>
          </div>
          <div className="box-type">
            <p className="box-topic">For Artists</p>
            <div className="steps-holder">
              <div className="first-option">
                <img src="https://imgs.search.brave.com/I3c8c8u3r1qErJPOqyC2xtEzcbr4GKdUipEyJeuBbrw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDQv/ODEyLzA3MS9zbWFs/bC91c2VyLXByb2Zp/bGUtb3ItYWNjb3Vu/dC1pY29uLW9uLXRy/YW5zcGFyZW50LWJh/Y2tncm91bmQtcG5n/LnBuZw" alt="Create Profile Icon" />
                <p>Create Profile</p>
              </div>
              <div className="second-option">
                <img src="https://imgs.search.brave.com/x_4uJEow0K8HcNYS8ATkhGRe6q2GQD_LhVG6mfpM-v8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjIv/MzUyLzQ2My9zbWFs/bC8zZC1jYWxlbmRh/ci1pY29uLWV2ZW50/LWRhdGUtcG5nLnBu/Zw" alt="List Events Icon" />
                <p>List Events</p>
              </div>
            </div>
          </div>
        </div>
        <button className="get-started">Get Started</button>
      </section>

      {/* FOOTER */}
      <section className="footer">
        <div className="footer-top">
          <div className="quick-links">
            <p>Quick Links</p>
            <div>
              <span>About Us</span>
              <span>Events</span>
              <span>Blog</span>
            </div>
          </div>
          <div className="support">
            <p>Support</p>
            <div>
              <span>Help Center</span>
              <span>Contact Us</span>
              <span>FAQ</span>
            </div>
          </div>
          <div className="legal">
            <p>Legal</p>
            <div>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
          <div className="follow">
            <p>Follow Us</p>
            <div>
              <img src="https://ichef.bbci.co.uk/news/1024/branded_news/C5CC/production/_89663605_instagram_logo_976.jpg" alt="Instagram" />
              <img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/home/fg/brand-homepg-guidance-inlogo-dsk-v01.jpg.original.jpg" alt="LinkedIn" />
              <img src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png" alt="Facebook" />
            </div>
          </div>
        </div>
        <div className="green-line-second"></div>
        <div className="footer-bottom">
          2025 Cruise Inc. All rights reserved.
        </div>
      </section>
    </>
  );
}

export default App;