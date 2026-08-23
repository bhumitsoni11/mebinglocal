import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userRole: 'TRAVELER' | 'LOCAL_FRIEND' | 'ADMIN' | null;
  setRole: (role: 'TRAVELER' | 'LOCAL_FRIEND' | 'ADMIN' | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userRole: null,
      setRole: (role) => set({ userRole: role }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
