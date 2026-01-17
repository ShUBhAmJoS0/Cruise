import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ArtistAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.get(`/artist/analytics`);
      setAnalytics(res.data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div>Loading...</div>;


  const eventLabels = Object.keys(analytics.eventsByDate).sort();
  const eventData = Object.values(analytics.eventsByDate);

  const revenueLabels = Object.keys(analytics.revenueByMonth).sort();
  const revenueData = Object.values(analytics.revenueByMonth);

  return (
    <div className="p-6 space-y-8 ml-[20%]">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card title="Total Reviews" value={analytics.totalReviews} color="from-[#3593A6] to-[#93CAD5]" />
        <Card title="Total Merch Sold" value={analytics.totalMerchSold} color="from-[#FFB347] to-[#FFCC33]" />
        <Card title="Total Events" value={analytics.totalEvents} color="from-[#8EC5FC] to-[#E0C3FC]" />
        <Card title="Total Bookings" value={analytics.totalBookings} color="from-[#F7971E] to-[#FFD200]" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-[#3593A6]">Events Over Time</h3>
          <Line
            data={{
              labels: eventLabels,
              datasets: [
                {
                  label: "Events Added",
                  data: eventData,
                  fill: true,
                  backgroundColor: "rgba(53, 147, 166, 0.2)",
                  borderColor: "#3593A6",
                  tension: 0.3,
                }
              ]
            }}
            options={{ responsive: true, plugins: { legend: { display: true } } }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-[#3593A6]">Revenue Over Time</h3>
          <Line
            data={{
              labels: revenueLabels,
              datasets: [
                {
                  label: "Revenue ($)",
                  data: revenueData,
                  fill: true,
                  backgroundColor: "rgba(147, 202, 213, 0.2)",
                  borderColor: "#93CAD5",
                  tension: 0.3,
                }
              ]
            }}
            options={{ responsive: true, plugins: { legend: { display: true } } }}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${color} text-white`}>
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default ArtistAnalytics;
