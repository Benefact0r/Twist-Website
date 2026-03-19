import { Link } from 'react-router-dom';
import { Camera, FileText, Truck, Package, Wallet, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    icon: Camera,
    titleKey: 'sellerGuide.step1.title',
    descKey: 'sellerGuide.step1.desc',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: FileText,
    titleKey: 'sellerGuide.step2.title',
    descKey: 'sellerGuide.step2.desc',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Truck,
    titleKey: 'sellerGuide.step3.title',
    descKey: 'sellerGuide.step3.desc',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Package,
    titleKey: 'sellerGuide.step4.title',
    descKey: 'sellerGuide.step4.desc',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Wallet,
    titleKey: 'sellerGuide.step5.title',
    descKey: 'sellerGuide.step5.desc',
    color: 'bg-primary/10 text-primary',
  },
];

export default function SellerGuide() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container py-8 md:py-16">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('sellerGuide.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('sellerGuide.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className={`shrink-0 w-14 h-14 rounded-xl ${step.color} flex items-center justify-center`}>
                <step.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h2 className="text-xl font-semibold">
                    {t(step.titleKey)}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-xl mx-auto mt-12 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              {t('home.sellerPromo.subtitle')}
            </h3>
            <Button size="lg" asChild>
              <Link to="/sell">
                {t('sellerGuide.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
