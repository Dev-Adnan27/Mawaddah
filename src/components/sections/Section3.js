"use client"; // 👈 ADD THIS LINE at very top

import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 👈 Use 'next/navigation' not 'next/router'
import React, { useEffect, useState } from 'react';

const TuitionService = () => {
    const router = useRouter();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the tuition service by slug
        async function fetchService() {
            try {
                const res = await fetch(`/api/services/premium-tuition-for-primary-secondary-students`);
                if (res.ok) {
                    const data = await res.json();
                    setService(data.service);
                } else {
                    console.error('Failed to fetch tuition service');
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, []);

    const handleReadMore = () => {
        router.push('/services/premium-tuition-for-primary-secondary-students');
    };

    // Fallback content if service not found in database
    const title = "Premium Tuition for Primary & Secondary Students";
    const description = "We offer high-quality tuition for Years 1–12, including HSC, VCE, QCS, and Selective School preparation. Our students consistently perform above national averages.";
    const imageSrc = "/service.jpg";

    return (
        <div className="w-full flex items-center justify-center bg-white py-16">
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6">
                
                {/* Text Content */}
                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-bold text-[#123a6d]">
                        {service?.title || title}
                    </h2>
                    <p className="text-gray-700 mt-4 max-w-lg">
                        {service?.description || description}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <button 
                            className="px-6 py-3 bg-[#123a6d] text-white rounded-md shadow-md hover:bg-[#1A252F] transition"
                            onClick={handleReadMore}
                        >
                            Read More
                        </button>
                        <button 
                            className="px-6 py-3 border border-[#123a6d] text-[#123a6d] rounded-md shadow-md hover:bg-[#123a6d] hover:text-white transition"
                            onClick={() => router.push('/contact')}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="md:w-1/2 flex justify-center relative">
                    <div className="absolute top-5 left-5 w-[90%] h-[90%] border-4 border-[#2C3E50]"></div>
                    {service?.coverImage ? (
                        <img 
                            src={service.coverImage}
                            alt={service.title}
                            className="relative shadow-lg rounded-lg w-[400px] h-[400px] object-cover"
                        />
                    ) : (
                        <Image 
                            src={imageSrc}
                            alt="Tuition Services"
                            width={400}
                            height={400}
                            className="relative shadow-lg rounded-lg"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TuitionService;
