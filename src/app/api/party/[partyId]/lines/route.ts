import { auth } from "@/auth";
import { isValidWord } from "@/lib/components/wordle/utils/wordle.utils";
import { env } from "@/lib/env.mjs";
import { LetterStatus } from "@/lib/types/wordle.type";
import { getDecryptedText } from "@/lib/utils/cryptr";
import { dayJS } from "@/lib/utils/dayjs/day-js";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Party = {
  params: {
    partyId: string;
  };
};

export const PUT = async (req: NextRequest, { params }: Party) => {
  const session = await auth();
  let userId: string | undefined = "";
  if (session) userId = session.user?.id ?? "";
  if (!session) userId = `guest${cookies().get("guestUserId")?.value}`;

  const { partyId } = params;

  const party = await db.game.findUnique({ where: { id: partyId, userId, isLive: true } });
  if (!party) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  const schema = z.object({
    currentLineIndex: z.number(),
    lines: z.array(z.array(z.object({
      value: z.string(),
      status: z.string(),
      isJoker: z.boolean().optional()
    }))),
    currentWord: z.string(),
    word: z.string()
  }).safeParse(await req.json());

  if (!schema.success) return NextResponse.json({ error: schema.error });

  const { currentLineIndex, lines, currentWord, word } = schema.data;

  const newLines = lines.map((line, index) => {
    if (index === currentLineIndex) {
      return isValidWord(
        lines.map((line) => line.map((entry) => ({
          value: entry.value, status: entry.status as LetterStatus
        }))),
        party.word,
        schema.data.currentLineIndex
      );
    }

    return line;
  });

  if (currentWord == getDecryptedText(word)) {
    await db.game.update({
      where: { id: partyId },
      data: {
        endedAt: dayJS().toISOString(),
        result: "WORDLE_WIN",
        lines: newLines,
        isLive: false
      }
    });

    return NextResponse.json({
      word: currentWord,
      lines: newLines,
      hasWon: true,
      hasLost: false
    });
  }

  const allLinesHasStatus = newLines.every((line) => line.every((entry) => entry.status !== "unknown"));
  let hasLost = false;
  
  if (allLinesHasStatus) {
    const lastLine = newLines[newLines.length - 1];
    hasLost = lastLine.every((entry) => entry.status !== "well-placed");

    if (hasLost) {
      await db.game.update({
        where: { id: partyId },
        data: {
          endedAt: dayJS().toISOString(),
          result: "WORDLE_LOSE",
          lines: newLines,
          isLive: false
        }
      });
    }
  }

  return NextResponse.json({
    ...party,
    lines: newLines,
    word: hasLost ? party.word : schema.data.word,
    hasWon: false,
    hasLost
  });
}