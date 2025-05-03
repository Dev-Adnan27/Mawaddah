'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FiMessageCircle } from "react-icons/fi";
import { FaBars, FaRegCircleUser } from "react-icons/fa6";
import { FaRegHeart, FaTimes } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import UserMenu from './UserMenu';

const navItems = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Contact', url: '/contact' },
    { name: 'About', url: '/about' },
    { name: 'Blogs', url: '/blogs' },
];

const Header = () => {
    const path = usePathname();
    const [show, setShow] = useState(false);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setShow(!show);

    return (
        <div className={`fixed top-0 left-0 w-full z-[99999] bg-white shadow-lg transition-all duration-300`}>
            <div className='flex items-center justify-between px-[5vw] py-[1.5em] border-b-2'>
               
                <div className="logoMawadda">
                    <Image src={'/logo1.jpg'} height={200} width={300} alt='logo' className='h-auto w-[70%] md:h-[35px] md:w-auto' />
                </div>

                
                <div className="navMenu hidden items-center gap-6 md:flex">
                    {navItems.map((item, index) => (
                        <Link key={index} className={`hover:text-blue-600 ${path === item.url ? 'text-blue-600' : 'text-gray-700'}`} href={item.url}>
                            {item.name}
                        </Link>
                    ))}
                    
                </div>

               
                <div className="iconsNav flex items-center gap-3 md:gap-6 text-2xl">
                    <Link className='text-gray-700 cursor-pointer' href={'/user/following'}><FaRegHeart /></Link>
                    <Link className='text-gray-700 cursor-pointer' href={'/user/chat'}><FiMessageCircle /></Link>
                    <UserMenu />

                    
                    <button className='text-gray-700 cursor-pointer md:hidden' onClick={toggleMenu}>
                        {show ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

           
            {show && (
                <div className="sideBar pb-6 bg-white shadow-lg">
                    <div className="flex flex-col gap-5 items-center">
                        {navItems.map((item, index) => (
                            <Link key={index} className={`hover:text-blue-600 ${path === item.url ? 'text-blue-600' : 'text-gray-700'}`} href={item.url}>
                                {item.name}
                            </Link>
                        ))}
                        <Link className='text-blue-600' href={'/plans'}>Be a Member</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
