import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Users, Calendar, MapPin, DollarSign, Mic2 } from "lucide-react";
import api from "../api/axios";

export default function ArtistViewEvents() {
  const [events, setEvents] = useState([]);

  const LoadRequestedEvents = async () => {
    try {
      const res = await api.get("/artist/request");
      setEvents(res.data.data || []);
    } catch (error) {
      alert("Failed to load events");
    }
  };

  useEffect(() => {
    LoadRequestedEvents();
  }, []);


  const columns = [
    {
      name: "Event",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.eventDate,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
    },
    {
      name: "Bookings",
      selector: (row) => row.bookings?.length || 0,
      sortable: true,
    },
    {
      name: "Revenue",
      selector: (row) =>
        `Rs. ${(row.bookings?.length || 0) * row.pricePerTicket}`,
      sortable: true,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-[20%]">


      <div className="grid grid-cols-4 gap-6 mb-8 ">
        <Stat title="Events" value={events.length} icon={<Calendar />} />
        <Stat
          title="Bookings"
          value={events.reduce((a, e) => a + (e.bookings?.length || 0), 0)}
          icon={<Users />}
        />
        <Stat
          title="Revenue"
          value={`Rs. ${events.reduce(
            (a, e) => a + (e.bookings?.length || 0) * e.pricePerTicket,
            0
          )}`}
          icon={<DollarSign />}
        />
        <Stat title="Cities" value="5+" icon={<MapPin />} />
      </div>

      {/* 📊 Data Table */}
      <div className="bg-[#3593A6]/40 rounded-2xl shadow-lg p-6">


   <div className="bg-white rounded-2xl shadow-xl p-6 mt-4">
  <h2 className="text-2xl font-semibold text-[#3593A6] mb-4 flex  items-center gap-1">
 <Mic2/> Event Overview 
  </h2>

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
    </div>
  );
}


const ExpandedEvent = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
      <div>
        <h4 className="font-semibold mb-3">👥 People Who Booked</h4>
        {data.bookings?.map((b, i) => (
          <div
            key={i}
            className="flex justify-between bg-white p-3 mb-2 rounded-lg shadow-sm"
          >
            <span>{b.name}</span>
            <span className="text-sm text-gray-500">{b.bookedAt}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold mb-3">📈 Event Summary</h4>
        <p>Total Tickets: {data.bookings.length}</p>
        <p>Total Revenue: Rs. {data.bookings.length * data.pricePerTicket}</p>
        <p className="text-green-600 font-semibold">
          Profit: Rs. {data.bookings.length * data.pricePerTicket - 5000}
        </p>
      </div>
    </div>
  );
};


const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
    <div className="p-3 bg-[#3593A6]/10 text-[#3593A6] rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
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
