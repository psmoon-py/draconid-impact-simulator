import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, RotateCcw, ZoomIn, Target } from 'lucide-react';

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
    meanAnomaly: number;
  };
}

interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  color: string;
  emissive: string;
  rotationSpeed: number;
  orbitSpeed: number;
  rings?: { innerRadius: number; outerRadius: number; color: string };
}

const PLANETS: PlanetData[] = [
  { name: 'Mercury', radius: 0.15, distance: 3, color: '#8c7853', emissive: '#4a3f2e', rotationSpeed: 0.002, orbitSpeed: 0.04 },
  { name: 'Venus', radius: 0.35, distance: 5, color: '#ffc649', emissive: '#d4a843', rotationSpeed: 0.001, orbitSpeed: 0.025 },
  { name: 'Earth', radius: 0.4, distance: 7, color: '#1e88e5', emissive: '#0d47a1', rotationSpeed: 0.005, orbitSpeed: 0.02 },
  { name: 'Mars', radius: 0.25, distance: 9, color: '#cd5c5c', emissive: '#8b3a3a', rotationSpeed: 0.004, orbitSpeed: 0.015 },
  { name: 'Jupiter', radius: 1.2, distance: 14, color: '#daa520', emissive: '#8b6914', rotationSpeed: 0.01, orbitSpeed: 0.008 },
  { name: 'Saturn', radius: 1.0, distance: 19, color: '#f4a460', emissive: '#cd853f', rotationSpeed: 0.008, orbitSpeed: 0.006, 
    rings: { innerRadius: 1.3, outerRadius: 2.0, color: '#c9a861' } },
  { name: 'Uranus', radius: 0.6, distance: 24, color: '#4fd0e0', emissive: '#2e7d8a', rotationSpeed: 0.006, orbitSpeed: 0.004 },
  { name: 'Neptune', radius: 0.58, distance: 28, color: '#4169e1', emissive: '#27408b', rotationSpeed: 0.005, orbitSpeed: 0.003 },
];

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
          meanAnomaly: Math.random() * Math.PI * 2,
        }
      });
    });
  });

  return asteroids.slice(0, 30);
};

const Sun = () => {
  return (
    <group>
      <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FDB813" />
      </Sphere>
      <Sphere args={[2.3, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff9500" transparent opacity={0.3} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={3} distance={200} color="#ffffff" />
    </group>
  );
};

const Planet = ({ data, timeSpeed, showLabels, onClick, isFocused }: { 
  data: PlanetData; 
  timeSpeed: number;
  showLabels: boolean;
  onClick: () => void;
  isFocused: boolean;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (groupRef.current && planetRef.current) {
      const t = clock.getElapsedTime() * timeSpeed;
      groupRef.current.rotation.y = t * data.orbitSpeed;
      planetRef.current.rotation.y += data.rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[data.distance, 0, 0]}>
        <Sphere
          ref={planetRef}
          args={[data.radius, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isFocused ? 1.3 : 1}
        >
          <meshStandardMaterial
            color={data.color}
            emissive={data.emissive}
            emissiveIntensity={0.4}
            roughness={0.7}
            metalness={0.3}
          />
        </Sphere>
        
        {data.rings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.rings.innerRadius, data.rings.outerRadius, 64]} />
            <meshBasicMaterial color={data.rings.color} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
        
        {(showLabels || hovered || isFocused) && (
          <Text
            position={[0, data.radius + 0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {data.name}
          </Text>
        )}
      </group>
    </group>
  );
};

const PlanetOrbit = ({ distance }: { distance: number }) => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(
      distance * Math.cos(angle),
      0,
      distance * Math.sin(angle)
    ));
  }
  return <Line points={points} color="#444444" lineWidth={1} transparent opacity={0.3} />;
};

const Asteroid = ({ data, onClick, isHovered, timeSpeed }: { 
  data: AsteroidData; 
  onClick: () => void;
  isHovered: boolean;
  timeSpeed: number;
}) => {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const t = clock.getElapsedTime() * timeSpeed;
      const { semiMajorAxis, eccentricity, inclination, meanAnomaly } = data.orbitalData;
      
      const a = 5 + semiMajorAxis * 2;
      const e = Math.min(eccentricity, 0.9);
      const inc = (inclination * Math.PI) / 180;
      
      const M = meanAnomaly + t * 0.05;
      let E = M;
      for (let i = 0; i < 5; i++) {
        E = M + e * Math.sin(E);
      }
      
      const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      );
      
      const r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
      
      asteroidRef.current.position.x = r * Math.cos(trueAnomaly) * Math.cos(inc);
      asteroidRef.current.position.z = r * Math.sin(trueAnomaly) * Math.cos(inc);
      asteroidRef.current.position.y = r * Math.sin(trueAnomaly) * Math.sin(inc);
      
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.005;
    }
  });

  const size = Math.max(0.05, Math.min(data.diameter / 3000, 0.3));
  const scale = (hovered || isHovered) ? 1.8 : 1;

  return (
    <group>
      <Sphere
        ref={asteroidRef}
        args={[size, 12, 12]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <meshStandardMaterial
          color={data.isPotentiallyHazardous ? "#ff4444" : "#8b7355"}
          roughness={0.95}
          metalness={0.1}
          emissive={data.isPotentiallyHazardous ? "#ff0000" : "#552200"}
          emissiveIntensity={data.isPotentiallyHazardous ? 0.5 : 0.2}
        />
      </Sphere>
      
      {(hovered || isHovered) && (
        <>
          <Html distanceFactor={15}>
            <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 min-w-[220px] pointer-events-none">
              <p className="font-semibold text-primary text-sm mb-1">{data.name}</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Diameter: {data.diameter.toFixed(0)}m</p>
                <p>Velocity: {data.velocity.toFixed(2)} km/s</p>
                <p>Miss Distance: {data.missDistance.toFixed(2)} LD</p>
                <p>Approach: {data.closeApproachDate}</p>
                {data.isPotentiallyHazardous && (
                  <Badge variant="destructive" className="mt-1">⚠ Potentially Hazardous</Badge>
                )}
              </div>
            </div>
          </Html>
          <Sphere args={[size * 2, 16, 16]} scale={scale}>
            <meshBasicMaterial color={data.isPotentiallyHazardous ? "#ff0000" : "#ffaa00"} transparent opacity={0.1} />
          </Sphere>
        </>
      )}
    </group>
  );
};

const AsteroidOrbit = ({ data, isSelected }: { data: AsteroidData; isSelected: boolean }) => {
  const points: THREE.Vector3[] = [];
  const { semiMajorAxis, eccentricity, inclination } = data.orbitalData;
  
  const a = 5 + semiMajorAxis * 2;
  const e = Math.min(eccentricity, 0.9);
  const inc = (inclination * Math.PI) / 180;
  
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
    points.push(new THREE.Vector3(
      r * Math.cos(angle) * Math.cos(inc),
      r * Math.sin(angle) * Math.sin(inc),
      r * Math.sin(angle) * Math.cos(inc)
    ));
  }

  return (
    <Line 
      points={points} 
      color={isSelected ? "#00d9ff" : data.isPotentiallyHazardous ? "#ff4444" : "#666666"} 
      lineWidth={isSelected ? 2 : 1} 
      transparent 
      opacity={isSelected ? 0.6 : 0.2} 
    />
  );
};

const CameraController = ({ focusTarget }: { focusTarget: THREE.Vector3 | null }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    if (focusTarget) {
      camera.lookAt(focusTarget);
    }
  });
  
  return null;
};

const Scene = ({ 
  asteroids, 
  selectedId, 
  onSelect, 
  timeSpeed, 
  showOrbits, 
  showLabels,
  focusedPlanet,
  onFocusPlanet 
}: { 
  asteroids: AsteroidData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  timeSpeed: number;
  showOrbits: boolean;
  showLabels: boolean;
  focusedPlanet: string | null;
  onFocusPlanet: (name: string) => void;
}) => {
  return (
    <>
      <Stars radius={500} depth={100} count={12000} factor={8} saturation={0} fade speed={0.5} />
      
      <ambientLight intensity={0.2} />
      
      <Sun />
      
      {showOrbits && PLANETS.map((planet) => (
        <PlanetOrbit key={`orbit-${planet.name}`} distance={planet.distance} />
      ))}
      
      {PLANETS.map((planet) => (
        <Planet
          key={planet.name}
          data={planet}
          timeSpeed={timeSpeed}
          showLabels={showLabels}
          onClick={() => onFocusPlanet(planet.name)}
          isFocused={focusedPlanet === planet.name}
        />
      ))}
      
      {showOrbits && asteroids.map((asteroid) => (
        <AsteroidOrbit
          key={`orbit-${asteroid.id}`}
          data={asteroid}
          isSelected={selectedId === asteroid.id}
        />
      ))}
      
      {asteroids.map((asteroid) => (
        <Asteroid
          key={asteroid.id}
          data={asteroid}
          onClick={() => onSelect(asteroid.id)}
          isHovered={selectedId === asteroid.id}
          timeSpeed={timeSpeed}
        />
      ))}
    </>
  );
};

export const SolarSystemViewer = () => {
  const [selectedAsteroid, setSelectedAsteroid] = useState<string | null>(null);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  
  const { data: asteroids = [], isLoading } = useQuery({
    queryKey: ['neo-data'],
    queryFn: fetchNEOData,
    refetchInterval: 300000,
  });

  const handleReset = () => {
    setTimeSpeed(1);
    setIsPaused(false);
    setSelectedAsteroid(null);
    setFocusedPlanet(null);
  };

  const currentTimeSpeed = isPaused ? 0 : timeSpeed;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Live Solar System Explorer
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our solar system with real-time NASA data - Interactive 3D visualization
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="w-full h-[700px] rounded-xl overflow-hidden cosmic-border bg-card/30 backdrop-blur-sm relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-muted-foreground">Loading live NASA data...</p>
                </div>
              </div>
            ) : (
              <Canvas camera={{ position: [40, 25, 40], fov: 50 }}>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={100}
                  zoomSpeed={1.5}
                />
                <Scene 
                  asteroids={asteroids}
                  selectedId={selectedAsteroid}
                  onSelect={setSelectedAsteroid}
                  timeSpeed={currentTimeSpeed}
                  showOrbits={showOrbits}
                  showLabels={showLabels}
                  focusedPlanet={focusedPlanet}
                  onFocusPlanet={setFocusedPlanet}
                />
              </Canvas>
            )}
            
            {/* Controls overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-card/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/30 space-y-3 min-w-[280px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Time Controls</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isPaused ? "default" : "outline"}
                      onClick={() => setIsPaused(!isPaused)}
                      className="h-7 w-7 p-0"
                    >
                      {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleReset}
                      className="h-7 w-7 p-0"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Speed</span>
                    <span>{timeSpeed}x</span>
                  </div>
                  <Slider
                    value={[timeSpeed]}
                    onValueChange={([v]) => setTimeSpeed(v)}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={showOrbits ? "default" : "outline"}
                    onClick={() => setShowOrbits(!showOrbits)}
                    className="text-xs h-7"
                  >
                    Orbits
                  </Button>
                  <Button
                    size="sm"
                    variant={showLabels ? "default" : "outline"}
                    onClick={() => setShowLabels(!showLabels)}
                    className="text-xs h-7"
                  >
                    Labels
                  </Button>
                </div>
              </div>

              {focusedPlanet && (
                <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30">
                  <p className="text-xs text-primary font-semibold">Focused: {focusedPlanet}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground">
                🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click objects to select
              </p>
            </div>

            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/30">
              <div className="text-xs space-y-1">
                <p className="font-semibold text-primary mb-2">Legend</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FDB813]" />
                  <span className="text-muted-foreground">Sun & Planets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8b7355]" />
                  <span className="text-muted-foreground">Asteroids</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff4444]" />
                  <span className="text-muted-foreground">Potentially Hazardous</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-primary mb-3">Planets</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {PLANETS.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setFocusedPlanet(planet.name === focusedPlanet ? null : planet.name)}
                  className={`w-full text-left p-2 rounded border transition-all text-xs ${
                    focusedPlanet === planet.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: planet.color }} />
                    <span className="font-medium">{planet.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm space-y-3 max-h-[450px] flex flex-col">
            <h3 className="text-sm font-semibold text-primary">
              Near-Earth Objects ({asteroids.length})
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1">
              {asteroids.map((asteroid) => (
                <button
                  key={asteroid.id}
                  onClick={() => setSelectedAsteroid(asteroid.id === selectedAsteroid ? null : asteroid.id)}
                  className={`w-full text-left p-2 rounded border transition-all ${
                    selectedAsteroid === asteroid.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-card/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-xs line-clamp-1 flex-1">{asteroid.name}</p>
                    {asteroid.isPotentiallyHazardous && (
                      <Badge variant="destructive" className="text-[10px] h-4 ml-1 shrink-0">PHA</Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-0.5">
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
    </div>
  );
};
