import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import useShunyaStore from './store/useShunyaStore';
import usePathStore from './store/usePathStore';
import Polyhedron from './components/Polyhedron';
import Oracle from './components/Oracle';
import PathwayMap from './components/PathwayMap';
import SoundEngine from './components/SoundEngine';

// -------------------
// 1. MAIN MENU
// -------------------
const MainMenu = ({ onSelectMode }) => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
    <h1 className="text-4xl md:text-6xl font-thin text-white mb-8 tracking-[0.5em] font-['Syncopate'] text-center select-none">
      SHUNYA
    </h1>
    <div className="flex flex-col md:flex-row gap-6">
      <button 
        onClick={() => onSelectMode('ORACLE')}
        className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-all backdrop-blur-md z-50 pointer-events-auto"
      >
        <span className="block text-xl mb-1">Oracle</span>
        <span className="text-xs text-gray-400">Quick Relief</span>
      </button>
      <button 
        onClick={() => onSelectMode('PATH')}
        className="px-8 py-4 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 rounded-lg transition-all backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] z-50 pointer-events-auto"
      >
        <span className="block text-xl mb-1">Ascension</span>
        <span className="text-xs text-cyan-300/70">The 7 Stages</span>
      </button>
    </div>
  </div>
);

// -------------------
// 2. MAIN APP
// -------------------
export default function App() {
  const [screen, setScreen] = useState('MENU'); // 'MENU', 'ORACLE', 'PATH', 'TIMER'
  
  const { status, reset, startTimer, setDuration, setTechnique } = useShunyaStore();
  const { completeStage } = usePathStore();
  const [activeStageId, setActiveStageId] = useState(null);

  // Auto-finish logic
  useEffect(() => {
    if (status === 'FINISHED') {
      if (activeStageId) {
        completeStage(activeStageId); 
      }
      setTimeout(() => {
         setScreen('MENU'); 
         reset();
      }, 5000);
    }
  }, [status, activeStageId, completeStage, reset]);

  // Start Handlers
  const handleStartPathSession = (stage) => {
    console.log("Starting Path Session:", stage.title); // Debug log
    setDuration(stage.duration);
    setTechnique(stage);
    setActiveStageId(stage.id);
    setScreen('TIMER');
    startTimer();
  };

  const handleStartOracleSession = (meditation) => {
    setDuration(meditation.duration);
    setTechnique(meditation);
    setActiveStageId(null);
    setScreen('TIMER');
    startTimer();
  };

  return (
    // "select-none" prevents text highlighting when tapping frantically
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans select-none">
      
      {/* --- AUDIO SYSTEM --- */}
      <SoundEngine />

      {/* --- 3D BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          
          <Polyhedron />
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.05} />
          </EffectComposer>

          {/* CRITICAL FIX: Disable controls when Menu/Path is open so clicks don't get stolen */}
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            enablePan={false}
            enabled={screen === 'TIMER'} 
          />
        </Canvas>
      </div>

      {/* --- UI LAYERS --- */}

      {/* Layer A: Main Menu */}
      {screen === 'MENU' && (
        <MainMenu onSelectMode={setScreen} />
      )}

      {/* Layer B: Oracle Menu */}
      {screen === 'ORACLE' && (
        <>
          <button 
            onClick={() => setScreen('MENU')} 
            className="absolute top-6 left-6 text-white/50 hover:text-white z-[60] text-sm uppercase tracking-widest"
          >
            ← Back
          </button>
          <div className="absolute inset-0 z-50 overflow-y-auto pointer-events-auto">
            <Oracle onStart={handleStartOracleSession} />
          </div>
        </>
      )}

      {/* Layer C: Ascension Path */}
      {screen === 'PATH' && (
        <>
          <button 
            onClick={() => setScreen('MENU')} 
            className="absolute top-6 left-6 text-white/50 hover:text-white z-[60] text-sm uppercase tracking-widest"
          >
            ← Back
          </button>
          {/* Note: PathwayMap has its own 'absolute inset-0' styling, so we render it directly */}
          <PathwayMap onStart={handleStartPathSession} />
        </>
      )}

      {/* Layer D: Active Timer HUD */}
      {screen === 'TIMER' && (
         <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center animate-pulse">
            <div className="absolute bottom-20 px-6 text-center">
               <h2 className="text-cyan-200 text-lg font-light tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                 {useShunyaStore.getState().technique?.title || "FOCUS"}
               </h2>
               <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto font-mono leading-relaxed">
                 {useShunyaStore.getState().technique?.instruction}
               </p>
            </div>
         </div>
      )}

    </div>
  );
}
