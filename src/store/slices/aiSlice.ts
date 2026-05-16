import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AIMessage, AIConversation, AIState } from '@/types/ai.types';

const initialState: AIState = {
  conversations: [],
  currentConversationId: null,
  currentMessages: [],
  isWidgetOpen: false,
  isLoading: false,
  isStreaming: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Widget visibility
    openWidget(state) { state.isWidgetOpen = true; },
    closeWidget(state) { state.isWidgetOpen = false; },
    toggleWidget(state) { state.isWidgetOpen = !state.isWidgetOpen; },

    // Message management
    addMessage(state, action: PayloadAction<AIMessage>) {
      state.currentMessages.push(action.payload);
    },
    setCurrentMessages(state, action: PayloadAction<AIMessage[]>) {
      state.currentMessages = action.payload;
    },
    clearCurrentMessages(state) {
      state.currentMessages = [];
      state.currentConversationId = null;
    },

    // Conversation management
    setConversations(state, action: PayloadAction<AIConversation[]>) {
      state.conversations = action.payload;
    },
    setCurrentConversationId(state, action: PayloadAction<string | null>) {
      state.currentConversationId = action.payload;
    },
    addConversation(state, action: PayloadAction<AIConversation>) {
      state.conversations.unshift(action.payload);
    },
    removeConversation(state, action: PayloadAction<string>) {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
    },

    // Loading / streaming states
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload; },
    setStreaming(state, action: PayloadAction<boolean>) { state.isStreaming = action.payload; },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },

    // Update the last assistant message content (used during streaming)
    updateLastAssistantMessage(state, action: PayloadAction<string>) {
      const lastMsg = state.currentMessages[state.currentMessages.length - 1];
      if (lastMsg && lastMsg.role === 'model') {
        lastMsg.content = action.payload;
      }
    },
  },
});

export const {
  openWidget, closeWidget, toggleWidget,
  addMessage, setCurrentMessages, clearCurrentMessages,
  setConversations, setCurrentConversationId, addConversation, removeConversation,
  setLoading, setStreaming, setError,
  updateLastAssistantMessage,
} = aiSlice.actions;

export default aiSlice.reducer;
