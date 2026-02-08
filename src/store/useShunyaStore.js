import { create } from 'zustand';
import { meditationLibrary } from '../data/meditations';

const useShunyaStore = create((set, get) => ({
  // Timer state
  timeLeft: 1500, // 25 minutes in seconds
  status: 'idle', // 'idle' | 'running' | 'finished'
  
  // Meditation state
  selectedMeditation: null,
  userMood: null,
  
  // Timer actions
  start: () => {
    set({ status: 'running' });
  },
  
  pause: () => {
    set({ status: 'idle' });
  },
  
  reset: () => {
    const { selectedMeditation } = get();
    const duration = selectedMeditation ? selectedMeditation.duration : 1500;
    set({ timeLeft: duration, status: 'idle' });
  },
  
  tick: () => {
    const { timeLeft, status } = get();
    if (status === 'running' && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft - 1 === 0) {
        set({ status: 'finished' });
      }
    }
  },
  
  // Meditation actions
  setMood: (mood) => {
    set({ userMood: mood });
  },
  
  selectMeditation: () => {
    const { userMood } = get();
    
    // Filter meditations by matching tags
    const moodLower = userMood ? userMood.toLowerCase() : '';
    const matches = meditationLibrary.filter(med => 
      med.tags.some(tag => tag.toLowerCase().includes(moodLower) || moodLower.includes(tag.toLowerCase()))
    );
    
    // Pick a random meditation from matches, or fallback to "Shunya"
    let selected;
    if (matches.length > 0) {
      selected = matches[Math.floor(Math.random() * matches.length)];
    } else {
      selected = meditationLibrary.find(m => m.id === 'shunya');
    }
    
    // Set the meditation and update timer duration
    set({ 
      selectedMeditation: selected,
      timeLeft: selected.duration
    });
  }
}));

export default useShunyaStore;
