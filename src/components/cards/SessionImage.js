const ThirdSection = () => {
    return (
      <section className="bg-white-100 py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          
          {/* Right Image - Pehle Image Left */}
          <div className="relative">
  <img src="/hero2.jpg" alt="Quran" className="w-full h-auto rounded-lg shadow-lg" />
</div>

  
          {/* Left Content - Abhi Text Right */}
          <div>
            <h2 className="text-3xl font-bold text-[#123a6d] mb-4">Mission Statement</h2>
            <p className="text-gray-700 mb-4">
             To empower individuals, couples, and families through meaningful marriage services, compassionate counselling, and faith-based guidance. We aim to foster healthy relationships, nurture personal growth, and strengthen our community through marriage functions, arbitration, youth and children’s counselling, group mentoring, school holiday programs, and inspiring Islamic talks and podcasts.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Support healthy relationships through compassionate counselling and guidance.</li>
              <li>Deliver youth and children's counselling to nurture emotional and spiritual development.</li>
              <li>Run school holiday programs that engage, educate, and inspire young minds.</li>
            </ul>
            <button className="mt-6 bg-[#123a6d] text-white px-6 py-3 rounded-md shadow-md hover:bg-orange-600 transition">
              More Info
            </button>
          </div>
  
        </div>
      </section>
    );
  };
  
  export default ThirdSection;
  
