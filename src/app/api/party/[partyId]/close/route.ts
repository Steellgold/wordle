import { auth } from "@/auth";
import { env } from "@/lib/env.mjs";
import { dayJS } from "@/lib/utils/dayjs/day-js";
import { db } from "@/lib/utils/prisma";
import { GAME_RESULT } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Party = {
  params: {
    partyId: string;
  };
};

export const POST = async (req: NextRequest, { params }: Party) => {
  const session = await auth();
  if (!session) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  const { partyId } = params;

  const party = await db.game.findUnique({ where: { id: partyId, userId: session.user?.id ?? "", isLive: true } });
  if (!party) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  const schema = z.object({ result: z.nativeEnum(GAME_RESULT) }).safeParse(await req.json());

  await db.game.update({
    where: { id: partyId },
    data: { result: schema.data?.result, isLive: false, endedAt: dayJS().toISOString() }
  });

  return NextResponse.json({ ...party });
}