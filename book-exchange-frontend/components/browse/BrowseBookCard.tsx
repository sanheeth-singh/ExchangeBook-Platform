"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Book } from "@/types/book";
import { BookOpen, Send } from "lucide-react";
import { ExchangeStatus } from "@/types/exchange";

interface Props {
  book: Book;
  exchangeStatus?: ExchangeStatus;
  onRequested: () => void;
  
  
}

export default function BrowseBookCard({ book, onRequested, exchangeStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  const handleRequest = async () => {
    try {
      setLoading(true);
      setMessage(null);

      await api.post("/exchanges/", {
        requested_book_id: book.id,
      });

      setType("success");
      setMessage("Exchange request sent");

      onRequested();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);

      setType("error");

      if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Failed to send request");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const isPending = exchangeStatus === "PENDING";
  const isAccepted = exchangeStatus === "ACCEPTED";
  const isReserved = !book.is_available;

  // const canRequest =
  //   !exchangeStatus ||
  //   exchangeStatus === "REJECTED" ||
  //   exchangeStatus === "CANCELLED";

    const canRequest =
    book.is_available &&
    (!exchangeStatus ||
      exchangeStatus === "REJECTED" ||
      exchangeStatus === "CANCELLED");


    const conditionColors: Record<string, string> = {
    NEW: "bg-green-100 text-green-700",
    LIKE_NEW: "bg-blue-100 text-blue-700",
    GOOD: "bg-emerald-100 text-emerald-700",
    FAIR: "bg-amber-100 text-amber-700",
    POOR: "bg-red-100 text-red-700",
  };
    

    const createdDate = new Date(book.created_at).toLocaleString(undefined,{dateStyle:"medium", timeStyle:"short" });



  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="
      group
      relative
      p-5
      rounded-xl
      bg-white
      border border-gray-200
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      flex flex-col
      justify-between
      aspect-3/4
      max-w-52.5
      "
      >
  

    {/* hover gradient */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
    transition duration-300 bg-linear-to-r from-orange-50 via-amber-50 to-yellow-50 pointer-events-none" />


    {/* TOP SECTION */}
    <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="p-3 bg-orange-100 rounded-lg w-fit"
          >
            <BookOpen className="text-orange-600" size={20} />
          </motion.div> 

          {book?.owner?.username && (
          <div className="bg-orange-300 border-2 border-black px-3 py-1 text-xs font-bold text-gray-700 font-mono shadow-[2px_2px_0px_#000]" title="{book owner}">
            {book.owner.username}
          </div>
          )}
        </div>
      <div>
        <h3 className="font-semibold text-md text-gray-900 leading-snug">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600">
          {book.author}
        </p>
      </div>
      <div className="mt-3 text-xs text-gray-400">
          Added on {createdDate}
        </div>
        <span
          className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-md font-medium ${conditionColors[book.condition]}`}>
                  {book.condition.replace("_", " ")}
        </span>
    </div>
    {/* book spine */}
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-600 opacity-50 rounded-l-lg" />
                


    {/* MIDDLE SECTION */}
    {/* {book?.owner?.username && (
      <div className="flex items-center gap-2 relative z-10">

        <div className="flex items-center gap-1 border-2 border-black bg-yellow-300 px-2 py-1 shadow-[2px_2px_0px_#000] text-xs font-bold">

          <User size={14} className="text-black" />

          <span className="text-black tracking-wide">
            {book.owner.username}
          </span>

        </div>

      </div>
    )} */}

              

    {/* BOTTOM ACTION AREA */}
    <div className="relative z-10 flex flex-col gap-2">

      {isPending && (
        <button
          disabled
          className="w-full px-3 py-1.5 text-xs bg-gray-400 text-white rounded-md"
        >
          Request Sent
        </button>
      )}

      {isAccepted && (
        <span className="text-xs text-green-600 font-medium text-center">
          Exchange Accepted
        </span>
      )}

      {isReserved && (
        <span className="text-xs text-yellow-600 font-medium text-center">
          Reserved
        </span>
      )}

      {canRequest && (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleRequest}
          disabled={loading}
          className="
          flex items-center justify-center gap-1
          px-3 py-1.5
          text-xs
          rounded-md
          bg-orange-500
          text-white
          hover:bg-orange-600
          shadow-sm
          transition
          disabled:opacity-60
          "
        >
          <Send size={14} />
          {loading ? "Sending..." : "Request"}
          
          
        </motion.button>
      )}

    </div>


    {/* MESSAGE */}
    {message && (
      <div
        className={`text-xs px-2 py-1 rounded-md relative z-10 ${
          type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message}
      </div>
    )}

    </motion.div>
);
}