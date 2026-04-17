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
} from "recharts";
import api from "../api/api";
import { Link } from "react-router-dom";

const COLORS = {
  applied: "#3b82f6",
  interview: "#f59e0b",
  offer: "#10b981",
  rejected: "#ef4444",
  ghost: "#6b7280",
};

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/applications/stats/").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const pieData = ["applied", "interview", "offer", "rejected", "ghost"]
    .map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: stats[key],
      color: COLORS[key],
    }))
    .filter((d) => d.value > 0); // hide zero values

  const barData = pieData; // reuse same data

  return (
    <div style={{ padding: "2rem" }}>
      <nav>
        <Link to="/dashboard">Applications</Link> |
        <Link to="/stats">Stats</Link>
      </nav>
      <h2>Application Stats</h2>
      <p>
        Total Applications: <strong>{stats.total}</strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: "3rem",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        {/* Pie Chart */}
        <div>
          <h3>Status Breakdown</h3>
          <PieChart width={350} height={300}>
            <Pie
              data={pieData}
              cx={175}
              cy={140}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div>
          <h3>Applications by Status</h3>
          <BarChart width={400} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {barData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
}
