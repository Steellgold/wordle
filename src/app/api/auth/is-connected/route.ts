import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async(): Promise<NextResponse> => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ isConnected: false });
  }

  return NextResponse.json({ isConnected: true });
};