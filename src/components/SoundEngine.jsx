import { useEffect, useRef } from 'react';
import useShunyaStore from '../store/useShunyaStore';

export default function SoundEngine() {
  const { status } = useShunyaStore();
  const audioCtx = useRef(null);
  const oscillator = useRef(null);
  const gainNode = useRef(null);

  useEffect(() => {
    // Initialize Audio Context on first user interaction (browser policy)
    if (!audioCtx.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new AudioContext();
      
      // Create Volume Control
      gainNode.current = audioCtx.current.createGain();
      gainNode.current.gain.value = 0; // Start silent
      gainNode.current.connect(audioCtx.current.destination);

      // Create Oscillator (The Drone)
      oscillator.current = audioCtx.current.createOscillator();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(110, audioCtx.current.currentTime); // 110Hz
      oscillator.current.connect(gainNode.current);
      oscillator.current.start();
    }

    // Logic: Fade In/Out based on Timer Status
    const now = audioCtx.current.currentTime;
    
    if (status === 'RUNNING') {
      // Resume context if suspended
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
      // Fade In (3 seconds)
      gainNode.current.gain.cancelScheduledValues(now);
      gainNode.current.gain.linearRampToValueAtTime(0.15, now + 3); 
    } else {
      // Fade Out (2 seconds)
      gainNode.current.gain.cancelScheduledValues(now);
      gainNode.current.gain.linearRampToValueAtTime(0, now + 2);
    }

    return () => {
      // Cleanup not strictly necessary for singleton, but good practice
    };
  }, [status]);

  return null; // This component has no visuals
}
