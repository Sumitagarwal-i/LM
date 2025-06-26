
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  Wand2, 
  Sparkles, 
  Copy, 
  Download, 
  Share2,
  ExternalLink
} from 'lucide-react';

interface ContentEditorProps {
  selectedTemplate: string | null;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ selectedTemplate }) => {
  const [url, setUrl] = useState('');
  const [instruction, setInstruction] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!url || !selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate content generation
    setTimeout(() => {
      const sampleContent = getSampleContent(selectedTemplate);
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  const getSampleContent = (template: string) => {
    const samples = {
      'linkedin-post': `🚀 Just discovered an incredible insight about AI-powered content creation!

Key takeaways from the article:
• AI tools are revolutionizing how we create content
• Time savings of up to 70% for content creators
• Quality remains high with proper prompting

The future of content creation is here, and it's more accessible than ever.

What's your experience with AI tools? Share below! 👇

#AI #ContentCreation #Innovation #LinkedInPost`,
      
      'twitter-thread': `1/ 🧵 Thread: Why AI-powered content tools are game-changers for creators

2/ Traditional content creation takes hours. Research, writing, editing, formatting - it's a massive time sink.

3/ New AI tools can analyze any link and transform it into multiple content formats instantly.

4/ Here's what I learned from testing these tools:
- 70% time savings ⏰
- Consistent quality 📈
- Multiple formats from one source 🔄

5/ The best part? You maintain creative control while AI handles the heavy lifting.

/end 🎯`,
      
      'newsletter': `# Weekly AI Insights Newsletter

## 🌟 Featured Article Analysis

This week, we analyzed an incredible piece about the future of AI in content creation.

### Key Highlights:
- **Time Efficiency**: 70% reduction in content creation time
- **Quality Consistency**: AI maintains high standards across formats
- **Scalability**: Generate multiple content pieces from single sources

### What This Means for You:
Content creators can now focus on strategy and creativity while AI handles the heavy lifting of format conversion and initial drafts.

### Action Items:
1. Test AI tools with your existing content
2. Develop a content repurposing strategy
3. Maintain your unique voice while leveraging AI efficiency

---
*That's all for this week! Forward this to a fellow creator who might benefit.*`
    };
    
    return samples[template as keyof typeof samples] || 'Generated content will appear here...';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link className="h-5 w-5" />
            Content Source
            {selectedTemplate && (
              <Badge variant="outline" className="ml-2 text-xs">
                {selectedTemplate.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste your link</label>
            <Input
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional instructions (optional)</label>
            <Textarea
              placeholder="Add specific requirements, tone, or focus areas..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="bg-background/50 min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!url || !selectedTemplate || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Content</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-background/30 border border-border/50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {generatedContent}
              </pre>
            </div>
            
            {url && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                Source: {url}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedTemplate && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Template</h3>
            <p className="text-muted-foreground">
              Choose a content template from the sidebar to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
