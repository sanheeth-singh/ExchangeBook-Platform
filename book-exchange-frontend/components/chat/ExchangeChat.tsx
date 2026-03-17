"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

import { ChatMessage, ChatSocketMessage } from "@/types/chat";

import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";

import { setLastRead } from "@/utils/ChatNotifications";


interface Props {
  exchangeId: string;
  currentUserId: string;
}

export default function ExchangeChat({
  exchangeId,
  currentUserId,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000";

  // Load chat history
  const loadHistory = async () => {
    try {
      const res = await api.get<ChatMessage[]>(`/chat/${exchangeId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  // Connect WebSocket
  const connectSocket = () => {
    const token = localStorage.getItem("token");

    const ws = new WebSocket(
      `${WS_URL}/ws/chat/${exchangeId}?token=${token}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data: ChatSocketMessage = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          sender_id: data.sender_id,
          message: data.message,
          created_at: data.created_at,
        },
      ]);
    };

    ws.onclose = () => {
      setConnected(false);
    };
  };

  const sendMessage = (message: string) => {
    if (!socketRef.current) return;

    socketRef.current.send(message);
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => { 
    loadHistory();
    connectSocket();
    setLastRead(exchangeId);

    return () => {
      socketRef.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-125 border rounded-xl p-4 bg-gray-200 shadow-sm">

      {/* header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">Exchange Chat</h3>

        <span
          className={`text-xs ${
            connected ? "text-green-600" : "text-gray-800"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, i) => (
          <ChatMessageBubble
            key={i}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
