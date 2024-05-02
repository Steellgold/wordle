"use server";

import { db } from "@/lib/utils/prisma";
import { GAME_TYPE } from "@prisma/client";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const createGame: ({ gameType, session }: { gameType: GAME_TYPE; session: Session | null; }) => void =
  async({ gameType, session }) => {
  const game = await db.game.create({
    data: {
      id: Math.random().toString(36).substring(7),
      type: gameType,
      isLive: true,
      user: { connect: { id: session?.user?.id } },
      categoryId: "general",
      result: "UNKNOWN",
      word: "rouge",
      lines: [
        { id: 0, word: "", correct: false, hinted: false },
        { id: 1, word: "", correct: false, hinted: false },
        { id: 2, word: "", correct: false, hinted: false },
        { id: 3, word: "", correct: false, hinted: false },
        { id: 4, word: "", correct: false, hinted: false }
      ]
    }
  });

  redirect(`/${game.id}`);
};