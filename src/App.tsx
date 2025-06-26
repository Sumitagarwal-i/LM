
import React, { useState } from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { UnifiedNavbar } from './components/layout/UnifiedNavbar';
import { EnhancedHero } from './components/layout/EnhancedHero';
import { StudioLayout } from './components/layout/StudioLayout';
import { LinkAnalyzer } from './components/analyzer/LinkAnalyzer';
import { TemplateSelector } from './components/creator/TemplateSelector';
import { ContentEditor } from './components/creator/ContentEditor';
import { RefinementPanel } from './components/creator/RefinementPanel';
import { Footer } from './components/layout/Footer';
import { AppMode } from './components/layout/ModeSelector';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'studio'>('home');
  const [mode, setMode] = useState<AppMode>('general');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: 'general' | 'creator') => {
    setMode(selectedMode);
    setCurrentView('studio');
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavbar 
          currentMode={mode} 
          onModeChange={setMode} 
          showModeSelector={false}
        />
        <EnhancedHero onModeSelect={handleModeSelect} />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar 
        currentMode={mode} 
        onModeChange={setMode} 
        showModeSelector={true}
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Creator Mode Only */}
        {mode === 'creator' && (
          <div className="w-80 border-r border-border/50 bg-muted/20 backdrop-blur-sm overflow-y-auto">
            <div className="p-6">
              <TemplateSelector onTemplateSelect={setSelectedTemplate} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {mode === 'general' ? (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Link Analyzer</h2>
                    <p className="text-muted-foreground text-lg">
                      Paste any link to extract summaries and insights
                    </p>
                  </div>
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
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Creator Studio
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Transform links into professional content with AI templates
                    </p>
                  </div>
                  <ContentEditor selectedTemplate={selectedTemplate} />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Creator Mode Only */}
          {mode === 'creator' && (
            <div className="w-80 border-l border-border/50 bg-muted/20 backdrop-blur-sm overflow-y-auto">
              <div className="p-6">
                <RefinementPanel mode={mode} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
