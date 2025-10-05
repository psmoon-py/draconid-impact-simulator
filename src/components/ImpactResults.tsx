import { Card } from "@/components/ui/card";
import { DetailedImpactResults } from "@/types/asteroid";
import { AlertTriangle, Zap, Mountain, Flame, Waves, Radio, TrendingUp } from "lucide-react";

interface ImpactResultsProps {
  results: DetailedImpactResults;
  location: { name: string; type: 'land' | 'ocean' };
}

export const ImpactResults = ({ results, location }: ImpactResultsProps) => {
  const getTorinoColor = (scale: number) => {
    if (scale === 0) return "text-muted-foreground";
    if (scale <= 2) return "text-yellow-500";
    if (scale <= 4) return "text-orange-500";
    if (scale <= 7) return "text-destructive";
    return "text-purple-500";
  };

  const getComparisonEvent = (megatons: number) => {
    if (megatons < 0.015) return "Similar to Hiroshima bomb (15 kt)";
    if (megatons < 0.5) return "Similar to Chelyabinsk meteor (500 kt)";
    if (megatons < 15) return "Similar to Castle Bravo test (15 MT)";
    if (megatons < 100) return "Similar to Tunguska event (10-15 MT)";
    if (megatons < 1000) return "Similar to largest thermonuclear test";
    if (megatons < 100000) return "Similar to Chicxulub impact (65 million years ago)";
    return "Extinction-level impact";
  };

  return (
    <div className="space-y-6">
      {/* Impact Classification */}
      <Card className="p-6 cosmic-border bg-gradient-to-br from-destructive/20 to-card border-destructive/50">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <div>
            <h3 className="text-2xl font-bold text-destructive">{results.impactClass}</h3>
            <p className="text-sm text-muted-foreground">Impact at {location.name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-card/50">
            <p className="text-xs text-muted-foreground mb-1">Torino Scale</p>
            <p className={`text-3xl font-bold ${getTorinoColor(results.torinoScale)}`}>
              {results.torinoScale}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-card/50">
            <p className="text-xs text-muted-foreground mb-1">Total Energy</p>
            <p className="text-xl font-bold text-primary">
              {results.energyMegatons.toFixed(2)} MT
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-card/30">
          <p className="text-xs text-muted-foreground mb-1">Comparison:</p>
          <p className="text-sm">{getComparisonEvent(results.energyMegatons)}</p>
        </div>
      </Card>

      {/* Detailed Effects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Crater Effects */}
        <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Crater Formation</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diameter:</span>
              <span className="font-mono">{(results.craterDiameter / 1000).toFixed(2)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth:</span>
              <span className="font-mono">{(results.craterDepth / 1000).toFixed(2)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-mono">{(results.craterVolume / 1e9).toFixed(2)} km³</span>
            </div>
          </div>
        </Card>

        {/* Blast Effects */}
        <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-500" />
            <h4 className="font-semibold">Blast Wave</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severe damage:</span>
              <span className="font-mono">{(results.blastRadius / 1000).toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overpressure:</span>
              <span className="font-mono">{results.overpressureAt1km.toFixed(1)} psi</span>
            </div>
            {results.airburstAltitude && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Airburst alt:</span>
                <span className="font-mono">{(results.airburstAltitude / 1000).toFixed(1)} km</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Buildings collapse, severe structural damage
          </p>
        </Card>

        {/* Thermal Effects */}
        <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold">Thermal Radiation</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Burn radius:</span>
              <span className="font-mono">{(results.thermalRadius / 1000).toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fireball:</span>
              <span className="font-mono">{results.fireballDuration.toFixed(1)} sec</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            3rd degree burns, fires ignited
          </p>
        </Card>

        {/* Seismic Effects */}
        <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold">Seismic Activity</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Magnitude:</span>
              <span className="font-mono">{results.seismicMagnitude.toFixed(1)} Richter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shaking radius:</span>
              <span className="font-mono">{(results.groundShakingRadius / 1000).toFixed(0)} km</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ground shaking felt over wide area
          </p>
        </Card>

        {/* Tsunami (if ocean impact) */}
        {location.type === 'ocean' && results.tsunamiHeight && (
          <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Waves className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Tsunami</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wave height:</span>
                <span className="font-mono">{results.tsunamiHeight.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Travel time:</span>
                <span className="font-mono">{results.tsunamiTravelTime} min</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Coastal flooding, wave propagation
            </p>
          </Card>
        )}

        {/* Population Impact */}
        <Card className="p-4 cosmic-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-destructive" />
            <h4 className="font-semibold">Human Impact</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Affected:</span>
              <span className="font-mono">{results.affectedPopulation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Casualties:</span>
              <span className="font-mono text-destructive">
                {results.estimatedCasualties.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated based on urban density
          </p>
        </Card>
      </div>

      {/* Energy Breakdown */}
      <Card className="p-6 cosmic-border bg-card/50">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Energy Breakdown
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total kinetic energy:</span>
            <span className="font-mono">{results.energyJoules.toExponential(2)} J</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">TNT equivalent:</span>
            <span className="font-mono text-primary">{results.tntEquivalent}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-destructive h-2 rounded-full"
              style={{ width: `${Math.min((results.energyMegatons / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
