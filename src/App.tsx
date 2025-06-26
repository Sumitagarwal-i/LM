
import React, { useState } from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CinematicHero } from './components/layout/CinematicHero';
import { StudioLayout } from './components/layout/StudioLayout';
import { LinkAnalyzer } from './components/analyzer/LinkAnalyzer';
import { AppMode } from './components/layout/ModeSelector';
import { Button } from './components/ui/button';
import { ArrowRight } from 'lucide-react';
import './App.css';

const App = () => {
  const [showStudio, setShowStudio] = useState(false);
  const [mode, setMode] = useState<AppMode>('general');

  if (!showStudio) {
    return (
      <div style={{ height: '100vh', overflowY: 'auto', background: '#000', WebkitOverflowScrolling: 'touch' }}>
        <CinematicHero />
        
        {/* Call to Action Section */}
        <div className="container mx-auto px-6 py-20 text-center">
          <Button
            size="lg"
            onClick={() => setShowStudio(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
          >
            Enter Studio
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
        
        <Analytics />
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: '#000' }}>
      <StudioLayout mode={mode} onModeChange={setMode}>
        {mode === 'general' ? (
          <LinkAnalyzer
            url=""
            setUrl={() => {}}
            analysis={null}
            setAnalysis={() => {}}
            result={null}
            setResult={() => {}}
            actionSetsShown={1}
            setActionSetsShown={() => {}}
          />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Creator Studio</h2>
              <p className="text-muted-foreground text-lg">
                Select a template from the sidebar and paste your link to generate formatted content
              </p>
            </div>
            
            {/* Creator Mode Interface - Placeholder for now */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Coming Soon: Creator Mode</h3>
                <p className="text-muted-foreground">
                  Template-based content generation with formatted outputs is being built. 
                  For now, use General Mode for link analysis.
                </p>
              </div>
            </div>
          </div>
        )}
      </StudioLayout>
      
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
