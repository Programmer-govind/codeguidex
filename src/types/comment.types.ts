export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  media?: {
    codeSnippets: CodeSnippet[];
  };
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
  media?: {
    codeSnippets: CodeSnippet[];
  };
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    displayName: string;
    profilePicture?: string;
  };
}
