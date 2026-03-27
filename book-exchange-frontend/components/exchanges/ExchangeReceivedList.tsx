"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Exchange } from "@/types/exchange";
import ExchangeCard from "./ExchangeCard";

type Props = {
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED" | "WAITING_CONFIRMATION";
};

export default function ExchangeReceivedList({ status = "PENDING" }: Props) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  const fetchReceived = async () => {
    const res = await api.get<Exchange[]>("/exchanges/received?limit=100");

    const filtered = res.data.filter((ex) => ex.status === status);

    setExchanges(filtered);
  };

  useEffect(() => {
    fetchReceived();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);


  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6
">

      {exchanges.length === 0 && (
        <div className="col-span-4 text-center text-gray-500 py-10">
          
        </div>
      )}

      {exchanges.map((ex) => (
        <ExchangeCard
          key={ex.id}
          exchange={ex}
          mode="received"
          onAction={fetchReceived}
        />
      ))}

    </div>
  );
}
