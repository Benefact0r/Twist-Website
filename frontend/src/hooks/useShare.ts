import { useCallback, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface ShareData {
  title: string;
  price: number;
  listingId: string;
  imageUrl?: string;
}

interface UseShareReturn {
  share: (data: ShareData) => Promise<void>;
  showDesktopModal: boolean;
  setShowDesktopModal: (show: boolean) => void;
  shareData: (ShareData & { url: string }) | null;
  copyLink: () => Promise<void>;
  shareToWhatsApp: () => void;
  shareToMessenger: () => void;
  shareToInstagram: () => void;
}

// Production URL - always use this for sharing
const TWIST_BASE_URL = 'https://twist.ge';

export function useShare(): UseShareReturn {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [shareData, setShareData] = useState<(ShareData & { url: string }) | null>(null);

  // Build canonical twist.ge URL
  const buildCanonicalUrl = useCallback((listingId: string): string => {
    return `${TWIST_BASE_URL}/listing/${listingId}`;
  }, []);

  const formatShareText = useCallback((title: string, price: number, url: string): string => {
    return language === 'ka'
      ? `${title} — ₾${price.toLocaleString()}\nნახე Twist-ზე: ${url}`
      : `${title} — ₾${price.toLocaleString()}\nView on Twist: ${url}`;
  }, [language]);

  const isMobile = useCallback((): boolean => {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  const share = useCallback(async (data: ShareData) => {
    const canonicalUrl = buildCanonicalUrl(data.listingId);
    const fullData = { ...data, url: canonicalUrl };
    setShareData(fullData);

    // Try native share on mobile - this shows all installed apps
    if (isMobile() && navigator.share) {
      try {
        await navigator.share({
          title: fullData.title,
          text: formatShareText(fullData.title, fullData.price, canonicalUrl),
          url: canonicalUrl,
        });
        return;
      } catch (err) {
        // User cancelled sharing - this is fine
        if ((err as Error).name === 'AbortError') {
          return;
        }
        // Fall through to modal on error
      }
    }

    // Desktop or native share not available - show modal
    setShowDesktopModal(true);
  }, [isMobile, formatShareText, buildCanonicalUrl]);

  const copyLink = useCallback(async () => {
    if (!shareData) return;
    
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: language === 'ka' ? 'ბმული დაკოპირდა' : 'Link copied',
        description: shareData.url,
      });
      setShowDesktopModal(false);
    } catch (err) {
      toast({
        title: language === 'ka' ? 'გაზიარება ვერ მოხერხდა' : 'Unable to share',
        description: language === 'ka' ? 'სცადე თავიდან' : 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [shareData, toast, language]);

  const shareToWhatsApp = useCallback(() => {
    if (!shareData) return;
    
    const message = formatShareText(shareData.title, shareData.price, shareData.url);
    const encodedMessage = encodeURIComponent(message);
    
    // Close modal first to prevent UI overlap
    setShowDesktopModal(false);
    
    if (isMobile()) {
      // Mobile: use wa.me which works universally
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    } else {
      // Desktop: use web.whatsapp.com
      window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    }
  }, [shareData, formatShareText, isMobile]);

  const shareToMessenger = useCallback(() => {
    if (!shareData) return;
    
    const encodedUrl = encodeURIComponent(shareData.url);
    
    // Close modal first to prevent UI overlap
    setShowDesktopModal(false);
    
    if (isMobile()) {
      // Mobile: try Messenger deep link first
      const messengerDeepLink = `fb-messenger://share?link=${encodedUrl}`;
      
      // Create a hidden iframe to attempt deep link without leaving page
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = messengerDeepLink;
      document.body.appendChild(iframe);
      
      // Fallback to web after short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        // If still on page, open web fallback
        window.open(`https://www.messenger.com/t/?link=${encodedUrl}`, '_blank', 'noopener,noreferrer');
      }, 1500);
    } else {
      // Desktop: open Messenger web
      window.open(`https://www.messenger.com/t/?link=${encodedUrl}`, '_blank', 'noopener,noreferrer');
    }
  }, [shareData, isMobile]);

  const shareToInstagram = useCallback(() => {
    if (!shareData) return;
    
    // Close modal first
    setShowDesktopModal(false);
    
    if (isMobile()) {
      // Mobile: use system share which includes Instagram
      if (navigator.share) {
        navigator.share({
          title: shareData.title,
          text: formatShareText(shareData.title, shareData.price, shareData.url),
          url: shareData.url,
        }).catch(() => {
          // User cancelled - that's fine
        });
      } else {
        toast({
          title: 'Instagram',
          description: language === 'ka' 
            ? 'აირჩიე Instagram გაზიარების მენიუდან' 
            : 'Select Instagram from share menu',
        });
      }
    } else {
      // Desktop: Instagram doesn't support direct URL sharing
      toast({
        title: 'Instagram',
        description: language === 'ka' 
          ? 'Instagram-ით გაზიარება მხოლოდ მობილურზე მუშაობს' 
          : 'Instagram sharing works on mobile',
      });
    }
  }, [shareData, formatShareText, isMobile, toast, language]);

  return {
    share,
    showDesktopModal,
    setShowDesktopModal,
    shareData,
    copyLink,
    shareToWhatsApp,
    shareToMessenger,
    shareToInstagram,
  };
}
