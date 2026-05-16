import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CODE_GENERATION_PROMPT = `You are CodeGuideX Code Generator, an expert code generation engine.
When given a prompt, generate clean, production-quality code with these rules:

1. ALWAYS respond with valid JSON matching this exact structure:
{
  "code": "<the complete code here — use \\n for newlines, escape quotes>",
  "explanation": "<2-3 sentence explanation of what the code does and key decisions made>",
  "language": "<the programming language used>",
  "filename": "<suggested filename with extension>"
}

2. Code quality rules:
- Write complete, runnable code — not snippets with "..." placeholders
- Include necessary imports at the top
- Add brief inline comments for non-obvious logic
- Follow language best practices (PEP8 for Python, ESLint standards for JS/TS, etc.)
- Handle edge cases where reasonable

3. Do NOT add markdown code fences around the JSON — return raw JSON only`;


export async function POST(req: NextRequest) {
  try {
    const { prompt, language, context } = await req.json();

    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = genAI.getGenerativeModel(
      { model: 'gemini-2.5-flash' },
      { apiVersion: 'v1' }
    );

    // Prepend system instructions directly into the prompt
    // (systemInstruction field is not serialized correctly by SDK 0.24.x on v1 endpoint)
    const fullPrompt = `${CODE_GENERATION_PROMPT}

---
${context
  ? `Generate ${language || 'code'} for the following:\n${prompt}\n\nContext/constraints:\n${context}`
  : `Generate ${language || 'code'} for the following:\n${prompt}`}`;

    // ── Streaming response via ReadableStream (Server-Sent Events) ──
    const encoder = new TextEncoder();
    let fullText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await model.generateContentStream(fullPrompt);

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            // Send each chunk as an SSE data event
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`));
          }

          // After all chunks, parse the accumulated JSON and send final structured response
          try {
            // Strip any accidental markdown fences that Gemini might add
            const cleanedText = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanedText);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, result: parsed })}\n\n`));
          } catch {
            // If JSON parse fails, send raw text as code
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  result: { code: fullText, explanation: 'Code generated successfully.', language: language || 'text', filename: 'output.txt' },
                })}\n\n`
              )
            );
          }

          controller.close();
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message || 'Generation failed' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[AI Code Gen API] Error:', error?.message);
    return new Response(
      JSON.stringify({ error: 'Failed to generate code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
