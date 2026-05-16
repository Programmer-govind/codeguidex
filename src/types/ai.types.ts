/**
 * AI Type Definitions
 * Used by the AI Helper, ChatWidget, and AI Code Generator
 */

export type AIRole = 'user' | 'model';

export interface AIMessage {
  id: string;
  role: AIRole;
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string; // Auto-generated from first message
  messages: AIMessage[];
  context?: string; // Optional page/post context
  createdAt: string;
  updatedAt: string;
}

export interface AICodeGenRequest {
  prompt: string;
  language: string;
  context?: string; // Optional surrounding code for better generation
}

export interface AICodeGenResponse {
  code: string;
  explanation: string;
  language: string;
  filename?: string;
}

export interface AIChatRequest {
  message: string;
  conversationHistory: Array<{ role: AIRole; content: string }>;
  context?: string; // e.g. "User is viewing a React post about hooks"
}

export interface AIChatResponse {
  response: string;
  timestamp: string;
}

export interface AIState {
  conversations: AIConversation[];
  currentConversationId: string | null;
  currentMessages: AIMessage[];
  isWidgetOpen: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}
