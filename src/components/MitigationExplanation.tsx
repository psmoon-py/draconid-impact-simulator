import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface MitigationExplanationProps {
  strategy: string;
  success: boolean;
  probability: number;
  asteroidSize: number;
  leadTime: number;
}

export const MitigationExplanation = ({ 
  strategy, 
  success, 
  probability,
  asteroidSize,
  leadTime 
}: MitigationExplanationProps) => {
  const getExplanation = () => {
    const leadTimeYears = (leadTime / 365).toFixed(1);
    
    if (success) {
      switch (strategy) {
        case 'kinetic':
          return {
            title: "Mission Success: Kinetic Impactor Deflection",
            process: [
              `T-${leadTimeYears}y: Mission planning and spacecraft design initiated`,
              `T-${(leadTime / 365 - 0.5).toFixed(1)}y: Spacecraft construction and testing completed`,
              `T-${(leadTime / 365 - 1).toFixed(1)}y: Launch window opens, spacecraft departs Earth`,
              `T-6 months: Final approach trajectory calculations refined`,
              `T-1 month: Autonomous navigation system activated`,
              `Impact: Spacecraft collides at 6.6 km/s, transferring momentum`,
              `T+1 day: Orbital change measured at ${(probability * 100 / 10).toFixed(1)} mm/s`,
              `T+30 days: Trajectory analysis confirms Earth miss by safe margin`,
            ],
            reason: `With ${leadTimeYears} years lead time, kinetic impactor had sufficient distance to achieve the required ${asteroidSize < 150 ? 'minimal' : 'substantial'} trajectory change. The ${asteroidSize}m asteroid's momentum was altered by approximately ${(probability * 100).toFixed(1)}%, resulting in a safe miss distance.`,
          };
        
        case 'gravity':
          return {
            title: "Mission Success: Gravity Tractor Deflection",
            process: [
              `T-${leadTimeYears}y: Multi-year gravity tractor mission approved`,
              `T-${(leadTime / 365 - 1).toFixed(1)}y: Spacecraft launch and 18-month cruise`,
              `T-${(leadTime / 365 - 2).toFixed(1)}y: Rendezvous achieved, station-keeping begins`,
              `T-${(leadTime / 365 - 2.5).toFixed(1)}y: Continuous gravitational pull applied`,
              `Ongoing: Velocity change accumulates at 0.4 mm/s per month`,
              `T-6 months: Total ΔV reaches required ${(probability * 5).toFixed(1)} m/s`,
              `T-3 months: Spacecraft departs, deflection confirmed`,
              `Impact date: Asteroid misses Earth by ${(probability * 50000).toFixed(0)} km`,
            ],
            reason: `The ${leadTimeYears}-year lead time allowed the gravity tractor to accumulate sufficient velocity change through continuous gravitational attraction. This gentle method avoided fragmentation risks while achieving ${(probability * 100).toFixed(0)}% deflection confidence.`,
          };
        
        case 'nuclear':
          return {
            title: "Mission Success: Nuclear Standoff Deflection",
            process: [
              `T-${leadTimeYears}y: Emergency nuclear deflection mission authorized`,
              `T-${(leadTime / 365 - 0.3).toFixed(1)}y: Modified ICBM with nuclear payload prepared`,
              `T-${(leadTime / 365 - 0.5).toFixed(1)}y: Launch window opens, interceptor launches`,
              `T-30 days: Final approach and targeting confirmation`,
              `T-1 day: Detonation altitude optimized (100m standoff)`,
              `Detonation: 1MT device vaporizes ${(probability * 1000).toFixed(0)} tons of surface`,
              `T+1 hour: Vapor plume creates ${(probability * 50).toFixed(1)} m/s ΔV`,
              `T+7 days: Trajectory analysis confirms successful deflection`,
            ],
            reason: `Nuclear deflection succeeded due to ${leadTimeYears} years warning and ${asteroidSize}m target size. The standoff burst vaporized surface material without fragmenting the asteroid, creating thrust equivalent to ${(probability * 10).toFixed(1)}x a kinetic impactor. Success probability of ${(probability * 100).toFixed(0)}% was achieved.`,
          };
        
        case 'laser':
          return {
            title: "Mission Success: Laser Ablation Deflection",
            process: [
              `T-${leadTimeYears}y: Solar-powered laser array mission approved`,
              `T-${(leadTime / 365 - 0.8).toFixed(1)}y: Spacecraft with 100kW laser array launches`,
              `T-${(leadTime / 365 - 1.5).toFixed(1)}y: Rendezvous and continuous ablation begins`,
              `Continuous: Laser vaporizes 10kg/day of surface material`,
              `T-${(leadTime / 365 / 2).toFixed(1)}y: Half deflection achieved, continuing operations`,
              `T-6 months: Required ΔV accumulated, laser shutdown`,
              `T-3 months: Final trajectory confirmation`,
              `Impact date: Safe miss achieved through sustained thrust`,
            ],
            reason: `The ${leadTimeYears}-year timeline enabled continuous laser ablation to slowly but steadily change the asteroid's velocity. Daily mass ejection accumulated to ${(probability * 100).toFixed(1)} m/s total ΔV, successfully altering the ${asteroidSize}m asteroid's path with ${(probability * 100).toFixed(0)}% confidence.`,
          };
        
        default:
          return {
            title: "Mission Success",
            process: [
              `Mission planning initiated`,
              `Spacecraft prepared and launched`,
              `Deflection maneuver executed`,
              `Trajectory successfully altered`,
            ],
            reason: `Deflection successful with ${(probability * 100).toFixed(0)}% confidence.`,
          };
      }
    } else {
      // Failure scenarios
      switch (strategy) {
        case 'kinetic':
          return {
            title: "Mission Failure: Insufficient Lead Time",
            process: [
              `T-${leadTimeYears}y: Emergency kinetic impactor mission initiated`,
              `T-${(leadTime / 365 - 0.3).toFixed(1)}y: Rushed spacecraft design completed with compromises`,
              `T-${(leadTime / 365 - 0.5).toFixed(1)}y: Launch attempted, trajectory suboptimal`,
              `T-3 months: Impact velocity only 4.2 km/s (vs required 6.6 km/s)`,
              `T-1 month: Momentum transfer calculation shows insufficient ΔV`,
              `Impact: Deflection only ${(probability * 100).toFixed(1)}% of required amount`,
              `Outcome: Asteroid still on collision course, impact imminent`,
            ],
            reason: `FAILURE: Only ${leadTimeYears} years lead time provided insufficient distance for the velocity change to accumulate into a safe miss. The ${asteroidSize}m asteroid required at least ${(1 / probability).toFixed(1)}x more lead time. Success probability of only ${(probability * 100).toFixed(0)}% was too low for guaranteed deflection.`,
          };
        
        case 'gravity':
          return {
            title: "Mission Failure: Trajectory Insufficient",
            process: [
              `T-${leadTimeYears}y: Gravity tractor mission approved but rushed`,
              `T-${(leadTime / 365 - 0.5).toFixed(1)}y: Spacecraft reaches asteroid`,
              `Ongoing: Gravitational pull applied but time limited`,
              `T-1y: Velocity change only ${(probability * 100).toFixed(1)}% of required`,
              `T-6 months: Mission extended but still insufficient`,
              `T-3 months: Deflection analysis shows miss by only ${(probability * 10000).toFixed(0)}km`,
              `Outcome: Trajectory altered but not enough, impact occurs`,
            ],
            reason: `FAILURE: Gravity tractor requires minimum 5 years, but only ${leadTimeYears} years available. The ${asteroidSize}m asteroid needed continuous gravitational influence to accumulate sufficient ΔV. Only ${(probability * 100).toFixed(0)}% of required deflection achieved. Method correct but insufficient time.`,
          };
        
        case 'nuclear':
          return {
            title: "Mission Failure: Fragmentation Event",
            process: [
              `T-${leadTimeYears}y: Emergency nuclear mission authorized`,
              `T-${(leadTime / 365 - 0.2).toFixed(1)}y: Hasty launch with insufficient targeting data`,
              `T-30 days: Standoff distance miscalculated`,
              `Detonation: Device too close (50m vs required 100m standoff)`,
              `T+1 hour: Asteroid fragments into ${Math.floor(3 + Math.random() * 5)} major pieces`,
              `T+1 day: Fragment tracking shows multiple Earth impacts now likely`,
              `Outcome: Single impact replaced by ${Math.floor(2 + Math.random() * 3)} fragment impacts`,
            ],
            reason: `FAILURE: Rushed ${leadTimeYears}-year timeline led to insufficient mission planning. Nuclear deflection created fragmentation instead of smooth deflection. The ${asteroidSize}m asteroid broke apart, converting one impact into multiple smaller impacts across wider area. Success probability of ${(probability * 100).toFixed(0)}% was too low - mission made situation worse.`,
          };
        
        default:
          return {
            title: "Mission Failure",
            process: [
              `Mission attempted but failed`,
              `Insufficient lead time or resources`,
              `Deflection unsuccessful`,
              `Impact could not be prevented`,
            ],
            reason: `Mission failed with only ${(probability * 100).toFixed(0)}% success probability. Insufficient lead time of ${leadTimeYears} years for ${asteroidSize}m asteroid.`,
          };
      }
    }
  };

  const explanation = getExplanation();
  const Icon = success ? CheckCircle2 : XCircle;
  const colorClass = success ? "text-green-500" : "text-destructive";
  const bgClass = success ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30";

  return (
    <Card className={`p-6 space-y-4 ${bgClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${colorClass} shrink-0 mt-1`} />
        <div className="flex-1">
          <h4 className={`text-lg font-semibold ${colorClass} mb-2`}>{explanation.title}</h4>
          <Badge variant={success ? "default" : "destructive"} className="mb-4">
            {(probability * 100).toFixed(0)}% Success Probability
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Mission Timeline:
          </h5>
          <div className="space-y-1.5 pl-6 border-l-2 border-primary/30">
            {explanation.process.map((step, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {step}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <h5 className="font-semibold text-sm mb-2">Analysis:</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation.reason}
          </p>
        </div>
      </div>
    </Card>
  );
};
