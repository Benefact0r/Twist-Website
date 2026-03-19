import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports, ReportCategory, reportReasons } from '@/hooks/useReports';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReportListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  sellerId: string;
  listingTitle?: string;
}

type Step = 'reason' | 'details' | 'confirm' | 'success';

export function ReportListingModal({
  isOpen,
  onClose,
  listingId,
  sellerId,
  listingTitle,
}: ReportListingModalProps) {
  const { language } = useLanguage();
  const { submitReport, isSubmitting } = useReports();
  const isMobile = useIsMobile();
  
  const [step, setStep] = useState<Step>('reason');
  const [selectedReason, setSelectedReason] = useState<ReportCategory | null>(null);
  const [details, setDetails] = useState('');

  const handleClose = () => {
    setStep('reason');
    setSelectedReason(null);
    setDetails('');
    onClose();
  };

  const handleReasonSelect = (reason: ReportCategory) => {
    setSelectedReason(reason);
    setStep('details');
  };

  const handleContinueToConfirm = () => {
    setStep('confirm');
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    const success = await submitReport(listingId, sellerId, selectedReason, details);
    if (success) {
      setStep('success');
    }
  };

  const handleBackToReason = () => {
    setStep('reason');
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Step: Reason Selection */}
      {step === 'reason' && (
        <div className="space-y-3 p-1">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'ka' 
              ? 'აირჩიეთ მიზეზი, რომელიც ყველაზე მეტად შეესაბამება პრობლემას:' 
              : 'Select the reason that best describes the issue:'}
          </p>
          
          {reportReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => handleReasonSelect(reason.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all text-left group"
            >
              <span className="text-xl">{reason.icon}</span>
              <span className="flex-1 text-sm font-medium">
                {language === 'ka' ? reason.labelKa : reason.labelEn}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
          
          <p className="text-xs text-muted-foreground text-center pt-2">
            {language === 'ka' 
              ? 'ცრუ რეპორტებმა შეიძლება გავლენა მოახდინოს თქვენს ანგარიშზე.' 
              : 'False reports may affect your account.'}
          </p>
        </div>
      )}

      {/* Step: Optional Details */}
      {step === 'details' && (
        <div className="space-y-4 p-1">
          <button
            onClick={handleBackToReason}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            ← {language === 'ka' ? 'უკან' : 'Back'}
          </button>
          
          <div className="p-3 rounded-xl bg-muted/50 flex items-center gap-3">
            <span className="text-xl">
              {reportReasons.find(r => r.id === selectedReason)?.icon}
            </span>
            <span className="text-sm font-medium">
              {language === 'ka' 
                ? reportReasons.find(r => r.id === selectedReason)?.labelKa
                : reportReasons.find(r => r.id === selectedReason)?.labelEn}
            </span>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'ka' ? 'დამატებითი დეტალები (არასავალდებულო)' : 'Additional details (optional)'}
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 300))}
              placeholder={language === 'ka' 
                ? 'მოკლედ აღწერეთ რა არის არასწორი. ეს დაგვეხმარება სწრაფ განხილვაში.' 
                : 'Tell us briefly what looks wrong. This helps us review faster.'}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {details.length}/300
            </p>
          </div>
          
          <Button 
            onClick={handleContinueToConfirm} 
            className="w-full"
            size="lg"
          >
            {language === 'ka' ? 'გაგრძელება' : 'Continue'}
          </Button>
        </div>
      )}

      {/* Step: Confirmation */}
      {step === 'confirm' && (
        <div className="space-y-4 p-1">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ka' ? 'დაადასტურეთ რეპორტი' : 'Confirm Report'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ka' 
                ? 'გმადლობთ, რომ ეხმარებით Twist-ს უსაფრთხოდ შენარჩუნებაში. ჩვენი გუნდი განიხილავს ამ განცხადებას.' 
                : 'Thanks for helping keep Twist safe. Our team will review this listing.'}
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/50 text-sm">
            <p className="font-medium mb-1">
              {language === 'ka' ? 'მიზეზი:' : 'Reason:'}
            </p>
            <p className="text-muted-foreground">
              {reportReasons.find(r => r.id === selectedReason)?.icon}{' '}
              {language === 'ka' 
                ? reportReasons.find(r => r.id === selectedReason)?.labelKa
                : reportReasons.find(r => r.id === selectedReason)?.labelEn}
            </p>
            {details && (
              <>
                <p className="font-medium mb-1 mt-3">
                  {language === 'ka' ? 'დეტალები:' : 'Details:'}
                </p>
                <p className="text-muted-foreground">{details}</p>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              size="lg"
            >
              {language === 'ka' ? 'გაუქმება' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting 
                ? (language === 'ka' ? 'იგზავნება...' : 'Submitting...') 
                : (language === 'ka' ? 'რეპორტის გაგზავნა' : 'Submit Report')}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="space-y-4 p-1 text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold">
            {language === 'ka' ? 'რეპორტი გაგზავნილია' : 'Report Submitted'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ka' 
              ? 'გმადლობთ, რომ ეხმარებით Twist-ს უსაფრთხოდ შენარჩუნებაში. ჩვენი გუნდი განიხილავს ამ განცხადებას.' 
              : 'Thanks for helping keep Twist safe. Our team will review this listing.'}
          </p>
          <Button onClick={handleClose} className="mt-4" size="lg">
            {language === 'ka' ? 'დახურვა' : 'Close'}
          </Button>
        </div>
      )}
    </div>
  );

  const title = step === 'success' 
    ? '' 
    : (language === 'ka' ? 'განცხადების მოხსენება' : 'Report Listing');

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="flex items-center gap-2">
              {step !== 'success' && <AlertTriangle className="h-5 w-5 text-muted-foreground" />}
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== 'success' && <AlertTriangle className="h-5 w-5 text-muted-foreground" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
