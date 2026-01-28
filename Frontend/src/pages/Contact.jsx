import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Basic Hero/Header for Contact Page */}
            <div className="bg-[#1a2c5b] py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
                    <p className="text-[#3593A6] text-lg font-medium">We'd love to hear from you. Get in touch with our team.</p>
                </div>
            </div>

            {/* Info Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:shadow-lg">
                        <div className="w-12 h-12 bg-[#3593A6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[#3593A6]">location_on</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Our Office</h3>
                        <p className="text-slate-600 text-sm">Kathmandu, Nepal</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:shadow-lg">
                        <div className="w-12 h-12 bg-[#3593A6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[#3593A6]">mail</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
                        <p className="text-slate-600 text-sm">support@cruise.com</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:shadow-lg">
                        <div className="w-12 h-12 bg-[#3593A6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[#3593A6]">call</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
                        <p className="text-slate-600 text-sm">+977 1234567890</p>
                    </div>
                </div>
            </div>

            {/* Footer (which contains the contact form) */}
            <Footer />
        </div>
    );
};

export default Contact;
