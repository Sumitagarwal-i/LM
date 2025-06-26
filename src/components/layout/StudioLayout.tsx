
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeSelector, AppMode } from './ModeSelector';
import { TemplateSelector } from '../creator/TemplateSelector';
import { RefinementPanel } from '../creator/RefinementPanel';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudioLayoutProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  mode,
  onModeChange,
  children
}) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <div 
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
          ${leftPanelOpen ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out
          ${isMobile && leftPanelOpen ? 'shadow-2xl' : ''}
        `}
      >
        <div className="h-full bg-card/50 backdrop-blur-xl border-r border-border/50 overflow-hidden">
          {leftPanelOpen && (
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Studio</h2>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeftPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Mode Selector */}
              <div className="mb-6">
                <ModeSelector currentMode={mode} onModeChange={onModeChange} />
              </div>

              {/* Template Selector for Creator Mode */}
              {mode === 'creator' && (
                <div className="flex-1 overflow-y-auto">
                  <TemplateSelector />
                </div>
              )}

              {/* General Mode Tools */}
              {mode === 'general' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h3 className="font-medium text-blue-400 mb-2">General Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Paste any link to extract and analyze content with AI
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && leftPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setLeftPanelOpen(false)}
        />
      )}

      {/* Center Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="hover:bg-muted/50"
            >
              {leftPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <span className="font-medium">
              {mode === 'general' ? 'General Analysis' : 'Creator Studio'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="hover:bg-muted/50"
          >
            {rightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Right Sidebar */}
      <div 
        className={`
          ${isMobile ? 'fixed inset-y-0 right-0 z-50' : 'relative'} 
          ${rightPanelOpen ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out
          ${isMobile && rightPanelOpen ? 'shadow-2xl' : ''}
        `}
      >
        <div className="h-full bg-card/50 backdrop-blur-xl border-l border-border/50 overflow-hidden">
          {rightPanelOpen && (
            <div className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Actions</h2>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRightPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <RefinementPanel mode={mode} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay for Right Panel */}
      {isMobile && rightPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setRightPanelOpen(false)}
        />
      )}
    </div>
  );
};
