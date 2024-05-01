"use server";

import { auth } from "@/auth";
import { db } from "@/lib/utils/prisma";

export const handleAbandon = async({ gameId }: { gameId: string }) => {
  "use server";

  const session = await auth();
  if (!session) return;

  const party = await db.game.findUnique({
    where: { id: gameId, userId: session.user?.id ?? "" }
  });

  if (!party) return;

  await db.game.update({
    where: { id: gameId },
    data: { result: "WORDLE_ABORT", isLive: false }
  });
};