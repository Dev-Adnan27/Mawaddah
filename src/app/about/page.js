import { FaHeart, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
{/* Hero Section */}
<section
  className="w-full h-[600px] bg-cover bg-center flex items-center justify-center"
  style={{ backgroundImage: "url('/mosque.jpg')" }}
>
  <div className="bg-black bg-opacity-60 p-10 rounded-lg text-center">
    <h1 className="text-5xl font-bold text-white mb-4">About Mawaddah</h1>
    <p className="text-white text-lg max-w-2xl">
   We understand that weddings are more than just events — they are lifelong memories. That’s why we provide a seamless platform where families and couples can book everything they need for a perfect marriage ceremony, all in one place.
    </p>
  </div>
</section>




      {/* Story Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/aboutus.jpg"
              alt="Our Story"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our journey began with a deep commitment to nurturing families, strengthening relationships, and guiding the community with care and compassion. As qualified marriage celebrants and counsellors, we not only officiate beautiful and meaningful marriage functions, but also support couples through ongoing marriage counselling and a dedicated marriage arbitration committee to help resolve conflicts peacefully. Our services extend to youth and children’s counselling, group counselling sessions, and personalised mentoring programs that empower individuals at every stage of life. We also run engaging school holiday programs designed to support children's emotional and spiritual growth. Through our Islamic talks and podcasts, we share valuable insights and guidance rooted in faith, aiming to inspire, educate, and uplift. Our mission is to walk alongside families and individuals as they build stronger, healthier, and more spiritually grounded lives.

            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-12">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Mission</h3>
              <p className="text-gray-700 text-lg">
               To empower individuals, couples, and families through meaningful marriage services, compassionate counselling, and faith-based guidance. We aim to foster healthy relationships, nurture personal growth, and strengthen our community through marriage functions, arbitration, youth and children’s counselling, group mentoring, school holiday programs, and inspiring Islamic talks and podcasts.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Vision</h3>
              <p className="text-gray-700 text-lg">
               To be a leading centre for relationship enrichment and community wellbeing, where every individual feels supported, every couple is guided with wisdom, and every family thrives through faith, connection, and care. We envision a future where strong, spiritually grounded relationships form the foundation of a resilient and compassionate society.



              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg p-8 rounded-xl">
            <FaHeart className="text-blue-600 text-5xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Genuineness</h4>
            <p className="text-gray-600">
              We believe in real connections and honest intentions — no games, no fakes.
            </p>
          </div>
          <div className="bg-white shadow-lg p-8 rounded-xl">
            <FaShieldAlt className="text-blue-600 text-5xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Security</h4>
            <p className="text-gray-600">
              Your data and identity are protected with top-notch encryption and moderation.
            </p>
          </div>
          <div className="bg-white shadow-lg p-8 rounded-xl">
            <FaUsers className="text-blue-600 text-5xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Community</h4>
            <p className="text-gray-600">
              Mawaddah is more than an app — it’s a respectful space for serious people.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
