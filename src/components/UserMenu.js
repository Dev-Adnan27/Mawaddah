"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaRegCircleUser } from "react-icons/fa6";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    router.push('/login');
  };

  if (!user) {
    return (
      <Link className='text-gray-700 cursor-pointer' href={'/login'}>
        <FaRegCircleUser />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center space-x-1 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          {user.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline">{user.username}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
            My Profile
          </Link>
          
          {user.role === 'admin' && (
            <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 