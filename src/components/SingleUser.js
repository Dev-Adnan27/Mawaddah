'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SingleUser = ({ user }) => {
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <h2>Loading user profile...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>

      {/* User Header */}
      <div className="flex flex-col items-center mt-4">
        {/* Profile Picture */}
        <div className="relative w-40 h-40 md:w-52 md:h-52">
          <Image 
            src={user.image || '/default-avatar.jpg'} 
            alt={user.name} 
            width={200} 
            height={200} 
            className="rounded-full border-4 border-pink-500 shadow-lg"
          />
        </div>

        {/* User Info */}
        <h2 className="text-3xl font-bold mt-4">{user.name}, {user.age}</h2>
        <p className="text-gray-400">{user.location}</p>
        <p className="mt-2 text-center text-gray-300 w-3/4 md:w-2/3">{user.bio}</p>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <button className="bg-pink-500 px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition">
            Message
          </button>
          <button className="bg-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">
            Like ❤️
          </button>
        </div>
      </div>

      {/* User Details */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">More About {user.name}</h3>
        <p className="text-gray-300 mt-2">{user.details}</p>

        {/* Interests */}
        <h3 className="mt-4 text-lg font-semibold">Interests</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.interests.map((interest, index) => (
            <span 
              key={index} 
              className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {user.photos.map((photo, index) => (
            <div key={index} className="relative w-full h-40 md:h-48">
              <Image 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {user.videos.map((video, index) => (
            <div key={index} className="relative w-full h-60">
              <video controls className="w-full h-full rounded-lg">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
