import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52 },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.36 },
};

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (code) => set({ currency: code }),
    }),
    {
      name: 'currency-storage',
    }
  )
);
