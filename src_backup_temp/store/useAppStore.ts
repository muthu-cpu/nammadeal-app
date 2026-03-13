import { create } from 'zustand';
import { BasketItem, Location } from './types';

interface AppState {
  // Savings
  totalSaved: number;
  addSavings: (amount: number) => void;

  // Basket
  basket: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (name: string) => void;
  clearBasket: () => void;

  // Recent searches
  recent: { grocery: string[]; food: string[]; pharma: string[] };
  addRecent: (tab: 'grocery' | 'food' | 'pharma', query: string) => void;

  // Locations (rides)
  pickup: Location | null;
  drop: Location | null;
  setPickup: (loc: Location) => void;
  setDrop: (loc: Location) => void;
  swapLocations: () => void;

  // Map modal
  mapOpen: boolean;
  mapTarget: 'pickup' | 'drop';
  openMap: (target: 'pickup' | 'drop') => void;
  closeMap: () => void;

  // Finance sidebar
  financeOpen: boolean;
  openFinance: () => void;
  closeFinance: () => void;

  // Toast
  toastMsg: string;
  toastVisible: boolean;
  showToast: (msg: string) => void;
  hideToast: () => void;

  // Auth
  userId: string | null;
  userPhone: string | null;
  userName: string | null;
  setUser: (uid: string | null, phone: string | null, name?: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Savings
  totalSaved: 0,
  addSavings: (amount) => set((s) => ({ totalSaved: (s.totalSaved || 0) + (isNaN(amount) ? 0 : Math.abs(amount)) })),

  // Basket
  basket: [],
  addToBasket: (item) => {
    const existing = get().basket.find((b) => b.name === item.name);
    if (existing) return;
    set((s) => ({ basket: [...s.basket, item] }));
  },
  removeFromBasket: (name) =>
    set((s) => ({ basket: s.basket.filter((b) => b.name !== name) })),
  clearBasket: () => set({ basket: [] }),

  // Recent
  recent: { grocery: [], food: [], pharma: [] },
  addRecent: (tab, query) =>
    set((s) => {
      const prev = s.recent[tab].filter((x) => x.toLowerCase() !== query.toLowerCase());
      return { recent: { ...s.recent, [tab]: [query, ...prev].slice(0, 5) } };
    }),

  // Locations
  pickup: null,
  drop: null,
  setPickup: (loc) => set({ pickup: loc }),
  setDrop: (loc) => set({ drop: loc }),
  swapLocations: () => set((s) => ({ pickup: s.drop, drop: s.pickup })),

  // Map
  mapOpen: false,
  mapTarget: 'pickup',
  openMap: (target) => set({ mapOpen: true, mapTarget: target }),
  closeMap: () => set({ mapOpen: false }),

  // Finance
  financeOpen: false,
  openFinance: () => set({ financeOpen: true }),
  closeFinance: () => set({ financeOpen: false }),

  // Toast
  toastMsg: '',
  toastVisible: false,
  showToast: (msg) => {
    set({ toastMsg: msg, toastVisible: true });
    setTimeout(() => set({ toastVisible: false }), 2600);
  },
  hideToast: () => set({ toastVisible: false }),

  // Auth
  userId: null,
  userPhone: null,
  userName: null,
  setUser: (uid, phone, name = null) => set({ userId: uid, userPhone: phone, userName: name }),
}));
