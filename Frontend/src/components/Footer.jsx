import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
                setFormData({ email: "", subject: "", message: "" });
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
        <footer className="bg-white border-t border-gray-200 w-full relative">
            <ToastContainer position="bottom-right" autoClose={3000} />
            <div className="px-4 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 mb-8">
                    <div>
                        <p className="font-bold text-lg mb-4 text-[#111418]">Quick Links</p>
                        <div className="flex flex-col gap-3 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">About Us</button>
                            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} className="hover:text-[#3593A6] text-left cursor-pointer transition">Events</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Blog</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4 text-[#111418]">Support</p>
                        <div className="flex flex-col gap-3 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Help Center</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Contact Us</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">FAQ</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4 text-[#111418]">Legal</p>
                        <div className="flex flex-col gap-3 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Privacy Policy</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Terms of Service</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-4 text-[#111418]">Follow Us</p>
                        <div className="flex gap-4">
                            <img src="https://ichef.bbci.co.uk/news/1024/branded_news/C5CC/production/_89663605_instagram_logo_976.jpg" alt="Instagram" className="h-9 w-9 cursor-pointer hover:scale-110 transition object-cover rounded-lg shadow-sm" />
                            <img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/home/fg/brand-homepg-guidance-inlogo-dsk-v01.jpg.original.jpg" alt="LinkedIn" className="h-9 w-9 cursor-pointer hover:scale-110 transition object-cover rounded-lg shadow-sm" />
                            <img src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png" alt="Facebook" className="h-9 w-9 cursor-pointer hover:scale-110 transition object-cover rounded-lg shadow-sm" />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-1">
                        <p className="font-bold text-lg mb-4 text-[#111418]">Any Issues? Contact Us</p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3593A6]/20 focus:border-[#3593A6] transition"
                                required
                            />
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3593A6]/20 focus:border-[#3593A6] transition"
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your problem here..."
                                rows="3"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3593A6]/20 focus:border-[#3593A6] transition resize-none"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2.5 rounded-xl bg-[#3593A6] text-white font-semibold text-sm shadow-md hover:bg-[#2d7a8a] transition-all transform active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="h-1 bg-[#3593A6] w-full mt-4"></div>
            <div className="px-4 md:px-8 py-6 text-center text-sm text-gray-600">
                2025 Cruise Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
