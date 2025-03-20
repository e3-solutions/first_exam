import { NextResponse } from 'next/server';
import { initiateQuickBooksAuth, handleQuickBooksCallback } from '@/services/quickbooks';

// Helper function to add CORS headers to responses
function addCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your specific domains in production
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');
  console.log('in call back');
  if (code && realmId) {
    try {
      const auth = await handleQuickBooksCallback(code, realmId);
      const response = NextResponse.json(auth);
      return addCORSHeaders(response);
    } catch (error) {
      const errorResponse = NextResponse.json(
        { error: 'Failed to handle QuickBooks callback' }, 
        { status: 500 }
      );
      return addCORSHeaders(errorResponse);
    }
  }

  const badRequestResponse = NextResponse.json(
    { error: 'Missing required parameters' }, 
    { status: 400 }
  );
  return addCORSHeaders(badRequestResponse);
}

export async function POST() {
  try {
    console.log("Inside post API");
    const authUrl = initiateQuickBooksAuth();
    const response = NextResponse.json({ url: authUrl });
    return addCORSHeaders(response);
  } catch (error) {
    const errorResponse = NextResponse.json(
      { error: 'Failed to initiate QuickBooks auth' }, 
      { status: 500 }
    );
    return addCORSHeaders(errorResponse);
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204, // No content
    headers: {
      'Access-Control-Allow-Origin': '*', // Replace with your specific domains in production
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}