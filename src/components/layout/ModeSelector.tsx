
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Sparkles } from 'lucide-react';

export type AppMode = 'general' | 'creator';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  currentMode, 
  onModeChange 
}) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
      <Button
        variant={currentMode === 'general' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('general')}
        className={`gap-2 transition-all duration-300 ${
          currentMode === 'general' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20' 
            : 'hover:bg-muted/50'
        }`}
      >
        <Zap className="h-4 w-4" />
        General
      </Button>
      
      <Button
        variant={currentMode === 'creator' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('creator')}
        className={`gap-2 transition-all duration-300 ${
          currentMode === 'creator' 
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20' 
            : 'hover:bg-muted/50'
        }`}
      >
        <Sparkles className="h-4 w-4" />
        Creator
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
          New
        </Badge>
      </Button>
    </div>
  );
};
