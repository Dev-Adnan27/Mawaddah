import Link from "next/link";
import {
  FaMosque,
  FaHandsHelping,
  FaBalanceScale,
  FaGavel,
  FaUtensils,
  FaChild,
  FaPodcast,
  FaUsers,
  FaSchool,
} from "react-icons/fa";
import ServiceImage from '../../components/ServiceImage';

// Get icon component by name
const getIconComponent = (iconName) => {
  const icons = {
    FaMosque,
    FaHandsHelping,
    FaBalanceScale,
    FaGavel,
    FaUtensils,
    FaChild,
    FaPodcast,
    FaUsers,
    FaSchool,
  };
  return icons[iconName] || FaMosque; // Default to FaMosque if icon not found
};

// Fetching services from the API
async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/services`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch services from API");
      return [];
    }

    const data = await res.json();
    console.log("✅ SERVICES DATA FROM DATABASE:", data);
    return data.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Fallback services data (used if API fails)
const fallbackServices = [
  {
    slug: "islamic-marriage-celebrant",
    icon: "FaMosque",
    title: "Islamic Marriage Celebrant",
    description: "Nikah ceremonies aligned with Islamic values and legal requirements, including registration services.",
    coverImage: "/islamic.jpg"
  },
  {
    slug: "marriage-counselling",
    icon: "FaHandsHelping",
    title: "Marriage Counselling",
    description: "Faith-based and modern guidance for couples to strengthen their relationship and resolve conflicts.",
    coverImage: "/marriage-counselling.jpg"
  },
  {
    slug: "marriage-conflict-resolution",
    icon: "FaBalanceScale",
    title: "Marriage Conflict Resolution",
    description: "Islamic and modern conflict resolution to restore harmony and understanding in relationships.",
    coverImage: "/marriage.avif"
  },
  {
    slug: "marriage-arbitration-committee",
    icon: "FaGavel",
    title: "Marriage Arbitration Committee",
    description: "Structured mediation rooted in Islamic ethics to resolve disputes fairly and respectfully.",
    coverImage: "/hero1.jpg"
  },
  {
    slug: "marriage-functions-venue-catering",
    icon: "FaUtensils",
    title: "Marriage Functions – Venue & Catering",
    description: "Elegant venue hire and halal catering for Nikah and wedding celebrations, professionally coordinated.",
    coverImage: "/mosque.jpg"
  },
  {
    slug: "youth-children-counselling",
    icon: "FaChild",
    title: "Youth & Children Counselling",
    description: "Supportive counselling for young individuals to build resilience and emotional well-being with Islamic values.",
    coverImage: "/marriage-counselling.jpg"
  },
  {
    slug: "islamic-talks-podcasts",
    icon: "FaPodcast",
    title: "Islamic Talks & Podcasts",
    description: "Inspirational talks and podcasts covering faith, personal development, and community well-being.",
    coverImage: "/arbitration.jpg"
  },
  {
    slug: "group-counselling-mentoring",
    icon: "FaUsers",
    title: "Group Counselling & Mentoring",
    description: "Group support rooted in Islamic guidance, fostering growth through shared experiences.",
    coverImage: "/islamic.jpg"
  },
  {
    slug: "school-holiday-programs",
    icon: "FaSchool",
    title: "School Holiday Programs",
    description: "Fun, skill-building activities during holidays with a safe, faith-based environment for children.",
    coverImage: "/school.webp"
  },
  {
    slug: "premium-tuition-for-primary-secondary-students",
    icon: "FaSchool",
    title: "Premium Tuition for Primary & Secondary Students",
    description: "High-quality tuition for Years 1-12, including HSC, VCE, QCS, and Selective School preparation.",
    coverImage: "/tuition.jpg"
  },
];

export default async function OurServices() {
  const apiServices = await getServices();
  console.log("🚀 Services from API:", JSON.stringify(apiServices, null, 2));

  const services = apiServices.length > 0 ? apiServices : fallbackServices;

  if (apiServices.length > 0) {
    console.log("✅ Services received from API:", apiServices.length);
    console.log("Sample service coverImage:", apiServices[0]?.coverImage ? "Present" : "Missing");
  } else {
    console.log("⚠️ USING FALLBACK STATIC SERVICES DATA");
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mt-8 mb-12 relative z-10">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <Link href={`/services/${service.slug}`} key={index}>
                <div className="p-6 text-center bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition duration-300 cursor-pointer h-full flex flex-col">
                  {service.coverImage ? (
                    <div className="mb-4 w-full h-40 relative rounded-md overflow-hidden">
                      <ServiceImage src={service.coverImage} alt={service.title} slug={service.slug} />
                    </div>
                  ) : (
                    <div className="text-blue-600 text-5xl mb-4">
                      <IconComponent />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
