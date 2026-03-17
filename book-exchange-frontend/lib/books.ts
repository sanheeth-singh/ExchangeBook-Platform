import api from "./api";
import { Book, BookCreate } from "@/types/book";

export const getBooks = async (): Promise<Book[]> => {
  const res = await api.get<Book[]>("/books/");
  return res.data;
};

export const createBook = async (data: BookCreate): Promise<Book> => {
  const res = await api.post<Book>("/books/", data);
  return res.data;
};

export const updateBook = async (
  id: string,
  data: BookCreate
): Promise<Book> => {
  const res = await api.put<Book>(`/books/${id}`, data);
  return res.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};
