"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-semibold">{user?.username}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm bg-blue-100 text-blue-800 rounded px-2 py-1 mt-2 inline-block">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verification Status:</span>
                  <span className={`font-medium ${user?.isVerified ? "text-green-600" : "text-yellow-600"}`}>
                    {user?.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition"
              >
                Back to Home
              </Link>
              
              {user?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition ml-4"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}