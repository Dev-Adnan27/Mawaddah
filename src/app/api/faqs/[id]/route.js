import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import FAQ from "../../../../../models/FAQModel";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Fetch specific FAQ by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { faq },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error fetching FAQ ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Update an existing FAQ
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    await connectDB();
    
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // If category is changing, we need to handle order properly
    if (updateData.category && updateData.category !== faq.category) {
      // Find highest order in new category
      const highestOrderFAQ = await FAQ.findOne({ category: updateData.category })
        .sort({ order: -1 })
        .limit(1);
      
      // Place at the end of the new category
      updateData.order = highestOrderFAQ ? highestOrderFAQ.order + 1 : 1;
    }
    
    // Update the FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(
      { message: "FAQ updated successfully", faq: updatedFAQ },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error updating FAQ ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Remove an FAQ
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    const { category, order } = faq;
    
    // Delete the FAQ
    await FAQ.findByIdAndDelete(id);
    
    // Update order of remaining FAQs in the category
    await FAQ.updateMany(
      { category, order: { $gt: order } },
      { $inc: { order: -1 } }
    );
    
    return NextResponse.json(
      { message: "FAQ deleted successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error deleting FAQ ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
} 