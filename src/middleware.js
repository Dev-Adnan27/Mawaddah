import { NextResponse } from 'next/server';

// This middleware handles CORS for API routes
export function middleware(request) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Create a response object
    const response = NextResponse.next();
    
    // Add the CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Return the response
    return response;
  }
  
  // Continue with the request for non-API routes
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
}; 