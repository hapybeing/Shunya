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

// Main Menu Component
const MainMenu = ({ onSelectMode }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/80 backdrop-blur-sm pointer-events-auto">
    <h1 className="text-4xl md:text-6xl font-thin text-white mb-8 tracking-[0.5em] font-['Syncopate'] text-center">
      SHUNYA
    </h1>
    <div className="flex flex-col md:flex-row gap-6">
      <button 
        onClick={() => onSelectMode('ORACLE')}
        className="px-8 py-4 border border-white/20 hover:bg-white/10 hover:border-white/40 text-white rounded-lg transition-all backdrop-blur-md group"
      >
        <span className="block text-xl mb-1 group-hover:tracking-widest transition-all">Oracle</span>
        <span className="text-xs text-gray-400">Quick Relief</span>
      </button>
      <button 
        onClick={() => onSelectMode('PATH')}
        className="px-8 py-4 border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 text-cyan-400 rounded-lg transition-all backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] group"
      >
        <span className="block text-xl mb-1 group-hover:tracking-widest transition-all">Ascension</span>
        <span className="text-xs text-cyan-300/70">The 7 Stages</span>
      </button>
    </div>
  </div>
);

export default function App() {
  const [screen, setScreen] = useState('MENU');
  
  const { status, reset, startTimer, setDuration, setTechnique } = useShunyaStore();
  const { completeStage } = usePathStore();
  const [activeStageId, setActiveStageId] = useState(null);

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

  const handleStartPathSession = (stage) => {
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
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans select-none">
      
      {/* 1. The Sound Engine (Invisible) */}
      <SoundEngine />

      {/* 2. The 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4] }}>
          {/* Lights */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          
          {/* The Core Shape */}
          <Polyhedron />
          
          {/* Post-Processing Effects (Bloom & Grain) */}
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.05} />
          </EffectComposer>

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
        </Canvas>
      </div>

      {/* 3. UI Layers */}
      {screen === 'MENU' && <MainMenu onSelectMode={setScreen} />}

      {screen === 'ORACLE' && (
        <div className="absolute inset-0 z-40 pointer-events-none">
           <div className="pointer-events-auto absolute top-0 left-0 w-full h-full">
              <button onClick={() => setScreen('MENU')} className="absolute top-4 left-4 text-white/50 hover:text-white z-50">← Back</button>
              <Oracle onStart={handleStartOracleSession} />
           </div>
        </div>
      )}

      {screen === 'PATH' && (
        <div className="absolute inset-0 z-40 pointer-events-none">
           <div className="pointer-events-auto absolute top-0 left-0 w-full h-full">
               <button onClick={() => setScreen('MENU')} className="absolute top-4 left-4 text-white/50 hover:text-white z-50">← Back</button>
               <PathwayMap onStart={handleStartPathSession} />
           </div>
        </div>
      )}

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
