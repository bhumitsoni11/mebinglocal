import { create } from "zustand";

export interface SearchState {
  destination: string;
  dates: string;
  passion: string;
  category: string;
  partySize: number;
  maxHourlyRate: number;
  selectedVibe: string;
  verifiedOnly: boolean;
  superhostOnly: boolean;
  setDestination: (destination: string) => void;
  setDates: (dates: string) => void;
  setPassion: (passion: string) => void;
  setCategory: (category: string) => void;
  setPartySize: (partySize: number) => void;
  setMaxHourlyRate: (rate: number) => void;
  setSelectedVibe: (vibe: string) => void;
  setVerifiedOnly: (verifiedOnly: boolean) => void;
  setSuperhostOnly: (superhostOnly: boolean) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  destination: "Florence, Italy",
  dates: "Oct 12 – Oct 18",
  passion: "Hidden Gems & Wine",
  category: "Food & Wine",
  partySize: 2,
  maxHourlyRate: 75,
  selectedVibe: "all",
  verifiedOnly: true,
  superhostOnly: false,
  setDestination: (destination) => set({ destination }),
  setDates: (dates) => set({ dates }),
  setPassion: (passion) => set({ passion, category: passion }),
  setCategory: (category) => set({ category, passion: category }),
  setPartySize: (partySize) => set({ partySize }),
  setMaxHourlyRate: (maxHourlyRate) => set({ maxHourlyRate }),
  setSelectedVibe: (selectedVibe) => set({ selectedVibe }),
  setVerifiedOnly: (verifiedOnly) => set({ verifiedOnly }),
  setSuperhostOnly: (superhostOnly) => set({ superhostOnly }),
  resetFilters: () =>
    set({
      destination: "",
      dates: "",
      passion: "",
      category: "",
      partySize: 1,
      maxHourlyRate: 150,
      selectedVibe: "all",
      verifiedOnly: true,
      superhostOnly: false,
    }),
}));
