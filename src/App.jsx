import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import useShunyaStore from './store/useShunyaStore';
import usePathStore from './store/usePathStore';
import Polyhedron from './components/Polyhedron';
import Oracle from './components/Oracle';
import PathwayMap from './components/PathwayMap';

// Safe Mode: No SoundEngine, No PostProcessing for now

const MainMenu = ({ onSelectMode }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/80 backdrop-blur-sm pointer-events-auto">
    <h1 className="text-4xl font-thin text-white mb-8 tracking-[0.5em] font-['Syncopate']">SHUNYA</h1>
    <div className="flex gap-6">
      <button 
        onClick={() => onSelectMode('ORACLE')}
        className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-all backdrop-blur-md"
      >
        <span className="block text-xl mb-1">Oracle</span>
        <span className="text-xs text-gray-400">Quick Relief</span>
      </button>
      <button 
        onClick={() => onSelectMode('PATH')}
        className="px-8 py-4 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 rounded-lg transition-all backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      >
        <span className="block text-xl mb-1">Ascension</span>
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
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Polyhedron />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* UI Layers */}
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
         <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center">
            <div className="absolute bottom-10 px-6 text-center">
               <h2 className="text-white/80 text-lg font-light tracking-widest mb-2">
                 {useShunyaStore.getState().technique?.title || "FOCUS"}
               </h2>
               <p className="text-white/50 text-sm max-w-md mx-auto">
                 {useShunyaStore.getState().technique?.instruction}
               </p>
            </div>
         </div>
      )}
    </div>
  );
}
