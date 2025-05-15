import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[80vh] bg-[url('/header.jpg')] bg-cover bg-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      <Image
  src="/hero1.jpg"
  alt="Hero Background"
  layout="fill"
  objectFit="cover"
  priority
  className=""
/>


      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-5">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          In the name of Allah, the creator of the universe
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-white">
        Welcome to Mawaddah – your trusted platform for meaningful connections and memorable celebrations.
        </p>
        
        
      </div>
    </div>
  );
};

export default HeroSection;
