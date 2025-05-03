'use client';
import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import Image from 'next/image';

const PartnerScroll = () => {
  return (
    <div className='w-full bg-center bg-cover bg-no-repeat min-h-[70vh]'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-[#ffffff] min-h-[70vh]'>

        {/* Video Section */}
        <div className="SectionVideo w-full flex justify-center p-4">
          <MuxPlayer
            playbackId="005kONu4IH1t1GfUuHjE9wZUEkBN5UD56sDGpCdd4ZfA"
            streamType="on-demand"
            autoPlay
            loop
            muted
            className="w-full h-[70vh] md:h-auto max-w-[450px] rounded-xl"
          />
        </div>

        {/* Images Section */}
        <div className="SectionImages grid grid-cols-2 gap-4 justify-center items-center p-4">
          <Image src={'https://eps.education.wisc.edu/wp-content/uploads/sites/9/2020/02/Michael-Dixon-square-2024-500x500.jpg'} height={300} width={300} alt='user' className='w-full max-w-[250px] h-auto rounded-lg' />
          <Image src={'https://cdn.sopercussion.com/wp-content/uploads/2023/07/so_josh-2715-500x500.jpg?strip=all&lossy=1&quality=88&webp=88&avif=88&sharp=1&ssl=1'} height={300} width={300} alt='user' className='w-full max-w-[250px] h-auto rounded-lg' />
          <Image src={'https://onefamily.com/assets/consumer/2022/01/annual-general-meeting-2-500x500-1.jpg'} height={300} width={300} alt='user' className='w-full max-w-[250px] h-auto rounded-lg' />
          <Image src={'https://admissions.indiana.edu/images/counselors/bretz-sara-500x500.jpg'} height={300} width={300} alt='user' className='w-full max-w-[250px] h-auto rounded-lg' />
        </div>

        {/* About Section */}
        <div className="SectionAbout mx-auto flex flex-col items-center text-center h-full gap-4 justify-center text-white bg-[#1a1a1a] md:rounded-xl p-6 sm:p-8 lg:p-12">
          <Image src={'/user3.jpeg'} height={160} width={160} alt='user' className='rounded-full border-[var(--col1)] border-4' />
          <h2 className='text-2xl text-[var(--col1)]'>Daim Hussain</h2>
          <p className='text-white text-sm md:text-base'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus nam ullam reprehenderit voluptates ea. Excepturi error dicta eligendi, labore soluta, minus amet quas reprehenderit minima reiciendis nobis facilis libero similique.</p>
          <div className="buttons w-full flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
            <button className='bg-red-500 text-white rounded-md px-4 py-2 w-full sm:w-auto'>Close</button>
            <button className='bg-[var(--col1)] text-white rounded-md px-4 py-2 w-full sm:w-auto'>Follow</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnerScroll;
