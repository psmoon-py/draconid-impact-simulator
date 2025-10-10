import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

let landGeoJSON: any = null;
let loadingPromise: Promise<any> | null = null;

async function getLandGeoJSON(): Promise<any> {
  if (landGeoJSON) return landGeoJSON;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  // Fetch Natural Earth 110m land data from CDN
  loadingPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
    .then(res => res.json())
    .then(topology => {
      const land = topology.objects.land;
      const geo = feature(topology, land) as any;
      landGeoJSON = geo.geometry;
      return landGeoJSON;
    })
    .catch(err => {
      console.error('Failed to load land data:', err);
      // Fallback: return null so we default to 'land'
      return null;
    });
  
  return loadingPromise;
}

export async function isLand(lat: number, lon: number): Promise<boolean> {
  const land = await getLandGeoJSON();
  if (!land) return true; // default to land if data fails to load
  // geoContains expects [lon, lat]
  return geoContains(land as any, [lon, lat]);
}

export async function detectLocationType(lat: number, lon: number): Promise<'land' | 'ocean'> {
  const land = await isLand(lat, lon);
  return land ? 'land' : 'ocean';
}
