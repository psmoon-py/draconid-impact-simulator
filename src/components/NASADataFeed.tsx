import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";

interface Asteroid {
  id: string;
  name: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
}

const NASA_API_KEY = "qii1L8IW1FYWR5akqTASXp0kD7rfVZMssSg60ApD";

export const NASADataFeed = () => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNEOData();
  }, []);

  const fetchNEOData = async () => {
    try {
      // Get today's date and 7 days from now
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];

      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
      );

      if (!response.ok) throw new Error('Failed to fetch NASA data');

      const data = await response.json();
      
      // Process and format the data
      const processedAsteroids: Asteroid[] = [];
      
      Object.values(data.near_earth_objects).forEach((dayAsteroids: any) => {
        dayAsteroids.forEach((asteroid: any) => {
          const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max;
          const closeApproach = asteroid.close_approach_data[0];
          
          processedAsteroids.push({
            id: asteroid.id,
            name: asteroid.name,
            diameter: diameter,
            velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_second),
            missDistance: parseFloat(closeApproach.miss_distance.kilometers),
            isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
            closeApproachDate: closeApproach.close_approach_date
          });
        });
      });

      // Sort by closest approach
      processedAsteroids.sort((a, b) => a.missDistance - b.missDistance);
      
      setAsteroids(processedAsteroids.slice(0, 10));
      setLoading(false);
      toast.success("NASA data loaded successfully!");
    } catch (error) {
      console.error('Error fetching NASA data:', error);
      toast.error("Failed to load NASA data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-primary">Loading NASA data...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Live NASA NEO Feed</h3>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          <Info className="w-3 h-3 mr-1" />
          Next 7 Days
        </Badge>
      </div>

      <div className="grid gap-3">
        {asteroids.map((asteroid, index) => (
          <Card 
            key={asteroid.id}
            className={`p-4 hover-glow transition-all cursor-pointer ${
              asteroid.isPotentiallyHazardous 
                ? 'bg-destructive/5 border-destructive/30' 
                : 'bg-card/50 border-primary/20'
            } backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                  <h4 className="font-semibold text-sm">{asteroid.name}</h4>
                  {asteroid.isPotentiallyHazardous && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      PHA
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Diameter:</span>
                    <p className="font-semibold text-primary">
                      {asteroid.diameter.toFixed(0)} m
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Velocity:</span>
                    <p className="font-semibold">
                      {asteroid.velocity.toFixed(2)} km/s
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Miss Distance:</span>
                    <p className="font-semibold">
                      {(asteroid.missDistance / 384400).toFixed(2)} LD
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approach:</span>
                    <p className="font-semibold">
                      {new Date(asteroid.closeApproachDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Data provided by NASA's Near Earth Object Web Service • LD = Lunar Distance (384,400 km)
      </p>
    </div>
  );
};
