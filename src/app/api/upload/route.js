import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get file extension and validate file type
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name;
    const extension = path.extname(originalFilename).toLowerCase();
    
    // Only allow image file types
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: "File type not supported. Only images are allowed." },
        { status: 400 }
      );
    }
    
    // Create a unique filename to prevent overwriting
    const uniqueFilename = `${uuidv4()}${extension}`;
    
    // Create the directory if it doesn't exist (public/assets folder)
    const uploadDir = path.join(process.cwd(), "public", "assets");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory already exists or other error, continue
      console.log("Directory already exists or error creating it:", err.message);
    }
    
    // Write the file to the public/assets directory
    await writeFile(path.join(uploadDir, uniqueFilename), buffer);
    
    // Return the path that can be used in the src attribute of an img tag
    const imageUrl = `/assets/${uniqueFilename}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 