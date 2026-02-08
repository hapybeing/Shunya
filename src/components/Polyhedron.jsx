import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Polyhedron() {
  const meshRef = useRef();

  // Rotate the polyhedron slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 0]} />
      <meshBasicMaterial 
        color="#00ffff" 
        wireframe={true}
      />
    </mesh>
  );
}
