"use client";

import { ChatMessage } from "@/types/chat";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for cleaner class management
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  message: ChatMessage;
  currentUserId: string;
}

export default function ChatMessageBubble({ message, currentUserId }: Props) {
  const isMe = message.sender_id === currentUserId;

  const time = message.created_at && new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className={cn("flex w-full mb-6 px-2 group", isMe ? "justify-end" : "justify-start")}>
      
      {/* Container for Bubble + Actions */}
      <div className={cn("relative flex items-center max-w-[85%] md:max-w-[70%]", isMe ? "flex-row-reverse" : "flex-row")}>
        
        {/* Bubble Body */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl border-2 border-black",
            // Static, confident neo-brutalist shadow (removed the hover-press effect)
            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            isMe 
              ? "bg-[#ff6b00] text-white rounded-tr-none" 
              : "bg-white text-black rounded-tl-none"
          )}
        >
          <div className="flex flex-col gap-y-1">
            {/* Added word-breaking and whitespace handling */}
            <p className="text-[15px] leading-relaxed font-medium wrap-break-word whitespace-pre-wrap">
              {message.message}
            </p>
            
            {time && (
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider self-end mt-1",
                isMe ? "text-orange-200" : "text-gray-500" // Slightly darkened gray for better contrast
              )}>
                {time}
              </span>
            )}
          </div>

          {/* Refined Neo-brutalist Tail */}
          <div className={cn(
            "absolute -top-0.5 w-3 h-4 border-t-2 border-black",
            isMe 
              ? "-right-2.5 border-r-2 bg-[#ff6b00] rounded-tr-md skew-x-20" 
              : "-left-2.5 border-l-2 bg-white rounded-tl-md -skew-x-20"
          )} />
        </div>

        {/* Hidden Message Actions (Reveals on Hover) */}
        <div className={cn(
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex gap-2 mx-4",
          isMe ? "flex-row-reverse" : "flex-row"
        )}>
           {/* Placeholder for action buttons (e.g., Lucide icons) */}
           <button className="text-gray-400 hover:text-black transition-colors" aria-label="React">
             ☺
           </button>
           <button className="text-gray-400 hover:text-black transition-colors" aria-label="Reply">
             ↵
           </button>
        </div>

      </div>
    </div>
  );
}