import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Service from "../../../../models/ServiceModel";

// GET all services
export async function GET() {
  try {
    await connectDB();
    
    const services = await Service.find().sort({ title: 1 });
    
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST new service (admin only in a real app)
export async function POST(request) {
  try {
    await connectDB();
    
    const serviceData = await request.json();
    
    if (!serviceData.slug || !serviceData.title || !serviceData.description || !serviceData.icon || !serviceData.coverImage) {
      return NextResponse.json(
        { error: "Slug, title, description, icon, and coverImage are required" },
        { status: 400 }
      );
    }
    
    // Check if a service with this slug already exists
    const existingService = await Service.findOne({ slug: serviceData.slug });
    
    if (existingService) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 409 }
      );
    }
    
    // Create the new service
    const newService = await Service.create(serviceData);
    
    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
} 