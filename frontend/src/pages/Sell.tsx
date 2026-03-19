import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, X, ChevronDown, Check, AlertCircle, Package, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CategorySelector } from '@/components/category/CategorySelector';
import { getFieldsForCategory, CategoryField } from '@/data/categoryFields';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { request } from '@/lib/apiClient';
import { compressImage, getImageDimensions, checkImageQuality, MIN_RECOMMENDED_SIZE } from '@/lib/imageUtils';

type ListingCondition = 'new' | 'like-new' | 'good' | 'fair';

const DRAFT_STORAGE_KEY = 'twist_listing_draft';

interface ListingDraft {
  images: string[];
  title: string;
  description: string;
  category: string;
  condition: ListingCondition | '';
  price: string;
  dynamicFields: Record<string, string>;
  savedAt: number;
}

export default function Sell() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load draft from localStorage on mount
  const loadDraft = useCallback((): ListingDraft | null => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as ListingDraft;
        // Only restore drafts less than 7 days old
        if (Date.now() - draft.savedAt < 7 * 24 * 60 * 60 * 1000) {
          return draft;
        }
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
    return null;
  }, []);

  const savedDraft = loadDraft();

  // Core fields with draft restoration
  const [images, setImages] = useState<string[]>(savedDraft?.images || []);
  const [title, setTitle] = useState(savedDraft?.title || '');
  const [description, setDescription] = useState(savedDraft?.description || '');
  const [category, setCategory] = useState(savedDraft?.category || '');
  const [condition, setCondition] = useState<ListingCondition | ''>(savedDraft?.condition || '');
  const [price, setPrice] = useState(savedDraft?.price || '');
  const [parcelSize, setParcelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageWarnings, setImageWarnings] = useState<string[]>([]);

  // Dynamic fields storage
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>(savedDraft?.dynamicFields || {});

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      if (title || description || images.length > 0 || category) {
        const draft: ListingDraft = {
          images,
          title,
          description,
          category,
          condition,
          price,
          dynamicFields,
          savedAt: Date.now(),
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      }
    };

    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [images, title, description, category, condition, price, dynamicFields]);

  // Clear draft on successful publish
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  // Get fields based on selected category
  const categoryFields = useMemo(() => {
    return getFieldsForCategory(category);
  }, [category]);

  const { isEmailVerified } = useAuth();

  // Auth guard - after all hooks
  if (!user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'შესვლა საჭიროა' : 'Login Required'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'ნივთის დასამატებლად გთხოვთ შეხვიდეთ ანგარიშში' 
                : 'Please login to list an item for sale'}
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">
                {language === 'ka' ? 'შესვლა' : 'Login'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Email verification guard
  if (!isEmailVerified) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <EmailVerificationBanner />
          </div>
        </div>
      </Layout>
    );
  }

  // Reset dynamic fields when category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setDynamicFields({});
  };

  const updateDynamicField = (fieldId: string, value: string) => {
    setDynamicFields((prev) => ({ ...prev, [fieldId]: value }));
  };

  const conditions: { value: ListingCondition; label: string; desc: string }[] = [
    { value: 'new', label: t('condition.new'), desc: language === 'ka' ? 'ახალი, არასდროს ნახმარი' : 'Brand new, never worn' },
    { value: 'like-new', label: t('condition.likeNew'), desc: language === 'ka' ? 'ერთხელ ან ორჯერ ჩაცმული' : 'Worn once or twice' },
    { value: 'good', label: t('condition.good'), desc: language === 'ka' ? 'მცირე ნიშნები' : 'Minor signs of wear' },
    { value: 'fair', label: t('condition.fair'), desc: language === 'ka' ? 'ხილული ცვეთა' : 'Visible wear' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newWarnings: string[] = [];

    for (const file of Array.from(files)) {
      try {
        // Check image dimensions before processing
        const dimensions = await getImageDimensions(file);
        const qualityCheck = checkImageQuality(dimensions.width, dimensions.height);

        if (!qualityCheck.isAcceptable) {
          toast({
            title: language === 'ka' ? 'სურათი ძალიან პატარაა' : 'Image too small',
            description: qualityCheck.message,
            variant: 'destructive',
          });
          continue;
        }

        if (!qualityCheck.isRecommended) {
          newWarnings.push(
            language === 'ka' 
              ? `ფოტო "${file.name}" შეიძლება არ იყოს საკმარისად მკაფიო. რეკომენდებულია მინ. ${MIN_RECOMMENDED_SIZE}px.`
              : `Photo "${file.name}" may not be sharp enough. Recommended: ${MIN_RECOMMENDED_SIZE}px minimum.`
          );
        }

        // Compress with high quality (88%) - only resize if too large
        const compressedImage = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.88, // High quality compression
          format: 'jpeg',
        });

        setImages((prev) => [...prev, compressedImage]);
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: language === 'ka' ? 'შეცდომა' : 'Error',
          description: language === 'ka' ? 'სურათის დამუშავება ვერ მოხერხდა' : 'Failed to process image',
          variant: 'destructive',
        });
      }
    }

    if (newWarnings.length > 0) {
      setImageWarnings((prev) => [...prev, ...newWarnings]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    // Clear warnings when images change
    if (imageWarnings.length > 0) {
      setImageWarnings([]);
    }
  };
  

  // Check if all required dynamic fields are filled
  const missingRequiredFields = categoryFields
    .filter((field) => field.required && !dynamicFields[field.id])
    .map((field) => language === 'ka' ? field.nameKa : field.name);

  const canSubmit = images.length > 0 && title && category && condition && price && missingRequiredFields.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !user) return;

    setIsSubmitting(true);

    try {
      await request('/listings', {
        method: 'POST',
        body: {
          title,
          description,
          price: parseFloat(price),
          category,
          condition,
          images,
          status: 'active',
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error creating listing:', error);
      // Save as draft on error
      const draft: ListingDraft = { images, title, description, category, condition, price, dynamicFields, savedAt: Date.now() };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      toast({ 
        title: language === 'ka' ? 'შეცდომა' : 'Error', 
        description: language === 'ka' ? 'განცხადება შენახულია როგორც მონახაზი. სცადეთ თავიდან.' : 'Saved as draft. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(false);

    // Clear draft on success
    clearDraft();
    toast({ title: t('common.success'), description: language === 'ka' ? 'თქვენი განცხადება გამოქვეყნდა!' : 'Your listing has been published!' });
    navigate('/profile');
  };

  // Render a dynamic field based on its type
  const renderField = (field: CategoryField) => {
    const value = dynamicFields[field.id] || '';
    const label = language === 'ka' ? field.nameKa : field.name;
    const placeholder = language === 'ka' ? field.placeholderKa : field.placeholder;

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium mb-2">
            {label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <select
              value={value}
              onChange={(e) => updateDynamicField(field.id, e.target.value)}
              className="w-full h-11 pl-4 pr-10 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"
              required={field.required}
            >
              <option value="">
                {language === 'ka' ? 'აირჩიეთ...' : 'Select...'}
              </option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === 'ka' ? opt.labelKa : opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      );
    }

    if (field.type === 'number') {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium mb-2">
            {label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={value}
              onChange={(e) => updateDynamicField(field.id, e.target.value)}
              placeholder={placeholder}
              required={field.required}
            />
            {field.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {field.suffix}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Default: text input
    return (
      <div key={field.id}>
        <label className="block text-sm font-medium mb-2">
          {label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <Input
          value={value}
          onChange={(e) => updateDynamicField(field.id, e.target.value)}
          placeholder={placeholder}
          required={field.required}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('sell.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('sell.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('sell.photos')}</h2>
            <p className="text-sm text-muted-foreground mb-2">{t('sell.photosDesc')}</p>
            <p className="text-xs text-muted-foreground mb-4">
              {language === 'ka' 
                ? `რეკომენდებული მინიმუმ ${MIN_RECOMMENDED_SIZE}px მაღალი ხარისხისთვის`
                : `Recommended minimum ${MIN_RECOMMENDED_SIZE}px for best quality`}
            </p>
            
            {/* Quality warnings */}
            {imageWarnings.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    {imageWarnings.map((warning, idx) => (
                      <p key={idx} className="text-xs text-warning">{warning}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((src, index) => (
                <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted group animate-fade-in">
                  <img src={src} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 rounded-full bg-card/90 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && <Badge className="absolute bottom-2 left-2" variant="default">{t('sell.cover')}</Badge>}
                </div>
              ))}
              {images.length < 12 && (
                <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">{t('sell.addPhoto')}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {language === 'ka' ? 'მაქს. 12' : 'Max 12'}
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </section>

          {/* Details Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('sell.details')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('sell.titleField')}</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('sell.titlePlaceholder')} required maxLength={80} />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/80 {t('common.characters')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('sell.descriptionField')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('sell.descriptionPlaceholder')}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* Category & Condition Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('sell.categoryAttributes')}</h2>
            <div className="space-y-4">
              {/* Category Selector - Always visible */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('sell.category')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <CategorySelector
                  value={category}
                  onChange={handleCategoryChange}
                  required
                />
              </div>

              {/* Condition - Always visible */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('sell.conditionField')}
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ListingCondition)}
                    className="w-full h-11 pl-4 pr-10 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="">{t('sell.selectCondition')}</option>
                    {conditions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>

              {/* Dynamic Category-Specific Fields */}
              {category && categoryFields.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {language === 'ka' ? 'კატეგორიის დეტალები' : 'Category Details'}
                    </h3>
                    {missingRequiredFields.length > 0 && (
                      <Badge variant="outline" className="text-warning border-warning gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {missingRequiredFields.length} {language === 'ka' ? 'სავალდებულო' : 'required'}
                      </Badge>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {categoryFields.map((field) => renderField(field))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Parcel Size Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              {language === 'ka' ? 'აირჩიეთ ამანათის ზომა' : 'Select your parcel size'}
            </h2>
            <div className="space-y-0 divide-y divide-border border border-border rounded-lg overflow-hidden">
              {/* Small */}
              <label 
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${parcelSize === 'small' ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <div>
                  <p className="font-medium">{language === 'ka' ? 'პატარა' : 'Small'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ka' ? 'ნივთებისთვის, რომლებიც დიდ კონვერტში ჩაეტევა' : "For items that'd fit in a large envelope."}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${parcelSize === 'small' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {parcelSize === 'small' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                </div>
                <input 
                  type="radio" 
                  name="parcelSize" 
                  value="small" 
                  checked={parcelSize === 'small'} 
                  onChange={() => setParcelSize('small')} 
                  className="sr-only" 
                />
              </label>

              {/* Medium - Recommended */}
              <label 
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${parcelSize === 'medium' ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <div>
                  <Badge variant="secondary" className="mb-1 bg-primary/10 text-primary border-0 text-xs">
                    {language === 'ka' ? 'რეკომენდებული' : 'Recommended'}
                  </Badge>
                  <p className="font-medium">{language === 'ka' ? 'საშუალო' : 'Medium'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ka' ? 'ნივთებისთვის, რომლებიც ფეხსაცმლის ყუთში ჩაეტევა' : "For items that'd fit in a shoebox."}
                  </p>
                  <button 
                    type="button" 
                    className="text-sm text-primary hover:underline mt-1"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: language === 'ka' ? 'ზომების დეტალები' : 'Sizing Details',
                        description: language === 'ka' ? 'საშუალო ამანათი: მაქს. 40x30x20 სმ, 5 კგ-მდე' : 'Medium parcel: max 40x30x20 cm, up to 5 kg',
                      });
                    }}
                  >
                    {language === 'ka' ? 'იხილეთ ზომები და ფასები' : 'See sizing and compensation details'}
                  </button>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${parcelSize === 'medium' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {parcelSize === 'medium' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                </div>
                <input 
                  type="radio" 
                  name="parcelSize" 
                  value="medium" 
                  checked={parcelSize === 'medium'} 
                  onChange={() => setParcelSize('medium')} 
                  className="sr-only" 
                />
              </label>

              {/* Large */}
              <label 
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${parcelSize === 'large' ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <div>
                  <p className="font-medium">{language === 'ka' ? 'დიდი' : 'Large'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ka' ? 'ნივთებისთვის, რომლებიც გადასატანი ყუთში ჩაეტევა' : "For items that'd fit in a moving box."}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${parcelSize === 'large' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {parcelSize === 'large' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                </div>
                <input 
                  type="radio" 
                  name="parcelSize" 
                  value="large" 
                  checked={parcelSize === 'large'} 
                  onChange={() => setParcelSize('large')} 
                  className="sr-only" 
                />
              </label>
            </div>
          </section>

          {/* Pricing Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('sell.pricing')}</h2>
            <div>
              <label className="block text-sm font-medium mb-2">{t('sell.price')}</label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₾</span>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="pl-8" required min={1} />
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-success-light flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div className="text-sm">
                <p><span className="font-medium text-foreground">{t('sell.youReceive')}: </span>₾{price || 0}</p>
                <p className="text-xs mt-1 text-muted-foreground">{t('sell.noCommission')}</p>
              </div>
            </div>
          </section>

          {/* Submit Section */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="lg">{t('sell.saveDraft')}</Button>
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? <span className="animate-pulse">{t('sell.publishing')}</span> : t('sell.publish')}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
