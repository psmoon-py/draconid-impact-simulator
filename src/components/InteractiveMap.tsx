import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Target } from 'lucide-react';

// Fix for default marker icons in Leaflet
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
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
}

function LocationSelector({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const InteractiveMap = ({ impactZones, onLocationSelect }: InteractiveMapProps) => {
  const [targetLocation, setTargetLocation] = useState<[number, number]>([40.7128, -74.0060]); // NYC default
  const [locationName, setLocationName] = useState('New York City');

  const handleLocationSelect = async (lat: number, lng: number) => {
    setTargetLocation([lat, lng]);
    
    // Reverse geocoding to get location name
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const name = data.display_name.split(',')[0] || 'Selected Location';
      setLocationName(name);
      onLocationSelect(lat, lng, name);
    } catch (error) {
      setLocationName('Selected Location');
      onLocationSelect(lat, lng, 'Selected Location');
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
      {/* Preset Location Buttons */}
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

      {/* Map Container */}
      <div className="h-[500px] rounded-xl overflow-hidden cosmic-border">
        <MapContainer
          center={targetLocation}
          zoom={6}
          style={{ height: '100%', width: '100%', background: '#0a0e27' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <LocationSelector onLocationSelect={handleLocationSelect} />
          
          {/* Impact Point Marker */}
          <Marker position={targetLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-destructive">Impact Point</p>
                <p className="text-xs">{locationName}</p>
                <p className="text-xs text-muted-foreground">
                  {targetLocation[0].toFixed(4)}°, {targetLocation[1].toFixed(4)}°
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Impact Zones */}
          {impactZones && (
            <>
              {/* Crater Zone */}
              <Circle
                center={targetLocation}
                radius={impactZones.crater}
                pathOptions={{
                  color: '#ff4444',
                  fillColor: '#ff4444',
                  fillOpacity: 0.4,
                  weight: 2,
                }}
              >
                <Popup>Crater Zone: {(impactZones.crater / 1000).toFixed(2)} km</Popup>
              </Circle>

              {/* Blast Zone */}
              <Circle
                center={targetLocation}
                radius={impactZones.blast}
                pathOptions={{
                  color: '#ff8800',
                  fillColor: '#ff8800',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              >
                <Popup>Blast Zone: {(impactZones.blast / 1000).toFixed(2)} km</Popup>
              </Circle>

              {/* Thermal Zone */}
              <Circle
                center={targetLocation}
                radius={impactZones.thermal}
                pathOptions={{
                  color: '#ffaa00',
                  fillColor: '#ffaa00',
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              >
                <Popup>Thermal Radiation Zone: {(impactZones.thermal / 1000).toFixed(2)} km</Popup>
              </Circle>
            </>
          )}
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/30">
        <p className="text-sm text-muted-foreground">
          <Target className="w-4 h-4 inline mr-2 text-primary" />
          Click anywhere on the map to select impact location, or use preset buttons above
        </p>
      </div>
    </div>
  );
};
