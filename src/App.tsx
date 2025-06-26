
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
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creator Studio
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a template from the sidebar, paste your link, and generate formatted content
              </p>
            </div>
            
            {/* Creator Mode Interface */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass p-8 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Template-Based Content Generation</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Choose a template from the left sidebar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Paste your link in the input field</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Add your custom prompt or instructions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Use refinement tools on the right sidebar</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <p className="text-sm text-purple-200">
                    🚀 <strong>V1 Features Available:</strong><br/>
                    • Template Selection (LinkedIn, Twitter, Newsletter, etc.)<br/>
                    • Content Refinement Tools<br/>
                    • Export & Share Options<br/>
                    • Mode Switching (General ↔ Creator)
                  </p>
                </div>
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
