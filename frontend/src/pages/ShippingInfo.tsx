import { Truck, Package, MapPin, Clock, CreditCard, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  { key: 'shippingInfo.step1', icon: Truck },
  { key: 'shippingInfo.step2', icon: CreditCard },
  { key: 'shippingInfo.step3', icon: Package },
  { key: 'shippingInfo.step4', icon: MapPin },
  { key: 'shippingInfo.step5', icon: Check },
];

export default function ShippingInfo() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container py-8 md:py-16">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Truck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('shippingInfo.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('shippingInfo.subtitle')}
          </p>
        </div>

        {/* How it Works */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('shippingInfo.howItWorks')}
          </h2>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {t(step.key)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-primary-light border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {t('shippingInfo.deliveryTime')}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {t('shippingInfo.deliveryTimeDesc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-success-light border border-success/20">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {t('shippingInfo.shippingCost')}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {t('shippingInfo.shippingCostDesc')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
