
import React from 'react';
import { ModeSelector, AppMode } from './ModeSelector';
import { TemplateSelector } from '../creator/TemplateSelector';
import { RefinementPanel } from '../creator/RefinementPanel';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LinkMage Studio
              </h1>
              <div className="text-sm text-muted-foreground">
                v1.0 - AI-Powered Content Creation
              </div>
            </div>
            
            <ModeSelector currentMode={mode} onModeChange={onModeChange} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Only show in Creator Mode */}
        {mode === 'creator' && (
          <div className="w-80 border-r border-white/10 bg-black/30 backdrop-blur-sm overflow-y-auto">
            <div className="p-6 space-y-6">
              <TemplateSelector />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </div>

          {/* Right Sidebar - Only show in Creator Mode */}
          {mode === 'creator' && (
            <div className="w-80 border-l border-white/10 bg-black/30 backdrop-blur-sm overflow-y-auto">
              <div className="p-6">
                <RefinementPanel mode={mode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
