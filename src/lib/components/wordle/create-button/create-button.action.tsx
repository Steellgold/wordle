"use server";

import { auth } from "@/auth";
import { db } from "@/lib/utils/prisma";
import { GAME_TYPE } from "@prisma/client";
import { Session } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createGame: ({ gameType, session }: { gameType: GAME_TYPE; session: Session | null; }) => void = async({ gameType, session }) => {
  const food = cookies();
  const guestId = food.get("guestUserId")?.value;

  const word = await fetch("https://trouve-mot.fr/api/size/5").then((res) => res.json()).then((data) => data[0]);

  const game = await db.game.create({
    data: {
      id: `${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}`,
      type: gameType,
      isLive: true,
      user: {
        connectOrCreate: {
          where: {
            id: session?.user?.id ?? `guest${guestId}`,
            email: session?.user?.email ?? `guest${guestId}@wordle.best`
          },
          create: {
            id: `guest${guestId}`,
            email: `guest${guestId}@wordle.best`,
            name: `Guest #${guestId}`,
            image: `https://api.dicebear.com/8.x/big-ears/png?seed=${guestId}&hairColor=2c1b18,b58143,a55728,4a312c,724133&mouth=variant0101,variant0102,variant0103,variant0104,variant0105,variant0201,variant0202,variant0203,variant0204,variant0205,variant0301,variant0302,variant0304,variant0305,variant0401,variant0402,variant0403,variant0404,variant0405,variant0501,variant0502,variant0503,variant0504,variant0505,variant0601,variant0602,variant0603,variant0604,variant0605,variant0701,variant0702,variant0703,variant0704,variant0705,variant0706,variant0707,variant0708,variant0303&skinColor=f8b788,da9969&backgroundColor=d1d4f9,c0aede,ffdfbf,b6e3f4`,
          }
        }
      },
      categoryId: "general",
      result: "UNKNOWN",
      word: word.name,
      lines: [
        [ { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" } ],
        [ { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" } ],
        [ { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" } ],
        [ { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" } ],
        [ { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" },
          { value: "", status: "unknown" } ]
      ]
    }
  });

  redirect(`/${game.id}`);
};