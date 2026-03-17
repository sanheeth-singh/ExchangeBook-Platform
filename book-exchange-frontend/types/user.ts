export interface Book {
  id: string;
  title: string;
  author: string;
  condition: string;
}

export interface UserWithBooks {
  id: string;
  email: string;
  username: string;
  books: Book[];
}

