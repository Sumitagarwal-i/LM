
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Twitter, 
  Linkedin, 
  Mail, 
  FileText, 
  Users, 
  PenTool,
  Hash,
  Sparkles
} from 'lucide-react';

export type TemplateType = 
  | 'linkedin-post' 
  | 'twitter-thread' 
  | 'newsletter' 
  | 'blog-summary' 
  | 'social-caption' 
  | 'email-sequence'
  | 'qa-format'
  | 'hashtag-generator';

interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  popular?: boolean;
}

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    description: 'Professional posts with engagement hooks',
    icon: Linkedin,
    color: 'blue',
    popular: true
  },
  {
    id: 'twitter-thread',
    name: 'Twitter Thread',
    description: 'Multi-tweet threads with proper flow',
    icon: Twitter,
    color: 'sky'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Email newsletter with sections',
    icon: Mail,
    color: 'green'
  },
  {
    id: 'blog-summary',
    name: 'Blog Summary',
    description: 'Key points and takeaways',
    icon: FileText,
    color: 'orange'
  },
  {
    id: 'social-caption',
    name: 'Social Caption',
    description: 'Instagram/Facebook captions',
    icon: MessageSquare,
    color: 'pink'
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence',
    description: 'Multi-part email series',
    icon: Users,
    color: 'purple'
  },
  {
    id: 'qa-format',
    name: 'Q&A Format',
    description: 'Question and answer breakdown',
    icon: PenTool,
    color: 'indigo'
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Relevant hashtags for content',
    icon: Hash,
    color: 'teal'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onTemplateSelect(templateId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="font-semibold text-lg">Content Templates</h3>
        </div>
        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
          {templates.length} available
        </Badge>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`
              cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
              border-border/30 bg-card/30 backdrop-blur-sm
              ${selectedTemplate === template.id 
                ? 'ring-2 ring-purple-500/50 bg-purple-500/10 border-purple-500/50' 
                : 'hover:bg-card/50 hover:border-border/50'
              }
            `}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedTemplate === template.id 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-muted/30 text-muted-foreground'
                }`}>
                  <template.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                    {template.popular && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Template Ready
          </h4>
          <p className="text-sm text-muted-foreground">
            {templates.find(t => t.id === selectedTemplate)?.name} template selected. 
            Add your link and instructions in the main editor to generate content.
          </p>
        </div>
      )}
    </div>
  );
};
