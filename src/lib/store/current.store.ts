import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Line } from "../types/wordle.type";

type PartyStore = {
  lines: Line[];
  currentLineIndex: number;

  incrLine: () => void;
  decrLine: () => void;

  init: (lines: Line[]) => Promise<void>;

  addLetter: (letter: string) => void;
  removeLetter: () => void;

  setLine: (line: Line, index: number) => void;

  clear: () => void;

  isLocked: boolean;
  setLocked: (locked: boolean) => void;
};

export const useCurrentParty = create(
  persist<PartyStore>(
    (set, get) => ({
      lines: [],
      currentLineIndex: 0,
      isLocked: false,

      incrLine: () => set((state) => ({ currentLineIndex: state.currentLineIndex + 1 })),
      decrLine: () => set((state) => ({ currentLineIndex: state.currentLineIndex - 1 })),

      init: (lines) => {
        set({ lines, currentLineIndex: 0 })
        return Promise.resolve();
      },

      addLetter: (letter) => {
        const lines: Line[] = get().lines;
        const lineIndex = get().currentLineIndex;

        const line = lines[lineIndex];

        const index = line.findIndex((l) => l.value === "");
        if (index === -1) return;

        line[index].value = letter;

        set((state) => {
          const lines = [...state.lines];
          lines[lineIndex] = line;
          return { lines };
        });
      },

      removeLetter: () => {
        const lines: Line[] = get().lines;
        const lineIndex = get().currentLineIndex;

        const line = lines[lineIndex];

        const index = line.findIndex((l) => l.value !== "");
        if (index === -1) return;

        line[index].value = "";

        set((state) => {
          const lines = [...state.lines];
          lines[lineIndex] = line;
          return { lines };
        });
      },

      setLine: (line, index) => set((state) => {
        const lines = [...state.lines];
        lines[index] = line;
        return { lines };
      }),

      clear: () => set({ lines: [] }),
      setLocked: (locked) => set({ isLocked: locked }),
    }),
    { name: "wordle-current-party-storage" },
  ),
);