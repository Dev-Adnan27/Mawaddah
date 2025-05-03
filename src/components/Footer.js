import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#1D1D1D] text-white">
      
      
      <div className="absolute inset-0">
        <Image
          src="/mosque.jpg"
          alt="Footer Background"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      
      <div className="relative z-10 px-5 py-10 md:py-16 lg:px-20">
        
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">About Us</h2>
            <p className="text-gray-300 text-sm">
              We are dedicated to providing authentic Islamic knowledge and services to the community.
            </p>
          </div>

          
          <div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-yellow-400">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400">Services</a></li>
              <li><a href="#" className="hover:text-yellow-400">Charity</a></li>
              <li><a href="#" className="hover:text-yellow-400">Scholars</a></li>
              <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
            </ul>
          </div>

         
          <div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Contact</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2"><MapPin size={18} className="text-yellow-400" /> 123 Islamic Street, City</li>
              <li className="flex items-center gap-2"><Phone size={18} className="text-yellow-400" /> +123 456 789</li>
              <li className="flex items-center gap-2"><Mail size={18} className="text-yellow-400" /> info@example.com</li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-gray-600 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} All Rights Reserved</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-yellow-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-yellow-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-yellow-400"><Instagram size={20} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
