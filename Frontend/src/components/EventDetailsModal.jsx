import { useState } from 'react';

function EventDetailsModal({ event, onClose, onApprove, onReject }) {
    if (!event) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price || 0).toFixed(2)}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] px-6 py-4 flex items-center justify-between border-b border-white/20 z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white">Event Details</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                event.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {event.status || 'Pending'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Event Image */}
                    {(event.profileImage || event.images?.[0]) && (
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={event.profileImage ? `http://localhost:5000/${event.profileImage}` : `http://localhost:5000/${event.images[0]}`}
                                alt={event.title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop';
                                }}
                            />
                        </div>
                    )}

                    {/* Event Title & Description */}
                    <div>
                        <h3 className="text-2xl font-bold text-[#111418] mb-2">{event.title}</h3>
                        <p className="text-[#617589] leading-relaxed">{event.description}</p>
                    </div>

                    {/* Artist Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-[#617589] uppercase tracking-wider mb-3">Artist Information</h4>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#3593A6]"
                                style={{ backgroundImage: `url(${event.artist?.profileImage ? `http://localhost:5000/${event.artist.profileImage}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'})` }}
                            ></div>
                            <div>
                                <p className="font-semibold text-[#111418]">{event.artist?.name || 'Unknown Artist'}</p>
                                <p className="text-sm text-[#617589]">{event.artist?.email || 'No email provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wider">Date & Time</h4>
                            </div>
                            <p className="text-blue-900 font-medium">{formatDate(event.date)}</p>
                            <p className="text-blue-700 text-sm">{event.time}</p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h4 className="text-sm font-semibold text-green-900 uppercase tracking-wider">Location</h4>
                            </div>
                            <p className="text-green-900 font-medium">{event.location}</p>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wider">Category</h4>
                            </div>
                            <p className="text-purple-900 font-medium">{event.category}</p>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="text-sm font-semibold text-orange-900 uppercase tracking-wider">Submitted</h4>
                            </div>
                            <p className="text-orange-900 font-medium">{formatDate(event.createdAt)}</p>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-gradient-to-br from-[#3593A6]/10 to-[#2d7a8a]/10 rounded-xl p-6 border border-[#3593A6]/20">
                        <h4 className="text-lg font-bold text-[#111418] mb-4">Ticket Pricing & Availability</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">VIP</span>
                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-[#111418]">{formatPrice(event.prices?.VIP)}</p>
                                <p className="text-sm text-[#617589] mt-1">{event.Quantity?.VIP || 0} tickets</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Regular</span>
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-[#111418]">{formatPrice(event.prices?.Regular)}</p>
                                <p className="text-sm text-[#617589] mt-1">{event.Quantity?.Regular || 0} tickets</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Student</span>
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-[#111418]">{formatPrice(event.prices?.Student)}</p>
                                <p className="text-sm text-[#617589] mt-1">{event.Quantity?.Student || 0} tickets</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {event.status === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => onReject(event.id)}
                                className="flex-1 px-6 py-3 rounded-lg border-2 border-red-500 bg-white text-red-600 hover:bg-red-50 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Decline Request
                            </button>
                            <button
                                onClick={() => onApprove(event.id)}
                                className="flex-1 px-6 py-3 rounded-lg bg-[#3593A6] hover:bg-[#2d7a8a] text-white font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Event
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetailsModal;
