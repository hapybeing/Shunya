import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useTimerStore from '../store/useTimerStore';

export default function Polyhedron() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const geometryRef = useRef();
  
  // Access timer state
  const timeLeft = useTimerStore((state) => state.timeLeft);
  
  // Total time (25 minutes = 1500 seconds)
  const TOTAL_TIME = 1500;
  
  // Create geometry and store original positions
  const { geometry, originalPositions, vertexCount } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    geometryRef.current = geo;
    
    const positions = geo.attributes.position.array;
    const count = positions.length / 3;
    
    // Store original positions for each vertex
    const original = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i++) {
      original[i] = positions[i];
    }
    
    return {
      geometry: geo,
      originalPositions: original,
      vertexCount: count
    };
  }, []);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!geometryRef.current) return;
    
    const positions = geometryRef.current.attributes.position.array;
    
    // Calculate progress (0 = start, 1 = finished)
    const progress = Math.min(1, Math.max(0, (TOTAL_TIME - timeLeft) / TOTAL_TIME));
    
    // Collapse threshold: what percentage of vertices should be collapsed
    const collapseThreshold = progress;
    
    // Update each vertex
    for (let i = 0; i < vertexCount; i++) {
      const idx = i * 3;
      
      // Assign each vertex a unique "expiration point" based on its index
      // This creates a wave of collapse from 0 to 1
      const vertexThreshold = i / vertexCount;
      
      // Check if this vertex should be collapsed
      if (progress >= vertexThreshold) {
        // Vertex is "expired" - lerp to center (0, 0, 0)
        const lerpFactor = Math.min(1, (progress - vertexThreshold) * 5); // Speed up collapse
        
        positions[idx] = THREE.MathUtils.lerp(originalPositions[idx], 0, lerpFactor);
        positions[idx + 1] = THREE.MathUtils.lerp(originalPositions[idx + 1], 0, lerpFactor);
        positions[idx + 2] = THREE.MathUtils.lerp(originalPositions[idx + 2], 0, lerpFactor);
      } else {
        // Vertex is "safe" - stay at original position
        positions[idx] = originalPositions[idx];
        positions[idx + 1] = originalPositions[idx + 1];
        positions[idx + 2] = originalPositions[idx + 2];
      }
    }
    
    // Critical: notify Three.js that positions have changed
    geometryRef.current.attributes.position.needsUpdate = true;
    
    // Slow rotation for aesthetic
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.1;
      pointsRef.current.rotation.y += delta * 0.15;
    }
    if (linesRef.current) {
      linesRef.current.rotation.x += delta * 0.1;
      linesRef.current.rotation.y += delta * 0.15;
    }
  });
  
  // When timer reaches 0, show bright singularity
  const isSingularity = timeLeft === 0;
  const pointColor = isSingularity ? '#FFFFFF' : '#00FFFF';
  const lineColor = isSingularity ? '#FFFFFF' : '#00FFFF';
  const pointSize = isSingularity ? 0.3 : 0.15;
  
  return (
    <group>
      {/* Glowing Points (vertices) */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color={pointColor}
          size={pointSize}
          sizeAttenuation={true}
          transparent={true}
          opacity={isSingularity ? 1.0 : 0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Wireframe Lines (edges) */}
      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial
          color={lineColor}
          transparent={true}
          opacity={isSingularity ? 1.0 : 0.6}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Extra bright core when collapsed */}
      {isSingularity && (
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent={true}
            opacity={1.0}
          />
        </mesh>
      )}
    </group>
  );
}
