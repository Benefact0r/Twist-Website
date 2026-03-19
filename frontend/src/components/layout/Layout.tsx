import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { GlobalHelpButton } from '@/components/support/GlobalHelpButton';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideBottomNav?: boolean;
}

export function Layout({ children, hideFooter = false, hideBottomNav = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-safe md:pb-0">{children}</main>
      {!hideFooter && <Footer />}
      {!hideBottomNav && <BottomNav />}
      <GlobalHelpButton />
    </div>
  );
}