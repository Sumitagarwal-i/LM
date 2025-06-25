import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onDismiss, 
  className = "" 
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 p-1 hover:bg-destructive/20 rounded"
            aria-label="Dismiss error"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}; 