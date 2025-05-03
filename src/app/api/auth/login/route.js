import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../db/connection";
import User from "../../../../../models/UserModel";

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    console.log("Database connected for login request");
    
    const body = await request.json();
    console.log("Login request received with email:", body.email);
    
    const { email, password } = body;
    
    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return new NextResponse(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Find the user in the database
    const user = await User.findOne({ email });
    
    // For debugging - log the found user (without sensitive data)
    if (user) {
      console.log(`User found: ${user.username}, role: ${user.role}`);
    } else {
      console.log(`No user found with email: ${email}`);
    }
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Check password 
    if (user.password !== password) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log(`User logged in successfully: ${user.username} (${user.email})`);
    
    // Return user info (excluding password)
    const userWithoutPassword = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    };
    
    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        user: userWithoutPassword
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
