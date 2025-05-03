import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Contact from "../../../../../models/ContactModel";

// GET a single contact by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

// UPDATE a contact by ID (for updating status)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const updateData = await request.json();
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }
    
    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ contact: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE a contact by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }
    
    await Contact.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
} 