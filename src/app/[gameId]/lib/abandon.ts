"use server";

import { auth } from "@/auth";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleAbandon = async({ gameId }: { gameId: string }) => {
  "use server";

  const session = await auth();
  let userId: string | undefined = "";
  if (session) userId = session.user?.id ?? "";
  if (!session) userId = `guest${cookies().get("guestUserId")?.value}`;

  const party = await db.game.findUnique({ where: { id: gameId, userId, isLive: true } });

  if (!party) return;

  await db.game.update({
    where: { id: gameId },
    data: { result: "WORDLE_ABORT", isLive: false }
  });

  redirect("/");
};