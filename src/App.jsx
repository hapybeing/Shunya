import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Polyhedron from './components/Polyhedron';
import useTimerStore from './store/useTimerStore';

function App() {
  const { timeLeft, status, start, pause, reset, tick } = useTimerStore();

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

  return (
    <div className="w-full h-screen bg-black relative">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Polyhedron />
      </Canvas>

      {/* Timer Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-white text-8xl font-thin mb-8 pointer-events-auto">
          {formatTime(timeLeft)}
        </h1>
        
        {/* Controls */}
        <div className="flex gap-4 pointer-events-auto">
          {status !== 'running' ? (
            <button
              onClick={start}
              className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition"
            >
              START
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition"
            >
              PAUSE
            </button>
          )}
          
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded hover:bg-gray-700 transition"
          >
            RESET
          </button>
        </div>

        {/* Status indicator */}
        {status === 'finished' && (
          <p className="text-white text-2xl mt-8 animate-pulse">
            Time's up!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
