import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Polyhedron from './components/Polyhedron';
import Oracle from './components/Oracle';
import useShunyaStore from './store/useShunyaStore';

function App() {
  const { timeLeft, status, selectedMeditation, start, pause, reset, tick } = useShunyaStore();

  // Handle timer tick
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, tick]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Show Oracle only when timer is idle and not started yet
  const showOracle = status === 'idle' && timeLeft === (selectedMeditation?.duration || 1500);

  return (
    <div className="w-full h-screen bg-black relative">
      {/* 3D Canvas - Always visible in background */}
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Polyhedron />
      </Canvas>

      {/* Oracle - Show before meditation starts */}
      {showOracle && <Oracle />}

      {/* Timer Display - Show during meditation */}
      {!showOracle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center mb-8">
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
              onClick={reset}
              className="px-6 py-3 bg-black/40 backdrop-blur-md border border-white/10 text-white/70 font-light rounded-lg hover:bg-black/60 hover:text-white transition"
            >
              RESET
            </button>
          </div>

          {/* Status indicator */}
          {status === 'finished' && (
            <div className="mt-8 text-center pointer-events-auto">
              <p className="text-white text-2xl mb-4 animate-pulse">
                ✨ Journey Complete
              </p>
              <button
                onClick={reset}
                className="px-8 py-3 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg hover:bg-cyan-500/40 transition font-light"
              >
                Begin Another Journey
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
