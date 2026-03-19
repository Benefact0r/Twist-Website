import { useState } from 'react';
import { request } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export type ReportCategory = 
  | 'mismatch'
  | 'fake'
  | 'scam'
  | 'stolen_photos'
  | 'inappropriate'
  | 'off_platform'
  | 'misleading'
  | 'other';

export interface ReportReason {
  id: ReportCategory;
  icon: string;
  labelKa: string;
  labelEn: string;
  priority: 'normal' | 'high';
}

export const reportReasons: ReportReason[] = [
  { id: 'mismatch', icon: '❌', labelKa: 'ნივთი არ შეესაბამება აღწერას', labelEn: 'Item does not match description', priority: 'normal' },
  { id: 'fake', icon: '🚫', labelKa: 'ყალბი / კონტრაფაქტული ნივთი', labelEn: 'Fake / counterfeit item', priority: 'high' },
  { id: 'scam', icon: '⚠️', labelKa: 'საეჭვო ფასი ან თაღლითობის მცდელობა', labelEn: 'Suspicious price or scam attempt', priority: 'high' },
  { id: 'stolen_photos', icon: '📸', labelKa: 'მოპარული ან კოპირებული ფოტოები', labelEn: 'Stolen or copied photos', priority: 'normal' },
  { id: 'inappropriate', icon: '🔞', labelKa: 'შეუფერებელი ან აკრძალული ნივთი', labelEn: 'Inappropriate or prohibited item', priority: 'high' },
  { id: 'off_platform', icon: '📦', labelKa: 'გამყიდველი ითხოვს Twist-ის გარეთ გადახდას', labelEn: 'Seller asks to go outside Twist', priority: 'high' },
  { id: 'misleading', icon: '🧾', labelKa: 'შეცდომაში შემყვანი ინფორმაცია', labelEn: 'Misleading information', priority: 'normal' },
  { id: 'other', icon: '🛑', labelKa: 'სხვა (მიუთითეთ დეტალები)', labelEn: 'Other (please explain)', priority: 'normal' },
];

export function useReports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkCanReport = async (): Promise<{ canReport: boolean; reason?: string }> => {
    if (!user) {
      return { 
        canReport: false, 
        reason: language === 'ka' ? 'გთხოვთ გაიაროთ ავტორიზაცია' : 'Please log in first' 
      };
    }

    // Enforced server-side, keep UI permissive.

    return { canReport: true };
  };

  const checkAlreadyReported = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    return false;
  };

  const submitReport = async (
    listingId: string,
    sellerId: string,
    category: ReportCategory,
    optionalDetails?: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'გთხოვთ გაიაროთ ავტორიზაცია' : 'Please log in first',
        variant: 'destructive',
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      // Determine priority based on category
      const reasonInfo = reportReasons.find(r => r.id === category);
      const priority = reasonInfo?.priority || 'normal';

      // Build reason text
      const reasonText = reasonInfo 
        ? (language === 'ka' ? reasonInfo.labelKa : reasonInfo.labelEn)
        : category;

      // Submit the report
      await request('/reports', {
        method: 'POST',
        body: {
          reporter_id: user.id,
          target_type: 'item',
          target_id: listingId,
          reason: reasonText,
          report_category: category,
          optional_details: optionalDetails?.trim() || null,
          seller_id: sellerId,
          priority: priority,
          status: 'open',
        },
      });

      return true;
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' 
          ? 'რეპორტის გაგზავნა ვერ მოხერხდა' 
          : 'Failed to submit report',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    checkCanReport,
    checkAlreadyReported,
    isSubmitting,
    reportReasons,
  };
}
