import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "./components/ScrollToTop";

// Critical pages - loaded immediately
import Index from "./pages/Index";
import Search from "./pages/Search";
import ListingDetail from "./pages/ListingDetail";

// Retry wrapper: if a dynamic import fails (stale chunk), reload the page once
const lazyWithRetry = (importFn: () => Promise<any>) =>
  lazy(() =>
    importFn().catch(() => {
      // Only reload once to avoid infinite loops
      const hasReloaded = sessionStorage.getItem('chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload', 'true');
        window.location.reload();
      }
      sessionStorage.removeItem('chunk_reload');
      return importFn();
    })
  );

// Lazy load non-critical pages for code splitting
const Auth = lazyWithRetry(() => import("./pages/Auth"));
const ItemCheckout = lazyWithRetry(() => import("./pages/ItemCheckout"));
const OfferCheckout = lazyWithRetry(() => import("./pages/OfferCheckout"));
const Sell = lazyWithRetry(() => import("./pages/Sell"));
const Favorites = lazyWithRetry(() => import("./pages/Favorites"));
const Messages = lazyWithRetry(() => import("./pages/Messages"));
const SellerGuide = lazyWithRetry(() => import("./pages/SellerGuide"));
const ShippingInfo = lazyWithRetry(() => import("./pages/ShippingInfo"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const EditProfile = lazyWithRetry(() => import("./pages/EditProfile"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const About = lazyWithRetry(() => import("./pages/About"));
const HowItWorksPage = lazyWithRetry(() => import("./pages/HowItWorks"));
const Press = lazyWithRetry(() => import("./pages/Press"));
const Buying = lazyWithRetry(() => import("./pages/Buying"));
const Selling = lazyWithRetry(() => import("./pages/Selling"));
const Pricing = lazyWithRetry(() => import("./pages/Pricing"));
const HelpCenter = lazyWithRetry(() => import("./pages/HelpCenter"));
const Safety = lazyWithRetry(() => import("./pages/Safety"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const SellerProfile = lazyWithRetry(() => import("./pages/SellerProfile"));
const BuyerProtection = lazyWithRetry(() => import("./pages/BuyerProtection"));
const ProhibitedItems = lazyWithRetry(() => import("./pages/ProhibitedItems"));
const CommunityRules = lazyWithRetry(() => import("./pages/CommunityRules"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));

// Admin pages - lazy loaded as they're rarely accessed
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazyWithRetry(() => import("./pages/admin/AdminUsers"));
const AdminListings = lazyWithRetry(() => import("./pages/admin/AdminListings"));
const AdminReports = lazyWithRetry(() => import("./pages/admin/AdminReports"));
const AdminChats = lazyWithRetry(() => import("./pages/admin/AdminChats"));
const AdminAuditLog = lazyWithRetry(() => import("./pages/admin/AdminAuditLog"));
const AdminViewUser = lazyWithRetry(() => import("./pages/admin/AdminViewUser"));
const AdminTools = lazyWithRetry(() => import("./pages/admin/AdminTools"));
const AdminOrders = lazyWithRetry(() => import("./pages/admin/AdminOrders"));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Critical routes - no lazy loading */}
                  <Route path="/" element={<Index />} />
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/category/:slug" element={<Search />} />
                  
                  {/* Lazy loaded routes */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/forgot-password" element={<Auth />} />
                  <Route path="/checkout/:itemId" element={<ItemCheckout />} />
                  <Route path="/checkout/offer/:offerId" element={<OfferCheckout />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/seller-guide" element={<SellerGuide />} />
                  <Route path="/shipping-info" element={<ShippingInfo />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/seller/:id" element={<SellerProfile />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Static Pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/buying" element={<Buying />} />
                  <Route path="/selling" element={<Selling />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Trust & Safety Pages */}
                  <Route path="/buyer-protection" element={<BuyerProtection />} />
                  <Route path="/prohibited-items" element={<ProhibitedItems />} />
                  <Route path="/community-rules" element={<CommunityRules />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/listings" element={<AdminListings />} />
                  <Route path="/admin/tools" element={<AdminTools />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/chats" element={<AdminChats />} />
                  <Route path="/admin/audit-log" element={<AdminAuditLog />} />
                  <Route path="/admin/view-user/:userId" element={<AdminViewUser />} />
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;