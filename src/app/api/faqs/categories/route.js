import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import FAQ from "../../../../../models/FAQModel";
import Category from "../../../../../models/CategoryModel";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Get all FAQ categories
export async function GET() {
  try {
    await connectDB();
    
    // Get all categories
    const categories = await Category.find().sort({ name: 1 });
    
    return NextResponse.json(
      { categories },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - Create a new category
export async function POST(request) {
  try {
    const { name } = await request.json();
    
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await connectDB();
    
    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }  // Case-insensitive search
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Create new category
    const newCategory = new Category({ name });
    await newCategory.save();
    
    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
} 