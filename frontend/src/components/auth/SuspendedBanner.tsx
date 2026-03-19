import { AlertTriangle, Clock, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuspendedBannerProps {
  reason: string | null;
  duration: string | null;
  expiresAt: string | null;
  onSignOut: () => void;
}

export const SuspendedBanner = ({ 
  reason, 
  duration, 
  expiresAt, 
  onSignOut 
}: SuspendedBannerProps) => {
  const isPermanent = duration === 'permanent';
  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  // If suspension has expired, don't show banner
  if (isExpired && !isPermanent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            {isPermanent ? (
              <Ban className="h-8 w-8 text-destructive" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle className="text-destructive">Account Suspended</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your account has been suspended due to a violation of our terms of service.
          </p>

          {reason && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Reason:</p>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {isPermanent ? (
              <span className="text-destructive font-medium">This suspension is permanent</span>
            ) : expiryDate ? (
              <span>
                Suspension ends: <span className="font-medium">{format(expiryDate, 'MMM d, yyyy \'at\' HH:mm')}</span>
              </span>
            ) : (
              <span>Duration: {duration}</span>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-xs text-center text-muted-foreground">
              If you believe this is a mistake, please contact our support team.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open('mailto:support@example.com', '_blank')}
              >
                Contact Support
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
