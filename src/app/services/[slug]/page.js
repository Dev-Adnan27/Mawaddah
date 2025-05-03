"use client";
// app/services/[slug]/page.js
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import ServiceHeroBackground from '../../../components/ServiceHeroBackground';
import RelatedServiceImage from '../../../components/RelatedServiceImage';

// Fetch service data from API
async function getService(slug) {
  try {
    console.log(`🔍 Fetching service with slug: ${slug}`);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/services/${slug}`;
    console.log(`🌐 API URL: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`❌ Failed to fetch service data from API. Status: ${res.status}`, errorData);
      return null;
    }
    
    const data = await res.json();
    console.log(`✅ Service data received:`, data);
    return data.service || null;
  } catch (error) {
    console.error("❌ Error in getService:", error);
    return null;
  }
}

// Fetch all services for related services section
async function getAllServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/services`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.error("Failed to fetch services from API");
      return fallbackServices;
    }
    
    const data = await res.json();
    console.log("✅ ALL SERVICES DATA FROM DATABASE (for related services):", data);
    // Return the services array from the response
    return data.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return fallbackServices;
  }
}

// Fallback data in case the API fails
const fallbackServices = [
  {
    slug: "islamic-marriage-celebrant",
    title: "Islamic Marriage Celebrant",
    description:
      "Nikah ceremonies aligned with Islamic values and legal requirements, including registration services.",
    coverImage: "/services/islamic-marriage-celebrant.jpg",
    content: "Our Islamic Marriage Celebrant service provides comprehensive support for couples looking to get married in accordance with Islamic traditions and values."
  },
  {
    slug: "marriage-counselling",
    title: "Marriage Counselling",
    description:
      "Faith-based and modern guidance for couples to strengthen their relationship and resolve conflicts.",
    coverImage: "/services/marriage-counselling.jpg",
    content: "Our Marriage Counselling service offers compassionate and effective guidance for couples at any stage of their relationship."
  },
  {
    slug: "marriage-conflict-resolution",
    title: "Marriage Conflict Resolution",
    description:
      "Islamic and modern conflict resolution to restore harmony and understanding in relationships.",
    coverImage: "/services/marriage-conflict-resolution.jpg",
    content: "Our Marriage Conflict Resolution service offers specialized mediation for couples experiencing significant challenges in their relationship."
  },
  {
    slug: "marriage-arbitration-committee",
    title: "Marriage Arbitration Committee",
    description:
      "Structured mediation rooted in Islamic ethics to resolve disputes fairly and respectfully.",
    coverImage: "/services/marriage-arbitration-committee.jpg",
    content: "Our Marriage Arbitration Committee provides formal dispute resolution for couples facing serious marital issues."
  },
  {
    slug: "marriage-functions-venue-catering",
    title: "Marriage Functions – Venue & Catering",
    description:
      "Elegant venue hire and halal catering for Nikah and wedding celebrations, professionally coordinated.",
    coverImage: "/services/marriage-functions-venue-catering.jpg",
    content: "Our Marriage Functions service offers comprehensive support for your wedding celebrations, from intimate Nikah ceremonies to grand receptions."
  },
  {
    slug: "premium-tuition-for-primary-secondary-students",
    title: "Premium Tuition for Primary & Secondary Students",
    description:
      "High-quality tuition for Years 1-12, including HSC, VCE, QCS, and Selective School preparation.",
    coverImage: "/tuition.jpg",
    content: "Our Premium Tuition service is designed to help students excel academically with personalized attention and expert instruction."
  }
];

export default function ServiceDetailPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
  const [isLoading, setIsLoading] = useState(true);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
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

  // Fetch data on component mount - replace useState with useEffect
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Try to fetch service from API, fallback to static data if needed
        const serviceData = await getService(slug);
        
        if (serviceData) {
          setService(serviceData);
          
          // Fetch all services for related services
          const apiServices = await getAllServices();
          const allServices = apiServices.length > 0 ? apiServices : fallbackServices;
          
          // Get related services (excluding current service)
          setRelated(allServices
            .filter((s) => s.slug !== serviceData.slug)
            .slice(0, 3));
        } else {
          // Fallback to static data
          console.log(`⚠️ USING FALLBACK STATIC DATA FOR SERVICE '${slug}'`);
          const fallbackService = fallbackServices.find((s) => s.slug === slug);
          setService(fallbackService);
          
          // Get related services (excluding current service)
          setRelated(fallbackServices
            .filter((s) => s.slug !== fallbackService.slug)
            .slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading service data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [slug]);

  if (isLoading || !service) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <ServiceHeroBackground coverImage={service.coverImage} slug={slug} />
      <div className="relative z-10 -mt-32 mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-white">{service.title}</h1>
        <p className="text-lg max-w-3xl mx-auto drop-shadow-md text-white">{service.description}</p>
      </div>

      {/* Description + Form */}
      <div className="bg-white py-16 px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-gray-200">
        {/* Description */}
        <div className="pr-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">{service.title}</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>{service.content || `${service.description} We provide tailored services to meet your needs with compassion and professionalism.`}</p>
            <p>Our experienced team ensures that every step of your journey is handled with care and respect. We aim to deliver a seamless experience, upholding Islamic principles and values while being mindful of modern needs.</p>
            <p>Whether you're planning a ceremony, resolving a conflict, or simply looking for guidance — our services are designed to be reliable, respectful, and result-driven.</p>
          </div>
        </div>

        {/* Form */}
        <div className="pl-4 border-l border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Contact Us</h3>
          
          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded-lg ${submitStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* Related Services */}
      <div className="bg-gray-100 py-12 px-6 lg:px-20">
        <h3 className="text-2xl font-bold text-blue-800 mb-8">Related Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((item) => (
            <Link href={`/services/${item.slug}`} key={item.slug}>
              <div className="bg-white border rounded-lg overflow-hidden hover:shadow-xl transition h-full">
                <div className="w-full h-48 relative">
                  <RelatedServiceImage coverImage={item.coverImage} slug={item.slug} />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-blue-700">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description.slice(0, 100)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}