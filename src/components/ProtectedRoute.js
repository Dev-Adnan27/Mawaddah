"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    if (!user) {
      console.log('User not authenticated, redirecting to login page');
      router.push('/login');
    } else {
      try {
        // Parse the user data to ensure it's valid
        const userData = JSON.parse(user);
        if (!userData.id || !userData.email) {
          console.log('Invalid user data, redirecting to login page');
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
} 