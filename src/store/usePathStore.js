import { create } from 'zustand';
import { voidPath } from '../pathways';

const STORAGE_KEY = 'shunya_pathway_progress';

// Load progress from localStorage
const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return {};
};

// Save progress to localStorage
const saveProgress = (completedStages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedStages));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Initialize pathway with locked/unlocked states
const initializePathway = (completedStages) => {
  return voidPath.stages.map((stage, index) => {
    const isCompleted = completedStages[stage.id] === true;
    const isFirstStage = index === 0;
    
    // A stage is unlocked if:
    // 1. It's the first stage, OR
    // 2. The previous stage is completed
    const previousCompleted = index > 0 ? completedStages[voidPath.stages[index - 1].id] === true : true;
    const isUnlocked = isFirstStage || previousCompleted;
    
    return {
      ...stage,
      completed: isCompleted,
      locked: !isUnlocked
    };
  });
};

const usePathStore = create((set, get) => {
  // Load saved progress on initialization
  const completedStages = loadProgress();
  
  return {
    pathway: {
      ...voidPath,
      stages: initializePathway(completedStages)
    },
    completedStages: completedStages,
    
    completeStage: (stageId) => {
      const { completedStages, pathway } = get();
      
      // Mark stage as completed
      const newCompleted = {
        ...completedStages,
        [stageId]: true
      };
      
      // Save to localStorage
      saveProgress(newCompleted);
      
      // Update pathway with new states
      const updatedStages = initializePathway(newCompleted);
      
      set({
        completedStages: newCompleted,
        pathway: {
          ...pathway,
          stages: updatedStages
        }
      });
    },
    
    resetProgress: () => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Reset to initial state (only first stage unlocked)
      const { pathway } = get();
      const updatedStages = initializePathway({});
      
      set({
        completedStages: {},
        pathway: {
          ...pathway,
          stages: updatedStages
        }
      });
    },
    
    getStageById: (stageId) => {
      const { pathway } = get();
      return pathway.stages.find(s => s.id === stageId);
    }
  };
});

export default usePathStore;
