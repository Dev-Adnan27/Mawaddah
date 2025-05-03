import Image from 'next/image';
import React from 'react';

const AboutIslam = () => {
    return (
        <div className="w-full flex items-center justify-center bg-white py-16">
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6">
                
                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-3xl font-bold text-[#123a6d]">Get to Know More About Islam</h2>
                    <p className="text-gray-700 mt-4 max-w-lg">
                        Odio potenti senara tortor nisi eu. Faucibus torquent nam augue diam nisl metus habitant
                        tempor. Purus augue necpos itoers nisl torcis facilisi netus acs sociis.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <button className="px-6 py-3 bg-[#123a6d] text-white rounded-md shadow-md hover:bg-[#1A252F] transition">
                            Discover More
                        </button>
                        <button className="px-6 py-3 border border-[#123a6d] text-[#123a6d] rounded-md shadow-md hover:bg-[#123a6d] hover:text-white transition">
                            Watch Intro
                        </button>
                    </div>
                </div>

               
                <div className="md:w-1/2 flex justify-center relative">
                    <div className="absolute top-5 left-5 w-[90%] h-[90%] border-4 border-[#2C3E50]"></div>
                    <Image 
                        src="/her3.jpg"
                        alt="Islamic Knowledge"
                        width={400}
                        height={400}
                        className="relative shadow-lg rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutIslam;
