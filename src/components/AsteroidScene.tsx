import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Stars } from '@react-three/drei';
import * as THREE from 'three';

export const AsteroidScene = () => {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Rotate asteroid
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x = t * 0.5;
      asteroidRef.current.rotation.y = t * 0.3;
      
      // Orbital path
      const orbitRadius = 5;
      asteroidRef.current.position.x = Math.cos(t * 0.5) * orbitRadius;
      asteroidRef.current.position.z = Math.sin(t * 0.5) * orbitRadius;
      asteroidRef.current.position.y = Math.sin(t * 0.3) * 2;
    }

    // Rotate Earth
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />

      {/* Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e88e5"
          emissive="#0d47a1"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>

      {/* Earth atmosphere glow */}
      <Sphere args={[2.1, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Asteroid with trail */}
      <Trail
        width={0.5}
        length={8}
        color="#ff4444"
        attenuation={(t) => t * t}
      >
        <Sphere ref={asteroidRef} args={[0.3, 32, 32]} position={[5, 0, 0]}>
          <meshStandardMaterial
            color="#8b4513"
            roughness={0.9}
            metalness={0.1}
          />
        </Sphere>
      </Trail>

      {/* Orbital path ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.3} />
      </mesh>
    </>
  );
};
