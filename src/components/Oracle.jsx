import { useState } from 'react';
import useShunyaStore from '../store/useShunyaStore';

const moodOptions = [
  { label: 'Anxious', value: 'anxious', emoji: '😰' },
  { label: 'Distracted', value: 'distracted', emoji: '🌀' },
  { label: 'Tired', value: 'tired', emoji: '😴' },
  { label: 'Seeking Clarity', value: 'seeking clarity', emoji: '🔍' }
];

export default function Oracle({ onBegin }) {
  const [showMeditation, setShowMeditation] = useState(false);
  
  const { 
    userMood, 
    selectedMeditation, 
    setMood, 
    selectMeditation
  } = useShunyaStore();

  const handleMoodSelect = (mood) => {
    setMood(mood);
    selectMeditation();
    setShowMeditation(true);
  };

  const handleBeginJourney = () => {
    if (onBegin) {
      onBegin();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {/* Mood Selection Card */}
      {!showMeditation && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 pointer-events-auto shadow-2xl">
          <h2 className="text-white text-3xl font-thin text-center mb-2">
            SHUNYA
          </h2>
          <p className="text-white/70 text-center mb-8 text-sm">
            What is your current state?
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleMoodSelect(option.value)}
                className="bg-white/5 hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white text-sm font-light">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meditation Instructions Card */}
      {showMeditation && selectedMeditation && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-lg w-full mx-4 pointer-events-auto shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-white text-2xl font-light mb-2">
              {selectedMeditation.title}
            </h3>
            <p className="text-cyan-300 text-sm font-thin">
              {selectedMeditation.source}
            </p>
          </div>
          
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/10">
            <p className="text-white/90 text-base leading-relaxed font-light">
              {selectedMeditation.instructions}
            </p>
          </div>
          
          <div className="text-center text-white/60 text-xs mb-6">
            Duration: {Math.floor(selectedMeditation.duration / 60)} minutes
          </div>
          
          <button
            onClick={handleBeginJourney}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-white py-4 rounded-xl font-light text-lg transition-all duration-300 hover:scale-105"
          >
            Begin Journey →
          </button>
          
          <button
            onClick={() => setShowMeditation(false)}
            className="w-full mt-3 text-white/50 hover:text-white/80 text-sm transition-colors"
          >
            ← Choose Different State
          </button>
        </div>
      )}
    </div>
  );
}
