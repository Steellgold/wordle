import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AsyncComponent } from "@/lib/components/utils/component";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";
import { WordleDialog } from "@/lib/components/wordle/dialogs/first-visit-wordle.dialog";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordle - Guess the word",
  applicationName: "Wordle",
  description: "Wordle is a word puzzle game that tests your vocabulary and word-guessing skills. The objective of the game is to guess a five-letter word by trying different words and receiving feedback on how close you are to the correct word."
};

export const viewport: Viewport = {
  themeColor: "#e8e8e8",
};

const Layout: AsyncComponent<PropsWithChildren> = async ({ children }) => {
  const session = await auth();

  return (
    <>
      <html lang="en">
        {process.env.NEXT_PUBLIC_ENV !== "dev" && (
          <script defer src="https://supalytics.co/track.js" data-website-id="5ec3ae77-9e61-42d6-b5f7-dba5a7dc9569" />
        )}

        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <body className={cn("bg-[#1A1A1A]", nunito.className)}>
              <WordleDialog isConnected={session !== null} /> 
              {children}
            </body>
          </ThemeProvider>
        </SessionProvider>
      </html>
    </>
  );
}

export default Layout;
