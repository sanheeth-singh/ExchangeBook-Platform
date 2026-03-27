"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Exchange } from "@/types/exchange";
import ExchangeCard from "./ExchangeCard";

type Props = {
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED" | "WAITING_CONFIRMATION";
};

export default function ExchangeSentList({ status = "PENDING" }: Props) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]); 
  const fetchSent = async () => { 
    const res = await api.get<Exchange[]>("/exchanges/sent/?limit=100"); 
    const filtered = res.data.filter((ex) => ex.status === status); 
    setExchanges(filtered); }; 
    
    useEffect(() => 

      { fetchSent(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [status]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 top-2">

      {exchanges.length === 0 && (
        <div className="col-span-4 text-center text-gray-500 py-10">
          No exchanges found.
        </div>
      )}

      {exchanges.map((ex) => (
        <ExchangeCard
          key={ex.id}
          exchange={ex}
          mode="sent"
          onAction={fetchSent}
        />
      ))}

    </div>
  );
}
