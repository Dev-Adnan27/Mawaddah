import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Service from "../../../../../models/ServiceModel";

// GET a specific service by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    console.log(`🔍 Attempting to fetch service with slug: ${slug}`);
    
    // Connect to database
    try {
      await connectDB();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }
    
    // Find service
    const service = await Service.findOne({ slug });
    console.log(`🔍 Service lookup result:`, service ? 'Found' : 'Not found');
    
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in service API route:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update a service
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const updateData = await request.json();
    
    await connectDB();
    
    // Check if service exists
    const existingService = await Service.findOne({ slug });
    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    // If slug is being changed, check if it's already in use
    if (updateData.slug && updateData.slug !== existingService.slug) {
      const slugExists = await Service.findOne({ slug: updateData.slug });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
    }
    
    // Update service fields
    const updatedService = await Service.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );
    
    return NextResponse.json({ service: updatedService }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a service
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    
    await connectDB();
    
    const service = await Service.findOne({ slug });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    await Service.findOneAndDelete({ slug });
    
    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 