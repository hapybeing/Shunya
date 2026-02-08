// src/pathways.js

export const voidPath = {
  id: 'path-void',
  title: 'The Path of the Void',
  description: 'Ancient techniques from the Vigyan Bhairava Tantra to dissolve the ego.',
  totalStages: 7,
  stages: [
    {
      id: 1,
      title: 'The Pause',
      technique: 'Breath Awareness',
      instruction: 'Focus only on the gap between your inhale and exhale. The void exists in that split second of silence.',
      duration: 300, // 5 minutes
      locked: false // First one is free
    },
    {
      id: 2,
      title: 'The Turning',
      technique: 'Retrograde Attention',
      instruction: 'As you breathe in, feel the breath turn down. As you breathe out, feel it turn up. Be the turning point.',
      duration: 480,
      locked: true
    },
    {
      id: 3,
      title: 'The Skin of Nothingness',
      technique: 'Dissolution',
      instruction: 'Imagine your skin is just a thin shell separating the infinite void outside from the infinite void inside. Pop the shell.',
      duration: 600,
      locked: true
    },
    {
      id: 4,
      title: 'The Silent Sound',
      technique: 'Anahata',
      instruction: 'Cover your ears. Listen to the sound of silence within. It is a hum that has no source. Dive into it.',
      duration: 600,
      locked: true
    },
    {
      id: 5,
      title: 'The Dark Mirror',
      technique: 'Trataka',
      instruction: 'Close your eyes. Stare into the darkness. Do not look for light. Accept the darkness as the mother of all light.',
      duration: 720,
      locked: true
    },
    {
      id: 6,
      title: 'The Sky Mind',
      technique: 'Expansion',
      instruction: 'Go outside or imagine the sky. Your mind is not in your head. Your mind is the blue sky. It has no walls.',
      duration: 900,
      locked: true
    },
    {
      id: 7,
      title: 'SHUNYA',
      technique: 'Total Abandonment',
      instruction: 'Drop all techniques. Drop the observer. Be the zero point.',
      duration: 1200,
      locked: true
    }
  ]
};
