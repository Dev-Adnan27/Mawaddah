import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const intrests = [
    {
        item: 'Gaming'
    },
    {
        item: 'Movies'
    },
    {
        item: 'Hiking'
    },
    {
        item: 'Writing'
    },
    {
        item: 'Photography'
    },
]

const FollowingCard = () => {
  return (
    <div className='flex flex-col shadow-xl items-center rounded-[20px] overflow-hidden'>
        <div className="upperSectionCard flex flex-col items-center gap-1 text-center p-6">
            <Image src={'/user1.jpg'} alt={'john doe'} height={120} width={120} className='rounded-full border border-3' />
            <h2 className='text-2xl'>John Doe</h2>
            <p>New York</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
            <div className="buttons flex gap-4 items-center">
                <Link href={'/user'}  className='bg-[var(--col1)] px-4 py-2 rounded-md text-white cursor-pointer'>View Profile</Link>
                <button className='bg-red-500 px-4 py-2 rounded-md text-white cursor-pointer'>Unfollow</button>
            </div>
        </div>
        <div className="lowerSectionCard p-6 grid grid-cols-3 gap-3 bg-black w-full">
            {
                intrests.map((me, index)=>(
                    <p className={` text-white rounded-md max-w-max ${me.item.length >= 8 ? 'col-span-2 mx-0' : 'col-span-1'}`} key={index}>#{me.item}</p>
                ))
            }
        </div>
    </div>
  )
}

export default FollowingCard