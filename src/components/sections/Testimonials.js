import React from "react";

const testimonials = [
  {
    name: "Ahmed Khan",
    text: "The school holiday program gave my kids a chance to learn about Islam in a fun and meaningful way. They can’t wait to go back!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Fatima Ali",
    text: "We were struggling, and didn’t know where to turn. The marriage arbitration process at Mawaddah was fair, respectful, and rooted in Islamic principles.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Omar Sheikh",
    text: "Very professional and user-friendly. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-blue-900 text-white py-16 px-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white text-black p-8 rounded-lg shadow-lg min-h-[300px]"
            >
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-yellow-400"
                  />
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
