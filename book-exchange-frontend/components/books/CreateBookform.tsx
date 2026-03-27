"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { BookOpen, User, Star, Loader2, Sparkles } from "lucide-react";

interface Props {
  onBookCreated: () => void;
}

export default function CreateBookForm({ onBookCreated }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert("Title and Author are required");
      return;
    }

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative overflow-hidden space-y-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/40 dark:from-orange-500/10 dark:to-amber-500/5 backdrop-blur-xl border border-orange-200/60 dark:border-orange-500/20 shadow-sm"
    >
      {/* Decorative ambient glow inside the form */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Form Header */}
      <div className="relative z-10 mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          Book Details <Sparkles size={16} className="text-orange-500" />
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter the information exactly as it appears on the cover.
        </p>
      </div>

      {/* Title */}
      <div className="relative z-10">
        <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Book Title
        </label>
        <div className="flex items-center mt-1.5 rounded-xl border border-orange-200/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all shadow-inner">
          <BookOpen size={18} className="text-orange-500 shrink-0 mr-3" />
          <input
            required
            type="text"
            placeholder="e.g. Atomic Habits"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Author */}
      <div className="relative z-10">
        <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Author
        </label>
        <div className="flex items-center mt-1.5 rounded-xl border border-orange-200/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all shadow-inner">
          <User size={18} className="text-orange-500 shrink-0 mr-3" />
          <input
            required
            type="text"
            placeholder="e.g. James Clear"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Condition */}
      <div className="relative z-10">
        <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Book Condition
        </label>
        <div className="flex items-center mt-1.5 rounded-xl border border-orange-200/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all shadow-inner">
          <Star size={18} className="text-orange-500 shrink-0 mr-3" />
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-white disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="NEW" className="dark:bg-zinc-800">NEW</option>
            <option value="LIKE_NEW" className="dark:bg-zinc-800">LIKE NEW</option>
            <option value="GOOD" className="dark:bg-zinc-800">GOOD</option>
            <option value="FAIR" className="dark:bg-zinc-800">FAIR</option>
            <option value="POOR" className="dark:bg-zinc-800">POOR</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="relative z-10 w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold 
        
        transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Adding Book...
          </>
        ) : (
          "Publish to Library"
        )}
      </motion.button>
    </motion.form>
  );
}