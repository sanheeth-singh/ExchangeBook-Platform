"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Library, 
  ChevronDown, 
  Globe2, 
  Sparkles,
  ShieldCheck,
  User
} from "lucide-react";

import CreateBookForm from "./CreateBookform";
import MyBooksList from "./MyBooksList";
import AllBooksList from "./AllBooksList";

interface Props {
  userId: string;
  role: "USER" | "ADMIN";
}

export default function BooksTab({ role }: Props) {
  // State for collapsible panels
  const [showCreate, setShowCreate] = useState(false);
  const [myBooksOpen, setMyBooksOpen] = useState(true);
  const [allBooksOpen, setAllBooksOpen] = useState(true);

  const handleBookCreated = () => {
    setShowCreate(false);
    // Optionally trigger a refresh in your lists here
  };

  const isAdmin = role === "ADMIN";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* --- HEADER BANNER --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
              <BookOpen className="text-orange-600 dark:text-orange-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Library Workspace <Sparkles className="text-orange-400" size={20} />
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Manage your personal inventory and explore community additions.
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            {isAdmin ? (
              <ShieldCheck size={16} className="text-purple-500" />
            ) : (
              <User size={16} className="text-blue-500" />
            )}
            <span className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 uppercase">
              {role}
            </span>
          </div>
        </div>
      </motion.div>

      {/* --- ADD NEW BOOK ACTION --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center justify-between w-full p-5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Plus size={18} />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              Add a New Book
            </span>
          </div>
          <motion.div animate={{ rotate: showCreate ? 45 : 0 }}>
            <Plus size={20} className="text-zinc-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-200 dark:border-zinc-800"
            >
              <div className="p-6">
                <CreateBookForm onBookCreated={handleBookCreated} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- MY BOOKS (COLLAPSIBLE) --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setMyBooksOpen(!myBooksOpen)}
          className="flex items-center justify-between w-full p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Library size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              My Books
            </h2>
          </div>
          <motion.div animate={{ rotate: myBooksOpen ? 180 : 0 }}>
            <ChevronDown size={20} className="text-zinc-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {myBooksOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="p-6 pt-0">
                <MyBooksList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- COMMUNITY BOOKS (COLLAPSIBLE) --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setAllBooksOpen(!allBooksOpen)}
          className="flex items-center justify-between w-full p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Globe2 size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Community Books
            </h2>
          </div>
          <motion.div animate={{ rotate: allBooksOpen ? 180 : 0 }}>
            <ChevronDown size={20} className="text-zinc-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {allBooksOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="p-6 pt-0">
                <AllBooksList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}