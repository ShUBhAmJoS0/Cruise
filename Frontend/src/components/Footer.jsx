import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-white border-t border-gray-200 w-full">
            <div className="px-4 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
                    <div>
                        <p className="font-bold text-lg mb-3 text-[#111418]">Quick Links</p>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">About Us</button>
                            <button onClick={() => { const token = localStorage.getItem('token'); if (!token) navigate('/login'); else navigate('/explore') }} className="hover:text-[#3593A6] text-left cursor-pointer transition">Events</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Blog</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-3 text-[#111418]">Support</p>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Help Center</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Contact Us</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">FAQ</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-3 text-[#111418]">Legal</p>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Privacy Policy</button>
                            <button onClick={() => navigate('/')} className="hover:text-[#3593A6] text-left cursor-pointer transition">Terms of Service</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-3 text-[#111418]">Follow Us</p>
                        <div className="flex gap-3">
                            <img src="https://ichef.bbci.co.uk/news/1024/branded_news/C5CC/production/_89663605_instagram_logo_976.jpg" alt="Instagram" className="h-8 w-8 cursor-pointer hover:opacity-80 transition object-cover rounded-md" />
                            <img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/home/fg/brand-homepg-guidance-inlogo-dsk-v01.jpg.original.jpg" alt="LinkedIn" className="h-8 w-8 cursor-pointer hover:opacity-80 transition object-cover rounded-md" />
                            <img src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png" alt="Facebook" className="h-8 w-8 cursor-pointer hover:opacity-80 transition object-cover rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-1 bg-[#3593A6] w-full"></div>
            <div className="px-4 md:px-8 py-6 text-center text-sm text-gray-600">
                2025 Cruise Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
