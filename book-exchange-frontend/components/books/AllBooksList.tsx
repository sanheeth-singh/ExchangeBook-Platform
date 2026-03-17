"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Book } from "@/types/book";
import BookCard from "./BooksCard";
import { Search, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function AllBooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("ALL");

  const fetchBooks = async () => {
    const res = await api.get(`/books/`);
    setBooks(res.data);
    setFilteredBooks(res.data);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await api.get(`/books/?search=${search}`);
      setBooks(res.data);
      setFilteredBooks(res.data);
    };
    fetchBooks();
  }, [search]);

  useEffect(() => {
    let filtered = books;

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (conditionFilter !== "ALL") {
      filtered = filtered.filter((b) => b.condition === conditionFilter);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredBooks(filtered);
  }, [search, conditionFilter, books]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-500 text-sm">
          Explore books shared by other students.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
          <Search size={16} className="text-gray-400 mr-2" />

          <input
            placeholder="Search books or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm bg-transparent text-gray-700"
          />
        </div>

        {/* Condition Filter */}
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm text-gray-700"
        >
          <option value="ALL">All Conditions</option>
          <option value="NEW">New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>

      {/* Books Grid */}

      {filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />

          <p className="text-gray-500">No books found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BookCard
                book={book}
                currentUserId={""}
                role={"USER"}
                onRefresh={fetchBooks}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
