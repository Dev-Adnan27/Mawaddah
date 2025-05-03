import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import User from "../../../../models/UserModel";

// GET all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select("-password");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST(request) {
  try {
    const { username, email, password, role, isVerified } = await request.json();
    
    await connectDB();
    
    // Check if user with this email or username already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" }, 
        { status: 400 }
      );
    }
    
    const newUser = await User.create({
      username,
      email,
      password, // Note: In a real app, you should hash this password
      role: role || "user",
      isVerified: isVerified || false
    });
    
    // Don't send back the password
    const userWithoutPassword = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
    
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 