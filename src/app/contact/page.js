"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ message: '', error: false });

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitStatus({
        message: 'Thank you! Your message has been sent successfully.',
        error: false
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        message: error.message || 'Failed to send your message. Please try again.',
        error: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white-100 text-blue-800">
      {/* Hero Section */}
      <section
        className="w-full h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/mosque.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 p-10 rounded-lg text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white text-lg max-w-2xl">
            We're here to help you with anything you need. Let's connect and build something great together.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Get in Touch</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h3>
              <div className="space-y-5 text-gray-700">
                <div>
                  <p className="font-medium">📍 Address</p>
                  <p className="text-sm">123 Business Street, New York, NY 10001</p>
                </div>
                <div>
                  <p className="font-medium">📧 Email</p>
                  <p className="text-sm">contact@mawaddah.com</p>
                </div>
                <div>
                  <p className="font-medium">📞 Phone</p>
                  <p className="text-sm">+1 234 567 890</p>
                </div>
                <div>
                  <p className="font-medium">🌍 Socials</p>
                  <div className="flex gap-4 mt-2 text-blue-600 text-xl">
                    <a href="#">🔵</a>
                    <a href="#">🐦</a>
                    <a href="#">📷</a>
                    <a href="#">💼</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Send Us a Message</h3>
              
              {submitStatus.message && (
                <div className={`mb-4 p-3 rounded-lg ${submitStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

