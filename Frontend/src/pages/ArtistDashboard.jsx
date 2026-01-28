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

  if (!analytics) {
    return (
      <div className="ml-[22%] px-10 py-10 min-h-screen bg-[#F3F6F8] flex items-center justify-center">
        <div className="bg-white/80 border border-gray-200 rounded-2xl px-6 py-5 shadow-sm flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-sm text-gray-600">Loading your performance dashboard…</p>
        </div>
      </div>
    );
  }


  const eventLabels = Object.keys(analytics.eventsByDate).sort();
  const eventData = Object.values(analytics.eventsByDate);

  const revenueLabels = Object.keys(analytics.revenueByMonth).sort();
  const revenueData = Object.values(analytics.revenueByMonth);

  const latestEventDate = eventLabels[eventLabels.length - 1] || "-";
  const latestRevenueMonth = revenueLabels[revenueLabels.length - 1] || "-";
  const latestRevenueValue = revenueData[revenueData.length - 1] || 0;

  return (
    <div className="ml-[22%] px-10 py-8 min-h-screen bg-[#F3F6F8]">
      {/* Top header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#3593A6]/80 mb-2">
            Artist performance
          </p>
          <h1 className="text-[2.1rem] leading-tight font-semibold tracking-tight text-gray-900">
            Dashboard overview
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Track how your shows, merch and bookings are performing over time in a single, live cockpit.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[0.68rem] font-medium text-gray-600">
              Live analytics · synced every few minutes
            </span>
          </div>
          <div className="flex gap-2 text-[0.7rem] text-gray-500">
            <span className="px-2 py-1 rounded-full bg-white/80 border border-gray-200">
              Last event · <span className="font-semibold text-gray-700">{latestEventDate}</span>
            </span>
            <span className="px-2 py-1 rounded-full bg-white/80 border border-gray-200">
              Last revenue month · <span className="font-semibold text-gray-700">{latestRevenueMonth}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
        <MetricCard
          title="Total reviews"
          value={analytics.totalReviews}
          accent="bg-[#EFF7FA] text-[#1F6D7E]"
          chip="Feedback"
        />
        <MetricCard
          title="Total merch sold"
          value={analytics.totalMerchSold || 0}
          accent="bg-[#FFF7EB] text-[#B35A11]"
          chip="Store"
        />
        <MetricCard
          title="Total events"
          value={analytics.totalEvents}
          accent="bg-[#F3EEFF] text-[#5B36C8]"
          chip="Shows"
        />
        <MetricCard
          title="Total bookings"
          value={analytics.totalBookings}
          accent="bg-[#FDF3F4] text-[#B43B40]"
          chip="Requests"
        />
      </div>

      {/* Charts & side column */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="space-y-6">
          {/* Events chart card */}
          <div className="bg-white/95 border border-gray-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-gray-900">
                  Events over time
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  How often you’ve added or played shows by date.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[0.7rem]">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3593A6]" />
                  Events added
                </span>
              </div>
            </div>
            <div className="h-[260px]">
              <Line
                data={{
                  labels: eventLabels,
                  datasets: [
                    {
                      label: "Events added",
                      data: eventData,
                      fill: true,
                      backgroundColor: "rgba(53, 147, 166, 0.16)",
                      borderColor: "#3593A6",
                      borderWidth: 2,
                      pointRadius: 3,
                      pointBackgroundColor: "#3593A6",
                      tension: 0.32,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                    y: {
                      grid: { color: "rgba(148,163,184,0.18)" },
                      ticks: { font: { size: 11 } },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Revenue chart card */}
          <div className="bg-white/95 border border-gray-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-gray-900">
                  Revenue over time
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Monthly combined revenue from your events and merch.
                </p>
              </div>
              <div className="flex gap-2 text-[0.7rem]">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F8FFF7] text-[#24663A] border border-[#a2de79]/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7bc963]" />
                  Revenue ($)
                </span>
              </div>
            </div>
            <div className="h-[260px]">
              <Line
                data={{
                  labels: revenueLabels,
                  datasets: [
                    {
                      label: "Revenue ($)",
                      data: revenueData,
                      fill: true,
                      backgroundColor: "rgba(147, 202, 213, 0.18)",
                      borderColor: "#93CAD5",
                      borderWidth: 2,
                      pointRadius: 3,
                      pointBackgroundColor: "#3593A6",
                      tension: 0.3,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                    y: {
                      grid: { color: "rgba(148,163,184,0.18)" },
                      ticks: { font: { size: 11 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right-hand insights column */}
        <div className="space-y-4">
          <div className="bg-white/95 border border-gray-200/80 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Quick spotlight
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[#3593A6] bg-[#EFF7FA] px-2 py-1 rounded-full">
                Highlight
              </span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Latest revenue month</span>
                <span className="font-medium text-gray-800">{latestRevenueMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Revenue that month</span>
                <span className="font-semibold text-emerald-600">
                  ${latestRevenueValue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total live metrics</span>
                <span className="font-medium text-[#1F6D7E]">
                  {analytics.totalEvents + analytics.totalBookings} touchpoints
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 border border-gray-200/80 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Breakdown</h3>
            <div className="space-y-2 text-[0.76rem]">
              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3593A6]" />
                Reviews feel like <span className="font-semibold">{analytics.totalReviews}</span> fan reactions
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#FFF7EB] text-[#B35A11] border border-[#F5D9A7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                Merch has moved <span className="font-semibold">{analytics.totalMerchSold || 0}</span> pieces
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#F3EEFF] text-[#5B36C8] border border-[#D4C6FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                You&apos;ve put on <span className="font-semibold">{analytics.totalEvents}</span> shows
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#FDF3F4] text-[#B43B40] border border-[#F4C2C5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                Bookings reached <span className="font-semibold">{analytics.totalBookings}</span> requests
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, accent, chip }) => (
  <div className="bg-white/95 border border-gray-200/80 rounded-2xl shadow-sm px-4 py-4 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[0.7rem] font-medium text-gray-500 uppercase tracking-[0.12em]">
        {title}
      </p>
      <span className={`text-[0.65rem] px-2 py-1 rounded-full border ${accent}`}>
        {chip}
      </span>
    </div>
    <p className="text-[1.7rem] leading-none font-semibold tracking-tight text-gray-900">
      {value}
    </p>
  </div>
);

export default ArtistAnalytics;
