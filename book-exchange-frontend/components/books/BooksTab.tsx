"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Plus, Library } from "lucide-react";


import CreateBookForm from "./CreateBookform";
import MyBooksList from "./MyBooksList";
import AllBooksList from "./AllBooksList";

interface Props {
  userId: string;
  role: "USER" | "ADMIN";
}


export default function BooksTab({ role }: Props) {

  const [showCreate, setShowCreate] = useState(false);

  const handleBookCreated = () => {
    setShowCreate(false);
  };

  const roleStyles =
    role === "ADMIN"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-cyan-100 text-cyan-800 border-cyan-200";

  return (

    <div >

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 max-w-6xl mx-auto"
      >

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm"
        >

          <div className="flex items-center gap-4">

            <div className="p-3 rounded-xl bg-cyan-100">
              <BookOpen className="text-cyan-600" />
            </div>

            <div>

              <h1 className="text-2xl font-semibold text-gray-900">
                Books Library
              </h1>

              <p className="text-sm text-gray-600">
                Manage your books and explore books shared by students
              </p>

            </div>

          </div>

          <div
            className={`px-3 py-1 text-xs font-medium rounded-full border ${roleStyles}`}
          >
            {role}
          </div>

        </motion.div>

        {/* ADD BOOK PANEL */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm overflow-hidden"
        >

          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 w-full p-5 text-left font-medium text-gray-800 hover:bg-blue-50 transition"
          >

            <div className="p-2 rounded-lg bg-cyan-100">
              <Plus size={16} className="text-cyan-600" />
            </div>

            Add a new book

          </button>

          {showCreate && (

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-6 pt-0"
            >
              <CreateBookForm onBookCreated={handleBookCreated} />
            </motion.div>

          )}

        </motion.div>

        {/* MY BOOKS */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm"
        >

          <div className="flex items-center gap-2 mb-5">

            <Library size={18} className="text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              My Books
            </h2>

          </div>

          <MyBooksList />

        </motion.div>

        {/* ALL BOOKS */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm"
        >

          <div className="flex items-center gap-2 mb-5">

            <BookOpen size={18} className="text-indigo-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              Community Books
            </h2>

          </div>

          <AllBooksList />

        </motion.div>

      </motion.div>

    </div>

  );
}
