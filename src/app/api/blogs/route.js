import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Blog from "../../../../models/BlogModel";

// GET all blogs
export async function GET() {
  try {
    await connectDB();
    
    const blogs = await Blog.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST new blog (admin only in a real app)
export async function POST(request) {
  try {
    await connectDB();
    
    const blogData = await request.json();
    
    if (!blogData.slug || !blogData.title || !blogData.summary || !blogData.content || !blogData.author || !blogData.coverImage) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }
    
    // Check if a blog with this slug already exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }
    
    // Create the new blog
    const newBlog = await Blog.create(blogData);
    
    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
} 