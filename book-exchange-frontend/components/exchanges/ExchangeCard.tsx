"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Exchange } from "@/types/exchange";
import { Book } from "@/types/book";
import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";

import ExchangeChat from "../chat/ExchangeChat";

import { hasUnread } from "@/utils/ChatNotifications";
import { motion } from "framer-motion";

interface Props {
  exchange: Exchange;
  mode: "sent" | "received";
  onAction: () => void;
}

export default function ExchangeCard({ exchange, mode, onAction }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  const [showChat, setShowChat] = useState(false);
  const [hasUnreadMsg, setHasUnreadMsg] = useState(false);

  const [confirmComplete, setConfirmComplete] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get<Book>(`/books/${exchange.requested_book_id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
  }, [exchange.requested_book_id]);


  const handleAction = async (endpoint: string, successMsg: string) => {
    try {
      setLoading(true);
      setMessage(null);

      await api.patch(endpoint);

      setType("success");
      setMessage(successMsg);

      onAction();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);

      setType("error");

      if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Action failed");
      }
    } finally {
      setLoading(false);
    }
    
      };
      useEffect(() => {
      if (message) {
        const timer = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);

  const [confirmChecked, setConfirmChecked] = useState(false);



  // unread chat notification
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await api.get(`/chat/${exchange.id}`);

        const messages = res.data;

        const lastMessage = messages[messages.length - 1];

        if (lastMessage) {
          const unread = hasUnread(exchange.id, lastMessage.created_at);
          setHasUnreadMsg(unread);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (exchange.status === "ACCEPTED") {
      checkUnread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange.id]);

// exchange 


  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-200 text-yellow-700",
    WAITING_CONFIRMATION: "bg-gray-200 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-200 text-gray-700",
  }[exchange.status];


  const time = new Date(
    exchange.status === "PENDING" ? exchange.created_at : exchange.updated_at,
  ).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const labelMap: Record<string, string> = {
    PENDING: "Requested",
    ACCEPTED: "Accepted",
    WAITING_CONFIRMATION: "Waiting",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };

  // 72 hours report logic 
  const canReport =
  exchange.first_confirmed_at &&
  Date.now() - new Date(exchange.first_confirmed_at).getTime() > 72 * 60 * 60 * 1000;

  const isConfirmedByMe =
    mode === "sent"
      ? exchange.requester_confirmed
      : exchange.owner_confirmed;

  const isConfirmedByOther =
    mode === "sent"
      ? exchange.owner_confirmed
      : exchange.requester_confirmed;


  return (
    <>
      <div
        className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition 
       p-4 flex flex-col justify-between aspect-3/4 max-w-55"
      >
        {/* BOOK INFO */}
        <div className="space-y-3">
          <div>
            <h3 className="text-md font-semibold text-gray-800 leading-snug">
              {book?.title ?? "Loading..."}
            </h3>

            <p className="text-sm text-gray-500">{book?.author}</p>
          </div>

          {(exchange.status === "ACCEPTED"
           || exchange.status === "COMPLETED" 
           || exchange.status === "WAITING_CONFIRMATION") && (
            <button
              onClick={() => setShowChat(true)}
              className="relative flex items-center gap-1 px-3 py-1.5
                      text-sm rounded-md bg-indigo-500 text-white
                      hover:bg-indigo-600 transition"
            >
              <MessageCircle size={14} />
              Chat
              {hasUnreadMsg && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
          )}

          <p className="text-xs text-gray-500">
            {labelMap[exchange.status]} • {time}
          </p>

          {mode === "sent" && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Requested from
              <span className="font-medium flex items-center gap-1">
                {exchange.owner_name}
                <ArrowBigUp className="text-red-500" size={14} />
              </span>
            </p>
          )}

          {mode === "received" && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Request from
              <span className="font-medium flex items-center gap-1">
                {exchange.requester_name}
                <ArrowBigDown className="text-blue-500" size={14} />
              </span>
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="space-y-3">
          <span
            className={`block text-center text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}
          >
            {exchange.status}
          </span>


          {exchange.status === "WAITING_CONFIRMATION" && (
            <div className="p-3 rounded-lg border border-yellow-400 bg-yellow-50">
              <p className="text-sm font-semibold text-yellow-800">
                Action Required
              </p>

              {!isConfirmedByMe ? (
                <p className="text-sm text-yellow-700 mt-1">
                  Please confirm completion.
                </p>
              ) : (
                <p className="text-sm text-yellow-700 mt-1">
                  Waiting for the other user to confirm.
                </p>
              )}
            </div>
          )}

          {exchange.status === "WAITING_CONFIRMATION" && (
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                Exchange Confirmation In Progress
              </p>

              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>
                  Your Status:{" "}
                  <span className={isConfirmedByMe ? "text-green-600" : "text-yellow-600"}>
                    {isConfirmedByMe ? "Confirmed" : "Pending"}
                  </span>
                </p>

                <p>
                  Other User:{" "}
                  <span className={isConfirmedByOther ? "text-green-600" : "text-yellow-600"}>
                    {isConfirmedByOther ? "Confirmed" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          )}



          <div className="flex flex-col gap-2">
            {mode === "sent" && exchange.status === "PENDING" && (
              <button
                disabled={loading}
                onClick={() =>
                  handleAction(
                    `/exchanges/${exchange.id}/cancel`,
                    "Request cancelled",
                  )
                }
                className="w-full py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            {mode === "received" && exchange.status === "PENDING" && (
              <>
                <button
                  disabled={loading}
                  onClick={() =>
                    handleAction(
                      `/exchanges/${exchange.id}/accept`,
                      "Exchange accepted",
                    )
                  }
                  className="w-full py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  Accept
                </button>

                <button
                  disabled={loading}
                  onClick={() =>
                    handleAction(
                      `/exchanges/${exchange.id}/reject`,
                      "Exchange rejected",
                    )
                  }
                  className="w-full py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

          </div>

          {(exchange.status === "ACCEPTED" || exchange.status=== "WAITING_CONFIRMATION") && (
            <>
              <button
                disabled={loading}
                onClick={() => setConfirmComplete(true)}
                className="w-full py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Mark as Completed
              </button>
            </>
          )}

          {/* 72 hour report method */}
          {exchange.status === "WAITING_CONFIRMATION" && canReport && (
            <button className="w-full py-1 text-sm bg-yellow-500 text-white rounded">
              Report Issue
            </button>
          )}

        </div>

        {message && (
          <div
            className={`text-xs px-2 py-1 rounded-md ${
              type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {showChat && (
        <div
          className="
          fixed inset-0
          z-50
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
        "
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
      relative
      w-[92%] max-w-2xl
      h-150

      bg-white
      rounded-2xl

      border-2 border-black
      shadow-[8px_8px_0px_black]

      flex flex-col
      overflow-hidden
      "
          >
            {/* Header */}
            <div
              className="
        flex items-center justify-between
        px-5 py-3
        border-b-2 border-black
        bg-linear-to-r from-indigo-500 to-purple-500
        text-white
      "
            >
              <div className="flex items-center gap-2">
                <div
                  className="
            w-2.5 h-2.5
            rounded-full
            bg-green-400
            animate-pulse
            "
                />

                <span className="font-semibold text-sm">
                  Chat:{book?.title}
                </span>
              </div>

              <button
                onClick={() => setShowChat(false)}
                className="
          px-3 py-1
          text-xs
          rounded-md
          bg-white text-black
          border border-black
          hover:translate-x-px hover:translate-y2px
          transition
          "
              >
                Close
              </button>
            </div>

            {/* Chat Area */}
            <div
              className="
        flex-1
        bg-linear-to-b
        from-white
        to-gray-300
        p-4
        overflow-hidden
      "
            >
              <ExchangeChat
                exchangeId={exchange.id}
                currentUserId={
                  mode === "sent" ? exchange.requester_id : exchange.owner_id
                }
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* conformation of exchange completion */}
      {confirmComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          
          <div className="w-[95%] max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">

            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Exchange Completion
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Final step before closing this exchange
              </p>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700 font-medium">
                This action cannot be undone
              </p>
              <p className="text-sm text-red-600 mt-1">
                Only confirm if you have received the book.
              </p>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                You are about to mark this exchange as completed from your side.
              </p>
              <p>
                It will be fully completed only after both users confirm.
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1"
              />
              <span>
                I confirm that I have received the book and completed this exchange.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmComplete(false);
                  setConfirmChecked(false); // reset
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                disabled={!confirmChecked || loading}
                onClick={() => {
                  setConfirmComplete(false);   // ✅ CLOSE MODAL FIRST
                  setConfirmChecked(false);    // ✅ RESET STATE

                  handleAction(
                    `/exchanges/${exchange.id}/complete`,
                    "Marked as completed"
                  );
                }}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

    </>

  );
}
