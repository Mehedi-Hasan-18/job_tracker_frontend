import { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutbtnloading, setLogoutbtnLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    applied_date: "",
    notes: "",
  });

  const fetchApplications = async () => {
    setLoading(true);
    const res = await api.get("/applications/");
    setApplications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/applications/", form);
    fetchApplications();
    setForm({ company: "", role: "", status: "applied", applied_date: "", notes: "" });
  };

  const handleDelete = async (id) => {
    await api.delete(`/applications/${id}/`);
    fetchApplications();
  };

  const handleLogout = async () => {
    setLogoutbtnLoading(true);
    try {
      const refresh = localStorage.getItem("refresh_token");
      await api.post("/auth/logout/", { refresh });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (err) { console.error(err); } 
    finally { setLogoutbtnLoading(false); }
  };

  const filteredApps = applications.filter((app) => {
    const matchStatus = activeFilter === "all" || app.status === activeFilter;
    const matchSearch = app.company.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filters = ["all", "applied", "interview", "offer", "rejected", "ghost"];

  const badgeStyle = (status) => {
    const map = {
      applied: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10",
      interview: "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
      offer: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
      rejected: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
      ghost: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10",
    };
    return `px-2 py-1 rounded-md text-xs font-medium ${map[status] || "bg-gray-50 text-gray-600"}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col gap-6">
        <h1 className="text-lg font-bold text-white">JobTrackr</h1>
        <nav className="flex flex-col gap-2">
          <Link className="text-sm text-white bg-slate-800 px-4 py-2.5 rounded-lg font-medium" to="/dashboard">Applications</Link>
          <Link className="text-sm text-slate-400 hover:text-white px-4 py-2.5 rounded-lg transition" to="/stats">Stats</Link>
        </nav>
        <button
          onClick={handleLogout}
          disabled={logoutbtnloading}
          className={`mt-auto text-sm py-2.5 rounded-lg font-medium transition ${logoutbtnloading ? "bg-slate-700 text-slate-400" : "bg-red-600 text-white hover:bg-red-700"}`}
        >
          {logoutbtnloading ? "Logging out..." : "Log out"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Applications</h2>

        {/* Add Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider text-slate-400">Add New</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input className="border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <input type="date" className="border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} />
            <select className="border border-slate-300 p-2.5 rounded-lg text-sm bg-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <button type="submit" className="md:col-span-4 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
              Add Application
            </button>
          </form>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <input className="w-full md:w-64 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${activeFilter === f ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Applied</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-slate-400">No applications found</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.company}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.role}</td>
                    <td className="px-6 py-4">
                      <span className={badgeStyle(app.status)}>{app.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{app.days_since_applied}d ago</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(app.id)} className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}