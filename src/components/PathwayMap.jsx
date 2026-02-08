import React from 'react';
import usePathStore from '../store/usePathStore';

const PathwayMap = ({ onStart }) => {
  const { stages, completedStages } = usePathStore();

  // Helper to handle both Click and Touch to ensure it fires
  const handleInteraction = (e, stage, isUnlocked) => {
    e.stopPropagation(); // Stop the event from bubbling to the 3D canvas
    if (isUnlocked) {
      onStart(stage);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] overflow-y-auto bg-black/95 pointer-events-auto touch-pan-y">
      <div className="flex flex-col items-center min-h-screen py-24 px-4">
        
        <h2 className="text-3xl text-white tracking-[0.2em] mb-2 text-center font-bold">
          THE PATH
        </h2>
        <p className="text-gray-500 text-xs mb-16 tracking-widest uppercase">
          Select Stage 1
        </p>

        <div className="relative flex flex-col items-center gap-16 w-full max-w-md pb-40">
          
          {/* The Vertical Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-800 -translate-x-1/2 z-0" />

          {stages.map((stage, index) => {
            const isCompleted = completedStages.includes(stage.id);
            const isUnlocked = index === 0 || completedStages.includes(stages[index - 1].id);
            const isNext = isUnlocked && !isCompleted;

            return (
              <div 
                key={stage.id} 
                className={`relative z-10 w-full flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* THE FIX: A massive transparent button that covers both the dot and the text.
                   This ensures you can't miss it.
                */}
                <div 
                  className="absolute inset-0 z-20"
                  onTouchEnd={(e) => handleInteraction(e, stage, isUnlocked)}
                  onClick={(e) => handleInteraction(e, stage, isUnlocked)}
                ></div>

                {/* Visual: The Center Dot */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-black z-10
                    ${isCompleted ? 'bg-cyan-500' : ''}
                    ${isNext ? 'bg-white shadow-[0_0_25px_white] animate-pulse' : ''}
                    ${!isUnlocked ? 'bg-gray-800' : ''}
                  `}
                />

                {/* Visual: The Text Card */}
                <div 
                  className={`
                    w-[45%] p-6 rounded-xl border transition-all duration-300
                    ${isNext ? 'bg-gray-900 border-white/50' : ''}
                    ${isCompleted ? 'opacity-50 border-cyan-900' : ''}
                    ${!isUnlocked ? 'opacity-20 border-transparent' : ''}
                  `}
                >
                  <h3 className={`text-base font-bold mb-1 ${isNext ? 'text-white' : 'text-cyan-600'}`}>
                    {stage.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {Math.floor(stage.duration / 60)} MIN
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PathwayMap;
