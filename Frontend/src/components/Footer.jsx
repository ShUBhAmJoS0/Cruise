import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#0a0f18] text-slate-400 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-black text-white tracking-tight uppercase">
                                CRUISE<span className="text-[#3593A6]">.</span>
                            </span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed mb-6">
                            Elevating exclusive nautical events to an art form. Join the community of thrill-seekers and wave-riders.
                        </p>
                    </div>

                    {/* Discovery Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Discovery</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
                            <li><Link to="/searchartists" className="hover:text-white transition-colors">Artists</Link></li>
                            <li><Link to="/merchandise" className="hover:text-white transition-colors">Merchandise</Link></li>
                            <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Report a Problem */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Report a Problem</h4>
                        <p className="text-xs mb-4 leading-relaxed">Encountered an issue? Let us know so we can fix it.</p>
                        <form className="flex flex-col gap-3" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = {
                                name: formData.get('name'),
                                email: formData.get('email'),
                                message: formData.get('problem'),
                                subject: 'User Problem'
                            };
                            try {
                                const response = await fetch('http://localhost:5000/api/user-problems', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });
                                if (response.ok) {
                                    alert('Report submitted successfully!');
                                    e.target.reset();
                                } else {
                                    alert('Failed to submit report.');
                                }
                            } catch (err) {
                                alert('Error submitting report.');
                            }
                        }}>
                            <input
                                name="name"
                                type="text"
                                placeholder="Issue Title"
                                required
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-xs focus:ring-2 focus:ring-[#3593A6]"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-xs focus:ring-2 focus:ring-[#3593A6]"
                            />
                            <textarea
                                name="problem"
                                placeholder="Describe the problem..."
                                required
                                rows="2"
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-xs focus:ring-2 focus:ring-[#3593A6] resize-none"
                            ></textarea>
                            <button type="submit" className="bg-[#3593A6] text-white font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-[#2d7a8a] transition-all">
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <p>© 2026 CRUISE EVENTS. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
