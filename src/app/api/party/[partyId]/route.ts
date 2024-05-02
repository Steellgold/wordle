import { auth } from "@/auth";
import { env } from "@/lib/env.mjs";
import { db } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

type Party = {
  params: {
    partyId: string;
  };
};

export const GET = async (req: NextRequest, { params }: Party) => {
  const session = await auth();
  if (!session) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  const { partyId } = params;

  const party = await db.game.findUnique({ where: { id: partyId, userId: session.user?.id ?? "" } });
  if (!party) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  return NextResponse.json({ party });
}