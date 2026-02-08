import React from 'react';
import usePathStore from '../store/usePathStore';

const PathwayMap = ({ onStart }) => {
  const { stages, completedStages } = usePathStore();

  return (
    // Added overflow-y-auto and pointer-events-auto to fix scrolling/clicking
    <div className="w-full h-full absolute inset-0 z-50 overflow-y-auto bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-sm pointer-events-auto">
      <div className="flex flex-col items-center min-h-screen py-20 px-4">
        
        {/* Header */}
        <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-2 text-center">
          THE PATH
        </h2>
        <p className="text-gray-400 text-sm mb-16 text-center max-w-xs font-mono">
          Vigyan Bhairava Tantra
        </p>

        {/* The Constellation Line */}
        <div className="relative flex flex-col items-center gap-12 w-full max-w-md pb-32">
          
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-20 left-1/2 w-0.5 bg-gradient-to-b from-cyan-500/50 via-cyan-900/20 to-transparent -translate-x-1/2 z-0" />

          {stages.map((stage, index) => {
            // Determine state
            const isCompleted = completedStages.includes(stage.id);
            const isNext = !isCompleted && (index === 0 || completedStages.includes(stages[index - 1].id));
            const isLocked = !isCompleted && !isNext;

            return (
              <div 
                key={stage.id} 
                className={`relative z-10 w-full flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* The clickable "Star" Node */}
                <button
                  disabled={isLocked}
                  onClick={() => onStart(stage)}
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${isCompleted ? 'bg-cyan-500 shadow-[0_0_20px_#06b6d4]' : ''}
                    ${isNext ? 'bg-white shadow-[0_0_30px_white] animate-pulse scale-110' : ''}
                    ${isLocked ? 'bg-gray-800 border border-gray-700' : ''}
                  `}
                >
                  {isCompleted && <span className="text-black font-bold">✓</span>}
                  {isLocked && <span className="text-gray-600 text-xs">{index + 1}</span>}
                </button>

                {/* The Info Card */}
                <div 
                  className={`
                    w-[42%] p-4 rounded-xl backdrop-blur-md border transition-all duration-500
                    ${isNext ? 'bg-white/10 border-white/40 opacity-100 translate-y-0' : ''}
                    ${isCompleted ? 'bg-cyan-900/20 border-cyan-500/30 opacity-70' : ''}
                    ${isLocked ? 'opacity-0 translate-y-4 pointer-events-none' : ''}
                  `}
                >
                  <h3 className={`font-medium ${isNext ? 'text-white' : 'text-cyan-400'}`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
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
