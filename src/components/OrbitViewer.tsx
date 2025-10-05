import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AsteroidScene } from './AsteroidScene';

export const OrbitViewer = () => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden cosmic-border bg-card/30 backdrop-blur-sm">
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />
        <AsteroidScene />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30">
        <p className="text-xs text-muted-foreground">
          Drag to rotate • Scroll to zoom • Click and drag to pan
        </p>
      </div>
    </div>
  );
};
