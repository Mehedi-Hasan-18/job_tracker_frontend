import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import { Link } from "react-router-dom";

const COLORS = {
  applied: "#3b82f6",
  interview: "#eab308",
  offer: "#22c55e",
  rejected: "#ef4444",
  ghost: "#64748b",
};

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/applications/stats/").then((res) => setStats(res.data));
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const data = ["applied", "interview", "offer", "rejected", "ghost"]
    .map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: stats[key] || 0,
      color: COLORS[key],
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col gap-6">
        <h1 className="text-lg font-bold text-white">JobTrackr</h1>
        <nav className="flex flex-col gap-2">
          <Link
            className="text-sm text-slate-400 hover:text-white px-4 py-2.5 rounded-lg transition"
            to="/dashboard"
          >
            Applications
          </Link>
          <Link
            className="text-sm text-white bg-slate-800 px-4 py-2.5 rounded-lg font-medium"
            to="/stats"
          >
            Stats
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Overview</h2>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Total Applications
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Active (Interview/Offer)
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.interview + stats.offer}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Success Rate</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.total > 0
                ? Math.round(
                    ((stats.interview + stats.offer) / stats.total) * 100,
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 uppercase tracking-wider text-slate-400">
              Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 uppercase tracking-wider text-slate-400">
              Application Volume
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
