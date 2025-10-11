import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, RotateCcw, List, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';

interface NEOData {
  id: string;
  designation: string;
  class: string;
  h: number;
  diameter: number;
  albedo?: number;
  velocity: number;
  missDistance: number;
  isPHA: boolean;
  nextApproach: string;
  orbitElements: {
    a: number;
    e: number;
    i: number;
    om: number;
    w: number;
    ma: number;
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

const fetchNEOData = async (): Promise<NEOData[]> => {
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
  const neos: NEOData[] = [];

  Object.values(data.near_earth_objects).forEach((dayData: any) => {
    dayData.slice(0, 25).forEach((neo: any) => {
      const approach = neo.close_approach_data[0];
      
      // Determine class from designation or default
      let neoClass = 'Aten';
      if (neo.orbital_data?.semi_major_axis) {
        const a = parseFloat(neo.orbital_data.semi_major_axis);
        if (a > 1.0) neoClass = 'Apollo';
        else if (a >= 0.9) neoClass = 'Amor';
      }

      neos.push({
        id: neo.id,
        designation: neo.name,
        class: neoClass,
        h: neo.absolute_magnitude_h,
        diameter: neo.estimated_diameter.meters.estimated_diameter_max,
        albedo: neo.absolute_magnitude_h ? 0.14 : undefined,
        velocity: parseFloat(approach.relative_velocity.kilometers_per_second),
        missDistance: parseFloat(approach.miss_distance.lunar),
        isPHA: neo.is_potentially_hazardous_asteroid,
        nextApproach: approach.close_approach_date,
        orbitElements: {
          a: parseFloat(neo.orbital_data?.semi_major_axis || '1'),
          e: parseFloat(neo.orbital_data?.eccentricity || '0.1'),
          i: parseFloat(neo.orbital_data?.inclination || '0'),
          om: parseFloat(neo.orbital_data?.ascending_node_longitude || '0'),
          w: parseFloat(neo.orbital_data?.perihelion_argument || '0'),
          ma: Math.random() * Math.PI * 2,
        }
      });
    });
  });

  return neos;
};

const Sun = () => (
  <group>
    <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
      <meshBasicMaterial color="#FDB813" toneMapped={false} />
    </Sphere>
    <Sphere args={[2.3, 64, 64]} position={[0, 0, 0]}>
      <meshBasicMaterial color="#ff9500" transparent opacity={0.3} toneMapped={false} />
    </Sphere>
    <pointLight position={[0, 0, 0]} intensity={3} distance={200} color="#ffffff" />
  </group>
);

const Planet = ({ data, timeSpeed, onClick, isFocused }: {
  data: PlanetData;
  timeSpeed: number;
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

        {(hovered || isFocused) && (
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

const NEOObject = ({ data, onClick, isSelected, timeSpeed }: {
  data: NEOData;
  onClick: () => void;
  isSelected: boolean;
  timeSpeed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * timeSpeed;
      const { a, e, i, ma } = data.orbitElements;

      const scaledA = 5 + a * 2;
      const scaledE = Math.min(e, 0.9);
      const inc = (i * Math.PI) / 180;

      const M = ma + t * 0.05;
      let E = M;
      for (let iter = 0; iter < 5; iter++) {
        E = M + scaledE * Math.sin(E);
      }

      const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + scaledE) * Math.sin(E / 2),
        Math.sqrt(1 - scaledE) * Math.cos(E / 2)
      );

      const r = scaledA * (1 - scaledE * scaledE) / (1 + scaledE * Math.cos(trueAnomaly));

      ref.current.position.x = r * Math.cos(trueAnomaly) * Math.cos(inc);
      ref.current.position.z = r * Math.sin(trueAnomaly) * Math.cos(inc);
      ref.current.position.y = r * Math.sin(trueAnomaly) * Math.sin(inc);

      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.005;
    }
  });

  const size = Math.max(0.05, Math.min(data.diameter / 3000, 0.3));
  const scale = (hovered || isSelected) ? 1.8 : 1;

  return (
    <group>
      <Sphere
        ref={ref}
        args={[size, 12, 12]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <meshStandardMaterial
          color={data.isPHA ? "#ff4444" : "#8b7355"}
          roughness={0.95}
          metalness={0.1}
          emissive={data.isPHA ? "#ff0000" : "#552200"}
          emissiveIntensity={data.isPHA ? 0.5 : 0.2}
        />
      </Sphere>

      {(hovered || isSelected) && (
        <Html distanceFactor={15}>
          <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 min-w-[220px] pointer-events-none">
            <p className="font-semibold text-primary text-sm mb-1">{data.designation}</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Class: {data.class}</p>
              <p>Diameter: {data.diameter.toFixed(0)}m</p>
              <p>H: {data.h.toFixed(1)}</p>
              {data.isPHA && (
                <Badge variant="destructive" className="mt-1 text-xs">⚠ PHA</Badge>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const NEOOrbit = ({ data, isSelected }: { data: NEOData; isSelected: boolean }) => {
  const points: THREE.Vector3[] = [];
  const { a, e, i } = data.orbitElements;

  const scaledA = 5 + a * 2;
  const scaledE = Math.min(e, 0.9);
  const inc = (i * Math.PI) / 180;

  for (let idx = 0; idx <= 128; idx++) {
    const angle = (idx / 128) * Math.PI * 2;
    const r = scaledA * (1 - scaledE * scaledE) / (1 + scaledE * Math.cos(angle));
    points.push(new THREE.Vector3(
      r * Math.cos(angle) * Math.cos(inc),
      r * Math.sin(angle) * Math.sin(inc),
      r * Math.sin(angle) * Math.cos(inc)
    ));
  }

  return (
    <Line
      points={points}
      color={isSelected ? "#00d9ff" : data.isPHA ? "#ff4444" : "#666666"}
      lineWidth={isSelected ? 2 : 1}
      transparent
      opacity={isSelected ? 0.6 : 0.2}
    />
  );
};

const Scene = ({
  neos,
  selectedId,
  onSelect,
  timeSpeed,
  showOrbits,
  focusedPlanet,
  onFocusPlanet
}: {
  neos: NEOData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  timeSpeed: number;
  showOrbits: boolean;
  focusedPlanet: string | null;
  onFocusPlanet: (name: string) => void;
}) => {
  const { gl } = useThree();
  
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
  }, [gl]);

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
          onClick={() => onFocusPlanet(planet.name)}
          isFocused={focusedPlanet === planet.name}
        />
      ))}

      {showOrbits && neos.map((neo) => (
        <NEOOrbit
          key={`orbit-${neo.id}`}
          data={neo}
          isSelected={selectedId === neo.id}
        />
      ))}

      {neos.map((neo) => (
        <NEOObject
          key={neo.id}
          data={neo}
          onClick={() => onSelect(neo.id)}
          isSelected={selectedId === neo.id}
          timeSpeed={timeSpeed}
        />
      ))}
    </>
  );
};

export const Enhanced3DViewer = () => {
  const [selectedNEO, setSelectedNEO] = useState<string | null>(null);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: neos = [], isLoading } = useQuery({
    queryKey: ['enhanced-neo-data'],
    queryFn: fetchNEOData,
    refetchInterval: 300000,
  });

  const handleReset = () => {
    setTimeSpeed(1);
    setIsPaused(false);
    setSelectedNEO(null);
    setFocusedPlanet(null);
    setDetailsOpen(false);
  };

  const handleNEOClick = (id: string) => {
    setSelectedNEO(id);
    setDetailsOpen(true);
  };

  const currentTimeSpeed = isPaused ? 0 : timeSpeed;
  const selectedObject = neos.find(n => n.id === selectedNEO);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Live 3D Solar System Viewer
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real-time visualization with NASA orbital data • Click objects for details
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="w-full h-[700px] rounded-xl overflow-hidden cosmic-border bg-black relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-center space-y-2">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-muted-foreground">Loading NASA data...</p>
                </div>
              </div>
            ) : (
              <Canvas camera={{ position: [40, 25, 40], fov: 50 }} gl={{ antialias: true }}>
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={100}
                  zoomSpeed={1.5}
                />
                <Scene
                  neos={neos}
                  selectedId={selectedNEO}
                  onSelect={handleNEOClick}
                  timeSpeed={currentTimeSpeed}
                  showOrbits={showOrbits}
                  focusedPlanet={focusedPlanet}
                  onFocusPlanet={setFocusedPlanet}
                />
              </Canvas>
            )}

            {/* Controls overlay */}
            <div className="absolute top-4 left-4 space-y-2 z-10">
              <Card className="bg-card/90 backdrop-blur-sm px-4 py-3 space-y-3 min-w-[280px] cosmic-border">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSidebar(true)}
                      className="h-7 w-7 p-0 lg:hidden"
                    >
                      <List className="h-3 w-3" />
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

                <Button
                  size="sm"
                  variant={showOrbits ? "default" : "outline"}
                  onClick={() => setShowOrbits(!showOrbits)}
                  className="text-xs h-7 w-full"
                >
                  {showOrbits ? 'Hide' : 'Show'} Orbits
                </Button>
              </Card>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 z-10">
              <p className="text-xs text-muted-foreground">
                Click and drag to rotate • Scroll to zoom • Click NEOs for details
              </p>
            </div>
          </div>
        </div>

        {/* NEO List Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm h-[700px] flex flex-col">
            <h3 className="text-lg font-semibold text-primary mb-4">Near-Earth Objects ({neos.length})</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {neos.map((neo) => (
                  <button
                    key={neo.id}
                    onClick={() => handleNEOClick(neo.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedNEO === neo.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-card/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold text-sm truncate pr-2">{neo.designation}</span>
                      {neo.isPHA && (
                        <Badge variant="destructive" className="text-xs shrink-0">PHA</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Class: {neo.class}</p>
                    <p className="text-xs text-muted-foreground">H: {neo.h.toFixed(1)} • {neo.diameter.toFixed(0)}m</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Near-Earth Objects ({neos.length})</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            <div className="space-y-2">
              {neos.map((neo) => (
                <button
                  key={neo.id}
                  onClick={() => {
                    handleNEOClick(neo.id);
                    setShowSidebar(false);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedNEO === neo.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-card/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-sm truncate pr-2">{neo.designation}</span>
                    {neo.isPHA && (
                      <Badge variant="destructive" className="text-xs shrink-0">PHA</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Class: {neo.class}</p>
                  <p className="text-xs text-muted-foreground">H: {neo.h.toFixed(1)} • {neo.diameter.toFixed(0)}m</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Details Panel */}
      {detailsOpen && selectedObject && (
        <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-primary">{selectedObject.designation}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedObject.class} • {selectedObject.isPHA ? 'Potentially Hazardous Asteroid' : 'Non-hazardous'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Physical Properties</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Absolute Magnitude (H):</span>
                  <span className="font-mono">{selectedObject.h.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diameter:</span>
                  <span className="font-mono">~{selectedObject.diameter.toFixed(0)}m</span>
                </div>
                {selectedObject.albedo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Albedo (est.):</span>
                    <span className="font-mono">{selectedObject.albedo.toFixed(3)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocity:</span>
                  <span className="font-mono">{selectedObject.velocity.toFixed(2)} km/s</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Orbital Elements</h4>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">a (semi-major axis):</span>
                  <span>{selectedObject.orbitElements.a.toFixed(3)} AU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">e (eccentricity):</span>
                  <span>{selectedObject.orbitElements.e.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">i (inclination):</span>
                  <span>{selectedObject.orbitElements.i.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miss distance:</span>
                  <span>{selectedObject.missDistance.toFixed(2)} LD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm">
              <span className="font-semibold">Next Close Approach:</span> {selectedObject.nextApproach}
            </p>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(selectedObject.designation)}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View in SBDB
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://cneos.jpl.nasa.gov/', '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              CNEOS Data
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
