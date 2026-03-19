import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Truck, Shield, XCircle } from 'lucide-react';

export default function Pricing() {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'ფასები და საკომისიო' : 'Pricing & Fees'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'გამჭვირვალე ფასები, არანაირი დამალული საკომისიო.'
            : 'Transparent pricing, no hidden fees.'}
        </p>

        {/* Seller Section */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {language === 'ka' ? 'გამყიდველისთვის' : 'For Sellers'}
          </h2>
          
          <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold text-foreground">0%</div>
              <div className="text-muted-foreground">
                {language === 'ka' ? 'საკომისიო გამყიდველისთვის' : 'Commission for sellers'}
              </div>
            </div>
          </div>

          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'განცხადების ატვირთვა უფასოა'
                : 'Listing is free'}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'რაც ფასად დაადგენ, იმას მიიღებ'
                : 'You get what you set as price'}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'არანაირი დამალული საკომისიო'
                : 'No hidden fees'}
            </li>
          </ul>
        </div>

        {/* Buyer Section */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {language === 'ka' ? 'მყიდველისთვის' : 'For Buyers'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
              <Truck className="h-8 w-8 text-primary shrink-0" />
              <div>
                <div className="text-xl font-bold text-foreground">5 ₾</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ka' ? 'მიწოდება თბილისში' : 'Delivery in Tbilisi'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
              <Truck className="h-8 w-8 text-primary shrink-0" />
              <div>
                <div className="text-xl font-bold text-foreground">7 ₾</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ka' ? 'მიწოდება რეგიონებში' : 'Delivery in regions'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <Shield className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">
                {language === 'ka' ? 'მყიდველის დაცვა შედის ფასში' : 'Buyer protection included'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ka'
                  ? 'თქვენი ფული დაცულია სანამ ნივთს არ მიიღებთ'
                  : 'Your money is protected until you receive the item'}
              </div>
            </div>
          </div>
        </div>

        {/* No Hidden Fees */}
        <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'რა არ არის' : 'What\'s NOT included'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'დამალული საკომისიო'
                : 'Hidden fees'}
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'გამყიდველის საკომისიო'
                : 'Seller commission'}
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              {language === 'ka'
                ? 'განცხადების გადასახადი'
                : 'Listing fee'}
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
