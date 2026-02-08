import { create } from 'zustand';
import { voidPath } from '../pathways';

const usePathStore = create((set, get) => ({
  path: voidPath,
  stages: voidPath.stages,
  // Check local storage to see which stages are done
  completedStages: JSON.parse(localStorage.getItem('shunya_completed_stages')) || [],

  completeStage: (stageId) => {
    const currentCompleted = get().completedStages;
    if (!currentCompleted.includes(stageId)) {
      const newCompleted = [...currentCompleted, stageId];
      // Save to React State
      set({ completedStages: newCompleted });
      // Save to Browser Memory (forever)
      localStorage.setItem('shunya_completed_stages', JSON.stringify(newCompleted));
    }
  },

  resetProgress: () => {
    set({ completedStages: [] });
    localStorage.removeItem('shunya_completed_stages');
  }
}));

export default usePathStore;
