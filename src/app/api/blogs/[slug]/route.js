import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Blog from "../../../../../models/BlogModel";

// GET a single blog by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// UPDATE a blog by slug
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    const updateData = await request.json();
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    // If updating the slug, check for uniqueness
    if (updateData.slug && updateData.slug !== slug) {
      const existingBlog = await Blog.findOne({ slug: updateData.slug });
      if (existingBlog) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 409 }
        );
      }
    }
    
    // Update the blog
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE a blog by slug
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
    
    await Blog.findOneAndDelete({ slug });
    
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
} 