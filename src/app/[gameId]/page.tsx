"use client";

import { Component } from "@/lib/components/utils/component";
import { handleAbandon } from "./lib/abandon";
import { useState } from "react";

type BoardProps = {
  params: {
    gameId: string;
  };
};

const Page: Component<BoardProps> = ({ params }) => {
  const [isLive, setIsLive] = useState(true);

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