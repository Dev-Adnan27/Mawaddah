"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/auth/login", formData);
      const user = response.data.user;

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Check user role and redirect accordingly
      if (user.role === "admin") {
        router.push("/admin/dashboard"); // redirect Admin to Admin Dashboard
      } else {
        router.push("/"); // redirect Normal User to Homepage
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-24">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white font-semibold rounded-md ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}