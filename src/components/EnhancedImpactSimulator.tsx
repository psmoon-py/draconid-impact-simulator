import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Zap, Waves, Mountain, AlertTriangle, Flame, Radio } from "lucide-react";
import { toast } from "sonner";
import { InteractiveMap } from "./InteractiveMap";
import { ASTEROID_MATERIALS, type AsteroidParameters, type DetailedImpactResults } from "@/types/asteroid";
import { calculateDetailedImpact } from "@/utils/advancedImpactCalculations";
import { ImpactResults } from "./ImpactResults";
import { MitigationPlanner } from "./MitigationPlanner";

export const EnhancedImpactSimulator = () => {
  const [diameter, setDiameter] = useState([100]); // meters
  const [velocity, setVelocity] = useState([20]); // km/s
  const [angle, setAngle] = useState([45]); // degrees
  const [selectedMaterial, setSelectedMaterial] = useState(ASTEROID_MATERIALS[1]); // Stone default
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    name: 'New York City',
    type: 'land' as 'land' | 'ocean'
  });
  const [results, setResults] = useState<DetailedImpactResults | null>(null);

  const handleLocationSelect = (lat: number, lng: number, locationName: string) => {
    // Simple ocean detection (very basic)
    const isOcean = Math.abs(lat) < 60 && (
      (lng > -180 && lng < -60) || // Pacific
      (lng > -40 && lng < 20) || // Atlantic
      (lng > 40 && lng < 150) // Indian/Pacific
    );
    
    setLocation({
      lat,
      lng,
      name: locationName,
      type: isOcean ? 'ocean' : 'land'
    });
  };

  const calculateImpact = () => {
    const params: AsteroidParameters = {
      diameter: diameter[0],
      material: selectedMaterial,
      velocity: velocity[0],
      angle: angle[0],
      location
    };

    const impactResults = calculateDetailedImpact(params);
    setResults(impactResults);

    toast.success("Impact calculated!", {
      description: `${impactResults.energyMegatons.toFixed(1)} MT impact at ${location.name}`
    });
  };

  const getSizeComparison = (d: number) => {
    if (d < 10) return "⚽ Soccer ball";
    if (d < 25) return "🚗 Car";
    if (d < 50) return "🏠 House";
    if (d < 100) return "✈️ Airplane";
    if (d < 200) return "🏟️ Stadium";
    if (d < 500) return "🏔️ Small mountain";
    if (d < 1000) return "🌆 City block";
    return "🏔️ Large mountain";
  };

  const impactZones = results ? {
    crater: results.craterDiameter / 2,
    blast: results.blastRadius,
    thermal: results.thermalRadius
  } : undefined;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Interactive Impact Simulator
        </h2>
        <p className="text-muted-foreground">
          Configure asteroid parameters and visualize impact effects on Earth
        </p>
      </div>

      <Tabs defaultValue="target" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="target">1. Select Target</TabsTrigger>
          <TabsTrigger value="configure">2. Configure Asteroid</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>3. Impact Results</TabsTrigger>
        </TabsList>

        <TabsContent value="target" className="space-y-6">
          <InteractiveMap
            onLocationSelect={handleLocationSelect}
            key="target-selector"
          />
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Asteroid Configuration */}
            <Card className="p-6 space-y-6 cosmic-border bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                <Target className="w-5 h-5" />
                Asteroid Parameters
              </h3>

              {/* Diameter */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Diameter</Label>
                  <span className="text-sm text-primary font-mono">{diameter[0]}m</span>
                </div>
                <Slider
                  value={diameter}
                  onValueChange={setDiameter}
                  min={10}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {getSizeComparison(diameter[0])}
                </p>
              </div>

              {/* Material Selection */}
              <div className="space-y-3">
                <Label>Material Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {ASTEROID_MATERIALS.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedMaterial.id === material.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-card/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{material.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {material.density} kg/m³
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{material.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Impact Velocity</Label>
                  <span className="text-sm text-primary font-mono">{velocity[0]} km/s</span>
                </div>
                <Slider
                  value={velocity}
                  onValueChange={setVelocity}
                  min={11}
                  max={72}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {velocity[0] < 15 ? "Slow orbital" : velocity[0] < 25 ? "Typical asteroid" : velocity[0] < 40 ? "Fast asteroid" : "Extreme velocity (comet-like)"}
                </p>
              </div>

              {/* Impact Angle */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Impact Angle</Label>
                  <span className="text-sm text-primary font-mono">{angle[0]}°</span>
                </div>
                <Slider
                  value={angle}
                  onValueChange={setAngle}
                  min={0}
                  max={90}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {angle[0] < 20 ? "Grazing impact" : angle[0] < 50 ? "Typical impact (45° most common)" : "Nearly vertical"}
                </p>
              </div>
            </Card>

            {/* Live Preview */}
            <Card className="p-6 space-y-6 cosmic-border bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary">Live Preview</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-primary/20">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">☄️</div>
                    <p className="font-mono text-2xl text-primary">{diameter[0]}m</p>
                    <p className="text-sm text-muted-foreground">{selectedMaterial.name}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded bg-card/50">
                    <span className="text-muted-foreground">Estimated Mass:</span>
                    <span className="font-mono">
                      {((4/3) * Math.PI * Math.pow(diameter[0]/2, 3) * selectedMaterial.density / 1e9).toFixed(2)} million tons
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-2 rounded bg-card/50">
                    <span className="text-muted-foreground">Target Location:</span>
                    <span className="font-mono text-primary">{location.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-card/50">
                    <span className="text-muted-foreground">Location Type:</span>
                    <span className="font-mono capitalize">{location.type}</span>
                  </div>
                </div>

                <Button 
                  onClick={calculateImpact}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                  size="lg"
                >
                  <Zap className="mr-2 w-5 h-5" />
                  Calculate Impact
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {results && (
            <>
              <ImpactResults 
                results={results} 
                location={{
                  lat: location.lat,
                  lng: location.lng,
                  name: location.name,
                  type: location.type
                }} 
              />
              <MitigationPlanner
                asteroidDiameter={diameter[0]}
                impactEnergy={results.energyMegatons}
                leadTimeDays={180}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
