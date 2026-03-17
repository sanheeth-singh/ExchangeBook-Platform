"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { BookOpen, User, Star } from "lucide-react";

interface Props {
  onBookCreated: () => void;
}

export default function CreateBookForm({ onBookCreated }: Props) {

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [condition, setCondition] = useState("NEW");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert("Title and Author are required");
      return;
    }

    try {

      await api.post("/books/", {
        title,
        author,
        condition,
      });

      setTitle("");
      setAuthor("");
      setCondition("NEW");

      onBookCreated();

    } catch (error) {
      console.error(error);
      alert("Failed to add book");
    }
  };

  return (

    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 p-6 rounded-2xl bg-blue-50/60 backdrop-blur border border-blue-100 shadow-sm"
    >

      {/* Title */}
      <div>

        <label className="text-sm font-medium text-blue-900">
          Book Title
        </label>

        <div className="flex items-center mt-1 rounded-lg border border-blue-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400 transition">

          <BookOpen size={16} className="text-cyan-600 mr-2" />

          <input
            required
            type="text"
            placeholder="Atomic Habits"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full outline-none text-sm text-gray-800 placeholder-gray-400"
          />

        </div>

      </div>

      {/* Author */}
      <div>

        <label className="text-sm font-medium text-blue-900">
          Author
        </label>

        <div className="flex items-center mt-1 rounded-lg border border-blue-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400 transition">

          <User size={16} className="text-cyan-600 mr-2" />

          <input
            required
            type="text"
            placeholder="James Clear"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full outline-none text-sm text-gray-800 placeholder-gray-400"
          />

        </div>

      </div>

      {/* Condition */}
      <div>

        <label className="text-sm font-medium text-blue-900">
          Book Condition
        </label>

        <div className="flex items-center mt-1 rounded-lg border border-blue-200 bg-white px-3 py-2">

          <Star size={16} className="text-cyan-600 mr-2" />

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full outline-none text-sm text-gray-800 bg-transparent"
          >
            <option value="NEW">NEW</option>
            <option value="LIKE_NEW">LIKE NEW</option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
          </select>

        </div>

      </div>

      {/* Submit */}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        type="submit"
        className="w-full py-2.5 rounded-lg bg-cyan-500 text-white font-medium shadow-sm hover:bg-cyan-600 transition"
      >
        Add Book
      </motion.button>

    </motion.form>

  );
}
