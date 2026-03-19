import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ban, AlertTriangle, HelpCircle } from 'lucide-react';

const ProhibitedItems = () => {
  const { language } = useLanguage();

  const prohibitedCategories = [
    {
      title: language === 'ka' ? 'უკანონო ნივთები' : 'Illegal Items',
      description: language === 'ka' 
        ? 'ნებისმიერი ნივთი, რომელიც უკანონოა საქართველოში'
        : 'Any item that is illegal in Georgia'
    },
    {
      title: language === 'ka' ? 'იარაღი და საბრძოლო მასალა' : 'Weapons & Ammunition',
      description: language === 'ka'
        ? 'ცეცხლსასროლი იარაღი, დანები, საბრძოლო მასალა'
        : 'Firearms, knives, ammunition, and related items'
    },
    {
      title: language === 'ka' ? 'ყალბი პროდუქცია' : 'Counterfeit Goods',
      description: language === 'ka'
        ? 'ყალბი ბრენდის ნივთები, პირატული პროდუქცია'
        : 'Fake brand items, pirated products'
    },
    {
      title: language === 'ka' ? 'მოპარული ნივთები' : 'Stolen Items',
      description: language === 'ka'
        ? 'ნივთები, რომლებიც არ გეკუთვნით ან მოპარულია'
        : 'Items that do not belong to you or are stolen'
    },
    {
      title: language === 'ka' ? 'ზრდასრულთა კონტენტი' : 'Adult Content',
      description: language === 'ka'
        ? 'პორნოგრაფიული ან სექსუალური ხასიათის მასალა'
        : 'Pornographic or sexually explicit material'
    },
    {
      title: language === 'ka' ? 'მედიკამენტები და ნარკოტიკები' : 'Medicines & Drugs',
      description: language === 'ka'
        ? 'რეცეპტით გასაცემი წამლები, ნარკოტიკული ნივთიერებები'
        : 'Prescription medications, controlled substances'
    },
    {
      title: language === 'ka' ? 'საშიში მასალები' : 'Dangerous Materials',
      description: language === 'ka'
        ? 'ფეთქებადი, აალებადი ან ტოქსიკური ნივთიერებები'
        : 'Explosive, flammable, or toxic substances'
    },
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Ban className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ka' ? 'აკრძალული ნივთები' : 'Prohibited Items'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'ეს ნივთები აკრძალულია Twist-ის პლატფორმაზე გაყიდვაზე.'
              : 'These items are prohibited from being sold on Twist.'}
          </p>
        </div>

        {/* Prohibited list */}
        <div className="space-y-4 mb-12">
          {prohibitedCategories.map((category, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-5 flex gap-4">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                <Ban className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Consequences */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {language === 'ka' ? 'რა ხდება დარღვევის შემთხვევაში?' : 'What happens if rules are violated?'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {language === 'ka' ? 'განცხადება შეიძლება წაიშალოს გაფრთხილების გარეშე' : 'Listing may be removed without notice'}</li>
                <li>• {language === 'ka' ? 'ანგარიში შეიძლება შეიზღუდოს ან დაიბლოკოს' : 'Account may be restricted or blocked'}</li>
                <li>• {language === 'ka' ? 'სერიოზული დარღვევები შეიძლება ეცნობოს უფლებამოსილ ორგანოებს' : 'Serious violations may be reported to authorities'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === 'ka' ? 'არ ხართ დარწმუნებული?' : 'Not sure if your item is allowed?'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ka'
                  ? 'თუ არ ხართ დარწმუნებული, შეიძლება თუ არა კონკრეტული ნივთის გაყიდვა, დაგვიკავშირდით განცხადების გამოქვეყნებამდე.'
                  : 'If you are unsure whether a specific item can be sold, contact us before posting.'}
              </p>
              <a href="/contact" className="text-primary hover:underline text-sm font-medium">
                {language === 'ka' ? 'დაგვიკავშირდით →' : 'Contact us →'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProhibitedItems;
