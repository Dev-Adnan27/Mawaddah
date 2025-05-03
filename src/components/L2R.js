import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const L2R = (props) => {
  return (
    <div className={`flex ${props.r2l === true ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'} w-full md:w-[70%] mx-auto gap-5 md:gap-[10vw] shadow-xl md:shadow-none p-5 rounded-xl`}>
      <div className="leftL2R w-full md:w-[50%] flex flex-col justify-center gap-5 md:gap-[1em]">
        <h2 className='text-2xl md:text-3xl font-bold text-black'>{props.title ? props.title : 'I am demo title of this section'}</h2>
        <p className='text-base md:text-lg'>{props.desc ? props.desc : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus aliquam nesciunt quo ad repellat, illo consequuntur voluptatum illum, sunt dolore autem, amet atque sed.'}</p>
        <p className='text-base md:text-lg'>{props.desc2}</p>
        <p className='text-base md:text-lg'>{props.desc3}</p>
        {
          props.url ? <Link href={props.url} className='bg-[var(--col1)] text-white px-4 py-2 rounded-full mt-[-1em] max-w-max'>Learn More</Link> : ''
        }
        
      </div>
      <div className="rightL2R w-full md:w-[50%] flex justify-center items-center">
        <Image src={props.img ? props.img : '/'} width={500} height={500} alt='l2r' className='rounded-xl shadow-lg' />
      </div>
    </div>
  )
}

export default L2R