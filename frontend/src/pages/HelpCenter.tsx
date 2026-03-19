import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, CreditCard, AlertCircle, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpCenter() {
  const { language } = useLanguage();

  const topics = [
    {
      icon: Truck,
      title: language === 'ka' ? 'მიწოდება' : 'Delivery',
      questions: [
        {
          q: language === 'ka' ? 'როგორ მუშაობს მიწოდება?' : 'How does delivery work?',
          a: language === 'ka'
            ? 'კურიერი იღებს ნივთს გამყიდველისგან და მოგიტანს პირდაპირ თქვენს მისამართზე. მიწოდება ხდება მთელი საქართველოს მასშტაბით.'
            : 'Courier picks up the item from the seller and delivers it directly to your address. Delivery is available across all of Georgia.'
        },
        {
          q: language === 'ka' ? 'რა ღირს მიწოდება?' : 'How much does delivery cost?',
          a: language === 'ka'
            ? 'თბილისში მიწოდება ღირს 5 ლარი, რეგიონებში — 7 ლარი.'
            : 'Delivery in Tbilisi costs 5 GEL, in regions — 7 GEL.'
        },
        {
          q: language === 'ka' ? 'რამდენ ხანში მოვა ნივთი?' : 'How long until item arrives?',
          a: language === 'ka'
            ? 'თბილისში მიწოდება ხდება 1-2 დღეში, რეგიონებში 2-4 დღეში.'
            : 'Delivery in Tbilisi takes 1-2 days, in regions 2-4 days.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: language === 'ka' ? 'გადახდა' : 'Payments',
      questions: [
        {
          q: language === 'ka' ? 'როგორ მუშაობს გადახდა?' : 'How do payments work?',
          a: language === 'ka'
            ? 'როცა ყიდულობთ ნივთს, თანხა უსაფრთხოდ ინახება. გამყიდველს თანხა ერიცხება მხოლოდ მას შემდეგ, რაც თქვენ დაადასტურებთ ნივთის მიღებას.'
            : 'When you buy an item, money is held securely. Seller receives money only after you confirm receipt.'
        },
        {
          q: language === 'ka' ? 'როდის მიიღებს გამყიდველი თანხას?' : 'When does seller get paid?',
          a: language === 'ka'
            ? 'მყიდველის მიერ ნივთის მიღებისა და დადასტურების შემდეგ, თანხა ავტომატურად ირიცხება გამყიდველის ანგარიშზე.'
            : 'After buyer receives and confirms the item, money is automatically transferred to seller\'s account.'
        }
      ]
    },
    {
      icon: AlertCircle,
      title: language === 'ka' ? 'პრობლემები' : 'Problems',
      questions: [
        {
          q: language === 'ka' ? 'რა ვქნა თუ ნივთი არ შეესაბამება აღწერას?' : 'What if item doesn\'t match description?',
          a: language === 'ka'
            ? 'თუ ნივთი არ შეესაბამება აღწერას, არ დაადასტუროთ მიღება და დაუყოვნებლივ დაგვიკავშირდით. ჩვენ დაგეხმარებით საკითხის მოგვარებაში.'
            : 'If item doesn\'t match description, don\'t confirm receipt and contact us immediately. We will help resolve the issue.'
        },
        {
          q: language === 'ka' ? 'რა ვქნა თუ ნივთი დაზიანებულია?' : 'What if item is damaged?',
          a: language === 'ka'
            ? 'გადაიღეთ ფოტოები და დაგვიკავშირდით. არ დაადასტუროთ მიღება სანამ საკითხი არ მოგვარდება.'
            : 'Take photos and contact us. Don\'t confirm receipt until the issue is resolved.'
        }
      ]
    },
    {
      icon: MessageSquare,
      title: language === 'ka' ? 'კონტაქტი' : 'Contact',
      questions: [
        {
          q: language === 'ka' ? 'როგორ დაგიკავშირდეთ?' : 'How to contact support?',
          a: language === 'ka'
            ? 'შეგიძლიათ მოგვწეროთ ელ-ფოსტაზე: Twistingsocials@gmail.com ან გამოიყენოთ ჩვენი კონტაქტის გვერდი.'
            : 'You can email us at: Twistingsocials@gmail.com or use our contact page.'
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'დახმარების ცენტრი' : 'Help Center'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'იპოვეთ პასუხები ხშირად დასმულ კითხვებზე.'
            : 'Find answers to frequently asked questions.'}
        </p>

        <div className="space-y-6">
          {topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-border bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <topic.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{topic.title}</h2>
              </div>
              <Accordion type="single" collapsible className="px-5">
                {topic.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`${topicIndex}-${qIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {language === 'ka' ? 'ვერ იპოვეთ პასუხი?' : 'Couldn\'t find an answer?'}
          </h2>
          <p className="text-muted-foreground mb-5">
            {language === 'ka'
              ? 'დაგვიკავშირდით და დაგეხმარებით.'
              : 'Contact us and we will help.'}
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            {language === 'ka' ? 'კონტაქტი' : 'Contact Us'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
