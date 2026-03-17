export interface ChatMessage {
  id?: string;
  exchange_id?: string;

  sender_id: string;
  message: string;

  created_at?: string;
}

export interface ChatSocketMessage {
  sender_id: string;
  message: string;
  created_at?: string;
}
