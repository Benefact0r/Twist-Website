import React, { useState, useEffect } from 'react';
import { X, Search, MessageCircle, Phone, Mail, ChevronRight, Clock, CheckCircle2, HelpCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFAQs, FAQ } from '@/hooks/useSupport';
import { faqCategories, defaultFaqs } from '@/data/faqData';
import { FAQItem } from './FAQItem';
import { LiveChat } from './LiveChat';

interface HelpPanelProps {
  onClose: () => void;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { popularFaqs, searchFaqs, trackFaqView, submitFaqFeedback } = useFAQs();
  
  const [activeTab, setActiveTab] = useState<'faq' | 'chat' | 'contact'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQ[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Use default FAQs if database is empty
  const displayFaqs = popularFaqs.length > 0 ? popularFaqs : defaultFaqs.slice(0, 5).map((faq, i) => ({
    ...faq,
    id: `default-${i}`,
    view_count: 0,
    helpful_yes: 0,
    helpful_no: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as FAQ[];

  // Search handling
  useEffect(() => {
    const doSearch = async () => {
      if (searchQuery.length >= 2) {
        const results = await searchFaqs(searchQuery);
        if (results.length === 0) {
          // Search in default FAQs
          const defaultResults = defaultFaqs.filter(faq => 
            faq.question_ka.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.question_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer_ka.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer_en.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((faq, i) => ({
            ...faq,
            id: `search-${i}`,
            view_count: 0,
            helpful_yes: 0,
            helpful_no: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })) as FAQ[];
          setSearchResults(defaultResults);
        } else {
          setSearchResults(results);
        }
      } else {
        setSearchResults([]);
      }
    };
    doSearch();
  }, [searchQuery, searchFaqs]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFaqClick = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
    if (!faqId.startsWith('default-') && !faqId.startsWith('search-')) {
      trackFaqView(faqId);
    }
  };

  const getCategoryFaqs = () => {
    if (!selectedCategory) return [];
    return defaultFaqs
      .filter(faq => faq.category === selectedCategory)
      .map((faq, i) => ({
        ...faq,
        id: `cat-${selectedCategory}-${i}`,
        view_count: 0,
        helpful_yes: 0,
        helpful_no: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as FAQ[];
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Panel */}
      <div className="relative w-full md:w-[420px] h-[90vh] md:h-[85vh] md:mr-6 bg-background rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-slide-in-right flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 bg-primary text-primary-foreground p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ka' ? 'დახმარება & მხარდაჭერა' : 'Help & Support'}
                </h2>
                <p className="text-xs text-primary-foreground/80">
                  {language === 'ka' ? 'ჩვენ აქ ვართ დასახმარებლად' : 'We\'re here to help'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Online Status */}
          <div className="flex items-center justify-between text-sm bg-primary-foreground/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>{language === 'ka' ? 'ონლაინ დახმარება' : 'Online Support'}</span>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/70">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {language === 'ka' ? 'პასუხი: ~5 წუთი' : 'Response: ~5 min'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'faq' | 'chat' | 'contact')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex-shrink-0 w-full justify-start rounded-none border-b bg-background p-0 h-auto">
            <TabsTrigger 
              value="faq" 
              className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {language === 'ka' ? 'კითხვები' : 'FAQ'}
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'ka' ? 'ჩათი' : 'Chat'}
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Phone className="h-4 w-4 mr-2" />
              {language === 'ka' ? 'კონტაქტი' : 'Contact'}
            </TabsTrigger>
          </TabsList>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ka' ? 'მოძებნეთ დახმარება...' : 'Search help...'}
                    className="pl-10"
                  />
                </div>
                
                {/* Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {language === 'ka' 
                        ? `შედეგები "${searchQuery}"-სთვის:` 
                        : `Results for "${searchQuery}":`}
                    </p>
                    {searchResults.map(faq => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedFaq === faq.id}
                        onClick={() => handleFaqClick(faq.id)}
                        onFeedback={submitFaqFeedback}
                        language={language}
                      />
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {searchQuery && searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      {language === 'ka' ? 'შედეგები არ მოიძებნა' : 'No results found'}
                    </p>
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('chat')}
                      className="mt-2"
                    >
                      {language === 'ka' ? 'დაგვიკავშირდით' : 'Contact us'}
                    </Button>
                  </div>
                )}
                
                {/* Category FAQs */}
                {selectedCategory && !searchQuery && (
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="text-primary"
                    >
                      ← {language === 'ka' ? 'უკან' : 'Back'}
                    </Button>
                    {getCategoryFaqs().map(faq => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedFaq === faq.id}
                        onClick={() => handleFaqClick(faq.id)}
                        onFeedback={submitFaqFeedback}
                        language={language}
                      />
                    ))}
                  </div>
                )}
                
                {/* Default View */}
                {!searchQuery && !selectedCategory && (
                  <>
                    {/* Popular FAQs */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-lg">⭐</span>
                        {language === 'ka' ? 'პოპულარული კითხვები' : 'Popular Questions'}
                      </h3>
                      {displayFaqs.map(faq => (
                        <FAQItem
                          key={faq.id}
                          faq={faq}
                          isExpanded={expandedFaq === faq.id}
                          onClick={() => handleFaqClick(faq.id)}
                          onFeedback={submitFaqFeedback}
                          language={language}
                        />
                      ))}
                    </div>
                    
                    {/* Categories */}
                    <div className="space-y-3 pt-4 border-t">
                      <h3 className="font-semibold">
                        {language === 'ka' ? 'კატეგორიები' : 'Categories'}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {faqCategories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted rounded-lg text-left transition-colors"
                          >
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-sm font-medium">
                              {language === 'ka' ? category.nameKa : category.nameEn}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
            <LiveChat 
              onActivate={() => undefined}
              onDeactivate={() => undefined}
            />
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">
                  {language === 'ka' ? 'დაგვიკავშირდით' : 'Contact Us'}
                </h3>
                
                <a
                  href="mailto:Twistingsocials@gmail.com"
                  className="flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{language === 'ka' ? 'ელფოსტა' : 'Email'}</p>
                    <p className="text-sm text-muted-foreground">Twistingsocials@gmail.com</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
                
                {/* Phone */}
                <a
                  href="tel:+995322123456"
                  className="flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{language === 'ka' ? 'ტელეფონი' : 'Phone'}</p>
                    <p className="text-sm text-muted-foreground">+995 32 2 12 34 56</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ka' ? 'ორშ-პარ, 10:00-18:00' : 'Mon-Fri, 10:00-18:00'}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
                
                {/* Social Media */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    {language === 'ka' ? 'სოციალური ქსელები' : 'Social Media'}
                  </h4>
                  <div className="flex gap-3">
                    {[
                      { icon: '📘', label: 'Facebook', url: 'https://facebook.com/twistge' },
                      { icon: '📷', label: 'Instagram', url: 'https://instagram.com/twistge' },
                      { icon: '💬', label: 'Telegram', url: 'https://t.me/twistge' },
                    ].map(social => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex flex-col items-center gap-1 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                      >
                        <span className="text-2xl">{social.icon}</span>
                        <span className="text-xs">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Response Time Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">
                      {language === 'ka' ? 'პასუხის დრო' : 'Response Time'}
                    </span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {language === 'ka' ? 'ჩათი: 2-5 წუთი' : 'Chat: 2-5 minutes'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {language === 'ka' ? 'ელფოსტა: 24 საათი' : 'Email: 24 hours'}
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-muted/30 px-4 py-3">
          <p className="text-xs text-center text-muted-foreground">
            © 2024 Twist.ge • {language === 'ka' ? 'ყველა უფლება დაცულია' : 'All rights reserved'}
          </p>
        </div>
      </div>
    </div>
  );
};
