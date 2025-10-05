import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Target, Lightbulb, Atom } from "lucide-react";

export const EducationalPanel = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="defense" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="defense" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Defense
          </TabsTrigger>
          <TabsTrigger value="detection" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Target className="w-4 h-4 mr-2" />
            Detection
          </TabsTrigger>
          <TabsTrigger value="physics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Atom className="w-4 h-4 mr-2" />
            Physics
          </TabsTrigger>
          <TabsTrigger value="facts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lightbulb className="w-4 h-4 mr-2" />
            Facts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="defense" className="mt-6">
          <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-2xl font-bold text-primary">Planetary Defense Strategies</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold text-lg mb-2">Kinetic Impactor (DART Mission)</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Double Asteroid Redirection Test (DART) demonstrated that a spacecraft can successfully 
                  alter an asteroid's trajectory by direct impact. This method changes the asteroid's velocity 
                  through momentum transfer, requiring years of advance warning for effectiveness.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <h4 className="font-semibold text-lg mb-2">Gravity Tractor</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A spacecraft hovers near the asteroid, using gravitational attraction to slowly alter its course. 
                  This gentle method requires decades of lead time but offers precise control without physical contact, 
                  making it ideal for hazardous objects where debris generation must be avoided.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <h4 className="font-semibold text-lg mb-2">Nuclear Deflection</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reserved for last-resort scenarios, a nuclear device detonated near (not on) an asteroid can 
                  vaporize surface material, creating thrust that changes its trajectory. This method requires 
                  international cooperation and careful planning to avoid fragmentation.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                <h4 className="font-semibold text-lg mb-2">Civil Defense & Evacuation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When deflection isn't possible, targeted evacuations and emergency preparations can save lives. 
                  Accurate impact prediction allows for strategic resource allocation and population protection, 
                  emphasizing the importance of early detection systems.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detection" className="mt-6">
          <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-2xl font-bold text-primary">Detection & Monitoring Systems</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold text-lg mb-2">NASA's Center for NEO Studies (CNEOS)</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CNEOS monitors all known near-Earth objects, calculating their orbits and assessing impact probabilities. 
                  The Sentry system automatically scans asteroid catalogs for potential Earth impacts over the next 100 years, 
                  providing early warning for threatening objects.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <h4 className="font-semibold text-lg mb-2">Ground-Based Telescopes</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Facilities like Pan-STARRS and the Catalina Sky Survey continuously scan the night sky, 
                  discovering hundreds of new asteroids annually. These systems have catalogued over 90% of 
                  potentially hazardous asteroids larger than 1 kilometer in diameter.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <h4 className="font-semibold text-lg mb-2">NEO Surveyor Mission</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Scheduled to launch in 2027, this infrared space telescope will discover asteroids that are 
                  difficult to detect from Earth, particularly those approaching from the direction of the Sun. 
                  It aims to find 90% of NEOs larger than 140 meters within a decade.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="physics" className="mt-6">
          <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-2xl font-bold text-primary">Impact Physics</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold text-lg mb-2">Kinetic Energy Formula</h4>
                <p className="text-sm font-mono bg-background/50 p-3 rounded">
                  E = ½ × m × v²
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Impact energy depends quadratically on velocity, meaning a doubling of speed results in 
                  four times the energy. This explains why even small asteroids can cause significant damage 
                  at cosmic velocities (15-72 km/s).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <h4 className="font-semibold text-lg mb-2">Crater Scaling Relationships</h4>
                <p className="text-sm font-mono bg-background/50 p-3 rounded">
                  D = 1.161 × (E/ρg)^0.22
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Crater diameter (D) scales with impact energy (E), target density (ρ), and gravity (g). 
                  This empirical formula, derived from nuclear tests and asteroid impacts, shows that 
                  crater size is much larger than the impactor itself.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <h4 className="font-semibold text-lg mb-2">Atmospheric Entry</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Small asteroids (&lt;25m) typically explode in the atmosphere (airburst) due to ram pressure. 
                  The 2013 Chelyabinsk meteor (20m) released energy equivalent to 30 Hiroshima bombs at 30km 
                  altitude, demonstrating how atmospheric entry physics protects Earth from smaller threats.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="facts" className="mt-6">
          <Card className="p-6 cosmic-border bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-2xl font-bold text-primary">Fascinating Facts</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold mb-2">🦖 Chicxulub Impact</h4>
                <p className="text-sm text-muted-foreground">
                  66 million years ago, a 10-km asteroid struck Earth with energy equivalent to 10 billion Hiroshima bombs, 
                  causing the extinction of 75% of species including non-avian dinosaurs.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <h4 className="font-semibold mb-2">💥 Tunguska Event</h4>
                <p className="text-sm text-muted-foreground">
                  In 1908, an asteroid or comet fragment exploded over Siberia, flattening 2,000 km² of forest. 
                  No crater formed, demonstrating the destructive power of airbursts.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <h4 className="font-semibold mb-2">🎯 DART Success</h4>
                <p className="text-sm text-muted-foreground">
                  In 2022, NASA's DART mission successfully altered asteroid Dimorphos's orbit by 33 minutes, 
                  exceeding predictions and proving kinetic deflection works.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                <h4 className="font-semibold mb-2">🌍 Daily Bombardment</h4>
                <p className="text-sm text-muted-foreground">
                  Earth is hit by about 100 tons of space dust and sand-sized particles every day. 
                  Meteors larger than 1m strike roughly once per year.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-semibold mb-2">📊 Statistical Risk</h4>
                <p className="text-sm text-muted-foreground">
                  The chance of a civilization-ending impact (10km asteroid) in your lifetime is about 1 in 10 million, 
                  similar to dying in a plane crash.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <h4 className="font-semibold mb-2">🔍 Discovery Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Over 32,000 near-Earth asteroids have been discovered, with about 2,000 new ones found each year. 
                  This rate continues to accelerate with improved detection technology.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
