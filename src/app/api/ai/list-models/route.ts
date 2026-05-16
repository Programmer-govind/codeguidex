import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint — lists all Gemini models available for your API key
 * Visit: http://localhost:3000/api/ai/list-models
 */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not set in .env.local' }, { status: 503 });
  }

  try {
    // Try v1 first
    const resV1 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    const dataV1 = await resV1.json();

    // Try v1beta as well
    const resV1Beta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const dataV1Beta = await resV1Beta.json();

    const modelsV1 = dataV1.models?.map((m: any) => ({
      name: m.name,
      displayName: m.displayName,
      supportedMethods: m.supportedGenerationMethods,
    })) ?? dataV1;

    const modelsV1Beta = dataV1Beta.models?.map((m: any) => ({
      name: m.name,
      displayName: m.displayName,
      supportedMethods: m.supportedGenerationMethods,
    })) ?? dataV1Beta;

    return NextResponse.json({
      keyPrefix: apiKey.slice(0, 8) + '...',
      v1: modelsV1,
      v1beta: modelsV1Beta,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
