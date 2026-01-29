import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0a0f18] text-slate-400 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-black text-white tracking-tight uppercase mb-6 block">
                            CRUISE<span className="text-[#3593A6]">.</span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed mb-6">
                            Elevating exclusive nautical events to an art form. Join the community of thrill-seekers and wave-riders.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                <a
                                    key={social}
                                    href={`#${social}`}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#3593A6] hover:text-white transition-all text-sm"
                                >
                                    <span className={`fa fa-${social}`}></span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Discovery</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
                            <li><Link to="/searchartists" className="hover:text-white transition-colors">Artists</Link></li>
                            <li><Link to="/merchandise" className="hover:text-white transition-colors">Merchandise</Link></li>
                            <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Report a Problem */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Report a Problem</h4>
                        <p className="text-sm mb-4">Encountered an issue? Let us know so we can fix it.</p>
                        <form className="flex flex-col gap-3" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = {
                                name: formData.get('name'),
                                email: formData.get('email'),
                                message: formData.get('problem'),
                                subject: 'Footer Report'
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
                                placeholder="Your Name"
                                required
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#3593A6]"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#3593A6]"
                            />
                            <textarea
                                name="problem"
                                placeholder="Describe the problem..."
                                required
                                rows="2"
                                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#3593A6] resize-none"
                            ></textarea>
                            <button type="submit" className="bg-[#3593A6] text-white font-bold uppercase tracking-widest text-xs py-3 rounded-xl hover:bg-[#2d7a8a] transition-all">
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
