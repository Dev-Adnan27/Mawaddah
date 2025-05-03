import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import Service from "../../../../../../models/ServiceModel";
import mongoose from "mongoose";

// GET a specific service by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`🔍 Attempting to fetch service with id: ${id}`);
    
    // Connect to database
    await connectDB();
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID format" },
        { status: 400 }
      );
    }
    
    // Find service
    const service = await Service.findById(id);
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
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Update a service by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    await connectDB();
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID format" },
        { status: 400 }
      );
    }
    
    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    // If slug is being changed, check if it's already in use
    if (updateData.slug && updateData.slug !== existingService.slug) {
      const slugExists = await Service.findOne({ 
        slug: updateData.slug,
        _id: { $ne: id } // Exclude current service
      });
      if (slugExists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
    }
    
    console.log("Updating service:", id);
    console.log("With data:", Object.keys(updateData));
    
    // Update service fields
    const updatedService = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return NextResponse.json({ service: updatedService }, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a service by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID format" },
        { status: 400 }
      );
    }
    
    console.log("Deleting service with ID:", id);
    
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    const result = await Service.findByIdAndDelete(id);
    console.log("Delete result:", result);
    
    return NextResponse.json({ 
      message: "Service deleted successfully",
      serviceId: id
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 