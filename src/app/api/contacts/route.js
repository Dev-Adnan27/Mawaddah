import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Contact from "../../../../models/ContactModel";

// GET all contacts (admin only)
export async function GET() {
  try {
    await connectDB();
    
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST new contact submission
export async function POST(request) {
  try {
    await connectDB();
    
    const contactData = await request.json();
    
    if (!contactData.name || !contactData.email || !contactData.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    
    // Create the new contact submission
    const newContact = await Contact.create(contactData);
    
    return NextResponse.json(
      { message: "Your message has been received", contact: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
} 