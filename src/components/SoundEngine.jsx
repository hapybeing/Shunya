import { useEffect, useRef } from 'react';

export default function SoundEngine({ status }) {
  const audioContextRef = useRef(null);
  const oscillatorLeftRef = useRef(null);
  const oscillatorRightRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pannerLeftRef = useRef(null);
  const pannerRightRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Initialize Audio Context
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain node for volume control and fading
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        // Create stereo panners for binaural effect
        pannerLeftRef.current = audioContextRef.current.createStereoPanner();
        pannerLeftRef.current.pan.setValueAtTime(-1, audioContextRef.current.currentTime); // Full left
        pannerLeftRef.current.connect(gainNodeRef.current);
        
        pannerRightRef.current = audioContextRef.current.createStereoPanner();
        pannerRightRef.current.pan.setValueAtTime(1, audioContextRef.current.currentTime); // Full right
        pannerRightRef.current.connect(gainNodeRef.current);
      }
    };

    const play = () => {
      if (isPlayingRef.current) return;
      
      initAudio();
      
      const ctx = audioContextRef.current;
      const currentTime = ctx.currentTime;
      
      // Create left oscillator at 110Hz (base frequency)
      oscillatorLeftRef.current = ctx.createOscillator();
      oscillatorLeftRef.current.type = 'sine';
      oscillatorLeftRef.current.frequency.setValueAtTime(110, currentTime);
      oscillatorLeftRef.current.connect(pannerLeftRef.current);
      
      // Create right oscillator at 110Hz + 7Hz (binaural beat at 7Hz - theta wave)
      oscillatorRightRef.current = ctx.createOscillator();
      oscillatorRightRef.current.type = 'sine';
      oscillatorRightRef.current.frequency.setValueAtTime(117, currentTime);
      oscillatorRightRef.current.connect(pannerRightRef.current);
      
      // Start oscillators
      oscillatorLeftRef.current.start(currentTime);
      oscillatorRightRef.current.start(currentTime);
      
      // Fade in over 3 seconds
      gainNodeRef.current.gain.cancelScheduledValues(currentTime);
      gainNodeRef.current.gain.setValueAtTime(0, currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.15, currentTime + 3);
      
      isPlayingRef.current = true;
    };

    const stop = () => {
      if (!isPlayingRef.current) return;
      
      const ctx = audioContextRef.current;
      const currentTime = ctx.currentTime;
      
      // Fade out over 2 seconds
      gainNodeRef.current.gain.cancelScheduledValues(currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 2);
      
      // Stop oscillators after fade out
      if (oscillatorLeftRef.current) {
        oscillatorLeftRef.current.stop(currentTime + 2);
        oscillatorLeftRef.current = null;
      }
      if (oscillatorRightRef.current) {
        oscillatorRightRef.current.stop(currentTime + 2);
        oscillatorRightRef.current = null;
      }
      
      isPlayingRef.current = false;
    };

    // Control playback based on status
    if (status === 'running') {
      play();
    } else {
      stop();
    }

    // Cleanup on unmount
    return () => {
      stop();
    };
  }, [status]);

  // Resume audio context on user interaction (browser requirement)
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    document.addEventListener('click', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);

    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  return null; // This component doesn't render anything
}
