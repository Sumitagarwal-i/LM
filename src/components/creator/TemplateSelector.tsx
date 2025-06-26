
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
  Hash
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

export const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Content Templates</h3>
        <Badge variant="outline" className="text-xs">
          {templates.length} available
        </Badge>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`
              cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md
              ${selectedTemplate === template.id 
                ? `ring-2 ring-${template.color}-500/50 bg-${template.color}-500/5` 
                : 'hover:bg-muted/50'
              }
            `}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${template.color}-500/20 flex items-center justify-center`}>
                  <template.icon className={`h-4 w-4 text-${template.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
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
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <h4 className="font-medium text-purple-400 mb-2">Template Selected</h4>
          <p className="text-sm text-muted-foreground">
            {templates.find(t => t.id === selectedTemplate)?.name} template is ready. 
            Paste your link and add a prompt to generate content.
          </p>
        </div>
      )}
    </div>
  );
};
