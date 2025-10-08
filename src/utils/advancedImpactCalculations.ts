import { AsteroidParameters, DetailedImpactResults } from "@/types/asteroid";

export function calculateDetailedImpact(params: AsteroidParameters): DetailedImpactResults {
  const { diameter, material, velocity, angle, location } = params;
  
  // Calculate mass (sphere volume * density)
  const radius = diameter / 2;
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * material.density; // kg
  
  // Impact velocity in m/s
  const v = velocity * 1000;
  
  // Kinetic energy
  const energyJoules = 0.5 * mass * Math.pow(v, 2);
  const energyMegatons = energyJoules / 4.184e15; // Convert to megatons TNT
  
  // Angle factor (perpendicular impact = 1.0, grazing = lower)
  const angleFactor = Math.sin(angle * Math.PI / 180);
  
  // Crater calculations (using scaling laws)
  const g = 9.81; // gravity
  const targetDensity = location.type === 'ocean' ? 1000 : 2700; // water vs rock
  
  // Crater diameter (modified Pi-group scaling)
  const craterDiameter = 1.161 * Math.pow(
    (energyJoules * angleFactor) / (targetDensity * g),
    0.22
  );
  
  // Crater depth (approximately 1/5 to 1/3 of diameter)
  const craterDepth = craterDiameter / 5;
  
  // Crater volume (hemispherical approximation)
  const craterVolume = (2/3) * Math.PI * Math.pow(craterDiameter/2, 2) * craterDepth;
  
  // Blast radius calculations
  // Overpressure zones: >20 psi = total destruction, >5 psi = severe damage
  const blastRadius = Math.pow(energyMegatons / 0.00025, 1/3) * 1000; // meters, 5 psi overpressure
  const overpressureAt1km = energyMegatons * 50 / Math.pow(1, 2); // rough approximation
  
  // Thermal radiation radius (3rd degree burns)
  const thermalRadius = Math.sqrt(energyMegatons / Math.PI) * 1000 * 1.5;
  
  // Fireball duration
  const fireballDuration = Math.pow(energyMegatons, 0.44); // seconds
  
  // Seismic effects
  const seismicMagnitude = 0.67 * Math.log10(energyJoules) - 5.87;
  const groundShakingRadius = Math.pow(10, seismicMagnitude) * 100; // rough estimate
  
  // Airburst altitude for smaller asteroids
  let airburstAltitude: number | undefined;
  if (diameter < 100) {
    // Smaller asteroids often explode in atmosphere
    airburstAltitude = 8000 + (diameter / 100) * 20000; // meters
  }
  
  // Tsunami calculations for ocean impacts
  let tsunamiHeight: number | undefined;
  let tsunamiTravelTime: number | undefined;
  
  if (location.type === 'ocean') {
    // Simplified tsunami model
    tsunamiHeight = Math.sqrt(energyMegatons) * 2; // meters
    tsunamiTravelTime = 30; // minutes (very rough)
  }
  
  // Population impact estimation based on actual location
  // Population density varies dramatically by location
  const getPopulationDensity = (lat: number, lng: number): number => {
    // Major cities and their approximate densities (people per km²)
    const cities = [
      { lat: 35.6762, lng: 139.6503, density: 6158, name: 'Tokyo' },
      { lat: 28.7041, lng: 77.1025, density: 11320, name: 'Delhi' },
      { lat: 40.7128, lng: -74.0060, density: 10947, name: 'New York' },
      { lat: 19.0760, lng: 72.8777, density: 20694, name: 'Mumbai' },
      { lat: 51.5074, lng: -0.1278, density: 5701, name: 'London' },
      { lat: -33.8688, lng: 151.2093, density: 2058, name: 'Sydney' },
      { lat: 55.7558, lng: 37.6173, density: 4822, name: 'Moscow' },
      { lat: 31.2304, lng: 121.4737, density: 3816, name: 'Shanghai' },
      { lat: 39.9042, lng: 116.4074, density: 1311, name: 'Beijing' },
      { lat: -23.5505, lng: -46.6333, density: 7821, name: 'São Paulo' },
    ];
    
    // Find closest major city within 100km
    let closestCity = null;
    let minDistance = Infinity;
    
    for (const city of cities) {
      const distance = Math.sqrt(
        Math.pow((lat - city.lat) * 111, 2) + 
        Math.pow((lng - city.lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
      );
      if (distance < minDistance && distance < 100) {
        minDistance = distance;
        closestCity = city;
      }
    }
    
    if (closestCity) {
      // Density decreases with distance from city center
      const densityFactor = Math.max(0.1, 1 - (minDistance / 100));
      return closestCity.density * densityFactor;
    }
    
    // Default densities based on latitude (rough approximation)
    // Oceans have 0 density
    if (location.type === 'ocean') return 0;
    
    // Desert/sparse areas (30-35° latitude bands)
    if ((Math.abs(lat) > 20 && Math.abs(lat) < 40) && 
        ((lng > -20 && lng < 60) || (lng > -120 && lng < -100))) {
      return 5; // Very low density
    }
    
    // General land areas
    return 50; // Rural/suburban default
  };
  
  const urbanDensity = getPopulationDensity(location.lat, location.lng);
  const affectedArea = Math.PI * Math.pow(blastRadius / 1000, 2); // km²
  const affectedPopulation = Math.floor(affectedArea * urbanDensity);
  const estimatedCasualties = Math.floor(affectedPopulation * 0.6); // 60% casualty rate in blast zone
  
  // Impact classification
  let impactClass: string;
  let torinoScale: number;
  
  if (energyMegatons < 1) {
    impactClass = "Local damage";
    torinoScale = 1;
  } else if (energyMegatons < 10) {
    impactClass = "City-killer";
    torinoScale = 5;
  } else if (energyMegatons < 100) {
    impactClass = "Regional catastrophe";
    torinoScale = 8;
  } else if (energyMegatons < 1000) {
    impactClass = "Continental devastation";
    torinoScale = 9;
  } else {
    impactClass = "Extinction-level event";
    torinoScale = 10;
  }
  
  // TNT equivalent comparison
  let tntEquivalent: string;
  if (energyMegatons < 0.001) {
    tntEquivalent = `${(energyMegatons * 1000).toFixed(0)} tons TNT`;
  } else if (energyMegatons < 1) {
    tntEquivalent = `${(energyMegatons * 1000).toFixed(0)} kilotons TNT`;
  } else if (energyMegatons < 1000) {
    tntEquivalent = `${energyMegatons.toFixed(1)} megatons TNT`;
  } else {
    tntEquivalent = `${(energyMegatons / 1000).toFixed(1)} gigatons TNT`;
  }
  
  return {
    energyJoules,
    energyMegatons,
    tntEquivalent,
    craterDiameter,
    craterDepth,
    craterVolume,
    blastRadius,
    overpressureAt1km,
    thermalRadius,
    fireballDuration,
    seismicMagnitude,
    groundShakingRadius,
    tsunamiHeight,
    tsunamiTravelTime,
    airburstAltitude,
    estimatedCasualties,
    affectedPopulation,
    impactClass,
    torinoScale,
  };
}

export function calculateDeflectionDeltaV(
  asteroidMass: number,
  impactorMass: number,
  impactorVelocity: number
): number {
  // Momentum transfer calculation for kinetic impactor
  // Δv = (m_impactor * v_impactor * β) / m_asteroid
  // β = momentum enhancement factor (typically 1.5-4)
  const beta = 2.5; // conservative estimate
  return (impactorMass * impactorVelocity * beta) / asteroidMass;
}

export function calculateMissionSuccessProbability(
  leadTimeDays: number,
  asteroidDiameter: number,
  strategy: string
): number {
  // Simplified mission success probability model
  let baseProbability = 0.7;
  
  // Lead time factor (more time = higher success)
  const leadTimeFactor = Math.min(leadTimeDays / 365, 1.5) * 0.2;
  
  // Size factor (smaller = easier)
  const sizeFactor = Math.max(0, (1000 - asteroidDiameter) / 1000) * 0.15;
  
  // Strategy factor
  let strategyFactor = 0;
  switch (strategy) {
    case 'kinetic':
      strategyFactor = 0.05; // proven technology
      break;
    case 'nuclear':
      strategyFactor = 0.10; // high confidence but untested
      break;
    case 'gravity':
      strategyFactor = -0.05; // less certain
      break;
    case 'laser':
      strategyFactor = -0.10; // experimental
      break;
  }
  
  return Math.min(Math.max(baseProbability + leadTimeFactor + sizeFactor + strategyFactor, 0.1), 0.95);
}
