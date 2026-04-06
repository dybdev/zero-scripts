import { create } from 'zustand';

export interface TebexUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  basketIdent?: string;
}

interface UserState {
  user: TebexUser | null;
  setUser: (user: TebexUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
