import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/inventory', '');
    const queryString = url.search;

    const response = await fetch(
      `${BACKEND_URL}/api/inventory${endpoint}${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
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
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
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
    const endpoint = url.pathname.replace('/api/inventory', '');
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/inventory${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
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
    const endpoint = url.pathname.replace('/api/inventory', '');

    const response = await fetch(`${BACKEND_URL}/api/inventory${endpoint}`, {
      method: 'DELETE',
    });

    const data = response.ok ? { success: true } : await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend connection error:', error);
    return NextResponse.json(
      { error: 'Erro conectando ao backend' },
      { status: 500 }
    );
  }
}
