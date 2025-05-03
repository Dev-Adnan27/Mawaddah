import { NextResponse } from "next/server";
import { dbConnect } from "../../../../db/connection";
import Service from "../../../../models/ServiceModel";
import FAQ from "../../../../models/FAQModel";

// Initial services data
const servicesData = [
  {
    slug: "islamic-marriage-celebrant",
    icon: "FaMosque",
    title: "Islamic Marriage Celebrant",
    description:
      "Nikah ceremonies aligned with Islamic values and legal requirements, including registration services.",
    content: "Our Islamic Marriage Celebrant service provides comprehensive support for couples looking to get married in accordance with Islamic traditions and values. We offer legally recognized Nikah ceremonies conducted by qualified celebrants who ensure all religious and legal requirements are met. Our services include pre-marriage counseling, documentation assistance, and official marriage registration. We create a meaningful and spiritually rich ceremony that honors your faith while fulfilling all legal obligations.",
    coverImage: "/services/islamic-marriage-celebrant.jpg",
    isActive: true
  },
  {
    slug: "marriage-counselling",
    icon: "FaHandsHelping",
    title: "Marriage Counselling",
    description:
      "Faith-based and modern guidance for couples to strengthen their relationship and resolve conflicts.",
    content: "Our Marriage Counselling service offers compassionate and effective guidance for couples at any stage of their relationship. Our qualified counselors combine Islamic principles with contemporary psychological approaches to address relationship challenges and build stronger bonds. Whether you're preparing for marriage, working through conflicts, or seeking to enrich your existing relationship, our counselors provide a safe, confidential space to explore solutions and develop communication skills that foster understanding and mutual respect.",
    coverImage: "/services/marriage-counselling.jpg",
    isActive: true
  },
  {
    slug: "marriage-conflict-resolution",
    icon: "FaBalanceScale",
    title: "Marriage Conflict Resolution",
    description:
      "Islamic and modern conflict resolution to restore harmony and understanding in relationships.",
    content: "Our Marriage Conflict Resolution service offers specialized mediation for couples experiencing significant challenges in their relationship. Our trained mediators use both Islamic principles of reconciliation and modern conflict resolution techniques to help couples navigate through difficult issues. We provide a structured, respectful environment where both partners can express their concerns, identify root causes of conflict, and work toward mutually beneficial solutions that restore peace and understanding to the relationship.",
    isActive: true
  },
  {
    slug: "marriage-arbitration-committee",
    icon: "FaGavel",
    title: "Marriage Arbitration Committee",
    description:
      "Structured mediation rooted in Islamic ethics to resolve disputes fairly and respectfully.",
    content: "Our Marriage Arbitration Committee provides formal dispute resolution for couples facing serious marital issues. Following the Islamic principle of appointing arbiters from each family, our committee includes qualified scholars and professionals who work impartially to assess situations and recommend fair solutions. The committee addresses complex issues with wisdom and compassion, always prioritizing justice and the well-being of all family members, especially children. Our structured approach helps couples find resolution while maintaining dignity and respect.",
    isActive: true
  },
  {
    slug: "marriage-functions-venue-catering",
    icon: "FaUtensils",
    title: "Marriage Functions – Venue & Catering",
    description:
      "Elegant venue hire and halal catering for Nikah and wedding celebrations, professionally coordinated.",
    content: "Our Marriage Functions service offers comprehensive support for your wedding celebrations, from intimate Nikah ceremonies to grand receptions. We provide elegant venue options that can be customized to reflect your personal style and accommodate your guest list. Our professional halal catering service offers diverse menu options featuring traditional and modern cuisines. Our experienced event coordinators handle all details, including decor, seating arrangements, and timing coordination, allowing you to fully enjoy your special day without stress.",
    isActive: true
  },
  {
    slug: "youth-children-counselling",
    icon: "FaChild",
    title: "Youth & Children Counselling",
    description:
      "Supportive counselling for young individuals to build resilience and emotional well-being with Islamic values.",
    content: "Our Youth & Children Counselling service provides specialized support for young people facing various challenges. Our trained counselors create a safe, nurturing environment where children and teenagers can express themselves freely and develop healthy coping strategies. We address issues such as academic pressure, social challenges, family changes, and identity formation through an approach that integrates Islamic values with child-centered counseling techniques. Our goal is to help young people build resilience, emotional intelligence, and a strong sense of self-worth.",
    isActive: true
  },
  {
    slug: "islamic-talks-podcasts",
    icon: "FaPodcast",
    title: "Islamic Talks & Podcasts",
    description:
      "Inspirational talks and podcasts covering faith, personal development, and community well-being.",
    content: "Our Islamic Talks & Podcasts service delivers engaging, thought-provoking content that connects Islamic teachings to contemporary life challenges. Our speakers and content creators are knowledgeable scholars and professionals who present authentic religious guidance in accessible, relevant formats. We cover a wide range of topics including spiritual growth, family dynamics, mental health, social issues, and personal development. Through both live events and digital content, we aim to inspire, educate, and provide practical wisdom that enriches daily life.",
    isActive: true
  },
  {
    slug: "group-counselling-mentoring",
    icon: "FaUsers",
    title: "Group Counselling & Mentoring",
    description:
      "Group support rooted in Islamic guidance, fostering growth through shared experiences.",
    content: "Our Group Counselling & Mentoring service creates supportive communities where individuals can grow through shared experiences and guided discussion. Led by experienced facilitators, our groups address specific life challenges or transitions within a framework of Islamic principles and psychological best practices. Participants benefit from the wisdom and support of peers who understand their situations, while developing practical strategies for personal growth. We offer specialized groups for various demographics and needs, including youth mentoring, women's support circles, and men's growth groups.",
    isActive: true
  },
  {
    slug: "school-holiday-programs",
    icon: "FaSchool",
    title: "School Holiday Programs",
    description:
      "Fun, skill-building activities during holidays with a safe, faith-based environment for children.",
    content: "Our School Holiday Programs provide enriching experiences for children during school breaks in a safe, supervised environment that reflects Islamic values. Our diverse activities focus on building beneficial skills while ensuring children have fun and make new friends. Programs include arts and crafts, sports, outdoor adventures, STEM workshops, and cultural activities. Each program incorporates age-appropriate spiritual elements that strengthen children's connection to their faith and community. Our qualified staff create a nurturing atmosphere where children can explore, learn, and enjoy memorable holiday experiences.",
    isActive: true
  },
];

// Initial FAQs data
const faqsData = [
  {
    question: "How does Mawaddah work?",
    answer: "Mawaddah connects people looking for marriage based on values and compatibility. Our platform offers various services including Islamic marriage celebrant services, counseling, conflict resolution, and more to support individuals and couples throughout their relationship journey.",
    category: "general",
    order: 1,
    isActive: true
  },
  {
    question: "Is Mawaddah free to use?",
    answer: "Yes, basic features are free. Premium plans offer more benefits including priority access to counseling services, exclusive workshops, and personalized marriage preparation programs.",
    category: "general",
    order: 2,
    isActive: true
  },
  {
    question: "How can I verify my profile?",
    answer: "You can verify your profile by uploading a valid ID and submitting a short video through our secure verification process. This helps maintain the integrity of our community and ensures a safe environment for all members.",
    category: "account",
    order: 3,
    isActive: true
  },
  {
    question: "What qualifications do your marriage counselors have?",
    answer: "Our marriage counselors are qualified professionals with backgrounds in psychology, social work, or Islamic studies. Many hold advanced degrees and specialized certifications in marriage counseling, combining modern therapeutic techniques with Islamic principles.",
    category: "services",
    order: 4,
    isActive: true
  },
  {
    question: "How do I book a Nikah ceremony?",
    answer: "To book a Nikah ceremony, you can contact us through our website or call our office directly. Our team will guide you through the process, including required documentation, selecting a date and venue, and customizing the ceremony to your preferences.",
    category: "services",
    order: 5,
    isActive: true
  },
  {
    question: "Do you offer services for non-Muslims?",
    answer: "While our services are rooted in Islamic principles, we welcome individuals of all backgrounds who are interested in our approach. Certain services such as counseling and conflict resolution can be adapted to meet the needs of diverse clients.",
    category: "services",
    order: 6,
    isActive: true
  }
];

export async function GET(request) {
  try {
    await dbConnect();
    
    // Check if data already exists
    const existingServices = await Service.countDocuments();
    const existingFAQs = await FAQ.countDocuments();
    
    let results = {
      services: { added: 0, skipped: 0 },
      faqs: { added: 0, skipped: 0 }
    };
    
    // Only seed if collections are empty
    if (existingServices === 0) {
      await Service.insertMany(servicesData);
      results.services.added = servicesData.length;
    } else {
      results.services.skipped = servicesData.length;
    }
    
    if (existingFAQs === 0) {
      await FAQ.insertMany(faqsData);
      results.faqs.added = faqsData.length;
    } else {
      results.faqs.skipped = faqsData.length;
    }
    
    return NextResponse.json({
      message: "Database seeding completed",
      results
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Database seeding failed", details: error.message },
      { status: 500 }
    );
  }
} 