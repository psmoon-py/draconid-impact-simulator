import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MITIGATION_STRATEGIES } from "@/types/asteroid";
import { calculateMissionSuccessProbability } from "@/utils/advancedImpactCalculations";
import { Rocket, Target, Sparkles, Zap, Check, X, Clock, DollarSign, Radio, Orbit, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MitigationExplanation } from "./MitigationExplanation";

interface MitigationPlannerProps {
  asteroidDiameter: number;
  impactEnergy: number;
  leadTimeDays: number;
}

export const MitigationPlanner = ({ asteroidDiameter, impactEnergy, leadTimeDays: initialLeadTime }: MitigationPlannerProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState(MITIGATION_STRATEGIES[0]);
  const [leadTimeDays, setLeadTimeDays] = useState([initialLeadTime]);
  const [showExplanation, setShowExplanation] = useState(false);

  const successProbability = calculateMissionSuccessProbability(
    leadTimeDays[0],
    asteroidDiameter,
    selectedStrategy.id
  );

  const getStrategyIcon = (id: string) => {
    switch (id) {
      case 'kinetic': return Rocket;
      case 'gravity': return Target;
      case 'nuclear': return Zap;
      case 'laser': return Sparkles;
      case 'ion-beam': return Radio;
      case 'mass-driver': return Orbit;
      case 'solar-sail': return Flame;
      case 'fragmentation': return Zap;
      default: return Rocket;
    }
  };

  const canExecute = leadTimeDays[0] >= selectedStrategy.minLeadTime;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold text-gradient">
          Planetary Defense Strategies
        </h3>
        <p className="text-muted-foreground">
          Plan a deflection mission to prevent the impact
        </p>
      </div>

      {/* Mission Timeline */}
      <Card className="p-6 cosmic-border bg-card/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Lead Time Before Impact</Label>
            <span className="text-lg font-mono text-primary">{leadTimeDays[0]} days</span>
          </div>
          <Slider
            value={leadTimeDays}
            onValueChange={setLeadTimeDays}
            min={30}
            max={1825}
            step={30}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 month</span>
            <span>1 year</span>
            <span>5 years</span>
          </div>
        </div>
      </Card>

      {/* Strategy Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MITIGATION_STRATEGIES.map((strategy) => {
          const Icon = getStrategyIcon(strategy.id);
          const isSelected = selectedStrategy.id === strategy.id;
          const meetsMinTime = leadTimeDays[0] >= strategy.minLeadTime;
          
          return (
            <Card
              key={strategy.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'cosmic-border bg-primary/10 border-primary'
                  : 'border-border hover:border-primary/50 bg-card/30'
              } ${!meetsMinTime ? 'opacity-50' : ''}`}
              onClick={() => setSelectedStrategy(strategy)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{strategy.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {strategy.description}
                  </p>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Min lead: {Math.floor(strategy.minLeadTime / 365)}y {Math.floor((strategy.minLeadTime % 365) / 30)}m</span>
                      {meetsMinTime ? (
                        <Check className="w-3 h-3 text-green-500 ml-auto" />
                      ) : (
                        <X className="w-3 h-3 text-destructive ml-auto" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3" />
                      <span>{strategy.cost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      <span>{strategy.technology}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Mission Assessment */}
      <Card className="p-6 cosmic-border bg-gradient-to-br from-card to-primary/5">
        <h4 className="font-semibold mb-4 text-lg">Mission Assessment: {selectedStrategy.name}</h4>
        
        <div className="space-y-4">
          {/* Success Probability */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Probability</span>
              <span className="text-lg font-bold text-primary">
                {(successProbability * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={successProbability * 100} className="h-3" />
          </div>

          {/* Mission Feasibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-card/50">
              <p className="text-xs text-muted-foreground mb-1">Lead Time Status</p>
              <p className={`font-semibold ${canExecute ? 'text-green-500' : 'text-destructive'}`}>
                {canExecute ? 'Sufficient' : 'Insufficient'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-card/50">
              <p className="text-xs text-muted-foreground mb-1">Target Size</p>
              <p className="font-semibold">{asteroidDiameter}m diameter</p>
            </div>
          </div>

          {/* Warnings & Recommendations */}
          {!canExecute && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive font-semibold mb-1">
                ⚠️ Insufficient Lead Time
              </p>
              <p className="text-xs text-muted-foreground">
                This strategy requires at least {Math.floor(selectedStrategy.minLeadTime / 365)} years of preparation.
                Consider a faster-deployment option.
              </p>
            </div>
          )}

          {impactEnergy > 100 && (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <p className="text-sm text-orange-500 font-semibold mb-1">
                ⚠️ High Energy Impact
              </p>
              <p className="text-xs text-muted-foreground">
                This {impactEnergy.toFixed(0)} MT impact requires maximum effort. Multiple missions may be needed.
              </p>
            </div>
          )}

          {canExecute && successProbability > 0.7 && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-500 font-semibold mb-1">
                ✓ Mission Viable
              </p>
              <p className="text-xs text-muted-foreground">
                Conditions favorable for deflection mission. Recommend immediate mission planning.
              </p>
            </div>
          )}

          {/* Mission Details */}
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <h5 className="font-semibold">Mission Details:</h5>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Estimated cost: {selectedStrategy.cost}</li>
              <li>• Technology readiness: {selectedStrategy.technology}</li>
              <li>• Base success rate: {(selectedStrategy.successProbability * 100).toFixed(0)}%</li>
              <li>• Adjusted for lead time and target size</li>
            </ul>
          </div>

          {/* Launch Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowExplanation(true)}
          >
            <Rocket className="mr-2 w-5 h-5" />
            Simulate Mission Outcome
          </Button>
        </div>
      </Card>

      {/* Mission Outcome Explanation */}
      {showExplanation && (
        <MitigationExplanation
          strategy={selectedStrategy.id}
          success={canExecute && successProbability > 0.5}
          probability={successProbability}
          asteroidSize={asteroidDiameter}
          leadTime={leadTimeDays[0]}
        />
      )}

      {/* Educational Note */}
      <Card className="p-4 bg-muted/30 border-muted">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> These calculations are simplified models for educational purposes. 
          Real planetary defense missions involve complex orbital mechanics, international coordination, 
          and extensive testing. NASA's DART mission (2022) successfully demonstrated kinetic impactor 
          technology on asteroid Dimorphos.
        </p>
      </Card>
    </div>
  );
};
