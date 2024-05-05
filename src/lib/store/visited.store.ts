import { create } from "zustand";
import { persist } from "zustand/middleware";


type VisitedStore = {
  visited: boolean;
  setVisited: (visited: boolean) => void;
};


export const useVisitedStore = create(persist<VisitedStore>((set) => ({
  visited: false,
  setVisited: (visited) => set({ visited }),
}), { name: "already-visited" }));