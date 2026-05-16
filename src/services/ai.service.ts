/**
 * AI Service — Client-side wrapper for AI API calls
 * All API keys stay server-side. This service only calls our own Next.js API routes.
 */

import type { AIMessage, AIConversation, AICodeGenResponse } from '@/types/ai.types';
import { db } from '@/config/firebase.config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const AI_API_BASE = '/api/ai';

// ─── Chat (Full Response) ────────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }>,
  context?: string
): Promise<string> {
  const res = await fetch(`${AI_API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory: history, context }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to get AI response');
  }

  const data = await res.json();
  return data.response as string;
}

// ─── Code Generation (Streaming) ────────────────────────────────────────────

export async function* generateCodeStream(
  prompt: string,
  language: string,
  context?: string,
  onDone?: (result: AICodeGenResponse) => void
): AsyncGenerator<string> {
  const res = await fetch(`${AI_API_BASE}/generate-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language, context }),
  });

  if (!res.ok || !res.body) {
    throw new Error('Code generation request failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const parsed = JSON.parse(line.slice(6));

        if (parsed.error) throw new Error(parsed.error);

        if (parsed.done && parsed.result) {
          onDone?.(parsed.result as AICodeGenResponse);
        } else if (parsed.chunk) {
          yield parsed.chunk as string;
        }
      } catch {
        // Ignore malformed SSE lines
      }
    }
  }
}

// ─── Firestore Persistence ───────────────────────────────────────────────────

export async function saveConversation(
  userId: string,
  conversationId: string | null,
  messages: AIMessage[],
  title?: string
): Promise<string> {
  const conversationsRef = collection(db, 'aiConversations');

  if (conversationId) {
    // Update existing conversation
    const convRef = doc(conversationsRef, conversationId);
    await updateDoc(convRef, {
      messages,
      updatedAt: serverTimestamp(),
    });
    return conversationId;
  } else {
    // Create new conversation
    const newConv = await addDoc(conversationsRef, {
      userId,
      title: title || messages[0]?.content?.slice(0, 50) || 'New Conversation',
      messages,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newConv.id;
  }
}

export async function loadUserConversations(
  userId: string,
  maxCount = 20
): Promise<AIConversation[]> {
  const conversationsRef = collection(db, 'aiConversations');
  const q = query(
    conversationsRef,
    orderBy('updatedAt', 'desc'),
    limit(maxCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .filter((doc) => doc.data().userId === userId)
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    })) as AIConversation[];
}
