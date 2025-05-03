import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import User from "../../../../models/UserModel";
import Service from "../../../../models/ServiceModel";
import FAQ from "../../../../models/FAQModel";
import Blog from "../../../../models/BlogModel";
import Contact from "../../../../models/ContactModel";

// GET dashboard stats
export async function GET() {
  try {
    await connectDB();
    
    // Count all users, services, FAQs, blogs, and contacts in parallel
    const [usersCount, servicesCount, faqsCount, blogsCount, contactsCount] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      FAQ.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments()
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        users: usersCount,
        services: servicesCount,
        faqs: faqsCount,
        blogs: blogsCount,
        contacts: contactsCount
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch stats"
      },
      { status: 500 }
    );
  }
} 