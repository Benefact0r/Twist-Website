/**
 * Category-Specific Form Fields Configuration
 * Vinted-level dynamic form fields per category
 */

export interface CategoryField {
  id: string;
  name: string;
  nameKa: string;
  type: 'select' | 'text' | 'number' | 'multiselect';
  required?: boolean;
  options?: { value: string; label: string; labelKa: string }[];
  placeholder?: string;
  placeholderKa?: string;
  suffix?: string;
}

export interface CategoryFieldConfig {
  categoryPatterns: string[];
  fields: CategoryField[];
}

// Size options
const clothingSizes = [
  { value: 'XXS', label: 'XXS', labelKa: 'XXS' },
  { value: 'XS', label: 'XS', labelKa: 'XS' },
  { value: 'S', label: 'S', labelKa: 'S' },
  { value: 'M', label: 'M', labelKa: 'M' },
  { value: 'L', label: 'L', labelKa: 'L' },
  { value: 'XL', label: 'XL', labelKa: 'XL' },
  { value: 'XXL', label: 'XXL', labelKa: 'XXL' },
  { value: 'XXXL', label: 'XXXL', labelKa: 'XXXL' },
  { value: 'one-size', label: 'One Size', labelKa: 'უნივერსალური' },
];

const shoeSizes = Array.from({ length: 20 }, (_, i) => ({
  value: String(35 + i),
  label: `EU ${35 + i}`,
  labelKa: `EU ${35 + i}`,
}));

const kidsSizes = [
  { value: '0-3m', label: '0-3 months', labelKa: '0-3 თვე' },
  { value: '3-6m', label: '3-6 months', labelKa: '3-6 თვე' },
  { value: '6-12m', label: '6-12 months', labelKa: '6-12 თვე' },
  { value: '12-18m', label: '12-18 months', labelKa: '12-18 თვე' },
  { value: '18-24m', label: '18-24 months', labelKa: '18-24 თვე' },
  { value: '2-3y', label: '2-3 years', labelKa: '2-3 წელი' },
  { value: '3-4y', label: '3-4 years', labelKa: '3-4 წელი' },
  { value: '4-5y', label: '4-5 years', labelKa: '4-5 წელი' },
  { value: '5-6y', label: '5-6 years', labelKa: '5-6 წელი' },
  { value: '6-7y', label: '6-7 years', labelKa: '6-7 წელი' },
  { value: '7-8y', label: '7-8 years', labelKa: '7-8 წელი' },
  { value: '8-10y', label: '8-10 years', labelKa: '8-10 წელი' },
  { value: '10-12y', label: '10-12 years', labelKa: '10-12 წელი' },
];

const colors = [
  { value: 'black', label: 'Black', labelKa: 'შავი' },
  { value: 'white', label: 'White', labelKa: 'თეთრი' },
  { value: 'grey', label: 'Grey', labelKa: 'ნაცრისფერი' },
  { value: 'beige', label: 'Beige', labelKa: 'ბეჟი' },
  { value: 'brown', label: 'Brown', labelKa: 'ყავისფერი' },
  { value: 'navy', label: 'Navy', labelKa: 'მუქი ლურჯი' },
  { value: 'blue', label: 'Blue', labelKa: 'ლურჯი' },
  { value: 'red', label: 'Red', labelKa: 'წითელი' },
  { value: 'pink', label: 'Pink', labelKa: 'ვარდისფერი' },
  { value: 'green', label: 'Green', labelKa: 'მწვანე' },
  { value: 'yellow', label: 'Yellow', labelKa: 'ყვითელი' },
  { value: 'orange', label: 'Orange', labelKa: 'ნარინჯისფერი' },
  { value: 'purple', label: 'Purple', labelKa: 'იისფერი' },
  { value: 'multicolor', label: 'Multicolor', labelKa: 'ფერადი' },
];

const clothingMaterials = [
  { value: 'cotton', label: 'Cotton', labelKa: 'ბამბა' },
  { value: 'polyester', label: 'Polyester', labelKa: 'პოლიესტერი' },
  { value: 'wool', label: 'Wool', labelKa: 'მატყლი' },
  { value: 'silk', label: 'Silk', labelKa: 'აბრეშუმი' },
  { value: 'linen', label: 'Linen', labelKa: 'სელი' },
  { value: 'denim', label: 'Denim', labelKa: 'ჯინსი' },
  { value: 'leather', label: 'Leather', labelKa: 'ტყავი' },
  { value: 'synthetic', label: 'Synthetic', labelKa: 'სინთეტიკური' },
  { value: 'cashmere', label: 'Cashmere', labelKa: 'კაშემირი' },
  { value: 'velvet', label: 'Velvet', labelKa: 'ხავერდი' },
];

const storageOptions = [
  { value: '16gb', label: '16 GB', labelKa: '16 GB' },
  { value: '32gb', label: '32 GB', labelKa: '32 GB' },
  { value: '64gb', label: '64 GB', labelKa: '64 GB' },
  { value: '128gb', label: '128 GB', labelKa: '128 GB' },
  { value: '256gb', label: '256 GB', labelKa: '256 GB' },
  { value: '512gb', label: '512 GB', labelKa: '512 GB' },
  { value: '1tb', label: '1 TB', labelKa: '1 TB' },
  { value: '2tb', label: '2 TB', labelKa: '2 TB' },
];

const warrantyOptions = [
  { value: 'none', label: 'No warranty', labelKa: 'გარანტიის გარეშე' },
  { value: '3months', label: '3 months', labelKa: '3 თვე' },
  { value: '6months', label: '6 months', labelKa: '6 თვე' },
  { value: '1year', label: '1 year', labelKa: '1 წელი' },
  { value: '2years', label: '2 years', labelKa: '2 წელი' },
];

const furnitureMaterials = [
  { value: 'wood', label: 'Wood', labelKa: 'ხე' },
  { value: 'metal', label: 'Metal', labelKa: 'მეტალი' },
  { value: 'glass', label: 'Glass', labelKa: 'მინა' },
  { value: 'plastic', label: 'Plastic', labelKa: 'პლასტმასა' },
  { value: 'fabric', label: 'Fabric', labelKa: 'ქსოვილი' },
  { value: 'leather', label: 'Leather', labelKa: 'ტყავი' },
  { value: 'mdf', label: 'MDF', labelKa: 'MDF' },
];

export const categoryFieldConfigs: CategoryFieldConfig[] = [
  // WOMEN & MEN CLOTHING - Size is optional now for simpler Vinted-like flow
  {
    categoryPatterns: [
      'women-clothing', 'women-dresses', 'women-tops', 'women-tshirts', 'women-shirts',
      'women-knitwear', 'women-hoodies', 'women-jackets', 'women-trousers', 'women-jeans',
      'women-skirts', 'women-shorts', 'women-activewear', 'women-swimwear', 'women-lingerie',
      'women-sleepwear', 'women-suits', 'women-maternity', 'women-plussize',
      'men-clothing', 'men-tshirts', 'men-shirts', 'men-polos', 'men-knitwear',
      'men-hoodies', 'men-jackets', 'men-trousers', 'men-jeans', 'men-shorts',
      'men-suits', 'men-activewear', 'men-swimwear', 'men-underwear', 'men-sleepwear',
    ],
    fields: [
      { id: 'size', name: 'Size', nameKa: 'ზომა', type: 'select', options: clothingSizes },
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'material', name: 'Material', nameKa: 'მასალა', type: 'select', options: clothingMaterials },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Zara, H&M', placeholderKa: 'მაგ., Zara, H&M' },
    ],
  },
  // SHOES - Size is optional now
  {
    categoryPatterns: [
      'women-shoes', 'women-sneakers', 'women-boots', 'women-heels', 'women-flats',
      'women-sandals', 'women-loafers', 'women-espadrilles', 'women-athletic-shoes', 'women-slippers',
      'men-shoes', 'men-sneakers', 'men-boots', 'men-formal', 'men-loafers',
      'men-sandals', 'men-athletic-shoes', 'men-slippers',
    ],
    fields: [
      { id: 'size', name: 'Size (EU)', nameKa: 'ზომა (EU)', type: 'select', options: shoeSizes },
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Nike, Adidas', placeholderKa: 'მაგ., Nike, Adidas' },
    ],
  },
  // BAGS & ACCESSORIES
  {
    categoryPatterns: [
      'women-bags', 'women-handbags', 'women-backpacks', 'women-tote', 'women-crossbody',
      'women-clutches', 'women-wallets', 'women-travel-bags',
      'women-accessories', 'women-jewelry', 'women-watches', 'women-belts', 'women-scarves',
      'women-hats', 'women-gloves', 'women-sunglasses', 'women-hair-accessories',
      'men-bags', 'men-backpacks', 'men-messenger', 'men-briefcases', 'men-wallets', 'men-travel-bags',
      'men-accessories', 'men-watches', 'men-jewelry', 'men-belts', 'men-ties',
      'men-hats', 'men-scarves', 'men-gloves', 'men-sunglasses',
    ],
    fields: [
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Michael Kors, Gucci', placeholderKa: 'მაგ., Michael Kors, Gucci' },
    ],
  },
  // KIDS - Size is optional now
  {
    categoryPatterns: [
      'kids-baby', 'kids-baby-clothing', 'kids-baby-shoes', 'kids-baby-accessories',
      'kids-toddler', 'kids-toddler-clothing', 'kids-toddler-shoes',
      'kids-girls', 'kids-girls-clothing', 'kids-girls-shoes', 'kids-girls-accessories',
      'kids-boys', 'kids-boys-clothing', 'kids-boys-shoes', 'kids-boys-accessories',
      'kids-teens', 'kids-teens-clothing', 'kids-teens-shoes',
    ],
    fields: [
      { id: 'size', name: 'Size / Age', nameKa: 'ზომა / ასაკი', type: 'select', options: kidsSizes },
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Zara Kids', placeholderKa: 'მაგ., Zara Kids' },
    ],
  },
  // BABY GEAR - All optional
  {
    categoryPatterns: ['kids-gear', 'kids-strollers', 'kids-carseats', 'kids-carriers', 'kids-highchairs', 'kids-cribs', 'kids-monitors'],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Chicco, Bugaboo', placeholderKa: 'მაგ., Chicco, Bugaboo' },
      { id: 'ageRange', name: 'Age Range', nameKa: 'ასაკი', type: 'select', options: [
        { value: '0-6m', label: '0-6 months', labelKa: '0-6 თვე' },
        { value: '0-12m', label: '0-12 months', labelKa: '0-12 თვე' },
        { value: '0-3y', label: '0-3 years', labelKa: '0-3 წელი' },
        { value: 'universal', label: 'Universal', labelKa: 'უნივერსალური' },
      ]},
    ],
  },
  // TOYS
  {
    categoryPatterns: ['kids-toys', 'kids-toys-dolls', 'kids-toys-cars', 'kids-toys-building', 'kids-toys-outdoor', 'kids-toys-educational', 'kids-toys-plush'],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., LEGO, Hasbro', placeholderKa: 'მაგ., LEGO, Hasbro' },
      { id: 'ageRange', name: 'Recommended Age', nameKa: 'რეკომენდებული ასაკი', type: 'select', options: [
        { value: '0-2y', label: '0-2 years', labelKa: '0-2 წელი' },
        { value: '3-5y', label: '3-5 years', labelKa: '3-5 წელი' },
        { value: '6-8y', label: '6-8 years', labelKa: '6-8 წელი' },
        { value: '9-12y', label: '9-12 years', labelKa: '9-12 წელი' },
        { value: '12+', label: '12+ years', labelKa: '12+ წელი' },
      ]},
    ],
  },
  // ELECTRONICS - PHONES, TABLETS, LAPTOPS - All optional
  {
    categoryPatterns: [
      'electronics-phones', 'electronics-smartphones', 'electronics-tablets', 'electronics-ipads',
      'electronics-android-tablets', 'electronics-laptops', 'electronics-macbooks',
      'electronics-windows-laptops', 'electronics-chromebooks',
    ],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Apple, Samsung', placeholderKa: 'მაგ., Apple, Samsung' },
      { id: 'model', name: 'Model', nameKa: 'მოდელი', type: 'text', placeholder: 'e.g., iPhone 15, Galaxy S24', placeholderKa: 'მაგ., iPhone 15, Galaxy S24' },
      { id: 'storage', name: 'Storage', nameKa: 'მეხსიერება', type: 'select', options: storageOptions },
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'warranty', name: 'Warranty', nameKa: 'გარანტია', type: 'select', options: warrantyOptions },
    ],
  },
  // ELECTRONICS - AUDIO, GAMING, CAMERAS - All optional
  {
    categoryPatterns: [
      'electronics-headphones', 'electronics-wireless-headphones', 'electronics-earbuds', 'electronics-wired-headphones',
      'electronics-gaming', 'electronics-consoles', 'electronics-games', 'electronics-controllers', 'electronics-vr',
      'electronics-cameras', 'electronics-dslr', 'electronics-mirrorless', 'electronics-action-cameras',
      'electronics-wearables', 'electronics-smartwatches', 'electronics-fitness',
      'electronics-tv', 'electronics-tvs', 'electronics-speakers', 'electronics-soundbars',
    ],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Sony, Bose', placeholderKa: 'მაგ., Sony, Bose' },
      { id: 'model', name: 'Model', nameKa: 'მოდელი', type: 'text', placeholder: 'e.g., WH-1000XM5', placeholderKa: 'მაგ., WH-1000XM5' },
      { id: 'warranty', name: 'Warranty', nameKa: 'გარანტია', type: 'select', options: warrantyOptions },
    ],
  },
  // FURNITURE - All optional
  {
    categoryPatterns: [
      'home-furniture', 'home-sofas', 'home-tables', 'home-chairs', 'home-beds',
      'home-wardrobes', 'home-desks', 'home-shelves',
    ],
    fields: [
      { id: 'material', name: 'Material', nameKa: 'მასალა', type: 'select', options: furnitureMaterials },
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'dimensions', name: 'Dimensions (cm)', nameKa: 'ზომები (სმ)', type: 'text', placeholder: 'e.g., 120x80x75', placeholderKa: 'მაგ., 120x80x75' },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., IKEA', placeholderKa: 'მაგ., IKEA' },
    ],
  },
  // HOME DECOR & KITCHEN
  {
    categoryPatterns: [
      'home-decor', 'home-wall-art', 'home-vases', 'home-candles', 'home-clocks', 'home-frames',
      'home-kitchen', 'home-cookware', 'home-dinnerware', 'home-glassware', 'home-cutlery',
      'home-textiles', 'home-bedding', 'home-towels', 'home-curtains', 'home-rugs', 'home-cushions',
      'home-storage', 'home-lighting', 'home-lamps',
    ],
    fields: [
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'Optional', placeholderKa: 'არასავალდებულო' },
    ],
  },
  // BOOKS & ENTERTAINMENT
  {
    categoryPatterns: [
      'entertainment-books', 'entertainment-fiction', 'entertainment-nonfiction', 'entertainment-children-books',
      'entertainment-textbooks', 'entertainment-comics', 'entertainment-movies', 'entertainment-music',
    ],
    fields: [
      { id: 'author', name: 'Author / Artist', nameKa: 'ავტორი', type: 'text', placeholder: 'e.g., Stephen King', placeholderKa: 'მაგ., სტივენ კინგი' },
      { id: 'language', name: 'Language', nameKa: 'ენა', type: 'select', options: [
        { value: 'georgian', label: 'Georgian', labelKa: 'ქართული' },
        { value: 'english', label: 'English', labelKa: 'ინგლისური' },
        { value: 'russian', label: 'Russian', labelKa: 'რუსული' },
        { value: 'other', label: 'Other', labelKa: 'სხვა' },
      ]},
    ],
  },
  // SPORTS
  {
    categoryPatterns: [
      'sports', 'sports-fitness', 'sports-clothing', 'sports-bicycles', 'sports-camping',
      'sports-winter', 'sports-team',
    ],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Nike, Adidas', placeholderKa: 'მაგ., Nike, Adidas' },
      { id: 'size', name: 'Size', nameKa: 'ზომა', type: 'select', options: clothingSizes },
    ],
  },
  // BEAUTY - All optional
  {
    categoryPatterns: [
      'women-beauty', 'women-makeup', 'women-skincare', 'women-haircare', 'women-fragrances', 'women-nails', 'women-beauty-tools',
      'men-grooming', 'men-skincare', 'men-haircare', 'men-shaving', 'men-fragrances',
    ],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Chanel, MAC', placeholderKa: 'მაგ., Chanel, MAC' },
      { id: 'volume', name: 'Volume / Size', nameKa: 'მოცულობა', type: 'text', placeholder: 'e.g., 50ml', placeholderKa: 'მაგ., 50მლ' },
    ],
  },
  // LUXURY - Brand and authenticity optional now
  {
    categoryPatterns: [
      'luxury', 'luxury-bags', 'luxury-handbags', 'luxury-clutches', 'luxury-clothing',
      'luxury-women-clothing', 'luxury-men-clothing', 'luxury-shoes', 'luxury-women-shoes',
      'luxury-men-shoes', 'luxury-watches', 'luxury-jewelry', 'luxury-accessories',
    ],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'e.g., Louis Vuitton, Gucci', placeholderKa: 'მაგ., Louis Vuitton, Gucci' },
      { id: 'authenticity', name: 'Authenticity', nameKa: 'ავთენტურობა', type: 'select', options: [
        { value: 'authentic', label: 'Authentic with proof', labelKa: 'ავთენტური დადასტურებით' },
        { value: 'authentic-no-proof', label: 'Authentic without proof', labelKa: 'ავთენტური დადასტურების გარეშე' },
      ]},
      { id: 'color', name: 'Color', nameKa: 'ფერი', type: 'select', options: colors },
    ],
  },
  // PETS
  {
    categoryPatterns: ['pets', 'pets-dogs', 'pets-cats', 'pets-carriers', 'pets-other'],
    fields: [
      { id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'Optional', placeholderKa: 'არასავალდებულო' },
    ],
  },
];

export function getFieldsForCategory(categoryId: string): CategoryField[] {
  if (!categoryId) return [];

  for (const config of categoryFieldConfigs) {
    for (const pattern of config.categoryPatterns) {
      if (categoryId === pattern || categoryId.startsWith(pattern + '-')) {
        return config.fields;
      }
    }
  }

  return [{ id: 'brand', name: 'Brand', nameKa: 'ბრენდი', type: 'text', placeholder: 'Optional', placeholderKa: 'არასავალდებულო' }];
}

export function isCategoryType(categoryId: string, type: 'clothing' | 'shoes' | 'electronics' | 'furniture' | 'kids'): boolean {
  const patterns: Record<string, string[]> = {
    clothing: ['women-clothing', 'men-clothing', 'kids-girls', 'kids-boys', 'kids-baby', 'kids-toddler', 'kids-teens'],
    shoes: ['women-shoes', 'men-shoes'],
    electronics: ['electronics'],
    furniture: ['home-furniture'],
    kids: ['kids'],
  };

  return patterns[type]?.some(pattern => categoryId === pattern || categoryId.startsWith(pattern)) ?? false;
}
