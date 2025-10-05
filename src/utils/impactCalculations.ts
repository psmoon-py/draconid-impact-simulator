import { ImpactParameters, ImpactEffects } from "@/types/nasa";

/**
 * Calculate comprehensive impact effects based on asteroid parameters
 * Uses established scaling relationships from impact physics
 */
export const calculateImpactEffects = (params: ImpactParameters): ImpactEffects => {
  const { diameter, velocity, density, angle, targetType } = params;
  
  // Convert velocity to m/s
  const velocityMS = velocity * 1000;
  
  // Calculate mass (sphere volume * density)
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * density;
  
  // Impact energy (kinetic energy with angle correction)
  const angleRadians = (angle * Math.PI) / 180;
  const effectiveVelocity = velocityMS * Math.sin(angleRadians);
  const energyJoules = 0.5 * mass * Math.pow(effectiveVelocity, 2);
  const energyMegatons = energyJoules / 4.184e15; // Convert to megatons TNT
  
  // Crater diameter (simplified scaling law)
  // D = 1.161 * (E/ρg)^0.22
  const targetDensity = targetType === 'ocean' ? 1000 : 2500; // kg/m³
  const gravity = 9.81;
  const craterDiameter = 1.161 * Math.pow(energyJoules / (targetDensity * gravity), 0.22);
  
  // Blast radius (overpressure > 5 psi)
  // R = (E/P)^(1/3) where P is reference pressure
  const blastRadius = Math.pow(energyMegatons / 0.00025, 1 / 3) * 1000;
  
  // Thermal radiation radius (3rd degree burns)
  // R = sqrt(E/π) * efficiency
  const thermalEfficiency = 0.3;
  const thermalRadius = Math.sqrt((energyMegatons * thermalEfficiency) / Math.PI) * 1000;
  
  // Seismic magnitude (Richter scale)
  // M = 0.67 * log10(E) - 5.87
  const seismicMagnitude = 0.67 * Math.log10(energyJoules) - 5.87;
  
  const effects: ImpactEffects = {
    energyJoules,
    energyMegatons,
    craterDiameter,
    blastRadius,
    thermalRadius,
    seismicMagnitude
  };
  
  // Additional calculation for ocean impacts
  if (targetType === 'ocean') {
    // Tsunami height scaling (simplified)
    const tsunamiHeight = Math.pow(energyMegatons, 0.33) * 10;
    effects.tsunamiHeight = tsunamiHeight;
  }
  
  return effects;
};

/**
 * Calculate deflection velocity required for mission
 */
export const calculateDeflectionDeltaV = (
  asteroidMass: number,
  impactorMass: number,
  impactorVelocity: number
): number => {
  // Momentum transfer efficiency (beta factor)
  const beta = 1.5; // Typical value for DART-style missions
  
  // Change in velocity (m/s)
  const deltaV = (beta * impactorMass * impactorVelocity) / asteroidMass;
  
  return deltaV;
};

/**
 * Estimate mission success probability based on parameters
 */
export const calculateMissionSuccessProbability = (
  daysToImpact: number,
  deltaV: number,
  requiredDeflection: number
): number => {
  // Time factor (more time = higher success)
  const timeFactor = Math.min(daysToImpact / 180, 1);
  
  // Deflection adequacy
  const deflectionFactor = Math.min(deltaV / requiredDeflection, 1);
  
  // Combined probability
  const baseProbability = 0.7; // 70% base success rate
  const probability = baseProbability * timeFactor * deflectionFactor;
  
  return Math.min(probability, 0.95); // Cap at 95%
};

/**
 * Convert between different energy units
 */
export const energyConversions = {
  joulesToMegatons: (joules: number) => joules / 4.184e15,
  megatonsToJoules: (megatons: number) => megatons * 4.184e15,
  joulesToHiroshima: (joules: number) => joules / 6.3e13, // 15 kilotons
};

/**
 * Torino Scale classification
 */
export const getTorinoScale = (
  impactProbability: number,
  kineticEnergy: number
): number => {
  if (impactProbability === 0) return 0;
  
  // Simplified Torino scale calculation
  if (impactProbability < 0.01) {
    if (kineticEnergy < 1) return 0;
    if (kineticEnergy < 10) return 1;
    return 2;
  } else if (impactProbability < 0.1) {
    if (kineticEnergy < 10) return 3;
    if (kineticEnergy < 100) return 4;
    return 5;
  } else {
    if (kineticEnergy < 10) return 6;
    if (kineticEnergy < 100) return 7;
    if (kineticEnergy < 1000) return 8;
    if (kineticEnergy < 10000) return 9;
    return 10;
  }
};
