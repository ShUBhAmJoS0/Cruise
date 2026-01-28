import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.message) {
            toast.error("Please provide both email and message.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/user-problems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Problem reported successfully! We'll get back to you soon.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Failed to report problem.");
            }
        } catch (error) {
            console.error("Error submitting problem:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-[#1a2c5b] w-full relative">
            <ToastContainer position="bottom-right" autoClose={3000} />
            
            {/* Main Footer Content */}
            <div className="px-4 md:px-8 py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    
                    {/* Left Column - Logo & About */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <img src="/images/cruise logo.png" alt="Cruise Logo" className="h-20 w-20 object-contain" />
                            {/* <span className="text-white font-bold text-xl">Cruise</span> */}
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-semibold text-[#3593A6] uppercase tracking-wide">Company</p>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">About Us</button>
                                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Careers</button>
                                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Blog</button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Support */}
                    <div className="flex flex-col gap-6">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Support</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Help Center</button>
                            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Contact Us</button>
                            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Terms of Service</button>
                            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-[#3593A6] text-sm transition duration-300 text-left">Privacy Policy</button>
                        </div>
                    </div>

                    {/* Right Column - Social & Form */}
                    <div className="flex flex-col gap-6">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Follow Us</p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-lg flex items-center justify-center transition duration-300 text-white" title="Facebook">
                                <span className="text-lg font-bold">f</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-lg flex items-center justify-center transition duration-300 text-white" title="Instagram">
                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-lg flex items-center justify-center transition duration-300 text-white text-xs font-bold" title="Twitter">
                                X
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-lg flex items-center justify-center transition duration-300 text-white" title="LinkedIn">
                                <span className="text-lg font-bold">in</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="flex flex-col gap-6">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3593A6] transition"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3593A6] transition"
                                required
                            />
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3593A6] transition"
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Your message..."
                                rows="3"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3593A6] transition resize-none"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2.5 rounded-lg bg-[#3593A6] hover:bg-[#2d7a8a] text-white font-semibold text-sm transition-all transform active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 w-full"></div>

            {/* Bottom Footer */}
            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
                <div className="text-center text-sm text-gray-400">
                    <p>© 2026 Cruise Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
