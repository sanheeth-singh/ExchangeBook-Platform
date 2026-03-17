"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Book } from "@/types/book";
import BookCard from "./BooksCard";

interface BookListProps {
  currentUserId: string;
  role: "USER" | "ADMIN";
  refreshTrigger: number;
}

export default function BookList({
  currentUserId,
  role,
  refreshTrigger,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get<Book[]>("/books/");
      setBooks(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [refreshTrigger]);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          currentUserId={currentUserId}
          role={role}
          onRefresh={fetchBooks}
        />
      ))}
    </div>
  );
}
