import { X, Download, Calendar, MapPin, Clock, Ticket } from "lucide-react";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function TicketPopup({ booking, onClose }) {
  const ticketRef = useRef(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: "#3593A6",
      });

      const link = document.createElement("a");
      link.download = `ticket-${booking.ticketCode}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6  relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 text-sm">
            Your ticket has been generated successfully
          </p>
        </div>

        {/* Downloadable Ticket */}
        <div
          ref={ticketRef}
          className="bg-[#3593A6] rounded-2xl p-3 mb-4 min-h-[220px] max-h-[260px] flex flex-col justify-between border-2 border-[#256d7b]"
        >
          <div className="bg-white rounded-xl p-2 mb-2">
            <p className="text-[#256d7b] text-[10px] mb-0.5">Ticket Code</p>
            <p className="text-[#256d7b] text-lg font-bold tracking-wider">
              {booking.ticketCode}
            </p>
          </div>

          <div className="space-y-2 text-white text-xs">
            <div>
              <p className="text-[#e0e0e0] text-[10px] mb-0.5">Event</p>
              <p className="font-semibold text-xs">{booking.eventName}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[#e0e0e0] text-[10px] mb-0.5">Date</p>
                <p className="text-xs font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(booking.eventDetails.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[#e0e0e0] text-[10px] mb-0.5">Time</p>
                <p className="text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {booking.eventDetails.time}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[#e0e0e0] text-[10px] mb-0.5">Location</p>
              <p className="text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {booking.eventDetails.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e0e0]">
              <div>
                <p className="text-[#e0e0e0] text-[10px] mb-0.5">Ticket Type</p>
                <p className="font-semibold text-xs">{booking.ticketType}</p>
              </div>
              <div>
                <p className="text-[#e0e0e0] text-[10px] mb-0.5">Quantity</p>
                <p className="font-semibold text-xs">{booking.quantity}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e0e0e0]">
              <p className="text-[#e0e0e0] text-[10px] mb-0.5">Total Paid</p>
              <p className="text-lg font-bold">Rs. {booking.totalPrice}</p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#e0e0e0] text-center">
            <p className="text-[#e0e0e0] text-[10px]">
              Purchased by {booking.customerName}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-[#3593A6] text-white py-3 rounded-xl font-semibold hover:bg-[#2d7a8a] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Ticket
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
