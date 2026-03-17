export const getLastRead = (exchangeId: string) => {
  return localStorage.getItem(`chat_last_read_${exchangeId}`);
};

export const setLastRead = (exchangeId: string) => {
  localStorage.setItem(
    `chat_last_read_${exchangeId}`,
    new Date().toISOString()
  );
};

export const hasUnread = (
  exchangeId: string,
  lastMessageTime?: string
) => {
  if (!lastMessageTime) return false;

  const lastRead = getLastRead(exchangeId);

  if (!lastRead) return true;

  return new Date(lastMessageTime) > new Date(lastRead);
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

