import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import Polyhedron from './components/Polyhedron';
import Oracle from './components/Oracle';
import PathwayMap from './components/PathwayMap';
import SoundEngine from './components/SoundEngine';
import useShunyaStore from './store/useShunyaStore';
import usePathStore from './store/usePathStore';

function App() {
  const { timeLeft, status, selectedMeditation, start, pause, reset, tick } = useShunyaStore();
  const { completeStage } = usePathStore();
  
  const [currentView, setCurrentView] = useState('pathway'); // 'pathway' | 'oracle' | 'session' | 'complete'
  const [currentStage, setCurrentStage] = useState(null);

  // Handle timer tick
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, tick]);

  // Handle timer completion
  useEffect(() => {
    if (status === 'finished' && currentStage) {
      // Mark stage as complete
      completeStage(currentStage.id);
      setCurrentView('complete');
    }
  }, [status, currentStage, completeStage]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle starting a pathway stage
  const handleStartSession = (stage) => {
    setCurrentStage(stage);
    setCurrentView('oracle');
    // Reset timer with stage duration
    reset();
  };

  // Handle beginning meditation after Oracle selection
  const handleBeginMeditation = () => {
    setCurrentView('session');
    start();
  };

  // Return to pathway map
  const handleReturnToMap = () => {
    setCurrentView('pathway');
    setCurrentStage(null);
    reset();
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas - Always visible in background */}
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Polyhedron />
        
        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            height={300}
          />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>

      {/* Binaural Sound Engine */}
      <SoundEngine status={status} />

      {/* Pathway Map View */}
      {currentView === 'pathway' && (
        <PathwayMap onStartSession={handleStartSession} />
      )}

      {/* Oracle View - Mood selection for current stage */}
      {currentView === 'oracle' && currentStage && (
        <div className="absolute inset-0 z-10">
          <Oracle onBegin={handleBeginMeditation} />
          <button
            onClick={handleReturnToMap}
            className="absolute top-8 left-8 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-white/70 rounded-lg text-sm font-light hover:bg-black/60 transition"
          >
            ← Back to Pathway
          </button>
        </div>
      )}

      {/* Session View - Active meditation timer */}
      {currentView === 'session' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center mb-8">
            {currentStage && (
              <div className="mb-4">
                <div className="text-cyan-400/50 text-sm font-light mb-1">
                  {currentStage.title}
                </div>
                <div className="text-cyan-300/70 text-xs">
                  {currentStage.technique}
                </div>
              </div>
            )}
            {selectedMeditation && (
              <h2 className="text-cyan-300 text-xl font-thin mb-4 opacity-70">
                {selectedMeditation.title}
              </h2>
            )}
            <h1 className="text-white text-8xl font-thin mb-8 pointer-events-auto">
              {formatTime(timeLeft)}
            </h1>
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 pointer-events-auto">
            {status !== 'running' ? (
              <button
                onClick={start}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-light rounded-lg hover:bg-white/20 transition"
              >
                RESUME
              </button>
            ) : (
              <button
                onClick={pause}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-light rounded-lg hover:bg-white/20 transition"
              >
                PAUSE
              </button>
            )}
            
            <button
              onClick={handleReturnToMap}
              className="px-6 py-3 bg-black/40 backdrop-blur-md border border-white/10 text-white/70 font-light rounded-lg hover:bg-black/60 hover:text-white transition"
            >
              EXIT
            </button>
          </div>
        </div>
      )}

      {/* Stage Complete View */}
      {currentView === 'complete' && currentStage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/50 rounded-3xl p-12 max-w-md mx-4 pointer-events-auto shadow-2xl text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-pulse">✨</div>
              <h2 className="text-white text-3xl font-thin mb-2">
                Stage Complete
              </h2>
              <p className="text-cyan-300 text-lg mb-4">
                {currentStage.title}
              </p>
              <p className="text-white/60 text-sm font-light">
                You have journeyed deeper into the void.
              </p>
            </div>
            
            <button
              onClick={handleReturnToMap}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-white py-4 rounded-xl font-light text-lg transition-all duration-300 hover:scale-105"
            >
              Continue Journey →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
