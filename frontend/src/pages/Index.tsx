import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { HeroItemsPreview } from '@/components/home/HeroItemsPreview';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { SellerValueProp } from '@/components/home/SellerValueProp';
import { FinalCTA } from '@/components/home/FinalCTA';

import { CategoryChips } from '@/components/home/CategoryChips';

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <HeroItemsPreview />
      {/* Mobile category quick access */}
      <div className="container py-4">
        <CategoryChips />
      </div>
      <CategoryShowcase />
      <FeaturedListings />
      <SellerValueProp />
      <FinalCTA />
      
    </Layout>
  );
};

export default Index;
