
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary via-primary/80 to-primary/60 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent leading-tight">
          Smart Link Analyzer
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Understand links like never before — AI-powered insights in seconds.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </div>
    </div>
  );
};
