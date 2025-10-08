import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Target } from 'lucide-react';

// Fix for default marker icons in Leaflet
// (Leaflet defaults expect images to be at specific URLs)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ImpactZones {
  crater: number;
  blast: number;
  thermal: number;
}

interface InteractiveMapProps {
  impactZones?: ImpactZones;
  onLocationSelect?: (lat: number, lng: number, locationName: string) => void;
  initialLocation?: { lat: number; lng: number; name: string };
  readOnly?: boolean;
}

export const InteractiveMap = ({ impactZones, onLocationSelect, initialLocation, readOnly = false }: InteractiveMapProps) => {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const craterCircleRef = useRef<L.Circle | null>(null);
  const blastCircleRef = useRef<L.Circle | null>(null);
  const thermalCircleRef = useRef<L.Circle | null>(null);

  const [targetLocation, setTargetLocation] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [40.7128, -74.0060]
  );
  const [locationName, setLocationName] = useState(initialLocation?.name || 'New York City');

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;

    const map = L.map(mapElRef.current, {
      center: targetLocation,
      zoom: 6,
      zoomControl: true,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Initial marker
    markerRef.current = L.marker(targetLocation).addTo(map).bindPopup(
      `<div style="text-align:center">
        <p style="font-weight:600;color:var(--destructive, #ef4444)">Impact Point</p>
        <p style="font-size:12px">${locationName}</p>
        <p style="font-size:12px;opacity:.7">${targetLocation[0].toFixed(4)}°, ${targetLocation[1].toFixed(4)}°</p>
      </div>`
    );

    // Click to choose location (only if not read-only)
    if (!readOnly) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        await handleLocationSelect(e.latlng.lat, e.latlng.lng, map);
      });
    }

    mapRef.current = map;
  }, []);

  // Update map view when targetLocation changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(targetLocation, map.getZoom());

    // Update marker
    if (!markerRef.current) {
      markerRef.current = L.marker(targetLocation).addTo(map);
    } else {
      markerRef.current.setLatLng(targetLocation);
    }
    markerRef.current.bindPopup(
      `<div style="text-align:center">
        <p style="font-weight:600;color:var(--destructive, #ef4444)">Impact Point</p>
        <p style="font-size:12px">${locationName}</p>
        <p style="font-size:12px;opacity:.7">${targetLocation[0].toFixed(4)}°, ${targetLocation[1].toFixed(4)}°</p>
      </div>`
    );
  }, [targetLocation, locationName]);

  // Draw/update impact zones
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Helper to create or update circle
    const upsertCircle = (
      circleRef: React.MutableRefObject<L.Circle | null>,
      radius: number,
      color: string,
      fillOpacity: number
    ) => {
      if (radius <= 0) {
        if (circleRef.current) {
          map.removeLayer(circleRef.current);
          circleRef.current = { current: null } as any; // ensure clean
        }
        return;
      }
      if (!circleRef.current) {
        circleRef.current = circleRef as any; // TS helper
      }
      if (!circleRef.current) return;
      if (!circleRef.current) return;
      if (!circleRef.current) return;
      if (!circleRef.current) return;
      // Create if missing
      if (!circleRef.current) {
        circleRef.current = L.circle(targetLocation, {
          radius,
          color,
          weight: 2,
          fillColor: color,
          fillOpacity,
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(targetLocation);
        circleRef.current.setRadius(radius);
        circleRef.current.setStyle({ color, fillColor: color, fillOpacity, weight: 2 });
      }
    };

    // Clear existing circles if no impactZones
    if (!impactZones) {
      [craterCircleRef, blastCircleRef, thermalCircleRef].forEach(ref => {
        if (ref.current) {
          map.removeLayer(ref.current);
          ref.current = null;
        }
      });
      return;
    }

    // Update circles with tooltips
    if (!craterCircleRef.current) {
      craterCircleRef.current = L.circle(targetLocation, {
        radius: impactZones.crater,
        color: '#ff4444',
        weight: 2,
        fillColor: '#ff4444',
        fillOpacity: 0.4,
      }).addTo(map).bindTooltip(
        '<strong style="color:#ff4444">Crater Zone</strong><br/>Complete devastation<br/>Total destruction of all structures',
        { permanent: false, sticky: true }
      );
    } else {
      craterCircleRef.current.setLatLng(targetLocation);
      craterCircleRef.current.setRadius(impactZones.crater);
      craterCircleRef.current.setStyle({ color: '#ff4444', fillColor: '#ff4444', fillOpacity: 0.4, weight: 2 });
    }

    if (!blastCircleRef.current) {
      blastCircleRef.current = L.circle(targetLocation, {
        radius: impactZones.blast,
        color: '#ff8800',
        weight: 2,
        fillColor: '#ff8800',
        fillOpacity: 0.2,
      }).addTo(map).bindTooltip(
        '<strong style="color:#ff8800">Blast Zone</strong><br/>Severe structural damage<br/>Building collapse, high casualties',
        { permanent: false, sticky: true }
      );
    } else {
      blastCircleRef.current.setLatLng(targetLocation);
      blastCircleRef.current.setRadius(impactZones.blast);
      blastCircleRef.current.setStyle({ color: '#ff8800', fillColor: '#ff8800', fillOpacity: 0.2, weight: 2 });
    }

    if (!thermalCircleRef.current) {
      thermalCircleRef.current = L.circle(targetLocation, {
        radius: impactZones.thermal,
        color: '#ffaa00',
        weight: 2,
        fillColor: '#ffaa00',
        fillOpacity: 0.15,
      }).addTo(map).bindTooltip(
        '<strong style="color:#ffaa00">Thermal Zone</strong><br/>3rd degree burns<br/>Fires ignited, heat radiation damage',
        { permanent: false, sticky: true }
      );
    } else {
      thermalCircleRef.current.setLatLng(targetLocation);
      thermalCircleRef.current.setRadius(impactZones.thermal);
      thermalCircleRef.current.setStyle({ color: '#ffaa00', fillColor: '#ffaa00', fillOpacity: 0.15, weight: 2 });
    }
  }, [impactZones, targetLocation]);

  const handleLocationSelect = async (lat: number, lng: number, map?: L.Map) => {
    if (readOnly) return; // Prevent selection in read-only mode
    
    setTargetLocation([lat, lng]);

    // Reverse geocoding to get location name
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const name = (data.display_name?.split(',')[0] as string) || 'Selected Location';
      setLocationName(name);
      if (onLocationSelect) {
        onLocationSelect(lat, lng, name);
      }
    } catch (error) {
      setLocationName('Selected Location');
      if (onLocationSelect) {
        onLocationSelect(lat, lng, 'Selected Location');
      }
    }

    if (map) {
      map.setView([lat, lng]);
    } else if (mapRef.current) {
      mapRef.current.setView([lat, lng]);
    }
  };

  const presetLocations = [
    { name: 'New York City', coords: [40.7128, -74.0060] as [number, number] },
    { name: 'Tokyo', coords: [35.6762, 139.6503] as [number, number] },
    { name: 'London', coords: [51.5074, -0.1278] as [number, number] },
    { name: 'Sydney', coords: [-33.8688, 151.2093] as [number, number] },
    { name: 'Pacific Ocean', coords: [0, -140] as [number, number] },
    { name: 'Sahara Desert', coords: [23.4162, 25.6628] as [number, number] },
  ];

  return (
    <div className="w-full h-full space-y-4">
      {/* Preset Location Buttons - only show if not read-only */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2 mb-4">
          {presetLocations.map((location) => (
            <button
              key={location.name}
              onClick={() => handleLocationSelect(location.coords[0], location.coords[1])}
              className="px-3 py-1.5 text-xs rounded-lg bg-card border border-primary/30 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Target className="w-3 h-3 inline mr-1" />
              {location.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Container */}
      <div className="h-[500px] rounded-xl overflow-hidden cosmic-border" style={{ background: '#0a0e27' }}>
        <div ref={mapElRef} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* Instructions */}
      {!readOnly && (
        <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/30">
          <p className="text-sm text-muted-foreground">
            <Target className="w-4 h-4 inline mr-2 text-primary" />
            Click anywhere on the map to select impact location, or use preset buttons above
          </p>
        </div>
      )}
    </div>
  );
};
