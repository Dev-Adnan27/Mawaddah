import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../db/connection";
import User from "../../../../../models/UserModel";

export async function GET() {
  try {
    await dbConnect();
    console.log("Database connected for seed-admin request");
    
    // Check if any users already exist
    const userCount = await User.countDocuments();
    console.log(`Existing user count: ${userCount}`);
    
    // Try to find or create admin user
    let adminUser = await User.findOne({ email: "admin@mawaddah.org" });
    
    if (!adminUser) {
      console.log("Creating new admin user");
      adminUser = await User.create({
        username: "admin",
        email: "admin@mawaddah.org",
        password: "admin123456",
        role: "admin",
        isVerified: true
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
    
    // Try to find or create staff user
    let staffUser = await User.findOne({ email: "staff@mawaddah.org" });
    
    if (!staffUser) {
      console.log("Creating new staff user");
      staffUser = await User.create({
        username: "staff",
        email: "staff@mawaddah.org",
        password: "staff123456",
        role: "user",
        isVerified: true
      });
      console.log("Staff user created successfully");
    } else {
      console.log("Staff user already exists");
    }
    
    const newUserCount = await User.countDocuments();
    
    return NextResponse.json({
      message: `Test users ready: ${newUserCount} users in the database`,
      adminEmail: "admin@mawaddah.org",
      adminPassword: "admin123456",
      staffEmail: "staff@mawaddah.org",
      staffPassword: "staff123456",
      totalUsers: newUserCount
    });
    
  } catch (error) {
    console.error("Error creating test users:", error);
    return NextResponse.json(
      { error: "Failed to create test users", details: error.message },
      { status: 500 }
    );
  }
} 