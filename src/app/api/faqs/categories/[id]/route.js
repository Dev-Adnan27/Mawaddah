import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import Category from "../../../../../../models/CategoryModel";
import FAQ from "../../../../../../models/FAQModel";
import mongoose from "mongoose";

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

// GET - Get a specific category
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { category },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Update a category
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name } = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await connectDB();
    
    // Check if category exists
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if the new name already exists (excluding current category)
    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${name}$`, "i") } // Case-insensitive search
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Update category
    category.name = name;
    await category.save();
    
    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await connectDB();
    
    // Check if category exists
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if category is in use
    const faqsUsingCategory = await FAQ.countDocuments({ category: id });
    
    if (faqsUsingCategory > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete category that has FAQs associated with it", 
          count: faqsUsingCategory 
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Delete category
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
} 