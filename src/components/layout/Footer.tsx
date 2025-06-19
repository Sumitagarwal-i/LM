import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart ,SquareArrowUpRight} from 'lucide-react';


interface FooterProps {
  onFeedbackModalOpen: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFeedbackModalOpen }) => {
  return (
    <footer className="border-t border-border/50 mt-0 w-full" style={{ marginTop: 'auto' }}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>A</span>
            
            <span className="font-medium text-foreground">QyVante</span>
            <span>Product</span>
            <a href='https://qyvante.vercel.app/' target='_blank'><SquareArrowUpRight className="h-5 w-5"/></a>
          </div>
          
          {/* <Button
            variant="ghost"
            onClick={onFeedbackModalOpen}
            className="gap-2 hover:bg-muted/50 transition-colors duration-200 text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Button> */}
        </div>
      </div>
    </footer>
  );
};
