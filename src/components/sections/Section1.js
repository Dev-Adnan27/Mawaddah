import React from 'react'
import { FaUsers } from "react-icons/fa";
import { GiLinkedRings } from "react-icons/gi";
import { FaHandsHelping } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { FaGlobeAmericas } from "react-icons/fa";
import { TbStarsFilled } from "react-icons/tb";

const items = [
    {
        name: 'Connection.',
        icon: <FaUsers />
    },
    {
        name: 'Strengthening Relationships',
        icon: <GiLinkedRings />
    },
    {
        name: 'Guidance',
        icon: <FaHandsHelping />
    },
    {
        name: 'Islamic Guidance',
        icon: <IoIosChatbubbles />
    },
    {
        name: 'Inspiring Youth',
        icon: <FaGlobeAmericas />
    },
    {
        name: 'Best rated app',
        icon: <TbStarsFilled />
    },
]

const Section1 = () => {
  return (
    
    <div className='flex w-full bg-[white] mt-[-7vh]'>

        <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-6">
            {
                items.map((me, index)=>(
                    <div key={index} className='grid grid-cols-3 md:flex gap-4 md:items-center md:mx-auto p-5 text-blue cursor-pointer'>
                        <div className='text-5xl text-[blue] hover:scale-110 flex justify-start'>{me.icon}</div>
                        <h2 className='text-xl col-span-2'>{me.name}</h2>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Section1
