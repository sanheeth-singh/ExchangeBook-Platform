"use client";

import { motion } from "framer-motion";
import { Book } from "@/types/book";
import api from "@/lib/api";
import { useState } from "react";
import EditBookModal from "./EditbookModal";
import Modal from "../ui/Modals";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

interface BookCardProps {
  book: Book;
  currentUserId: string;
  role: "USER" | "ADMIN";
  onRefresh: () => void;
}

export default function BookCard({
  book,
  currentUserId,
  role,
  onRefresh,
}: BookCardProps) {
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const isOwner = book.owner_id === currentUserId;
  const canDelete = isOwner || role === "ADMIN";

  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (role === "ADMIN" && !isOwner) {
        await api.delete(`/admin/books/${book.id}`);
      } else {
        await api.delete(`/books/${book.id}`);
      }

      setShowDelete(false);
      onRefresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);

      const message = error.response?.data?.detail || "Failed to delete book";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    id: string,
    data: { title: string; author: string; condition: string },
  ) => {
    try {
      await api.put(`/books/${id}`, data);
      setShowEdit(false);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const conditionColors: Record<string, string> = {
    NEW: "bg-green-100 text-green-700",
    LIKE_NEW: "bg-blue-100 text-blue-700",
    GOOD: "bg-emerald-100 text-emerald-700",
    FAIR: "bg-amber-100 text-amber-700",
    POOR: "bg-red-100 text-red-700",
  };

  const createdDate = new Date(book.created_at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.25 }}
        className="
              group
              relative
              p-4
              rounded-lg
              bg-white/90
              backdrop-blur
              border border-gray-200
              shadow-sm
              hover:shadow-2xl
              transition-all
              duration-300
              flex flex-col
              justify-between
              aspect-3/4
              max-w-50
                            "
      >
        {/* Gradient Hover Glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 pointer-events-none" />

        {/* Book Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-300 rounded-l-lg opacity-70" />

        {/* Book Info */}
        <div className="flex flex-col gap-3 relative z-10">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="p-3 bg-indigo-100 rounded-lg w-fit"
          >
            <BookOpen className="text-indigo-600" size={18} />
          </motion.div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {book.title}
            </h3>

            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-600">{createdDate}</p>

            <span
              className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-md font-medium ${conditionColors[book.condition]}`}
            >
              {book.condition.replace("_", " ")}
            </span>
          </div>
        </div>
{/* Availability Badge */}
<div className="absolute top-3 right-3 z-20">
  <span
    className={`text-xs font-medium px-2 py-1 rounded-md shadow-sm
      ${
        book.is_available
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
  >
    {book.is_available ? "Available" : "Unavailable"}
  </span>
</div>



        
        {/* Action Buttons */}
        <div
          className="
    absolute bottom-3 right-3
    flex gap-2
    opacity-0
    group-hover:opacity-100
    transition
  "
        >
          {isOwner && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-md bg-white shadow-md hover:bg-gray-100 transition"
              onClick={() => setShowEdit(true)}
            >
              <Pencil size={16} className="text-gray-700" />
            </motion.button>
          )}

          {canDelete && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={loading}
              className="p-2 rounded-md bg-red-500 shadow-md hover:bg-red-600 transition"
              onClick={() => {
                setErrorMessage("");
                setShowDelete(true);
              }}
            >
              <Trash2 size={16} className="text-white" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEdit && (
        <EditBookModal
          book={book}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)}>
        <h2 className="text-lg text-black font-semibold mb-2">Delete Book</h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{book.title}</strong>?
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDelete(false)}
            className="px-3 py-1.5 border rounded-md text-gray-800 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
