import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Sparkles, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
// import { ReactMarkdown } from 'react-markdown';

interface ActionResult {
  content: string;
  actionTitle?: string;
}

interface ResultPanelProps {
  result: ActionResult;
  onClose: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const isLong = result.content.length > 1500;
  const previewLength = 1500;
  // Find a word boundary for preview
  const previewEnd = isLong ? result.content.lastIndexOf(' ', previewLength) : result.content.length;
  const previewContent = isLong ? result.content.slice(0, previewEnd) + '...' : result.content;

  const copyToClipboard = async () => {
    if (!result?.content) return;
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Result copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Show back-to-top button if scrolled > 300px
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Card className="h-fit bg-transparent shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          {result.actionTitle || 'AI Result'}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="relative bg-background rounded-lg p-4 prose prose-invert max-w-none animate-fade-in"
          style={{
            maxHeight: 'calc(100vh - 264px)',
            overflowY: 'auto',
            lineHeight: 1.8,
            boxShadow: '0 2px 16px 0 #0002',
          }}
        >
          <ReactMarkdown
            components={{
              p: (props) => <p style={{ marginBottom: '1.25em' }} {...props} />,
              ul: (props) => <ul style={{ marginBottom: '1.25em', paddingLeft: '1.5em' }} {...props} />,
              ol: (props) => <ol style={{ marginBottom: '1.25em', paddingLeft: '1.5em' }} {...props} />,
              h1: (props) => <h1 style={{ marginTop: '1.5em', marginBottom: '1em' }} {...props} />,
              h2: (props) => <h2 style={{ marginTop: '1.25em', marginBottom: '0.75em' }} {...props} />,
              h3: (props) => <h3 style={{ marginTop: '1em', marginBottom: '0.5em' }} {...props} />,
            }}
          >
            {expanded || !isLong ? result.content : previewContent}
          </ReactMarkdown>
          {isLong && (
            <div className="flex flex-col items-center mt-6">
              <div className="relative w-full flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpanded((v) => !v)}
                  className="gap-2"
                >
                  {expanded ? 'Show Less' : 'Show Full Analysis'}
                </Button>
                {/* {showTop && (
                  <span className="absolute left-1/2" style={{ transform: 'translateX(110%)' }}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={handleBackToTop}
                      className="shadow-lg bg-background/60 hover:bg-background ml-4"
                      style={{ borderRadius: '50%' }}
                      aria-label="Back to Top"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </span>
                )} */}
              </div>
              {!expanded && (
                <ArrowDown className="h-6 w-6 mt-2 text-muted-foreground animate-bounce" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultPanel;
