import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Users, Calendar, MapPin, DollarSign, Mic2 } from "lucide-react";
import api from "../api/axios";


export default function ArtistViewEvents() {
  const [events, setEvents] = useState([]);

  const LoadRequestedEvents = async () => {
    try {
      const res = await api.get("/artist/allevents/details");
      console.log(res.data.data)
      setEvents(res.data.data);
    } catch (error) {
      console.log("Failed to load events");
    }
  };
  useEffect(() => {
    LoadRequestedEvents();
  }, []);

  const totalEvents = events.length;
  const totalBookings = events.reduce((a, e) => a + (e.Bookings?.length || 0), 0);
  const totalRevenue = events.reduce(
    (a, e) => a + Number(e.Bookings?.reduce((b, c) => b + Number(c.totalPrice), 0)),
    0
  );

  const eventsWithRevenue = events.map((e) => {
    const revenue = e.Bookings?.reduce(
      (sum, b) => sum + Number(b.totalPrice),
      0
    ) || 0;
    const bookingsCount = e.Bookings?.length || 0;
    return { ...e, __revenue: revenue, __bookingsCount: bookingsCount };
  });

  const topByRevenue = [...eventsWithRevenue]
    .sort((a, b) => b.__revenue - a.__revenue)
    .slice(0, 3);

  const topByBookings = [...eventsWithRevenue]
    .sort((a, b) => b.__bookingsCount - a.__bookingsCount)
    .slice(0, 3);

  const columns = [
    {
      name: "Event",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
    },
    {
      name: "Bookings",
      selector: (row) => row.Bookings?.length || 0,
      sortable: true,
    },
    {
      name: "Revenue",
      selector: (row) =>
        `NPR ${(row.Bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0))}`,
      sortable: true,
    },
  ];
  if (!events) {
    return (<p>Loading</p>)
  }
  return (
    <div className="sm:p-4 md:p-6 lg:p-10 lg:ml-[22%] px-6 md:px-10 py-8 bg-[#F3F6F8] min-h-screen">
      {/* Page header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#3593A6]/80 mb-2">
            Event performance
          </p>
          <h1 className="text-[2rem] md:text-[2.1rem] font-semibold tracking-tight text-gray-900 leading-tight">
            All of your shows, in one glance
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Review every event, see how many fans booked in and understand how much revenue you&apos;ve made.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[0.7rem] text-gray-600">
              {totalEvents} events · {totalBookings} total bookings
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[0.7rem] text-gray-500">
            <span className="px-2 py-1 rounded-full bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
              Revenue · <span className="font-semibold">NPR {totalRevenue}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
        <Stat title="Events" value={totalEvents} icon={<Calendar className="w-5 h-5" />} />
        <Stat
          title="Total bookings"
          value={totalBookings}
          icon={<Users className="w-5 h-5" />}
        />
        <Stat
          title="Total revenue"
          value={`NPR ${totalRevenue}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Stat title="Cities" value="5+" icon={<MapPin className="w-5 h-5" />} />
      </div>

      {/* Table + side insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.4fr)] gap-6 items-start">
        {/* Table / overview */}
        <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
                <Mic2 className="w-4 h-4" />
              </span>
              Event overview
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Click a row to see who booked and how each event performed.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200/70 bg-white">
            <DataTable
              columns={columns}
              data={events}
              pagination
              highlightOnHover
              striped
              expandableRows
              expandableRowsComponent={ExpandedEvent}
              customStyles={customStyles}
            />
          </div>
        </div>

        {/* Side insights */}
        <div className="space-y-4">
          <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Top grossing events
              </h3>
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[#3593A6] bg-[#EFF7FA] px-2 py-1 rounded-full">
                By revenue
              </span>
            </div>
            {topByRevenue.length === 0 ? (
              <p className="text-xs text-gray-500">
                Once bookings start coming in, your top events will show up here.
              </p>
            ) : (
              <div className="space-y-3">
                {topByRevenue.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-[#F9FAFB] px-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-[#EFF7FA] text-[#1F6D7E] flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-[0.7rem] text-gray-500">
                          {event.__bookingsCount} bookings · Rs. {event.__revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Fan-favorite shows
              </h3>
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[#5B36C8] bg-[#F3EEFF] px-2 py-1 rounded-full">
                By bookings
              </span>
            </div>
            {topByBookings.length === 0 ? (
              <p className="text-xs text-gray-500">
                As bookings land on your events, your most popular shows will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {topByBookings.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-[#F9FAFB] px-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-[#F3EEFF] text-[#5B36C8] flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-[0.7rem] text-gray-500">
                          {event.__bookingsCount} bookings · Rs. {event.__revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


const ExpandedEvent = ({ data }) => {
  return (
    <div className="w-full p-4 bg-[#F3F6F8] rounded-xl flex flex-col gap-5">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
          People who booked
        </h4>
        <span className="text-[0.7rem] text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
          {data.Bookings?.length || 0} total bookings
        </span>
      </div>

      {data.Bookings?.map((b, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row justify-between bg-white rounded-2xl border border-gray-200 shadow-sm gap-4 p-4 md:p-5"
        >
          {/* Booking Info */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {b.customerName || b.User?.name}
            </p>
            <p className="text-xs text-gray-500">
              Booked account: <span className="font-medium text-gray-700">{b.User?.name}</span>
            </p>
            <p className="text-[0.7rem] text-gray-400 mt-1">
              {new Date(b.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Event Summary */}
          <div className="flex-1 bg-[#EFF7FA] rounded-2xl p-4 md:p-5 border border-[#D6E7EE]">
            <h4 className="font-semibold mb-2 text-sm text-gray-900">
              Event summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-gray-700">
              <div>
                <p className="text-gray-500 text-[0.7rem] uppercase tracking-[0.12em] mb-0.5">
                  Tickets
                </p>
                <p className="font-semibold">{b.quantity}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[0.7rem] uppercase tracking-[0.12em] mb-0.5">
                  Revenue
                </p>
                <p className="font-semibold">NPR {b.totalPrice}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[0.7rem] uppercase tracking-[0.12em] mb-0.5">
                  Profit (est.)
                </p>
                <p className="font-semibold text-emerald-600">
                  NPR {Math.round(b.totalPrice * 0.13)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


const Stat = ({ title, value, icon }) => (
  <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-gray-500 mb-1">
        {title}
      </p>
      <h3 className="text-xl font-semibold text-gray-900 truncate">{value}</h3>
    </div>
  </div>
);


const customStyles = {
  table: {
    style: {
      borderRadius: "16px",
      overflow: "hidden",
    },
  },

  headRow: {
    style: {
      backgroundColor: "#e6f4f7",
      minHeight: "56px",
      borderBottom: "1px solid #d0e7ec",
    },
  },

  headCells: {
    style: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1f3f46",
      paddingLeft: "20px",
      paddingRight: "20px",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
  },

  rows: {
    style: {
      minHeight: "64px",
      fontSize: "14.5px",
      paddingTop: "6px",
      paddingBottom: "6px",
      borderBottom: "1px solid #f0f0f0",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f4fbfd",
      boxShadow: "inset 4px 0 0 #3593A6",
      cursor: "pointer",
    },
  },

  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },

  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "12px",
    },
  },
};
