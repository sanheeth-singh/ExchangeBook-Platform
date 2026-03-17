"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import BookCard from "./BooksCard";
import { Book } from "@/types/book";
import { motion } from "framer-motion";

export default function MyBooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      setBooks(res.data.books);
      setCurrentUserId(res.data.id);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <span className="text-sm text-gray-500">
          {books.length} books
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 py-10">
          Loading books...
        </div>
      )}

      {/* Empty State */}
      {!loading && books.length === 0 && (
        <div className="text-center text-gray-500 py-10 border rounded-xl">
          You have not added any books yet.
        </div>
      )}

      {/* Books Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {books.map((book) => (
          <motion.div key={book.id} variants={item}>
            <BookCard
              book={book}
              currentUserId={currentUserId}
              role={"USER"}
              onRefresh={fetchBooks}
            />
          </motion.div>
        ))}
      </motion.div>
      
    </div>
  );
}
