import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    void body; // TODO: Remove when implementing Firebase integration
    // const { email, password } = body;

    // TODO: Validate input
    // TODO: Authenticate with Firebase
    // TODO: Return auth response

    return NextResponse.json(
      {
        success: true,
        message: 'Login endpoint ready - Firebase integration coming soon',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Login failed',
      },
      { status: 500 }
    );
  }
}
