'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  setLoading,
  setError,
  openWidget,
  closeWidget,
  toggleWidget,
  clearCurrentMessages,
  setCurrentConversationId,
} from '@/store/slices/aiSlice';
import { sendChatMessage, generateCodeStream, saveConversation } from '@/services/ai.service';
import type { AIMessage, AICodeGenResponse } from '@/types/ai.types';
import { useAuth } from '@/hooks/useAuth';

export function useAI() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const aiState = useAppSelector((state) => state.ai);

  // ─── Widget control ─────────────────────────────────────────────────────
  const openAIWidget = useCallback(() => dispatch(openWidget()), [dispatch]);
  const closeAIWidget = useCallback(() => dispatch(closeWidget()), [dispatch]);
  const toggleAIWidget = useCallback(() => dispatch(toggleWidget()), [dispatch]);

  // ─── Send a chat message (full response mode) ────────────────────────────
  const sendMessage = useCallback(
    async (messageText: string, context?: string) => {
      if (!messageText.trim()) return;

      const userMsg: AIMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(userMsg));
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Build history from current messages (exclude the one just added)
        const history = aiState.currentMessages.map((m) => ({
          role: m.role as 'user' | 'model',
          content: m.content,
        }));

        const response = await sendChatMessage(messageText, history, context);

        const assistantMsg: AIMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'model',
          content: response,
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(assistantMsg));

        // Persist to Firestore if user is logged in
        if (user?.id) {
          const allMessages = [...aiState.currentMessages, userMsg, assistantMsg];
          const convId = await saveConversation(
            user.id,
            aiState.currentConversationId,
            allMessages
          );
          if (!aiState.currentConversationId) {
            dispatch(setCurrentConversationId(convId));
          }
        }
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to get response'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, aiState.currentMessages, aiState.currentConversationId, user?.id]
  );

  // ─── Generate code (streaming mode) ─────────────────────────────────────
  const generateCode = useCallback(
    async (
      prompt: string,
      language: string,
      context?: string,
      onChunk?: (chunk: string) => void,
      onComplete?: (result: AICodeGenResponse) => void
    ) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const gen = generateCodeStream(prompt, language, context, onComplete);
        for await (const chunk of gen) {
          onChunk?.(chunk);
        }
      } catch (err: any) {
        dispatch(setError(err.message || 'Code generation failed'));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // ─── Start a new conversation ────────────────────────────────────────────
  const newConversation = useCallback(() => {
    dispatch(clearCurrentMessages());
  }, [dispatch]);

  return {
    ...aiState,
    sendMessage,
    generateCode,
    newConversation,
    openAIWidget,
    closeAIWidget,
    toggleAIWidget,
  };
}
