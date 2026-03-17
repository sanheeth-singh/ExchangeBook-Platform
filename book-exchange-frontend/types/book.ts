export type BookCondition = "NEW" | "GOOD" | "FAIR" | "POOR";

export interface Book {
  [x: string]: unknown;
  id: string;
  title: string;
  author: string;
  condition: BookCondition;
  is_available: boolean;
  created_at: string | number | Date;
  updated_at: string | number | Date;
  owner_id: string;
  owner:{
    id:string;
    username:string;

  }
}

export interface BookCreate {
  title: string;
  author: string;
  condition: BookCondition;
}
