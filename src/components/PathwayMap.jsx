import React from 'react';
import usePathStore from '../store/usePathStore';

const PathwayMap = ({ onStart }) => {
  const { stages, completedStages } = usePathStore();

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md pointer-events-auto">
      <div className="flex flex-col items-center min-h-screen py-20 px-4">
        
        <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-2 text-center font-['Syncopate']">
          THE PATH
        </h2>
        <p className="text-gray-400 text-xs mb-16 text-center max-w-xs font-mono tracking-widest uppercase">
          Vigyan Bhairava Tantra
        </p>

        <div className="relative flex flex-col items-center gap-12 w-full max-w-md pb-32">
          {/* Vertical Line */}
          <div className="absolute top-4 bottom-20 left-1/2 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-900/20 to-transparent -translate-x-1/2" />

          {stages.map((stage, index) => {
            const isCompleted = completedStages.includes(stage.id);
            const isUnlocked = index === 0 || completedStages.includes(stages[index - 1].id);
            const isNext = isUnlocked && !isCompleted;

            return (
              <div 
                key={stage.id} 
                className={`relative z-10 w-full flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* 1. The Dot (Clickable) */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && onStart(stage)}
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-500 z-20
                    ${isCompleted ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : ''}
                    ${isNext ? 'bg-white scale-150 shadow-[0_0_20px_white] animate-pulse cursor-pointer' : ''}
                    ${!isUnlocked ? 'bg-gray-800 border border-gray-700' : ''}
                  `}
                />

                {/* 2. The Text Card (NOW CLICKABLE!) */}
                <div 
                  onClick={() => isUnlocked && onStart(stage)}
                  className={`
                    w-[45%] p-4 rounded-lg border transition-all duration-500 cursor-pointer
                    ${isNext ? 'bg-white/5 border-white/20 opacity-100 hover:bg-white/10 active:scale-95' : ''}
                    ${isCompleted ? 'opacity-50 border-cyan-900/30' : ''}
                    ${!isUnlocked ? 'opacity-20 border-transparent grayscale cursor-not-allowed' : ''}
                  `}
                >
                  <h3 className={`text-sm font-bold tracking-wider mb-1 ${isNext ? 'text-white' : 'text-cyan-600'}`}>
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
