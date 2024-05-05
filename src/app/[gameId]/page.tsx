"use client";

import { Component } from "@/lib/components/utils/component";
import { use, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useEventListener, useWindowSize } from 'usehooks-ts'
import ReactConfetti from "react-confetti";
import { WordleLayout } from "@/lib/components/wordle/layout";
import { GAME_RESULT, Game } from "@prisma/client";
import { dayJS } from "@/lib/utils/dayjs/day-js";
import { Alert } from "@/lib/components/ui/alert";
import { cn, minimize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Case } from "./lib/board";
import { useCurrentParty } from "@/lib/store/current.store";
import { handleAbandon } from "./lib/abandon";
import { Button } from "@/lib/components/ui/button";
import { HintsDialog } from "@/lib/components/wordle/dialogs/hints-dialog";
import { Timer } from "./lib/timer";
import { Line } from "@/lib/types/wordle.type";
import { z } from "zod";

type BoardProps = {
  params: {
    gameId: string;
  };
};

const Page: Component<BoardProps> = ({ params }) => {
  const { width, height } = useWindowSize();

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [endingReason, setEndingReason] = useState<GAME_RESULT>("UNKNOWN");

  const [wordFound, setWordFound] = useState(false);
  const [decryptedWord, setWord] = useState<string>();
  const [data, setData] = useState<Game | null>(null);

  const { isLocked, incrLine, currentLineIndex, addLetter, removeLetter, lines, init, setLine, clear } = useCurrentParty();

  const router = useRouter();

  const submit = async() => {
    if (isSending) return;
    if (isLocked) return;
    if (lines[currentLineIndex].some((l) => l.value === "")) return;
    setIsSending(true);

    const response = await fetch(`/api/party/${params.gameId}/lines`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentLineIndex,
        lines,
        currentWord: lines[currentLineIndex].map((l) => l.value.toLocaleLowerCase()).join(""),
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
      hasWon: z.boolean(),
      hasLost: z.boolean()
    }).safeParse(await response.json());

    if (!schema.success) return console.error(schema.error);

    setWordFound(schema.data.hasWon);
    setWord(schema.data.word);

    setLine(schema.data.lines[currentLineIndex] as Line, currentLineIndex);
    if (schema.data.hasWon) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsReadOnly(true);
      setEndingReason("WORDLE_WIN");
      setIsEnding(true);
      clear();

      router.push("/?from=" + params.gameId);
    } else if (schema.data.hasLost) {
      setIsReadOnly(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setEndingReason("WORDLE_LOSE");
      setIsEnding(true);
      clear();

      router.push("/?from=" + params.gameId);
    } else {
      incrLine();
    }

    setIsSending(false);
  };

  useEffect(() => {
    const fetchData = async () => {      
      setIsLoading(true);
      const authResponse = await fetch("/api/auth/is-connected");
      const authData = await authResponse.json();
      if (authResponse.ok) setIsConnected(authData.isConnected);
      else setIsConnected(false);

      try {
        const response = await fetch(`/api/party/${params.gameId}`);
        const data = await response.json();
        if (response.ok) {
          setData(data);
          init(data.lines);
        } else {
          throw new Error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching² data", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [params.gameId, init]);

  useEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
      removeLetter();
    } else if (event.key === "Enter") {
      submit();
    } else if (event.key.length === 1) {
      if ("abcdefghijklmnopqrstuvwxyz".includes(event.key.toLowerCase())) addLetter(event.key.toUpperCase());
    }
  });

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
                <Timer onEnd={async() => {
                  const closeGame = async(endReason: GAME_RESULT) => {
                    const response = await fetch(`/api/party/${params.gameId}/close`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ result: endReason })
                    });
                
                    const data = await response.json();
                    if (response.ok) setWord(data.word);
                  };

                  closeGame("WORDLE_TIMEOUT")
                    .then(() => router.push(`/?from=${params.gameId}`))
                  
                  setEndingReason("WORDLE_TIMEOUT");
                  setIsEnding(true);
                }} />
              )
              : (
                <>
                  <strong>{dayJS(data?.endedAt).diff(dayJS(data?.createdAt), "minute")} {minimize("minutes", "mins", width)}</strong>
                  <strong> {dayJS(data?.endedAt).diff(dayJS(data?.createdAt), "seconds") % 60} {minimize("seconds", "s", width)}</strong>
                </>
              )
            }
          </p>
        </Alert>
      }>
        <div className="flex flex-col">
          <div className={cn(
            "border border-[#262626] rounded-lg p-5",
            "flex flex-col sm:flex-row w-full", {
              "sm:flex-col": "pote".length > 6
            }
          )}>
            <div className="p-2">
              {lines.map((line, l) => (
                <div key={l} className="flex flex-row">
                  {line.map((letter, i) => (
                    <Case key={i} isJoker={letter.status === "hint"} letter={letter.value} status={letter.status} />
                  ))}
                </div>
              ))}
            </div>

            <div className="p-2 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  className="w-full"
                  size={"default"}
                  variant={"secondary"}
                  onClick={submit}
                  disabled={
                    isSending ||
                    isLocked ||
                    (lines[currentLineIndex] && lines[currentLineIndex].some((l) => l.value === ""))
                  }
                >
                  {isSending && <><Loader2 size={16} className="animate-spin" />&nbsp;</>}
                  Validate
                </Button>
                {isConnected ? (
                  <HintsDialog isConnected={isConnected ?? false} isMobile={width < 640}>
                    <Button className="w-full" size={"default"} variant={"default"}>Hints</Button>
                  </HintsDialog>
                ) : <Button className="w-full" size={"default"} variant={"default"} disabled>Hints</Button>}
              </div>
              
              {!isReadOnly && (
                <form onSubmit={async() => {
                  setEndingReason("WORDLE_ABORT");
                  setIsEnding(true);
                  clear();
                  await handleAbandon({ gameId: params.gameId });
                }}>
                  <button type="submit" className="bg-[#1e351a#]">click to Abandon</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </WordleLayout>
    </>
  );
}

export default Page;