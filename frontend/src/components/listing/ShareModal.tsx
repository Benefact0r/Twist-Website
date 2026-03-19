import { Copy, MessageCircle, Instagram, Link2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

// Custom Messenger icon component
const MessengerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.26.55l.03 1.73c.01.46.49.77.91.57l1.93-.85c.17-.07.36-.09.54-.05.88.21 1.82.32 2.79.32 5.64 0 10.2-4.13 10.2-9.7S17.64 2 12 2zm5.8 7.57l-2.84 4.5c-.45.72-1.42.89-2.08.36l-2.26-1.69c-.17-.13-.4-.13-.57 0l-3.05 2.31c-.41.31-.94-.18-.67-.62l2.84-4.5c.45-.72 1.42-.89 2.08-.36l2.26 1.69c.17.13.4.13.57 0l3.05-2.31c.41-.31.94.18.67.62z"/>
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  url: string;
  onCopyLink: () => void;
  onShareWhatsApp: () => void;
  onShareMessenger: () => void;
  onShareInstagram: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  price,
  url,
  onCopyLink,
  onShareWhatsApp,
  onShareMessenger,
  onShareInstagram,
}: ShareModalProps) {
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      onClick: onShareWhatsApp,
      className: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]',
    },
    {
      id: 'messenger',
      label: 'Messenger',
      icon: MessengerIcon,
      onClick: onShareMessenger,
      className: 'bg-[#0084FF]/10 hover:bg-[#0084FF]/20 text-[#0084FF]',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      onClick: onShareInstagram,
      className: 'bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#F77737]/20 text-[#E4405F]',
    },
    {
      id: 'copy',
      label: language === 'ka' ? 'ლინკის კოპირება' : 'Copy link',
      icon: Link2,
      onClick: onCopyLink,
      className: 'bg-muted hover:bg-muted/80',
    },
  ];

  const content = (
    <div className="space-y-4">
      {/* Preview */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-lg font-bold text-primary">₾{price.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground truncate mt-1">{url}</p>
      </div>

      {/* Share options grid */}
      <div className="grid grid-cols-2 gap-3">
        {shareOptions.map((option) => (
          <Button
            key={option.id}
            variant="ghost"
            className={`h-auto py-4 flex flex-col items-center gap-2 ${option.className}`}
            onClick={option.onClick}
          >
            <option.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const modalTitle = language === 'ka' ? 'გაზიარება' : 'Share';

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="pb-2">
            <DrawerTitle>{modalTitle}</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
