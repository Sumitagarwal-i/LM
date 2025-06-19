import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Brain, Search, Settings, Sparkles, Tv, Users, Film, Star, ThumbsUp, Camera } from 'lucide-react';

interface LinkAnalysis {
  type: string;
  purpose: string;
  actions: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  nextActionSet?: number;
  totalActionSets?: number;
  isDynamic?: boolean;
}

interface ActionsListProps {
  analysis: LinkAnalysis;
  isExecuting: boolean;
  onExecuteAction: (title: string, description: string) => void;
  onMoreActions: () => void;
  isAnalyzing: boolean;
  actionSetsShown?: number;
}

export const ActionsList: React.FC<ActionsListProps> = ({
  analysis,
  isExecuting,
  onExecuteAction,
  onMoreActions,
  isAnalyzing,
  actionSetsShown = 1
}) => {
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const getActionIcon = (iconType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '🧠': <Brain className="w-4 h-4" />,
      '🔍': <Search className="w-4 h-4" />,
      '⚙️': <Settings className="w-4 h-4" />,
      '✍️': <Sparkles className="w-4 h-4" />,
      '🐦': <Sparkles className="w-4 h-4" />,
      '📧': <Sparkles className="w-4 h-4" />,
      '⚖️': <Sparkles className="w-4 h-4" />,
      '💡': <Sparkles className="w-4 h-4" />,
      '🏷️': <Sparkles className="w-4 h-4" />,
      '💼': <Sparkles className="w-4 h-4" />,
      '🎓': <Sparkles className="w-4 h-4" />,
      '❓': <Sparkles className="w-4 h-4" />,
      '📝': <Sparkles className="w-4 h-4" />,
      '📹': <Sparkles className="w-4 h-4" />,
      '🔗': <Sparkles className="w-4 h-4" />,
      '📰': <Sparkles className="w-4 h-4" />,
      '📚': <Sparkles className="w-4 h-4" />,
      '📋': <Sparkles className="w-4 h-4" />,
      '✅': <Sparkles className="w-4 h-4" />,
      '🚀': <Sparkles className="w-4 h-4" />,
      '🔧': <Sparkles className="w-4 h-4" />,
      '⭐': <Star className="w-4 h-4" />,
      '👤': <Sparkles className="w-4 h-4" />,
      '📱': <Sparkles className="w-4 h-4" />,
      '📺': <Tv className="w-4 h-4" />,
      '👥': <Users className="w-4 h-4" />,
      '😄': <Sparkles className="w-4 h-4" />,
      '📖': <Sparkles className="w-4 h-4" />,
      '🌍': <Sparkles className="w-4 h-4" />,
      '💭': <Sparkles className="w-4 h-4" />,
      '🎬': <Film className="w-4 h-4" />,
      '🎥': <Camera className="w-4 h-4" />,
      '👍': <ThumbsUp className="w-4 h-4" />
    };
    return iconMap[iconType] || <Brain className="w-4 h-4" />;
  };

  const handleActionClick = async (title: string, description: string) => {
    setExecutingAction(title);
    await onExecuteAction(title, description);
    setExecutingAction(null);
  };

  if (analysis.type === "insufficient") {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-orange-400">Need More Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Please provide a valid URL for better AI analysis and actions.
          </p>
          <div className="text-sm text-muted-foreground">
            <strong>Tips:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Make sure the URL is accessible</li>
              <li>Include the full URL with protocol (https://)</li>
              <li>Try a different link if this one isn't working</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            Smart AI Actions
            {analysis.isDynamic && (
              <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                AI Generated
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-3">
            {analysis.isDynamic && (
              <div className="text-xs text-purple-400 font-medium">
                ✨ Unique AI Actions
              </div>
            )}
            {analysis.nextActionSet !== undefined && 
             analysis.totalActionSets && 
             actionSetsShown < analysis.totalActionSets && (
              <Button
                variant="outline"
                size="sm"
                onClick={e => { e.preventDefault(); e.stopPropagation(); onMoreActions(); }}
                disabled={isAnalyzing}
                className="gap-2 border-border hover:bg-accent"
              >
                <RefreshCw className="w-4 h-4" />
                More Actions
              </Button>
            )}
            {analysis.totalActionSets && actionSetsShown >= analysis.totalActionSets && !analysis.isDynamic && (
              <Button
                variant="outline"
                size="sm"
                onClick={e => { e.preventDefault(); e.stopPropagation(); onMoreActions(); }}
                disabled={isAnalyzing}
                className="gap-2 border-border hover:bg-accent"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Actions
              </Button>
            )}
            {analysis.isDynamic && (
              <div className="text-xs text-green-400 font-medium">
                ✓ Dynamic actions generated
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.actions.map((action, index) => {
              const isCurrentlyExecuting = executingAction === action.title;
              const isAnyExecuting = executingAction !== null;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start w-full hover:bg-accent transition-colors border-border disabled:opacity-50"
                  onClick={() => handleActionClick(action.title, action.description)}
                  disabled={isAnyExecuting}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCurrentlyExecuting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        getActionIcon(action.icon)
                      )}
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <div className="font-medium text-foreground">{action.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
