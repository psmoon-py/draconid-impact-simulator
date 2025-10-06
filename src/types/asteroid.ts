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
    density: 7870,
    description: 'Dense metallic asteroid composed of iron-nickel alloy. Maximum penetration and devastation.',
    color: '#8B7355',
    examples: 'Psyche, M-type asteroids (~5%)'
  },
  {
    id: 'stone',
    name: 'Stone (S-type)',
    density: 3000,
    description: 'Most common asteroid type made of silicate rock. Moderate density and typical impact effects.',
    color: '#A0826D',
    examples: 'Eros, Itokawa (~17% of all)'
  },
  {
    id: 'carbon',
    name: 'Carbonaceous (C-type)',
    density: 2000,
    description: 'Primitive carbon-rich asteroids with water. Dark and ancient composition.',
    color: '#3D3D3D',
    examples: 'Bennu, Ryugu (~75% of all)'
  },
  {
    id: 'ice',
    name: 'Ice/Comet',
    density: 1000,
    description: 'Icy bodies from outer solar system. Low density but extremely high velocity impacts.',
    color: '#B4D7E5',
    examples: "Halley's Comet, 67P"
  },
  {
    id: 'gold',
    name: 'Platinum-Rich',
    density: 19300,
    description: 'Hypothetical precious metal-rich asteroid. Extremely dense core remnant.',
    color: '#FFD700',
    examples: 'Psyche (theoretical)'
  },
  {
    id: 'nickel-iron',
    name: 'Nickel-Iron',
    density: 8000,
    description: 'Pure metallic composition from planetesimal cores. Maximum penetration depth.',
    color: '#7F8C8D',
    examples: 'Iron meteorites, Psyche'
  },
  {
    id: 'basaltic',
    name: 'Basaltic (V-type)',
    density: 2900,
    description: 'Volcanic rock from differentiated asteroids. Similar to Earth\'s oceanic crust.',
    color: '#4A4A4A',
    examples: 'Vesta fragments'
  },
  {
    id: 'rubble-pile',
    name: 'Rubble Pile',
    density: 2000,
    description: 'Loosely bound aggregate of rocks. May fragment during atmospheric entry.',
    color: '#8B8680',
    examples: 'Itokawa, Bennu (porous)'
  },
  {
    id: 'porous-ice',
    name: 'Porous Ice',
    density: 600,
    description: 'Highly porous icy structure. Likely to airburst at high altitude.',
    color: '#E0F7FA',
    examples: 'Some comets, TNOs'
  },
  {
    id: 'chondrite',
    name: 'Chondritic',
    density: 3400,
    description: 'Primitive undifferentiated material containing chondrules. Oldest solar system material.',
    color: '#8D6E63',
    examples: 'Most meteorites (>85%)'
  }
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
    description: 'Ram a high-speed spacecraft into the asteroid to change its velocity through momentum transfer.',
    minLeadTime: 365,
    successProbability: 0.75,
    cost: '$300M - $500M',
    technology: 'Current (NASA DART proven)',
  },
  {
    id: 'gravity',
    name: 'Gravity Tractor',
    description: 'Station spacecraft near asteroid, using gravitational attraction to slowly alter its trajectory.',
    minLeadTime: 1825,
    successProbability: 0.65,
    cost: '$1B - $2B',
    technology: 'Near-term feasible',
  },
  {
    id: 'nuclear',
    name: 'Nuclear Standoff Burst',
    description: 'Detonate nuclear device near asteroid to vaporize surface material, creating deflecting thrust.',
    minLeadTime: 180,
    successProbability: 0.85,
    cost: '$2B - $5B',
    technology: 'Theoretically proven',
  },
  {
    id: 'laser',
    name: 'Laser Ablation',
    description: 'Use focused solar-powered lasers to continuously vaporize asteroid surface over months.',
    minLeadTime: 730,
    successProbability: 0.60,
    cost: '$5B+',
    technology: 'Experimental',
  },
  {
    id: 'ion-beam',
    name: 'Ion Beam Shepherd',
    description: 'Direct ion beam at asteroid surface to gradually push it off course via momentum transfer.',
    minLeadTime: 1095,
    successProbability: 0.70,
    cost: '$3B - $6B',
    technology: 'Development phase',
  },
  {
    id: 'mass-driver',
    name: 'Mass Driver',
    description: 'Land on asteroid and use mined material as reaction mass to create thrust.',
    minLeadTime: 2190,
    successProbability: 0.55,
    cost: '$10B+',
    technology: 'Conceptual',
  },
  {
    id: 'solar-sail',
    name: 'Solar Sail',
    description: 'Deploy large reflective sail on asteroid surface to use solar radiation pressure.',
    minLeadTime: 1460,
    successProbability: 0.50,
    cost: '$4B - $8B',
    technology: 'Conceptual',
  },
  {
    id: 'fragmentation',
    name: 'Nuclear Fragmentation',
    description: 'Detonate nuclear device inside/on asteroid to fragment it (last resort for <6 month warning).',
    minLeadTime: 60,
    successProbability: 0.40,
    cost: '$1B - $3B',
    technology: 'Last resort only',
  },
];
