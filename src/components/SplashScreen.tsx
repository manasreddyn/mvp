import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <div 
      className={`splash-screen ${isExiting ? 'animate-splash-exit' : ''}`}
    >
      {/* Logo */}
      <div className="splash-logo mb-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center">
            <Activity className="h-12 w-12 text-primary-foreground" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 h-24 w-24 rounded-2xl bg-primary blur-xl opacity-50" />
        </div>
      </div>

      {/* Brand Name */}
      <div className="splash-text text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Kernex
        </h1>
        <p className="text-lg text-white/60">
          Industrial IoT Command Center
        </p>
      </div>

      {/* Loading indicator */}
      <div className="splash-loader flex items-center gap-2">
        <div className="loader-dot h-3 w-3 rounded-full bg-primary" />
        <div className="loader-dot h-3 w-3 rounded-full bg-primary" />
        <div className="loader-dot h-3 w-3 rounded-full bg-primary" />
      </div>

      {/* Version info */}
      <div className="absolute bottom-8 text-center">
        <p className="text-sm text-white/40">v1.0.0</p>
      </div>
    </div>
  );
}