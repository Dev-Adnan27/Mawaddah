import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../../models/UserModel";

// GET a single user by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { username, email, role, isVerified } = await request.json();
    
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if username or email is taken by another user
    if (username && username !== existingUser.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }
    
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }
    
    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        ...(username && { username }),
        ...(email && { email }),
        ...(role && { role }),
        ...(isVerified !== undefined && { isVerified })
      },
      { new: true }
    ).select("-password");
    
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 