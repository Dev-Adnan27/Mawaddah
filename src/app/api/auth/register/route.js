import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../db/connection";
import User from "../../../../../models/UserModel";

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password, // In a real app, hash the password before storing
      role: "user",
      isVerified: false
    });
    
    // Return user info (excluding password)
    const userWithoutPassword = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified
    };
    
    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
} 