import { NextResponse } from 'next/server';

// Handler for the GET request
export async function GET(request: Request) {
  // Extract the search parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Get the 'url' parameter from the search parameters
  const imageUrl = searchParams.get('url');

  // If no 'url' parameter is provided, return a 400 Bad Request response
  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // Fetch the image data from the provided URL
    const response = await fetch(imageUrl);

    // Convert the response to an ArrayBuffer for binary data
    const buffer = await response.arrayBuffer();

    // Return the image data with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        // Preserve the original content type if available, default to 'image/png'
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        // Allow all origins to access this resource (CORS policy)
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    // Handle errors during the fetch process and return a 500 Internal Server Error
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
