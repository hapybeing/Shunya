import { useState } from 'react';
import usePathStore from '../store/usePathStore';

export default function PathwayMap({ onStartSession }) {
  const { pathway, resetProgress } = usePathStore();
  const [selectedStage, setSelectedStage] = useState(null);

  const handleStageClick = (stage) => {
    if (!stage.locked) {
      setSelectedStage(stage);
    }
  };

  const handleStartSession = () => {
    if (selectedStage) {
      onStartSession(selectedStage);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 max-w-2xl w-full mx-4 pointer-events-auto shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-thin mb-2 tracking-wider">
            {pathway.title}
          </h1>
          <p className="text-cyan-300/70 text-sm font-light">
            {pathway.description}
          </p>
        </div>

        {/* Pathway Constellation */}
        <div className="relative py-8">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent transform -translate-x-1/2" />
          
          {/* Stage dots */}
          <div className="space-y-6">
            {pathway.stages.map((stage, index) => (
              <div key={stage.id} className="relative flex items-center justify-center">
                {/* Stage number label */}
                <div className="absolute left-8 text-cyan-400/50 text-xs font-light">
                  Stage {index + 1}
                </div>
                
                {/* Stage dot */}
                <button
                  onClick={() => handleStageClick(stage)}
                  disabled={stage.locked}
                  className={`
                    relative z-10 w-6 h-6 rounded-full transition-all duration-300
                    ${stage.completed 
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                      : stage.locked 
                        ? 'bg-gray-600/30 border border-gray-500/30 cursor-not-allowed'
                        : 'bg-white border-2 border-white/50 animate-pulse cursor-pointer hover:scale-125 shadow-lg shadow-white/50'
                    }
                    ${selectedStage?.id === stage.id && !stage.locked ? 'ring-4 ring-cyan-400/50 scale-125' : ''}
                  `}
                >
                  {stage.completed && (
                    <div className="absolute inset-0 flex items-center justify-center text-black text-xs">
                      ✓
                    </div>
                  )}
                </button>

                {/* Stage info on hover/selection */}
                {(selectedStage?.id === stage.id || (!stage.locked && !selectedStage)) && (
                  <div className="absolute left-1/2 transform translate-x-8 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 min-w-[200px]">
                    <h3 className="text-white text-sm font-light mb-1">
                      {stage.title}
                    </h3>
                    <p className="text-cyan-300/60 text-xs">
                      {stage.duration}s · {stage.technique}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 space-y-3">
          {selectedStage && !selectedStage.locked && (
            <button
              onClick={handleStartSession}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-white py-4 rounded-xl font-light text-lg transition-all duration-300 hover:scale-105"
            >
              Begin {selectedStage.title} →
            </button>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={resetProgress}
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-300 py-2 rounded-lg text-sm font-light transition-all"
            >
              Reset Progress
            </button>
            <div className="flex-1 text-center py-2 text-cyan-400/50 text-sm">
              {pathway.stages.filter(s => s.completed).length} / {pathway.stages.length} Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
