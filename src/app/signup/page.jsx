"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSend } = formData;
      
      // Use absolute URL for API requests
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      const response = await axios.post(`${baseUrl}/api/auth/register`, dataToSend);
      
      // Store user data in localStorage or use a state management solution
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect to user dashboard or homepage
      router.push("/profile");
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="flex w-full max-w-4xl h-[600px] shadow-lg rounded-lg overflow-hidden border border-gray-300">
        
        {/* Left Side - Welcome Section */}
        <div className="w-1/3 bg-black text-white flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-bold">Join Us</h2>
          <p className="mt-2 text-center text-gray-300">Create your account to begin your journey</p>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-2/3 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled={loading}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled={loading}
            />
            <button
              type="submit"
              className={`w-full p-3 bg-[var(--col1)] text-white font-semibold rounded-md mt-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
              }`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--col1)] font-bold">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
} 