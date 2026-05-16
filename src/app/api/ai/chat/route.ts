import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are CodeGuideX AI, an expert programming assistant integrated into the CodeGuideX learning platform.
Your role is to help developers — especially students — by:
- Answering technical programming questions clearly and concisely
- Explaining complex algorithms and data structures with examples
- Debugging code and identifying logic errors
- Suggesting best practices and design patterns
- Breaking down concepts for beginners without being condescending

Guidelines:
- Be direct and technical. Don't use filler phrases like "Great question!"
- Always include code examples when relevant (use markdown code blocks)
- If the user shares a code snippet with an error, identify the exact issue
- Keep responses focused — don't over-explain unless the user asks for more detail
- For ambiguous questions, ask one clarifying question before answering
- Format code examples properly with the correct language identifier`;

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [], context } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    // getGenerativeModel without systemInstruction — v1 REST API doesn't accept it
    // as a camelCase field via the SDK. We inject the system prompt via history instead.
    const model = genAI.getGenerativeModel(
      { model: 'gemini-2.5-flash' },
      { apiVersion: 'v1' }
    );

    const systemInstruction = context
      ? `${SYSTEM_PROMPT}\n\nCurrent context: ${context}`
      : SYSTEM_PROMPT;

    // Inject system prompt as a priming exchange at the start of history.
    // This is the SDK-version-agnostic way to set model behaviour.
    const systemHistory = [
      { role: 'user' as const, parts: [{ text: `[System instructions — follow these for the entire conversation]\n${systemInstruction}` }] },
      { role: 'model' as const, parts: [{ text: 'Understood. I am CodeGuideX AI — a technical programming assistant. I will follow these guidelines for all responses. Ready to help!' }] },
    ];

    // Map previous conversation messages
    const history = [
      ...systemHistory,
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.content }],
      })),
    ];

    const chat = model.startChat({ history, safetySettings });
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[AI Chat API] Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
