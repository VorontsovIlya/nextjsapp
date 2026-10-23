import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface UnauthorizedPageProps {
  onBack?: () => void;
  resource?: string;
}

export function UnauthorizedPage({ onBack, resource = 'this resource' }: UnauthorizedPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full border-destructive/30">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access {resource}. Please contact an administrator if you believe this is an error.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
            <Lock className="h-4 w-4" />
            <span>This action is restricted to users with higher privileges.</span>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
