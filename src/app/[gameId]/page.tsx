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
import { Case } from "./lib/board";
import { useCurrentParty } from "@/lib/store/current.store";
import { Button } from "@/lib/components/ui/button";
import { normalizeText } from "@/lib/components/wordle/utils/wordle.utils";
import { z } from "zod";
import { Line } from "@/lib/types/wordle.type";

type BoardProps = {
  params: {
    gameId: string;
  };
};

const Page: Component<BoardProps> = ({ params }) => {
  const { width, height } = useWindowSize();

  const [isLoading, setIsLoading] = useState(false);
  
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [endingReason, setEndingReason] = useState<GAME_RESULT>("UNKNOWN");

  const [wordFound, setWordFound] = useState(false);
  const [decryptedWord, setWord] = useState<string>();
  const [data, setData] = useState<Game | null>(null);

  const {
    isLocked, setLocked,
    incrLine, decrLine, currentLineIndex,
    addLetter, removeLetter,
    lines, init, setLine,
    clear
  } = useCurrentParty();

  const [_, setTimer] = useState<string>(dayJS().toISOString());

  const router = useRouter()

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/party/${params.gameId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data");
        setData(data);
        init(data.lines);
        setIsLoading(false);
        setIsReadOnly(data.result !== "UNKNOWN");
      });
  }, [params.gameId, init]);

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

    if (!isReadOnly) {
      const interval = setInterval(() => {
        setTimer(dayJS().toISOString());

        if (dayJS().diff(dayJS(data?.createdAt), "minute") >= 5 && dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 >= 0) {
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
    }
  }, [data, params.gameId, endingReason, router, isReadOnly]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      alert("Enter key pressed");
    }
  };

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key.length === 1) {
        console.log("Key pressed", event.key);
        if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(normalizeText(event.key))) {
          console.log("Key pressed", event.key, normalizeText(event.key));
          addLetter(normalizeText(event.key));
        } else {
          console.log("Key pressed but not alphabet", event.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keypress", onKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [addLetter]);
  
  if (isLoading || isEnding) {
    return (
      <>
        {wordFound && <ReactConfetti width={width} height={height} recycle={false} />}
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="animate-spin" />
            {isEnding
              ? <p className="text-center">Your party has ended, {
                endingReason === "WORDLE_WIN" ? "you won 🎉!"
                : endingReason === "WORDLE_LOSE" ? "you lost!"
                : endingReason === "WORDLE_ABORT" ? "you abandoned the party!"
                : endingReason === "WORDLE_TIMEOUT" ? "the party timed out!"
                : "an error occurred!"
              }</p>
              : <p className="text-center">Your party is loading...</p>
            }
            {isEnding && decryptedWord && !wordFound && (
              <Alert className="w-96">
                <p className="text-center">The word was <strong>{decryptedWord}</strong></p>
              </Alert>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <WordleLayout subtitle={
        <Alert className="text-center text-muted-foreground -mt-5">
          <p>
            {isReadOnly
              ? <>This party is over, it lasted for&nbsp;</>
              : <>Your party has been going on for&nbsp;</>
            }

            {!isReadOnly
              ? (
                <>
                  <strong className={cn({
                    "text-red-400 animate-pulse":
                      dayJS().diff(dayJS(data?.createdAt), "minute") >= 5 &&
                      dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 >= 0
                  })}>
                    {dayJS().diff(dayJS(data?.createdAt), "minute")} minutes</strong> and&nbsp;
                  <strong className={cn({
                    "text-red-400 animate-pulse":
                      dayJS().diff(dayJS(data?.createdAt), "minute") >= 5 &&
                      dayJS().diff(dayJS(data?.createdAt), "seconds") % 60 >= 0
                  })}>
                    {dayJS().diff(dayJS(data?.createdAt), "seconds") % 60} seconds</strong>
                </>
              )
              : (
                <>
                  <strong>{dayJS(data?.endedAt).diff(dayJS(data?.createdAt), "minute")} minutes</strong> and&nbsp;
                  <strong>{dayJS(data?.endedAt).diff(dayJS(data?.createdAt), "seconds") % 60} seconds</strong>
                </>
              )
            }
          </p>
        </Alert>
      }>
        <div className="p-2">
          {lines.map((line, l) => (
            <div key={l} className="flex flex-row">
              {line.map((letter, i) => (
                <Case key={i} isJoker={letter.status === "hint"} letter={letter.value} status={letter.status} />
              ))}
            </div>
          ))}

          <Button onClick={async() => {
            const response = await fetch(`/api/party/${params.gameId}/lines`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                currentLineIndex,
                lines,
                currentWord: lines[currentLineIndex].map((l) => l.value).join(""),
                word: data?.word
              })
            });

            const schema = z.object({
              word: z.string(),
              lines: z.array(z.array(z.object({
                value: z.string(),
                status: z.string(),
                isJoker: z.boolean().optional()
              }))),
              hasWon: z.boolean()
            }).safeParse(await response.json());

            if (!schema.success) return console.error(schema.error);

            console.log("Response", schema.data);

            setWordFound(schema.data.hasWon);
            setWord(schema.data.word);

            if (schema.data.hasWon) {
              setEndingReason("WORDLE_WIN");
              setIsEnding(true);

              router.push("/");
            } else {
              setLine(schema.data.lines[currentLineIndex] as Line, currentLineIndex);
              incrLine();
            }
          }}>Submit</Button>
        </div>

        {!isReadOnly && (
          <form onSubmit={async() => {
            setEndingReason("WORDLE_ABORT");
            setIsEnding(true);
            await handleAbandon({ gameId: params.gameId });
          }}>
            <button type="submit" className="bg-red-400">click to Abandon</button>
          </form>
        )}
      </WordleLayout>
    </>
  );
}

export default Page;