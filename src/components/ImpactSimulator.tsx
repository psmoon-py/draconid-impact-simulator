import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Target, Zap, Waves, Mountain } from "lucide-react";
import { toast } from "sonner";

interface ImpactResults {
  energy: number;
  craterDiameter: number;
  blastRadius: number;
  thermalRadius: number;
  seismicMagnitude: number;
}

export const ImpactSimulator = () => {
  const [diameter, setDiameter] = useState([100]); // meters
  const [velocity, setVelocity] = useState([20]); // km/s
  const [angle, setAngle] = useState([45]); // degrees
  const [density, setDensity] = useState([3000]); // kg/m³
  const [results, setResults] = useState<ImpactResults | null>(null);

  const calculateImpact = () => {
    const d = diameter[0];
    const v = velocity[0] * 1000; // convert to m/s
    const rho = density[0];
    
    // Calculate mass (sphere volume * density)
    const radius = d / 2;
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * rho;
    
    // Impact energy (kinetic energy)
    const energy = 0.5 * mass * Math.pow(v, 2);
    const energyMegatons = energy / 4.184e15; // Convert to megatons TNT
    
    // Crater diameter (simplified scaling law)
    const craterDiameter = 1.161 * Math.pow(energy / (rho * 9.81), 0.22);
    
    // Blast radius (overpressure > 5 psi)
    const blastRadius = Math.pow(energyMegatons / 0.00025, 1/3) * 1000;
    
    // Thermal radiation radius (3rd degree burns)
    const thermalRadius = Math.sqrt(energyMegatons / Math.PI) * 1000;
    
    // Seismic magnitude
    const seismicMagnitude = 0.67 * Math.log10(energy) - 5.87;

    setResults({
      energy: energyMegatons,
      craterDiameter,
      blastRadius,
      thermalRadius,
      seismicMagnitude
    });

    toast.success("Impact calculated successfully!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Impact Calculator
        </h2>
        <p className="text-muted-foreground">
          Adjust asteroid parameters to simulate impact effects
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="p-6 space-y-6 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Diameter</Label>
                <span className="text-sm text-primary">{diameter[0]} m</span>
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
                {diameter[0] < 50 ? "Small" : diameter[0] < 200 ? "Medium" : diameter[0] < 500 ? "Large" : "City-Killer"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Velocity</Label>
                <span className="text-sm text-primary">{velocity[0]} km/s</span>
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
                Typical asteroid impact velocity: 15-25 km/s
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Impact Angle</Label>
                <span className="text-sm text-primary">{angle[0]}°</span>
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
                Most impacts occur at 45° (statistical average)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Density</Label>
                <span className="text-sm text-primary">{density[0]} kg/m³</span>
              </div>
              <Slider
                value={density}
                onValueChange={setDensity}
                min={1000}
                max={8000}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {density[0] < 2000 ? "Icy" : density[0] < 4000 ? "Rocky (S-type)" : "Metallic (M-type)"}
              </p>
            </div>

            <Button 
              onClick={calculateImpact}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
              size="lg"
            >
              <Target className="mr-2 w-5 h-5" />
              Calculate Impact
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 space-y-6 cosmic-border bg-card/50 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-primary">Impact Effects</h3>
          
          {results ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-destructive" />
                  <span className="font-semibold">Impact Energy</span>
                </div>
                <p className="text-2xl font-bold text-destructive">
                  {results.energy.toFixed(2)} Megatons TNT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {results.energy > 1000 ? "Extinction-level event" : results.energy > 100 ? "Regional catastrophe" : results.energy > 10 ? "City-killer" : "Local damage"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Crater Diameter</span>
                </div>
                <p className="text-2xl font-bold">
                  {(results.craterDiameter / 1000).toFixed(2)} km
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Blast Radius</span>
                </div>
                <p className="text-2xl font-bold">
                  {(results.blastRadius / 1000).toFixed(2)} km
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Area of severe structural damage
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Thermal Radius</span>
                </div>
                <p className="text-2xl font-bold">
                  {(results.thermalRadius / 1000).toFixed(2)} km
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  3rd degree burn radius
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain className="w-5 h-5" />
                  <span className="font-semibold">Seismic Magnitude</span>
                </div>
                <p className="text-2xl font-bold">
                  {results.seismicMagnitude.toFixed(1)} Richter
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Configure parameters and click Calculate Impact</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
