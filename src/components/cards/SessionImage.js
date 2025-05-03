const ThirdSection = () => {
    return (
      <section className="bg-white-100 py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          
          {/* Right Image - Pehle Image Left */}
          <div className="relative">
            <img src="/hero2.jpg" alt="Quran" className="w-full h-auto rounded-lg shadow-lg" />
            <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md opacity-75">
              <img src="/images/quran-frame.png" alt="Frame" className="w-16 h-16" />
            </div>
          </div>
  
          {/* Left Content - Abhi Text Right */}
          <div>
            <h2 className="text-3xl font-bold text-[#123a6d] mb-4">Mission Statement</h2>
            <p className="text-gray-700 mb-4">
              Sit suspendisse felis fermentum proin habitant non. Duis metus commodo et nibh ad 
              quam etiam facilisi id sem metus. Cubilia egestas felis habitasse imperdiet netus 
              tempor ad metus.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Pede cubilia consequat posuere justo purus cursus.</li>
              <li>Convallis ut interdum dictum libero habitasse ullamcorper lorem.</li>
              <li>Non commodo conubia ipsum phasellus habitasse.</li>
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
  