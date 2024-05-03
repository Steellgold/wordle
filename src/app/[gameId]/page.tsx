"use client";

import { Component } from "@/lib/components/utils/component";
import { handleAbandon } from "./lib/abandon";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useWindowSize } from 'usehooks-ts'
import ReactConfetti from "react-confetti";
import { WordleLayout } from "@/lib/components/wordle/layout";
import { GAME_RESULT, Game } from "@prisma/client";
import { dayJS } from "@/lib/utils/dayjs/day-js";
import { Alert } from "@/lib/components/ui/alert";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type BoardProps = {
  params: {
    gameId: string;
  };
};

const Page: Component<BoardProps> = ({ params }) => {
  const { width, height } = useWindowSize();

  const [isLoading, setIsLoading] = useState(false);
  
  const [isEnding, setIsEnding] = useState(false);
  const [endingReason, setEndingReason] = useState<GAME_RESULT>("UNKNOWN");

  const [wordFound, setWordFound] = useState(false);
  const [decryptedWord, setWord] = useState<string>();
  const [data, setData] = useState<Game | null>(null);

  const [_, setTimer] = useState<string>(dayJS().toISOString());

  const router = useRouter()

  const [lines, setLines] = useState<[
    { id: number; word: string; correct: boolean; hinted: boolean }[]
  ] | null>(null);

  useEffect(() => {
    const closeGame = async() => {
      const response = await fetch(`/api/party/${params.gameId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: endingReason })
      });

      const data = await response.json();
      if (response.ok) setWord(data.word);
    };

    const interval = setInterval(() => {
      setTimer(dayJS().toISOString());

      if (dayJS().diff(dayJS(data?.createdAt), "minute") === 5 && dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 === 0) {
        setEndingReason("WORDLE_TIMEOUT");
        closeGame()
          .then(() => {
            setIsEnding(true)
            clearInterval(interval);
            router.push("/");
          })
          .catch((error) => console.error("Error closing game", error));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data, params.gameId, endingReason, router]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/party/${params.gameId}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLines(data.lines);
        setIsLoading(false);
      });
  }, [params.gameId]);
  
  if (isLoading || isEnding) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="animate-spin" />
          {isEnding
            ? <p className="text-center">Your party has ended, {
              endingReason === "WORDLE_WIN" ? "you won!"
              : endingReason === "WORDLE_LOSE" ? "you lost!"
              : endingReason === "WORDLE_ABORT" ? "you abandoned the party!"
              : endingReason === "WORDLE_TIMEOUT" ? "the party timed out!"
              : "an error occurred!"
            }</p>
            : <p className="text-center">Your party is loading...</p>
          }
          {isEnding && decryptedWord && (
            <Alert className="w-96">
              <p className="text-center">The word was <strong>{decryptedWord}</strong></p>
            </Alert>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {wordFound && <ReactConfetti width={width} height={height} recycle={false} />}

      <WordleLayout subtitle={
        <Alert className="text-center text-muted-foreground -mt-5">
          <p>Your party has been going on for&nbsp;
          <strong className={cn({
            "text-red-400 animate-pulse":
              dayJS().diff(dayJS(data?.createdAt), "minute") === 5 &&
              dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 === 0
          })}>
            {dayJS().diff(dayJS(data?.createdAt), "minute")} minutes</strong> and&nbsp;
          <strong className={cn({
            "text-red-400 animate-pulse":
              dayJS().diff(dayJS(data?.createdAt), "minute") === 5 &&
              dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 === 0
          })}>
            {dayJS().diff(dayJS(data?.createdAt), "seconds") % 60} seconds</strong>
          </p>
        </Alert>
      }>
        <form onSubmit={async() => {
          setEndingReason("WORDLE_ABORT");
          setIsEnding(true);
          await handleAbandon({ gameId: params.gameId });
        }}>
          <button type="submit" className="bg-red-400">click to Abandon</button>
        </form>
      </WordleLayout>
    </>
  );
};

export default Page;