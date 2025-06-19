
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, X, Bold, Italic, List } from 'lucide-react';

interface RichNoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const RichNoteEditor: React.FC<RichNoteEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), content.trim());
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          ref={titleRef}
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold"
        />
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('**', '**')}
              className="gap-1"
            >
              <Bold className="h-3 w-3" />
              Bold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('*', '*')}
              className="gap-1"
            >
              <Italic className="h-3 w-3" />
              Italic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('\n- ')}
              className="gap-1"
            >
              <List className="h-3 w-3" />
              List
            </Button>
          </div>
          
          <Textarea
            ref={contentRef}
            placeholder="Type your note here... Use ** for bold, * for italic, and - for bullet points"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="resize-none"
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
