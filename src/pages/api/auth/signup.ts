import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    void body; // TODO: Remove when implementing Firebase integration
    // const { email, password, displayName, role } = body;

    // TODO: Validate input
    // TODO: Create user in Firebase
    // TODO: Return auth response

    return NextResponse.json(
      {
        success: true,
        message: 'Signup endpoint ready - Firebase integration coming soon',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Signup failed',
      },
      { status: 500 }
    );
  }
}
