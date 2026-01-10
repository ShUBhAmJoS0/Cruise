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
      setEvents(res.data.data );
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
        `Rs. ${(row.Bookings.reduce((sum,b)=>sum+Number(b.totalPrice),0))}`,
      sortable: true,
    },
  ];
if(!events){
  return (<p>Loading</p>)
}
  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-[20%]">
      <div className="grid grid-cols-4 gap-6 mb-8 ">
        <Stat title="Events" value={events.length} icon={<Calendar />} />
        <Stat
          title="Bookings"
          value={events.reduce((a, e) => a + (e.Bookings?.length || 0), 0)}
          icon={<Users />}
        />
        <Stat
          title="Revenue"
          value={`Rs. ${events.reduce(
            (a, e) => a + Number(e.Bookings?.reduce((b,c)=>b+Number(c.totalPrice),0)),
            0
          )}`}
          icon={<DollarSign />}
        />
        <Stat title="Cities" value="5+" icon={<MapPin />} />
      </div>

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
    <div className="w-full p-4 bg-gray-50 rounded-xl flex flex-col  gap-6">
      <div className="w-full">
        <h4 className="font-semibold mb-3">People Who Booked</h4>
        {data.Bookings?.map((b, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row justify-between bg-white p-3 mb-4 rounded-lg shadow-sm gap-4"
          >
            {/* Booking Info */}
            <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 p-10">
              <span>{b.User.name}</span>
              <span>{b.customerName}</span>
              <span className="text-sm text-gray-500">
                {new Date(b.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Event Summary */}
            <div className="flex-1 bg-[#e6f4f7] rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold mb-3">Event Summary</h4>
              <p>Total Tickets: {b.quantity}</p>
              <p>Total Revenue: Rs. {b.totalPrice}</p>
              <p className="text-green-600 font-semibold">
                Profit: Rs. {Math.round(b.totalPrice * 0.13)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center  gap-4">
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
