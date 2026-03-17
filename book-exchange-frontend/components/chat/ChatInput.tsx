"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/utils/ChatNotifications"; 

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 border-t pt-3 text-gray-800">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none border-gray-700 focus:ring-1 focus:ring-orange-500"
      />

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
          "bg-orange-500 text-white hover:bg-orange-600",
          "disabled:bg-gray-300 disabled:cursor-not-allowed" // These classes win when disabled
        )}
      >
        <Send size={14} />
      </button>
    </div>
  );
}