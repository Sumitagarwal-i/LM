import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionsList } from '@/components/ActionsList';
import { ResultPanel } from '@/components/ResultPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedToast } from '@/hooks/use-toast';
import { apiCall, ErrorHandler } from '@/lib/errorHandler';
import { Loader2, Link as LinkIcon, X as XIcon, FileText } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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

interface ActionResult {
  content: string;
  actionTitle?: string;
}

interface LinkAnalyzerProps {
  url: string;
  setUrl: (url: string) => void;
  analysis: LinkAnalysis | null;
  setAnalysis: (a: LinkAnalysis | null) => void;
  result: ActionResult | null;
  setResult: (r: ActionResult | null) => void;
  actionSetsShown: number;
  setActionSetsShown: (n: number) => void;
}

export const LinkAnalyzer: React.FC<LinkAnalyzerProps> = ({
  url,
  setUrl,
  analysis,
  setAnalysis,
  result,
  setResult,
  actionSetsShown,
  setActionSetsShown
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { user } = useAuth();
  const { showError, showSuccess } = useEnhancedToast();

  // Supported content types for the docs modal
  const supportedContentTypes = [
    "GitHub repository",
    "blog post",
    "product page",
    "YouTube sitcom",
    "YouTube movie",
    "YouTube video",
    "documentation",
    "news article",
    "portfolio",
    "forum post",
    "movie review"
  ];

  const analyzeLink = async () => {
    if (!url.trim()) {
      const error = ErrorHandler.createError(
        'VALIDATION_ERROR',
        'Missing URL',
        'Please enter a valid URL to analyze',
        'error',
        true
      );
      showError(error);
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setResult(null);
    setActionSetsShown(1);

    try {
      const data = await apiCall<LinkAnalysis>(
        '/api/analyze-link',
        {
          method: 'POST',
          body: JSON.stringify({ 
            link: url, 
            actionSet: 0 
          }),
        },
        'analyzing link'
      );
      
      setAnalysis(data);

      // Save to history if user is logged in
      if (user && data.type !== "insufficient") {
        await saveToHistory(url, data);
      }

    } catch (error) {
      showError(error, () => analyzeLink());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToHistory = async (link: string, analysisData: any) => {
    try {
      await apiCall(
        '/api/link_history',
        {
          method: 'POST',
          body: JSON.stringify({
            user_id: user?.id,
            link: link,
            title: analysisData.title || null,
            content_type: analysisData.type || null,
            summary: analysisData.purpose || null,
            analysis_data: analysisData
          }),
        },
        'saving to history'
      );
    } catch (error) {
      // Don't show error for history saving - it's not critical
      console.error('Error saving to history:', error);
    }
  };

  const executeAction = async (title: string, description: string) => {
    setIsExecuting(true);
    setResult(null);

    try {
      const data = await apiCall<ActionResult>(
        '/api/execute-action',
        {
          method: 'POST',
          body: JSON.stringify({
            link: url,
            action: title
          }),
        },
        'executing action'
      );
      
      setResult({
        content: data.content,
        actionTitle: title
      });

    } catch (error) {
      showError(error, () => executeAction(title, description));
    } finally {
      setIsExecuting(false);
    }
  };

  const loadMoreActions = async () => {
    if (!analysis || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      const data = await apiCall<LinkAnalysis>(
        '/api/analyze-link',
        {
          method: 'POST',
          body: JSON.stringify({ 
            link: url, 
            actionSet: analysis.nextActionSet || 999 // Use 999 for dynamic AI actions
          }),
        },
        'loading more actions'
      );
      
      setAnalysis(data);
      setActionSetsShown(actionSetsShown + 1);

    } catch (error) {
      showError(error, () => loadMoreActions());
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Link Analyzer
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1 ml-1" title="Supported Content Types">
                  <FileText className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supported Content Types</DialogTitle>
                  <DialogDescription>
                    The following content types are fully supported for specialized actions:
                  </DialogDescription>
                </DialogHeader>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {supportedContentTypes.map(type => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Enter URL to analyze</Label>
            <div className="flex gap-2">
              {url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setUrl('')}
                  className="self-center"
                  aria-label="Reset URL"
                  tabIndex={0}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeLink()}
                disabled={isAnalyzing}
              />
              <Button 
                onClick={analyzeLink} 
                disabled={isAnalyzing || !url.trim()}
                className="gap-2"
              >
                {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          {isAnalyzing && !analysis ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : analysis ? (
            <ActionsList
              analysis={analysis}
              isExecuting={isExecuting}
              onExecuteAction={executeAction}
              onMoreActions={loadMoreActions}
              isAnalyzing={isAnalyzing}
              actionSetsShown={actionSetsShown}
            />
          ) : null}
        </div>

        <div>
          {result && (
            <div className="result-box">
              <ResultPanel
                result={result}
                onClose={() => setResult(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
