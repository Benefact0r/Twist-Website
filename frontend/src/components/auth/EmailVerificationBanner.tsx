import { useState } from 'react';
import { Mail, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export function EmailVerificationBanner() {
  const { user, isEmailVerified, resendVerificationEmail } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || isEmailVerified || dismissed) return null;

  const handleResend = async () => {
    setIsResending(true);
    const { error } = await resendVerificationEmail();
    setIsResending(false);

    if (error) {
      const isRateLimit = error.message?.includes('rate') || error.status === 429;
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: isRateLimit
          ? (language === 'ka' ? 'დაიცადე რამდენიმე წუთი და სცადე ხელახლა' : 'Please wait a few minutes and try again')
          : (language === 'ka' ? 'რაღაც შეცდომა მოხდა. სცადე თავიდან' : 'Something went wrong. Please try again'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: language === 'ka' ? '✓ გაგზავნილია' : '✓ Sent',
        description: language === 'ka' ? 'ვერიფიკაციის ლინკი გაგზავნილია' : 'Verification link has been sent',
      });
    }
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            {language === 'ka' ? 'დაადასტურე ელფოსტა გასაგრძელებლად' : 'Please verify your email to continue'}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            {language === 'ka' ? 'შეამოწმე შემოსული წერილები:' : 'Check your inbox:'} {user.email}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/50"
            onClick={handleResend}
            disabled={isResending}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isResending ? 'animate-spin' : ''}`} />
            {language === 'ka' ? 'ხელახლა გაგზავნა' : 'Resend email'}
          </Button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-600 dark:text-amber-600 dark:hover:text-amber-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
