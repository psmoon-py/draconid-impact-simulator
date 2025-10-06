import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useQuery } from '@tanstack/react-query';

interface AsteroidData {
  id: string;
  name: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  orbitalData: {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
  };
}

const fetchNEOData = async (): Promise<AsteroidData[]> => {
  const NASA_API_KEY = 'qii1L8IW1FYWR5akqTASXp0kD7rfVZMssSg60ApD';
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  
  const startDateStr = new Date().toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDateStr}&end_date=${endDateStr}&api_key=${NASA_API_KEY}`
  );
  
  if (!response.ok) throw new Error('Failed to fetch NEO data');
  
  const data = await response.json();
  const asteroids: AsteroidData[] = [];

  Object.values(data.near_earth_objects).forEach((dayData: any) => {
    dayData.forEach((neo: any) => {
      const approach = neo.close_approach_data[0];
      asteroids.push({
        id: neo.id,
        name: neo.name,
        diameter: neo.estimated_diameter.meters.estimated_diameter_max,
        velocity: parseFloat(approach.relative_velocity.kilometers_per_second),
        missDistance: parseFloat(approach.miss_distance.lunar),
        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
        closeApproachDate: approach.close_approach_date,
        orbitalData: {
          semiMajorAxis: parseFloat(neo.orbital_data?.semi_major_axis || '1'),
          eccentricity: parseFloat(neo.orbital_data?.eccentricity || '0.1'),
          inclination: parseFloat(neo.orbital_data?.inclination || '0'),
        }
      });
    });
  });

  return asteroids.slice(0, 20);
};

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e88e5"
          emissive="#0d47a1"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>
      {/* Atmosphere */}
      <Sphere args={[1.05, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

const Asteroid = ({ data, onClick, isHovered }: { 
  data: AsteroidData; 
  onClick: () => void;
  isHovered: boolean;
}) => {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const t = clock.getElapsedTime();
      const { semiMajorAxis, eccentricity, inclination } = data.orbitalData;
      
      const a = 2 + semiMajorAxis * 3;
      const e = eccentricity;
      const inc = (inclination * Math.PI) / 180;
      
      const angle = t * 0.1 + parseFloat(data.id) * 0.001;
      const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
      
      asteroidRef.current.position.x = r * Math.cos(angle);
      asteroidRef.current.position.z = r * Math.sin(angle);
      asteroidRef.current.position.y = r * Math.sin(inc) * Math.sin(angle);
      
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.005;
    }
  });

  const size = Math.max(0.02, Math.min(data.diameter / 5000, 0.2));
  const scale = (hovered || isHovered) ? 1.5 : 1;

  return (
    <group>
      <Sphere
        ref={asteroidRef}
        args={[size, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <meshStandardMaterial
          color={data.isPotentiallyHazardous ? "#ff4444" : "#8b7355"}
          roughness={0.9}
          metalness={0.2}
          emissive={data.isPotentiallyHazardous ? "#ff0000" : "#000000"}
          emissiveIntensity={data.isPotentiallyHazardous ? 0.3 : 0}
        />
      </Sphere>
      
      {(hovered || isHovered) && (
        <Html distanceFactor={10}>
          <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 min-w-[200px] pointer-events-none">
            <p className="font-semibold text-primary text-sm mb-1">{data.name}</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Diameter: {data.diameter.toFixed(0)}m</p>
              <p>Velocity: {data.velocity.toFixed(2)} km/s</p>
              <p>Miss Distance: {data.missDistance.toFixed(2)} LD</p>
              <p>Date: {data.closeApproachDate}</p>
              {data.isPotentiallyHazardous && (
                <Badge variant="destructive" className="mt-1">Potentially Hazardous</Badge>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const OrbitPath = ({ semiMajorAxis, eccentricity }: { semiMajorAxis: number; eccentricity: number }) => {
  const points: THREE.Vector3[] = [];
  const a = 2 + semiMajorAxis * 3;
  const e = eccentricity;
  
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
    points.push(new THREE.Vector3(
      r * Math.cos(angle),
      0,
      r * Math.sin(angle)
    ));
  }

  return <Line points={points} color="#00d9ff" lineWidth={0.5} transparent opacity={0.2} />;
};

const Scene = ({ asteroids, selectedId, onSelect }: { 
  asteroids: AsteroidData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) => {
  return (
    <>
      <Stars radius={300} depth={80} count={8000} factor={6} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#0088ff" />
      
      <Earth />
      
      {asteroids.map((asteroid) => (
        <Asteroid
          key={asteroid.id}
          data={asteroid}
          onClick={() => onSelect(asteroid.id)}
          isHovered={selectedId === asteroid.id}
        />
      ))}
      
      {asteroids.slice(0, 5).map((asteroid) => (
        <OrbitPath
          key={`orbit-${asteroid.id}`}
          semiMajorAxis={asteroid.orbitalData.semiMajorAxis}
          eccentricity={asteroid.orbitalData.eccentricity}
        />
      ))}
    </>
  );
};

export const SolarSystemViewer = () => {
  const [selectedAsteroid, setSelectedAsteroid] = useState<string | null>(null);
  
  const { data: asteroids = [], isLoading } = useQuery({
    queryKey: ['neo-data'],
    queryFn: fetchNEOData,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const selected = asteroids.find(a => a.id === selectedAsteroid);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Live Solar System Tracker
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real-time Near-Earth Object tracking with NASA data - Click and zoom to explore asteroids
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="w-full h-[600px] rounded-xl overflow-hidden cosmic-border bg-card/30 backdrop-blur-sm relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Loading live NASA data...</p>
              </div>
            ) : (
              <Canvas camera={{ position: [15, 8, 15], fov: 60 }}>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={50}
                  zoomSpeed={1.2}
                />
                <Scene 
                  asteroids={asteroids}
                  selectedId={selectedAsteroid}
                  onSelect={setSelectedAsteroid}
                />
              </Canvas>
            )}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground">
                Drag to rotate • Scroll to zoom • Click asteroids for details
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm space-y-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-primary sticky top-0 bg-card/95 backdrop-blur-sm py-2 -mx-6 px-6">
            Tracked Objects ({asteroids.length})
          </h3>
          <div className="space-y-3">
            {asteroids.map((asteroid) => (
              <button
                key={asteroid.id}
                onClick={() => setSelectedAsteroid(asteroid.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedAsteroid === asteroid.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 bg-card/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm line-clamp-1">{asteroid.name}</p>
                  {asteroid.isPotentiallyHazardous && (
                    <Badge variant="destructive" className="text-xs ml-2 shrink-0">PHA</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>⌀ {asteroid.diameter.toFixed(0)}m</p>
                  <p>🚀 {asteroid.velocity.toFixed(2)} km/s</p>
                  <p>📏 {asteroid.missDistance.toFixed(2)} LD</p>
                  <p>📅 {asteroid.closeApproachDate}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
