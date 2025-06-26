
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Copy, 
  Share2, 
  Wand2, 
  RotateCcw, 
  Zap,
  FileText,
  Settings
} from 'lucide-react';
import { AppMode } from '../layout/ModeSelector';

interface RefinementPanelProps {
  mode: AppMode;
}

export const RefinementPanel: React.FC<RefinementPanelProps> = ({ mode }) => {
  const refinementActions = [
    { label: 'Make it shorter', icon: Wand2 },
    { label: 'Add quotes', icon: FileText },
    { label: 'Change tone', icon: Settings },
    { label: 'More engaging', icon: Zap },
  ];

  const exportActions = [
    { label: 'Copy to clipboard', icon: Copy, primary: true },
    { label: 'Download PDF', icon: Download },
    { label: 'Share link', icon: Share2 },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Refinements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Quick Refinements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {refinementActions.map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 hover:bg-muted/50"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to original
          </Button>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export & Share
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {exportActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.primary ? 'default' : 'outline'}
              size="sm"
              className={`w-full justify-start gap-2 ${
                action.primary 
                  ? mode === 'creator' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  : 'hover:bg-muted/50'
              }`}
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </Button>
          ))}
          
          <div className="pt-2 border-t border-border/50">
            <Badge variant="outline" className="w-full justify-center text-xs">
              More export options coming soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mode-specific actions */}
      {mode === 'creator' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Creator Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 hover:bg-purple-500/10"
            >
              Switch template
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 hover:bg-purple-500/10"
            >
              Batch generate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
