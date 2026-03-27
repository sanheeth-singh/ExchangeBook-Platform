export type ExchangeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "WAITING_CONFIRMATION";

export interface Exchange {
  updated_at: string | number | Date;
  created_at: string | number | Date;
  id: string;
  requester_id: string;
  owner_id: string;
  requested_book_id: string;
  requester_name: string;
  owner_name: string;
  owner_confirmed: string;
  requester_confirmed: string;
  first_confirmed_at: string | number | Date;
  status: ExchangeStatus;
  
}
