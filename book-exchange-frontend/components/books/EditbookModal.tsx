"use client";

import { useState } from "react";
import { Book } from "@/types/book";
import Modal from "../ui/Modals";
import { BookOpen, User, Save, X } from "lucide-react";

interface Props {
  book: Book;
  onClose: () => void;
  onSave: (
    id: string,
    data: { title: string; author: string; condition: string }
  ) => void;
}

export default function EditBookModal({ book, onClose, onSave }: Props) {

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [condition, setCondition] = useState(book.condition);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert("Fields cannot be empty");
      return;
    }

    onSave(book.id, { title, author, condition });
  };

  return (

    <Modal isOpen={true} onClose={onClose}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen size={18} className="text-orange-600 hover:rotate-6"/>
          Edit Book
        </h2>

        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-300 transition"
        >
          <X size={18}/>
        </button>

      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>

          <label className="text-sm text-gray-600 mb-1 block">
            Title
          </label>

          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">

            <BookOpen size={16} className="text-gray-400 mr-2"/>

            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full outline-none text-sm text-gray-800 bg-transparent"
            />

          </div>

        </div>

        {/* Author */}
        <div>

          <label className="text-sm text-gray-600 mb-1 block">
            Author
          </label>

          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">

            <User size={16} className="text-gray-400 mr-2"/>

            <input
              value={author}
              onChange={(e)=>setAuthor(e.target.value)}
              className="w-full outline-none text-sm text-gray-800 bg-transparent"
            />

          </div>

        </div>

        {/* Condition */}
        <div>

          <label className="text-sm text-gray-600 mb-1 block">
            Condition
          </label>

          <select
            value={condition}
            onChange={(e)=>setCondition(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            <option value="NEW">NEW</option>
            <option value="LIKE_NEW">LIKE NEW</option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
          </select>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-500 rounded-md hover:bg-gray-200 text-gray-800 transition"
          >
            <X size={16}/>
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition shadow-sm"
          >
            <Save size={16}/>
            Save
          </button>

        </div>

      </form>

    </Modal>

  );
}
