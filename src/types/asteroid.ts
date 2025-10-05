export interface AsteroidMaterial {
  id: string;
  name: string;
  density: number; // kg/m³
  description: string;
  color: string;
  examples: string;
}

export const ASTEROID_MATERIALS: AsteroidMaterial[] = [
  {
    id: 'iron',
    name: 'Iron (M-type)',
    density: 7800,
    description: 'Metallic asteroids composed primarily of iron and nickel. These are the densest type and produce the most devastating impacts.',
    color: '#8b8b8b',
    examples: 'Psyche, most meteorites found on Earth',
  },
  {
    id: 'stone',
    name: 'Stone (S-type)',
    density: 3000,
    description: 'Rocky asteroids made of silicate minerals. The most common type, similar to Earth rocks.',
    color: '#a0826d',
    examples: 'Eros, Itokawa, most near-Earth asteroids',
  },
  {
    id: 'carbon',
    name: 'Carbon (C-type)',
    density: 2000,
    description: 'Dark, primitive asteroids rich in carbon compounds and water. Less dense but still dangerous.',
    color: '#3d3d3d',
    examples: 'Bennu (OSIRIS-REx target), Ryugu',
  },
  {
    id: 'ice',
    name: 'Ice/Comet',
    density: 1000,
    description: 'Icy bodies with frozen water, CO2, and organics. Low density but high velocity impacts.',
    color: '#b0e0e6',
    examples: "Halley's Comet, 67P/Churyumov-Gerasimenko",
  },
  {
    id: 'gold',
    name: 'Platinum-Rich',
    density: 8000,
    description: 'Rare metallic asteroids with high concentrations of precious metals. Extremely dense and valuable.',
    color: '#ffd700',
    examples: 'Psyche (theoretical), certain M-type cores',
  },
];

export interface ImpactLocation {
  lat: number;
  lng: number;
  name: string;
  type: 'land' | 'ocean';
}

export interface AsteroidParameters {
  diameter: number; // meters
  material: AsteroidMaterial;
  velocity: number; // km/s
  angle: number; // degrees
  location: ImpactLocation;
}

export interface DetailedImpactResults {
  // Energy
  energyJoules: number;
  energyMegatons: number;
  tntEquivalent: string;
  
  // Crater
  craterDiameter: number;
  craterDepth: number;
  craterVolume: number;
  
  // Blast Effects
  blastRadius: number;
  overpressureAt1km: number;
  
  // Thermal
  thermalRadius: number;
  fireballDuration: number;
  
  // Seismic
  seismicMagnitude: number;
  groundShakingRadius: number;
  
  // Special Effects
  tsunamiHeight?: number;
  tsunamiTravelTime?: number;
  airburstAltitude?: number;
  
  // Population Impact
  estimatedCasualties: number;
  affectedPopulation: number;
  
  // Classification
  impactClass: string;
  torinoScale: number;
}

export interface MitigationStrategy {
  id: string;
  name: string;
  description: string;
  minLeadTime: number; // days
  successProbability: number;
  cost: string;
  technology: string;
}

export const MITIGATION_STRATEGIES: MitigationStrategy[] = [
  {
    id: 'kinetic',
    name: 'Kinetic Impactor',
    description: 'Ram a spacecraft into the asteroid to change its velocity. Proven technology (DART mission 2022).',
    minLeadTime: 365,
    successProbability: 0.75,
    cost: '$300M - $500M',
    technology: 'Current (NASA DART)',
  },
  {
    id: 'gravity',
    name: 'Gravity Tractor',
    description: 'Hover a spacecraft near the asteroid and use gravitational attraction to slowly alter its path.',
    minLeadTime: 1825, // 5 years
    successProbability: 0.65,
    cost: '$1B - $2B',
    technology: 'Near-term feasible',
  },
  {
    id: 'nuclear',
    name: 'Nuclear Deflection',
    description: 'Detonate a nuclear device near (not on) the asteroid to vaporize surface material and create thrust.',
    minLeadTime: 180,
    successProbability: 0.85,
    cost: '$2B - $5B',
    technology: 'Theoretically proven',
  },
  {
    id: 'laser',
    name: 'Laser Ablation',
    description: 'Use focused lasers to vaporize asteroid surface, creating a thrust over time.',
    minLeadTime: 730, // 2 years
    successProbability: 0.60,
    cost: '$5B+',
    technology: 'Experimental',
  },
];
