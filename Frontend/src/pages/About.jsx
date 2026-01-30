import { useState, useEffect } from 'react';
import api from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const primaryColor = '#3593A6';

const About = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

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

  return (
    <>


      <main className="mt-4 bg-cyan-50 min-h-screen">
        {/* About Us Section */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>About Us</p>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">Who We Are</h1>
              <p className="text-gray-700 mt-6 leading-relaxed">
                Cruise is a modern event discovery platform that connects users, artists, and organizers in
                one place. We make it easy to explore upcoming events, follow your favorite artists, and book
                tickets securely—without the hassle.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="/images/about.png"
                alt="About Cruise"
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* What You Can Do Section */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">What You Can Do</h1>
            <p className="text-gray-600 mt-4">Everything you need to experience events like never before.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Discover Events */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                <img
                  src="/images/DiscoverEvents.png"
                  alt="Discover Events"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mt-6">Discover Events</h3>
              <p className="text-gray-600 mt-4">Discover concerts, expos, and sports events happening near you.</p>
            </div>

            {/* Book Tickets */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                <img
                  src="/images/BookTickets.png"
                  alt="Book Tickets"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mt-6">Book Tickets</h3>
              <p className="text-gray-600 mt-4">Book tickets easily and receive instant confirmation for your entry.</p>
            </div>



            {/* Buy Merchandise */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                <img
                  src="/images/BuyMerchandise.png"
                  alt="Buy Merchandise"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mt-6">Buy Merchandise</h3>
              <p className="text-gray-600 mt-4">Purchase official event merchandise directly through the platform.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
