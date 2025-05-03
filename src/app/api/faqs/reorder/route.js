import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import FAQ from "../../../../../models/FAQModel";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST - Reorder FAQs (move up or down)
export async function POST(request) {
  try {
    const { id, direction } = await request.json();
    
    // Validate inputs
    if (!id) {
      return NextResponse.json(
        { error: "FAQ ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (direction !== "up" && direction !== "down") {
      return NextResponse.json(
        { error: "Direction must be 'up' or 'down'" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await connectDB();
    
    // Find the FAQ to reorder
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    const { category, order } = faq;
    
    // Handle moving up
    if (direction === "up") {
      // Cannot move up if already first
      if (order === 1) {
        return NextResponse.json(
          { message: "FAQ is already at the top position" },
          { status: 200, headers: corsHeaders }
        );
      }
      
      // Find the FAQ above the current one
      const aboveFAQ = await FAQ.findOne({
        category,
        order: order - 1
      });
      
      if (!aboveFAQ) {
        return NextResponse.json(
          { error: "Could not find FAQ above the current one" },
          { status: 404, headers: corsHeaders }
        );
      }
      
      // Swap orders
      aboveFAQ.order = order;
      faq.order = order - 1;
      
      await aboveFAQ.save();
      await faq.save();
    }
    
    // Handle moving down
    if (direction === "down") {
      // Find the highest order in this category
      const highestOrderFAQ = await FAQ.findOne({ category })
        .sort({ order: -1 })
        .limit(1);
      
      const highestOrder = highestOrderFAQ ? highestOrderFAQ.order : 1;
      
      // Cannot move down if already last
      if (order === highestOrder) {
        return NextResponse.json(
          { message: "FAQ is already at the bottom position" },
          { status: 200, headers: corsHeaders }
        );
      }
      
      // Find the FAQ below the current one
      const belowFAQ = await FAQ.findOne({
        category,
        order: order + 1
      });
      
      if (!belowFAQ) {
        return NextResponse.json(
          { error: "Could not find FAQ below the current one" },
          { status: 404, headers: corsHeaders }
        );
      }
      
      // Swap orders
      belowFAQ.order = order;
      faq.order = order + 1;
      
      await belowFAQ.save();
      await faq.save();
    }
    
    return NextResponse.json(
      { message: `FAQ moved ${direction} successfully` },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error reordering FAQ:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
} 