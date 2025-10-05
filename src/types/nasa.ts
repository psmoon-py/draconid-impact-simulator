export interface NASANearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  is_sentry_object: boolean;
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface ImpactParameters {
  diameter: number; // meters
  velocity: number; // km/s
  angle: number; // degrees
  density: number; // kg/m³
  targetType: 'land' | 'ocean';
}

export interface ImpactEffects {
  energyJoules: number;
  energyMegatons: number;
  craterDiameter: number; // meters
  blastRadius: number; // meters
  thermalRadius: number; // meters
  seismicMagnitude: number;
  tsunamiHeight?: number; // meters (if ocean impact)
}
