"use client";

import SessionImage from "@/components/cards/SessionImage";
import HomeHero from "@/components/HomeHero";
import Section1 from "@/components/sections/Section1";
import Section2 from "@/components/sections/Section2";
import Section3 from "@/components/sections/Section3";
import Testimonials from "@/components/sections/Testimonials"; // ✅ Add testimonials
import FAQs from "@/components/sections/FAQs"; 

export default function Home() {
  const img = 'https://cdn.prod.website-files.com/5f7adad57379a36d83a3972a/6272a2dc4eb7484a3a00b50a_Connect-Love-Gif.gif'
  return (
    <div className="flex flex-col gap-[10vh] w-full">
      <HomeHero />
      <Section1 />
      <Section2 />
      <Section3 />
      <SessionImage img = {img} />
      <Testimonials />  {/* ✅ Add Testimonials Section */}
      <FAQs />  {/* ✅ Add FAQs Section */}
    </div>
  );
}
