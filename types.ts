// types.ts
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface QuickBooksAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  realmId: string; // QuickBooks company ID
}

export interface Invoice {
  id: string;
  customerRef: {
    value: string;
    name: string;
  };
  dueDate: string;
  totalAmount: number;
  balance: number;
  status: string;
}

// services/quickbooks.ts (stub)
export async function initiateQuickBooksAuth() {
  // Implement QuickBooks OAuth flow initiation
}

export async function handleQuickBooksCallback(code: string, realmId: string) {
  // Handle OAuth callback and token storage
}

export async function fetchInvoices(auth: QuickBooksAuth) {
  // Fetch invoices from QuickBooks API
}

// services/ai.ts (stub)
export async function generateAIResponse(messages: Message[], quickBooksAuth?: QuickBooksAuth) {
  // Implement AI service integration that can access QuickBooks data when needed
}