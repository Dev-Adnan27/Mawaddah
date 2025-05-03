'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import testimonials from '@/app/api/testmonials';
import Image from 'next/image';

const Testimonials = () => {
    return (
        <div className='flex flex-col items-center gap-8 rounded-xl'>
            <h2 className='text-3xl text-black'>Testimonials</h2>
            <div className="testimonials-inner w-[80vw] md:w-[80vw] mx-auto rounded-xl">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    loop={true}
                    modules={[Autoplay]}
                    className="mySwiper"
                >
                    {testimonials.map((me, index) => (
                        <SwiperSlide key={index} className='mx-auto rounded-xl'>
                            <div className='flex flex-col gap-4 bg-black p-5 rounded-xl items-start cursor-pointer max-w-[100%] md:max-w-[80%] mx-auto'>
                                <div className="user-info flex gap-3 items-center">
                                    <div className="image-container h-[100px] w-[100px] relative rounded-full overflow-hidden">
                                        <Image 
                                            src={me.userImage} 
                                            alt={me.username} 
                                            layout="fill" 
                                            objectFit="cover" 
                                            className='rounded-full' 
                                        />
                                    </div>
                                    <div>
                                        <h3 className='text-lg font-bold text-[var(--col1)]'>{me.name}</h3>
                                        <p className='text-gray-300 text-sm'>{me.username}</p>
                                    </div>
                                </div>
                                <p className='text-gray-100 text-sm'>{me.message}</p>
                                <p className='text-[var(--col1)] text-xs'>{me.date || '01/01/2025'}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Testimonials;
