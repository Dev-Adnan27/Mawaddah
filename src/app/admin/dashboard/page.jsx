"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Users, ShieldCheck, HelpCircle, Layers, FileText, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    faqs: 0,
    blogs: 0,
    contacts: 0
  });

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        console.log('Unauthorized access attempt to admin dashboard');
        router.push('/');
        return;
      }
      setUser(parsedUser);
      fetchStats();
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      
      // Fetch database stats
      const response = await axios.get(`${baseUrl}/api/monitor`);
      
      if (response.data.success && response.data.stats) {
        // Use actual data from API
        setStats(response.data.stats);
      } else {
        // Fallback to placeholder data if API returns unexpected format
        console.warn("Monitor API returned unexpected format:", response.data);
        setStats({
          users: 0,
          services: 0,
          faqs: 0,
          blogs: 0,
          contacts: 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default values in case of error
      setStats({
        users: 0,
        services: 0,
        faqs: 0,
        blogs: 0,
        contacts: 0
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username || 'admin'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Users</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
            <p className="text-sm text-gray-600 mt-2">Total registered users</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Services</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.services}</p>
            <p className="text-sm text-gray-600 mt-2">Available services</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">FAQs</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.faqs}</p>
            <p className="text-sm text-gray-600 mt-2">Frequently asked questions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Blogs</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.blogs}</p>
            <p className="text-sm text-gray-600 mt-2">Published blog posts</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contacts</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.contacts}</p>
            <p className="text-sm text-gray-600 mt-2">Contact submissions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Link href="/admin/users" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-3">
                <Users size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Manage Users</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Add, edit, or remove user accounts</p>
            </Link>
            <Link href="/admin/services" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-green-100 text-green-600 p-4 rounded-full mb-3">
                <ShieldCheck size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Manage Services</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Add, edit, or modify available services</p>
            </Link>
            <Link href="/admin/categories" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-purple-100 text-purple-600 p-4 rounded-full mb-3">
                <Layers size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Manage Categories</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Add, edit, or remove FAQ categories</p>
            </Link>
            <Link href="/admin/faqs" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full mb-3">
                <HelpCircle size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Manage FAQs</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Update frequently asked questions</p>
            </Link>
            <Link href="/admin/blogs" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-3">
                <FileText size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Manage Blogs</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Create, edit, or publish blog posts</p>
            </Link>
            <Link href="/admin/contacts" className="bg-white hover:shadow-lg p-6 rounded-lg flex flex-col items-center justify-center transition-transform transform hover:-translate-y-1">
              <div className="bg-red-100 text-red-600 p-4 rounded-full mb-3">
                <MessageSquare size={28} />
              </div>
              <span className="text-lg font-medium text-gray-800">Contact Messages</span>
              <p className="text-sm text-gray-600 mt-2 text-center">View and manage contact form submissions</p>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Database Status:</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Database Name:</span>
              <span className="font-medium">mawaddah</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">API URL:</span>
              <span className="font-medium">{process.env.NEXT_PUBLIC_API_URL || window.location.origin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 