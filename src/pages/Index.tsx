import { Hero } from "@/components/Hero";
import { Enhanced3DViewer } from "@/components/Enhanced3DViewer";
import { EnhancedImpactSimulator } from "@/components/EnhancedImpactSimulator";
import { NASADataFeed } from "@/components/NASADataFeed";
import { EducationalPanel } from "@/components/EducationalPanel";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Simulator Section */}
      <section id="simulator" className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Live 3D Solar System Viewer */}
          <Enhanced3DViewer />

          <Separator className="bg-border/50" />

          {/* Enhanced Impact Simulator */}
          <EnhancedImpactSimulator />

          <Separator className="bg-border/50" />

          {/* NASA Data Feed */}
          <div className="space-y-6">
            <NASADataFeed />
          </div>

          <Separator className="bg-border/50" />

          {/* Educational Panel */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient">
                Learn More
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore planetary defense strategies, detection systems, and the science behind asteroid impacts
              </p>
            </div>
            <EducationalPanel />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/assets/draconid-animated.gif" 
              alt="Draconid Logo" 
              className="w-16 h-16 object-contain opacity-70"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Draconid - Planetary Defense Simulator
          </p>
          <p className="text-xs text-muted-foreground">
            Data provided by NASA's Near Earth Object Web Service and USGS Earth Explorer
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built for NASA Space Apps Challenge 2025 • Educational purposes only
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
