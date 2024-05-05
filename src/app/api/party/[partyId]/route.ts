import { auth } from "@/auth";
import { env } from "@/lib/env.mjs";
import { getEncryptedText } from "@/lib/utils/cryptr";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Party = {
  params: {
    partyId: string;
  };
};

export const GET = async (req: NextRequest, { params }: Party) => {
  const session = await auth();
  let userId: string | undefined = "";
  if (session) userId = session.user?.id ?? "";
  if (!session) userId = `guest${cookies().get("guestUserId")?.value}`;

  const { partyId } = params;

  const party = await db.game.findUnique({ where: { id: partyId, userId } });
  if (!party) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

  return NextResponse.json({
    ...party,
    word: getEncryptedText(party.word)
  });
}