import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Component } from "@/lib/components/utils/component";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/components/providers/theme-provider";
import Script from "next/script";
import { env } from "../lib/env.mjs";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordle - Guess the word",
  applicationName: "Wordle",
  description: "Wordle is a word puzzle game that tests your vocabulary and word-guessing skills. The objective of the game is to guess a five-letter word by trying different words and receiving feedback on how close you are to the correct word.",

  icons: {
    icon: [
      {
        url: "/_static/wordle-favicon.png",
        href: "/_static/wordle-favicon.png"
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#e8e8e8",
};

const Layout: Component<PropsWithChildren> = ({ children }) => {
  console.log(env.NEXT_PUBLIC_ENV);

  return (
    <>
      <html lang="en">
        {process.env.NEXT_PUBLIC_ENV !== "dev" && (
          <Script defer src="https://supalytics.co/track.js" data-website-id="5ec3ae77-9e61-42d6-b5f7-dba5a7dc9569" />
        )}

        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <body className={cn("bg-[#1A1A1A]", nunito.className)}>          
            {children}
          </body>
        </ThemeProvider>
      </html>
    </>
  );
}

export default Layout;
