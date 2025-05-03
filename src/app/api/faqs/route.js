import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import FAQ from "../../../../models/FAQModel";

// Helper function to add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all FAQs from database
export async function GET() {
  try {
    // Connect to database
    await connectDB();
    console.log("Database connected for FAQs GET request");
    
    // Fetch FAQs from database
    const faqs = await FAQ.find({}).sort({ category: 1, order: 1 });
    console.log(`Found ${faqs.length} FAQs`);
    
    return NextResponse.json({ faqs }, { 
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// POST - Create a new FAQ
export async function POST(request) {
  try {
    const { question, answer, category, isVisible = true } = await request.json();
    
    // Validate required fields
    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: "Missing required fields: question, answer, and category are required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await connectDB();
    
    // Find the highest order in the category to place new FAQ at the end
    const highestOrderFAQ = await FAQ.findOne({ category })
      .sort({ order: -1 })
      .limit(1);
    
    const newOrder = highestOrderFAQ ? highestOrderFAQ.order + 1 : 1;
    
    // Create new FAQ
    const newFAQ = new FAQ({
      question,
      answer,
      category,
      isVisible,
      order: newOrder,
    });
    
    await newFAQ.save();
    
    return NextResponse.json(
      { message: "FAQ created successfully", faq: newFAQ },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 