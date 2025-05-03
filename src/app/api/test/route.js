import { NextResponse } from "next/server";

// Helper function to add CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    console.log("Test API endpoint called");
    // Add a deliberate delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      message: "API is working!",
      timestamp: new Date().toISOString(),
      server: "Next.js API route"
    }, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Error in test API:", error);
    return NextResponse.json({
      error: "Server error",
      message: error.message
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
} 