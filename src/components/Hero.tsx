import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Shield, ChevronDown } from "lucide-react";

export const Hero = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToSimulator = () => {
    setIsScrolling(true);
    const simulatorSection = document.getElementById('simulator');
    simulatorSection?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <img 
            src="/src/assets/draconid-animated.gif" 
            alt="Draconid Meteor Shower" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_40px_rgba(0,217,255,0.6)]"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black animate-in fade-in slide-in-from-top duration-700 delay-100">
          <span className="text-gradient glow-text">DRACONID</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl mx-auto animate-in fade-in slide-in-from-top duration-700 delay-200">
          Interactive Asteroid Impact Simulator
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top duration-700 delay-300">
          Launch asteroids, witness realistic impacts, and explore planetary defense strategies 
          with live NASA data and cutting-edge 3D visualizations.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm">Real NASA Data</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">3D Orbital Mechanics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">Defense Strategies</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <Button
            size="lg"
            onClick={scrollToSimulator}
            className="group relative px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all duration-300"
          >
            Launch Simulator
            <ChevronDown className={`ml-2 w-5 h-5 transition-transform ${isScrolling ? 'animate-bounce' : 'group-hover:translate-y-1'}`} />
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary/50" />
      </div>
    </div>
  );
};
