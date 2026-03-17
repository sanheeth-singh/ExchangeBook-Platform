"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Book } from "@/types/book";
import { Exchange } from "@/types/exchange";
import BrowseBookCard from "./BrowseBookCard";
import { Search, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  currentUserId: string;
}

export default function BrowseBookList({ currentUserId }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [page, setPage] = useState(0);
  const limit = 9;

  const [sentExchanges, setSentExchanges] = useState<Exchange[]>([]);

  // Fetch only once
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await api.get<Book[]>(`/books/?limit=200`);

      const filtered = res.data.filter(
        (book) => book.owner_id !== currentUserId,
      );

      setBooks(filtered);
    } catch (error) {
      console.error(error);
      alert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await api.get<Exchange[]>("/exchanges/sent");
      setSentExchanges(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchSentRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local filtering
  const filteredBooks = useMemo(() => {
    let result = books;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.owner.username.toLocaleLowerCase().includes(q),
      );
    }

    if (availableOnly) {
      result = result.filter((b) => b.is_available);
    }
    return result;
  }, [books, search, availableOnly]);

  // Local pagination
  const paginatedBooks = useMemo(() => {
    const start = page * limit;
    return filteredBooks.slice(start, start + limit);
  }, [filteredBooks, page]);

  const totalPages = Math.ceil(filteredBooks.length / limit);

  if (loading) {
    return <p>Loading books...</p>;
  }

  // added
  const exchangeMap: Record<string, Exchange["status"]> = {};

  sentExchanges.forEach((ex) => {
    const existing = exchangeMap[ex.requested_book_id];

    // Priority handling
    if (!existing) {
      exchangeMap[ex.requested_book_id] = ex.status;
      return;
    }

    if (existing === "ACCEPTED") return;

    if (ex.status === "ACCEPTED") {
      exchangeMap[ex.requested_book_id] = "ACCEPTED";
      return;
    }

    if (existing === "PENDING") return;

    if (ex.status === "PENDING") {
      exchangeMap[ex.requested_book_id] = "PENDING";
    }
  });

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div
          className="flex items-center border
         border-slate-200 rounded-xl px-3 py-2 w-full md:w-80
          bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2
           focus-within:ring-orange-400 transition"
        >
          <Search size={16} className="text-gray-400 mr-2" />

          <input
            type="text"
            placeholder="Search books or authors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full outline-none text-sm bg-transparent text-gray-700"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => {
              setAvailableOnly(e.target.checked);
              setPage(0);
            }}
          />
          Available Only
        </label>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {paginatedBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 col-span-full"
          >
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No books found.</p>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {paginatedBooks.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <BrowseBookCard
                book={book}
                exchangeStatus={exchangeMap[book.id]}
                onRequested={() => {
                  fetchBooks();
                  fetchSentRequests();
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
