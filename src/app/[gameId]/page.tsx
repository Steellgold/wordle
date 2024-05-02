"use client";

import { Component } from "@/lib/components/utils/component";
import { handleAbandon } from "./lib/abandon";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type BoardProps = {
  params: {
    gameId: string;
  };
};

const Page: Component<BoardProps> = ({ params }) => {
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/party/${params.gameId}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLive(data.party.isLive);
        setIsLoading(false);
      });
  }, [params.gameId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-center">Your party is starting...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Board</h1>
      <p>Party ID: {params.gameId}</p>
      <p>Is live: {isLive ? "Yes" : "No"}</p>

      <form action={async() => {
        await handleAbandon({ gameId: params.gameId })
          .then(() => setIsLive(false));
      }}>
        <button type="submit" className="bg-red-400">click to Abandon</button>
      </form>
    </div>
  );
};

export default Page;