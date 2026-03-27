"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ExchangeSentList from "../exchanges/ExchangeSentList";
import ExchangeReceivedList from "../exchanges/ExchangeReceivedList";

type TabType =
  | "sent"
  | "received"
  | "accepted"
  | "completed"
  | "waiting"
  | "rejected"
  | "cancelled";

export default function ExchangesTab() {
  const [tab, setTab] = useState<TabType>("sent");

  const tabs: { id: TabType; label: string }[] = [
    { id: "sent", label: "Sent" },
    { id: "received", label: "Received" },
    { id: "accepted", label: "Accepted" },    
    { id: "waiting", label: "Waiting"},
    { id: "completed", label: "Completed"},
    { id: "rejected", label: "Rejected" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-8">
      {/* Floating Island Tabs */}
      <div className="flex justify-center">
        <div
          className="flex flex-wrap gap-2 px-3 py-2 
  bg-white/70 backdrop-blur-xl 
  rounded-full border border-gray-200 
  shadow-lg"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative px-5 py-2 text-sm font-medium rounded-full transition-all"
            >
              {tab === t.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span
                className={`relative z-10 ${
                  tab === t.id ? "text-white" : "text-gray-600"
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "sent" && <ExchangeSentList />}
        {tab === "received" && <ExchangeReceivedList />}

        {tab === "accepted" && (
          <>
            <ExchangeSentList status="ACCEPTED" />       
            <br />
            <ExchangeReceivedList status="ACCEPTED" />
          </>
        )}

        {tab === "rejected" && (
          <>
            <ExchangeSentList status="REJECTED" />
            <br />
            <ExchangeReceivedList status="REJECTED" />
          </>
        )}

        {tab === "cancelled" && (
          <>
            <ExchangeSentList status="CANCELLED" />
            <br />
            <ExchangeReceivedList status="CANCELLED" />
          </>
        )}

        {tab === "waiting" &&(
          <>
          <ExchangeSentList status="WAITING_CONFIRMATION"/>
          <br />
          <ExchangeReceivedList status="WAITING_CONFIRMATION"/>
          </>
        )}

        {tab === "completed" && (
          <>
            <span>Sent</span>
            <ExchangeSentList status="COMPLETED"/>
            <br />
            <span>Received</span>
            <ExchangeReceivedList status="COMPLETED"/>
          </>          
        )}
        
      </motion.div>
    </div>
  );
}
