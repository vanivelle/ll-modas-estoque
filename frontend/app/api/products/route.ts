import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Helper to safely parse JSON response
async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  return response.ok ? { success: true } : { error: await response.text() };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/products', '');
    const queryString = url.search;

    const response = await fetch(
      `${BACKEND_URL}/api/products${endpoint}${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend connection error:', error);
    return NextResponse.json(
      { error: 'Erro conectando ao backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/products', '');
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/products${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend connection error:', error);
    return NextResponse.json(
      { error: 'Erro conectando ao backend' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/products', '');
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend connection error:', error);
    return NextResponse.json(
      { error: 'Erro conectando ao backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/products', '');

    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, {
      method: 'DELETE',
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend connection error:', error);
    return NextResponse.json(
      { error: 'Erro conectando ao backend' },
      { status: 500 }
    );
  }
}
