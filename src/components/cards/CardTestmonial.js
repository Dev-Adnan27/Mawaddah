import Image from 'next/image';
import React from 'react';
import { FaStar } from "react-icons/fa";

const CardTestimonial = (props) => {
    const num = 5; // Total number of stars

    return (
        <div className='mx-auto flex flex-col items-center text-center w-[80%] shadow-lg rounded-md'>
            <Image src={props.img} height={100} width={100} alt={props.name} className='md:mt-[-50px] rounded-full border-4 border-[#DCB36Fff]' />
            <div className="content flex flex-col items-center px-4 py-3 gap-3">
                <h2>{props.name}</h2>
                <div className="stars flex gap text-xl">
                    {Array.from({ length: props.rating }, (_, index) => (
                        <FaStar key={index} className="text-yellow-500 mx-0.5" />
                    ))}
                    {Array.from({ length: num - props.rating }, (_, index) => (
                        <FaStar key={index + props.rating} className="text-gray-500 mx-0.5" />
                    ))}
                </div>
                <p>{props.message}</p>
            </div>
        </div>
    );
}

export default CardTestimonial;
