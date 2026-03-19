import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategoryCounts } from '@/hooks/useCategoryCounts';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryCard {
  id: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  emoji: string;
  image: string;
  color: string;
}

const categoriesData: CategoryCard[] = [
  {
    id: 'women',
    slug: 'women',
    nameKa: 'ქალის ტანსაცმელი',
    nameEn: "Women's Fashion",
    emoji: '👗',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=600&fit=crop',
    color: 'category-women',
  },
  {
    id: 'men',
    slug: 'men',
    nameKa: 'კაცის ტანსაცმელი',
    nameEn: "Men's Fashion",
    emoji: '👔',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=600&fit=crop',
    color: 'category-men',
  },
  {
    id: 'shoes',
    slug: 'women-shoes',
    nameKa: 'ფეხსაცმელი',
    nameEn: 'Shoes',
    emoji: '👟',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    color: 'category-sports',
  },
  {
    id: 'bags',
    slug: 'women-bags',
    nameKa: 'ჩანთები',
    nameEn: 'Bags',
    emoji: '👜',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    color: 'category-luxury',
  },
  {
    id: 'kids',
    slug: 'kids',
    nameKa: 'ბავშვთა ტანსაცმელი',
    nameEn: "Kids' Fashion",
    emoji: '👶',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=600&fit=crop',
    color: 'category-kids',
  },
  {
    id: 'accessories',
    slug: 'women-accessories',
    nameKa: 'აქსესუარები',
    nameEn: 'Accessories',
    emoji: '💍',
    image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=600&h=600&fit=crop',
    color: 'category-accessories',
  },
];

export function CategoryShowcase() {
  const { language } = useLanguage();
  const { data: counts, isLoading, isError } = useCategoryCounts();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {language === 'ka' ? 'აღმოაჩინე კატეგორიები' : 'Explore Categories'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {language === 'ka' 
              ? 'იპოვე სწორედ ის, რაც გჭირდება'
              : 'Find exactly what you\'re looking for'}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categoriesData.map((category, index) => {
            const count = counts?.[category.slug] ?? null;

            return (
              <Link
                key={category.id}
                to={`/search?category=${category.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl animate-fade-in",
                  (index === 0 || index === 3) ? "aspect-[3/4]" : "aspect-[4/5]"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={language === 'ka' ? category.nameKa : category.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span 
                    className={cn(
                      "text-2xl md:text-3xl mb-2 inline-flex w-fit p-2 rounded-xl transition-transform duration-300 group-hover:scale-110",
                      `category-badge-${category.id}`
                    )}
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                  >
                    {category.emoji}
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 transition-transform duration-300 group-hover:translate-x-1">
                    {language === 'ka' ? category.nameKa : category.nameEn}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm font-medium">
                      {isLoading ? (
                        <span className="inline-block w-12 h-4 bg-white/20 rounded animate-pulse" />
                      ) : isError || count === null ? (
                        `0 ${language === 'ka' ? 'ნივთი' : 'items'}`
                      ) : (
                        `${count} ${language === 'ka' ? 'ნივთი' : 'items'}`
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      {language === 'ka' ? 'ნახვა' : 'Explore'}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    `bg-[hsl(var(--${category.color}))]`
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
