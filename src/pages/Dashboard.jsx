import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchApplications(); // refresh list
    setForm({
      company: "",
      role: "",
      status: "applied",
      applied_date: "",
      notes: "",
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/applications/${id}/`);
    fetchApplications();
  };
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    await api.post("/auth/logout/", { refresh });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  {
    loading ? (
      <p className="text-center py-8 text-gray-400">Loading...</p>
    ) : (
      <div>
        <nav>
          <Link to="/dashboard">Applications</Link> |
          <Link to="/stats">Stats</Link> |
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <h2>My Applications</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            type="date"
            value={form.applied_date}
            onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="submit">Add Application</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Days Since</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.role}</td>
                <td>{app.status}</td>
                <td>{app.days_since_applied}d</td>
                <td>
                  <button onClick={() => handleDelete(app.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
