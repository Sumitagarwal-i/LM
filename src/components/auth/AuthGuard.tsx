
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  onSignInClick: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  onSignInClick,
  onContinueAsGuest
}) => {
  if (!requireAuth) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="h-5 w-5" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            You need to sign in to access this feature, or continue as a guest with limited functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onSignInClick} className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Sign In / Sign Up
          </Button>
          {onContinueAsGuest && (
            <Button
              variant="outline"
              onClick={onContinueAsGuest}
              className="w-full"
            >
              Continue as Guest
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
