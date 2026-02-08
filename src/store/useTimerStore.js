import { create } from 'zustand';

const useTimerStore = create((set, get) => ({
  timeLeft: 1500, // 25 minutes in seconds
  status: 'idle', // 'idle' | 'running' | 'finished'
  
  start: () => {
    set({ status: 'running' });
  },
  
  pause: () => {
    set({ status: 'idle' });
  },
  
  reset: () => {
    set({ timeLeft: 1500, status: 'idle' });
  },
  
  tick: () => {
    const { timeLeft, status } = get();
    if (status === 'running' && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft - 1 === 0) {
        set({ status: 'finished' });
      }
    }
  }
}));

export default useTimerStore;
