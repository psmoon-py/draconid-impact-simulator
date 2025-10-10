import { feature } from "topojson-client";
import { geoContains } from "d3-geo";
// Import lightweight world atlas (110m resolution)
// Vite supports JSON imports by default
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import world110m from "world-atlas/world/110m.json";

let landGeoJSON: any = null;

function getLandGeoJSON(): any {
  if (!landGeoJSON) {
    const land = (world110m as any).objects.land;
    const geo = feature(world110m as any, land) as any;
    // geo is a Feature<MultiPolygon>
    landGeoJSON = geo.geometry as any;
  }
  return landGeoJSON!;
}

export function isLand(lat: number, lon: number): boolean {
  const land = getLandGeoJSON();
  // geoContains expects [lon, lat]
  return geoContains(land as any, [lon, lat]);
}

export function detectLocationType(lat: number, lon: number): 'land' | 'ocean' {
  return isLand(lat, lon) ? 'land' : 'ocean';
}
