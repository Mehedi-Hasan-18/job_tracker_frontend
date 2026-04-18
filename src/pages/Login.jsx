import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login/", form);
      console.log(res.data);
      localStorage.setItem("access_token", res.data.access);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE (Image + Text) */}
      <div
        className="hidden md:flex items-center justify-center bg-cover bg-center p-10 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a')",
        }}
      >
        <div className="bg-black/50 p-10 rounded-xl">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Track Your Job Applications Easily & Smartly
            </h1>
            <p className="text-lg opacity-90">
              Stay organized, monitor your progress, and never miss an
              opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Login Form) */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              type="password"
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-lg text-white transition
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                `}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
