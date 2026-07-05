import { create } from 'zustand';

interface DashboardState {
  selectedDate: Date;
  refreshKey: number;
  setSelectedDate: (date: Date) => void;
  incrementRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedDate: new Date(),
  refreshKey: 0,
  setSelectedDate: (date) => set({ selectedDate: date }),
  incrementRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
