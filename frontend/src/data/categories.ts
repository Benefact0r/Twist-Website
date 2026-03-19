import { Category } from '@/types';

/**
 * Category Taxonomy for Twist Marketplace
 * Structured like Vinted: Women, Men, Kids, Home
 * Each main category has: Clothes, Shoes, Bags, Accessories, Beauty
 */

export const categories: Category[] = [
  // ═══════════════════════════════════════════════════════════════
  // WOMEN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'women',
    name: 'Women',
    nameKa: 'ქალი',
    slug: 'women',
    icon: '👗',
    subcategories: [
      // CLOTHES
      {
        id: 'women-clothes',
        name: 'Clothes',
        nameKa: 'ტანსაცმელი',
        slug: 'women-clothes',
        icon: '👚',
        parentId: 'women',
        subcategories: [
          { id: 'women-clothes-jumpers-sweaters', name: 'Jumpers & sweaters', nameKa: 'ჯემპერები და სვიტერები', slug: 'women-clothes-jumpers-sweaters', parentId: 'women-clothes' },
          { id: 'women-clothes-dresses', name: 'Dresses', nameKa: 'კაბები', slug: 'women-clothes-dresses', parentId: 'women-clothes' },
          { id: 'women-clothes-tops-tshirts', name: 'Tops & T-shirts', nameKa: 'ტოპები და მაისურები', slug: 'women-clothes-tops-tshirts', parentId: 'women-clothes' },
          { id: 'women-clothes-pants-leggings', name: 'Pants & leggings', nameKa: 'შარვლები და ლეგინსები', slug: 'women-clothes-pants-leggings', parentId: 'women-clothes' },
          { id: 'women-clothes-jumpsuits-rompers', name: 'Jumpsuits & rompers', nameKa: 'კომბინეზონები', slug: 'women-clothes-jumpsuits-rompers', parentId: 'women-clothes' },
          { id: 'women-clothes-lingerie-nightwear', name: 'Lingerie & nightwear', nameKa: 'საცვლები და საძილე', slug: 'women-clothes-lingerie-nightwear', parentId: 'women-clothes' },
          { id: 'women-clothes-activewear', name: 'Activewear', nameKa: 'სპორტული ტანსაცმელი', slug: 'women-clothes-activewear', parentId: 'women-clothes' },
          { id: 'women-clothes-other', name: 'Other clothing', nameKa: 'სხვა ტანსაცმელი', slug: 'women-clothes-other', parentId: 'women-clothes' },
          { id: 'women-clothes-coats-jackets', name: 'Coats & jackets', nameKa: 'პალტოები და ქურთუკები', slug: 'women-clothes-coats-jackets', parentId: 'women-clothes' },
          { id: 'women-clothes-suits-blazers', name: 'Suits & blazers', nameKa: 'კოსტიუმები და ბლეიზერები', slug: 'women-clothes-suits-blazers', parentId: 'women-clothes' },
          { id: 'women-clothes-skirts', name: 'Skirts', nameKa: 'ქვედაბოლოები', slug: 'women-clothes-skirts', parentId: 'women-clothes' },
          { id: 'women-clothes-jeans', name: 'Jeans', nameKa: 'ჯინსები', slug: 'women-clothes-jeans', parentId: 'women-clothes' },
          { id: 'women-clothes-shorts-cropped', name: 'Shorts & cropped pants', nameKa: 'შორტები', slug: 'women-clothes-shorts-cropped', parentId: 'women-clothes' },
          { id: 'women-clothes-swimwear', name: 'Swimwear', nameKa: 'საცურაო ტანსაცმელი', slug: 'women-clothes-swimwear', parentId: 'women-clothes' },
          { id: 'women-clothes-maternity', name: 'Maternity clothes', nameKa: 'ორსულთა ტანსაცმელი', slug: 'women-clothes-maternity', parentId: 'women-clothes' },
          { id: 'women-clothes-costumes', name: 'Costumes & special outfits', nameKa: 'კოსტიუმები და სპეციალური', slug: 'women-clothes-costumes', parentId: 'women-clothes' },
        ],
      },
      // SHOES
      {
        id: 'women-shoes',
        name: 'Shoes',
        nameKa: 'ფეხსაცმელი',
        slug: 'women-shoes',
        icon: '👠',
        parentId: 'women',
        subcategories: [
          { id: 'women-shoes-heels', name: 'Heels', nameKa: 'ქუსლიანი', slug: 'women-shoes-heels', parentId: 'women-shoes' },
          { id: 'women-shoes-oxfords-loafers', name: 'Oxfords & loafers', nameKa: 'ოქსფორდები და ლოფერები', slug: 'women-shoes-oxfords-loafers', parentId: 'women-shoes' },
          { id: 'women-shoes-sandals', name: 'Sandals', nameKa: 'სანდლები', slug: 'women-shoes-sandals', parentId: 'women-shoes' },
          { id: 'women-shoes-flip-flops', name: 'Flip-flops', nameKa: 'ფლიპ-ფლოპები', slug: 'women-shoes-flip-flops', parentId: 'women-shoes' },
          { id: 'women-shoes-other', name: 'Other shoes', nameKa: 'სხვა ფეხსაცმელი', slug: 'women-shoes-other', parentId: 'women-shoes' },
          { id: 'women-shoes-boots', name: 'Boots', nameKa: 'ჩექმები', slug: 'women-shoes-boots', parentId: 'women-shoes' },
          { id: 'women-shoes-flats', name: 'Flats', nameKa: 'ბრტყელი ძირით', slug: 'women-shoes-flats', parentId: 'women-shoes' },
          { id: 'women-shoes-ankle-boots', name: 'Ankle boots', nameKa: 'წვივის ჩექმები', slug: 'women-shoes-ankle-boots', parentId: 'women-shoes' },
          { id: 'women-shoes-sports', name: 'Sports shoes', nameKa: 'სპორტული ფეხსაცმელი', slug: 'women-shoes-sports', parentId: 'women-shoes' },
          { id: 'women-shoes-slippers', name: 'Slippers', nameKa: 'ჩუსტები', slug: 'women-shoes-slippers', parentId: 'women-shoes' },
        ],
      },
      // BAGS
      {
        id: 'women-bags',
        name: 'Bags',
        nameKa: 'ჩანთები',
        slug: 'women-bags',
        icon: '👜',
        parentId: 'women',
        subcategories: [
          { id: 'women-bags-shoulder', name: 'Shoulder bags', nameKa: 'მხრის ჩანთები', slug: 'women-bags-shoulder', parentId: 'women-bags' },
          { id: 'women-bags-tote', name: 'Tote bags', nameKa: 'შოპერები', slug: 'women-bags-tote', parentId: 'women-bags' },
          { id: 'women-bags-purses-wallets', name: 'Purses & wallets', nameKa: 'საფულეები', slug: 'women-bags-purses-wallets', parentId: 'women-bags' },
          { id: 'women-bags-satchels', name: 'Satchels', nameKa: 'სატჩელები', slug: 'women-bags-satchels', parentId: 'women-bags' },
          { id: 'women-bags-patterned', name: 'Patterned & embroidered bags', nameKa: 'ნაქარგი ჩანთები', slug: 'women-bags-patterned', parentId: 'women-bags' },
          { id: 'women-bags-luggage', name: 'Luggage & suitcases', nameKa: 'ბარგი და ჩემოდნები', slug: 'women-bags-luggage', parentId: 'women-bags' },
          { id: 'women-bags-handbags', name: 'Handbags', nameKa: 'ხელჩანთები', slug: 'women-bags-handbags', parentId: 'women-bags' },
          { id: 'women-bags-backpacks', name: 'Backpacks', nameKa: 'ზურგჩანთები', slug: 'women-bags-backpacks', parentId: 'women-bags' },
          { id: 'women-bags-clutches', name: 'Clutches', nameKa: 'კლატჩები', slug: 'women-bags-clutches', parentId: 'women-bags' },
          { id: 'women-bags-makeup', name: 'Makeup bags', nameKa: 'კოსმეტიკის ჩანთები', slug: 'women-bags-makeup', parentId: 'women-bags' },
          { id: 'women-bags-bum', name: 'Bum bags', nameKa: 'წელის ჩანთები', slug: 'women-bags-bum', parentId: 'women-bags' },
          { id: 'women-bags-carryalls', name: 'Carryalls, Holdalls', nameKa: 'სპორტული ჩანთები', slug: 'women-bags-carryalls', parentId: 'women-bags' },
          { id: 'women-bags-other', name: 'Other bags', nameKa: 'სხვა ჩანთები', slug: 'women-bags-other', parentId: 'women-bags' },
        ],
      },
      // ACCESSORIES
      {
        id: 'women-accessories',
        name: 'Accessories',
        nameKa: 'აქსესუარები',
        slug: 'women-accessories',
        icon: '💍',
        parentId: 'women',
        subcategories: [
          { id: 'women-accessories-watches', name: 'Watches', nameKa: 'საათები', slug: 'women-accessories-watches', parentId: 'women-accessories' },
          { id: 'women-accessories-sunglasses', name: 'Sunglasses', nameKa: 'სათვალეები', slug: 'women-accessories-sunglasses', parentId: 'women-accessories' },
          { id: 'women-accessories-gloves', name: 'Gloves', nameKa: 'ხელთათმანები', slug: 'women-accessories-gloves', parentId: 'women-accessories' },
          { id: 'women-accessories-hair', name: 'Hair accessories', nameKa: 'თმის აქსესუარები', slug: 'women-accessories-hair', parentId: 'women-accessories' },
          { id: 'women-accessories-umbrellas', name: 'Umbrellas', nameKa: 'ქოლგები', slug: 'women-accessories-umbrellas', parentId: 'women-accessories' },
          { id: 'women-accessories-other', name: 'Other accessories', nameKa: 'სხვა აქსესუარები', slug: 'women-accessories-other', parentId: 'women-accessories' },
          { id: 'women-accessories-jewelry', name: 'Jewelry', nameKa: 'სამკაულები', slug: 'women-accessories-jewelry', parentId: 'women-accessories' },
          { id: 'women-accessories-belts', name: 'Belts', nameKa: 'ქამრები', slug: 'women-accessories-belts', parentId: 'women-accessories' },
          { id: 'women-accessories-scarves', name: 'Scarves & shawls', nameKa: 'შარფები და შალები', slug: 'women-accessories-scarves', parentId: 'women-accessories' },
          { id: 'women-accessories-hats', name: 'Hats & caps', nameKa: 'ქუდები', slug: 'women-accessories-hats', parentId: 'women-accessories' },
          { id: 'women-accessories-tech', name: 'Tech accessories', nameKa: 'ტექ აქსესუარები', slug: 'women-accessories-tech', parentId: 'women-accessories' },
          { id: 'women-accessories-keyrings', name: 'Keyrings', nameKa: 'გასაღებების საკიდები', slug: 'women-accessories-keyrings', parentId: 'women-accessories' },
        ],
      },
      // BEAUTY
      {
        id: 'women-beauty',
        name: 'Beauty',
        nameKa: 'სილამაზე',
        slug: 'women-beauty',
        icon: '💄',
        parentId: 'women',
        subcategories: [
          { id: 'women-beauty-perfume', name: 'Perfume', nameKa: 'სუნამო', slug: 'women-beauty-perfume', parentId: 'women-beauty' },
          { id: 'women-beauty-tools', name: 'Beauty tools', nameKa: 'სილამაზის ხელსაწყოები', slug: 'women-beauty-tools', parentId: 'women-beauty' },
          { id: 'women-beauty-nail', name: 'Nail Care', nameKa: 'ფრჩხილების მოვლა', slug: 'women-beauty-nail', parentId: 'women-beauty' },
          { id: 'women-beauty-hair', name: 'Hair care', nameKa: 'თმის მოვლა', slug: 'women-beauty-hair', parentId: 'women-beauty' },
          { id: 'women-beauty-makeup', name: 'Makeup', nameKa: 'მაკიაჟი', slug: 'women-beauty-makeup', parentId: 'women-beauty' },
          { id: 'women-beauty-face', name: 'Face care', nameKa: 'სახის მოვლა', slug: 'women-beauty-face', parentId: 'women-beauty' },
          { id: 'women-beauty-hand', name: 'Hand Care', nameKa: 'ხელის მოვლა', slug: 'women-beauty-hand', parentId: 'women-beauty' },
          { id: 'women-beauty-body', name: 'Body care', nameKa: 'სხეულის მოვლა', slug: 'women-beauty-body', parentId: 'women-beauty' },
          { id: 'women-beauty-other', name: 'Other beauty items', nameKa: 'სხვა სილამაზის პროდუქტები', slug: 'women-beauty-other', parentId: 'women-beauty' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MEN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'men',
    name: 'Men',
    nameKa: 'კაცი',
    slug: 'men',
    icon: '👔',
    subcategories: [
      // CLOTHES
      {
        id: 'men-clothes',
        name: 'Clothes',
        nameKa: 'ტანსაცმელი',
        slug: 'men-clothes',
        icon: '👕',
        parentId: 'men',
        subcategories: [
          { id: 'men-clothes-coats-jackets', name: 'Coats & jackets', nameKa: 'პალტოები და ქურთუკები', slug: 'men-clothes-coats-jackets', parentId: 'men-clothes' },
          { id: 'men-clothes-suits-blazers', name: 'Suits & blazers', nameKa: 'კოსტიუმები და ბლეიზერები', slug: 'men-clothes-suits-blazers', parentId: 'men-clothes' },
          { id: 'men-clothes-pants', name: 'Pants', nameKa: 'შარვლები', slug: 'men-clothes-pants', parentId: 'men-clothes' },
          { id: 'men-clothes-socks-underwear', name: 'Socks & underwear', nameKa: 'წინდები და საცვლები', slug: 'men-clothes-socks-underwear', parentId: 'men-clothes' },
          { id: 'men-clothes-activewear', name: 'Activewear', nameKa: 'სპორტული ტანსაცმელი', slug: 'men-clothes-activewear', parentId: 'men-clothes' },
          { id: 'men-clothes-other', name: "Other men's clothing", nameKa: 'სხვა კაცის ტანსაცმელი', slug: 'men-clothes-other', parentId: 'men-clothes' },
          { id: 'men-clothes-jeans', name: 'Jeans', nameKa: 'ჯინსები', slug: 'men-clothes-jeans', parentId: 'men-clothes' },
          { id: 'men-clothes-tops-tshirts', name: 'Tops & T-shirts', nameKa: 'ტოპები და მაისურები', slug: 'men-clothes-tops-tshirts', parentId: 'men-clothes' },
          { id: 'men-clothes-jumpers-sweaters', name: 'Jumpers & sweaters', nameKa: 'ჯემპერები და სვიტერები', slug: 'men-clothes-jumpers-sweaters', parentId: 'men-clothes' },
          { id: 'men-clothes-shorts', name: 'Shorts', nameKa: 'შორტები', slug: 'men-clothes-shorts', parentId: 'men-clothes' },
          { id: 'men-clothes-swimwear', name: 'Swimwear', nameKa: 'საცურაო ტანსაცმელი', slug: 'men-clothes-swimwear', parentId: 'men-clothes' },
          { id: 'men-clothes-costumes', name: 'Costumes & special outfits', nameKa: 'კოსტიუმები და სპეციალური', slug: 'men-clothes-costumes', parentId: 'men-clothes' },
        ],
      },
      // SHOES
      {
        id: 'men-shoes',
        name: 'Shoes',
        nameKa: 'ფეხსაცმელი',
        slug: 'men-shoes',
        icon: '👞',
        parentId: 'men',
        subcategories: [
          { id: 'men-shoes-slippers-flipflops', name: 'Slippers & flip-flops', nameKa: 'ჩუსტები და ფლიპ-ფლოპები', slug: 'men-shoes-slippers-flipflops', parentId: 'men-shoes' },
          { id: 'men-shoes-sneakers', name: 'Sneakers', nameKa: 'კედები', slug: 'men-shoes-sneakers', parentId: 'men-shoes' },
          { id: 'men-shoes-sandals', name: 'Sandals', nameKa: 'სანდლები', slug: 'men-shoes-sandals', parentId: 'men-shoes' },
          { id: 'men-shoes-other', name: 'Other shoes', nameKa: 'სხვა ფეხსაცმელი', slug: 'men-shoes-other', parentId: 'men-shoes' },
          { id: 'men-shoes-oxfords-loafers', name: 'Oxfords & loafers', nameKa: 'ოქსფორდები და ლოფერები', slug: 'men-shoes-oxfords-loafers', parentId: 'men-shoes' },
          { id: 'men-shoes-formal', name: 'Formal shoes', nameKa: 'ფორმალური ფეხსაცმელი', slug: 'men-shoes-formal', parentId: 'men-shoes' },
          { id: 'men-shoes-sports', name: 'Sports shoes', nameKa: 'სპორტული ფეხსაცმელი', slug: 'men-shoes-sports', parentId: 'men-shoes' },
          { id: 'men-shoes-boots', name: 'Boots', nameKa: 'ჩექმები', slug: 'men-shoes-boots', parentId: 'men-shoes' },
        ],
      },
      // ACCESSORIES
      {
        id: 'men-accessories',
        name: 'Accessories',
        nameKa: 'აქსესუარები',
        slug: 'men-accessories',
        icon: '⌚',
        parentId: 'men',
        subcategories: [
          { id: 'men-accessories-bags-backpacks', name: 'Bags & backpacks', nameKa: 'ჩანთები და ზურგჩანთები', slug: 'men-accessories-bags-backpacks', parentId: 'men-accessories' },
          { id: 'men-accessories-belts', name: 'Belts', nameKa: 'ქამრები', slug: 'men-accessories-belts', parentId: 'men-accessories' },
          { id: 'men-accessories-sunglasses', name: 'Sunglasses', nameKa: 'სათვალეები', slug: 'men-accessories-sunglasses', parentId: 'men-accessories' },
          { id: 'men-accessories-scarves', name: 'Scarves & shawls', nameKa: 'შარფები და შალები', slug: 'men-accessories-scarves', parentId: 'men-accessories' },
          { id: 'men-accessories-other', name: 'Other', nameKa: 'სხვა', slug: 'men-accessories-other', parentId: 'men-accessories' },
          { id: 'men-accessories-ties', name: 'Ties & pocket squares', nameKa: 'ჰალსტუხები', slug: 'men-accessories-ties', parentId: 'men-accessories' },
          { id: 'men-accessories-jewelry', name: 'Jewelry', nameKa: 'სამკაულები', slug: 'men-accessories-jewelry', parentId: 'men-accessories' },
          { id: 'men-accessories-watches', name: 'Watches', nameKa: 'საათები', slug: 'men-accessories-watches', parentId: 'men-accessories' },
          { id: 'men-accessories-hats', name: 'Hats & caps', nameKa: 'ქუდები', slug: 'men-accessories-hats', parentId: 'men-accessories' },
          { id: 'men-accessories-gloves', name: 'Gloves', nameKa: 'ხელთათმანები', slug: 'men-accessories-gloves', parentId: 'men-accessories' },
        ],
      },
      // GROOMING
      {
        id: 'men-grooming',
        name: 'Grooming',
        nameKa: 'მოვლა',
        slug: 'men-grooming',
        icon: '🧴',
        parentId: 'men',
        subcategories: [
          { id: 'men-grooming-tools', name: 'Tools & accessories', nameKa: 'ხელსაწყოები', slug: 'men-grooming-tools', parentId: 'men-grooming' },
          { id: 'men-grooming-body', name: 'Body care', nameKa: 'სხეულის მოვლა', slug: 'men-grooming-body', parentId: 'men-grooming' },
          { id: 'men-grooming-aftershave', name: 'Aftershave & cologne', nameKa: 'ლოსიონი და ოდეკოლონი', slug: 'men-grooming-aftershave', parentId: 'men-grooming' },
          { id: 'men-grooming-kits', name: 'Grooming kits', nameKa: 'მოვლის ნაკრებები', slug: 'men-grooming-kits', parentId: 'men-grooming' },
          { id: 'men-grooming-face', name: 'Face care', nameKa: 'სახის მოვლა', slug: 'men-grooming-face', parentId: 'men-grooming' },
          { id: 'men-grooming-hair', name: 'Hair care', nameKa: 'თმის მოვლა', slug: 'men-grooming-hair', parentId: 'men-grooming' },
          { id: 'men-grooming-hand-nail', name: 'Hand & nail care', nameKa: 'ხელისა და ფრჩხილის მოვლა', slug: 'men-grooming-hand-nail', parentId: 'men-grooming' },
          { id: 'men-grooming-makeup', name: 'Makeup', nameKa: 'მაკიაჟი', slug: 'men-grooming-makeup', parentId: 'men-grooming' },
          { id: 'men-grooming-other', name: 'Other grooming items', nameKa: 'სხვა მოვლის პროდუქტები', slug: 'men-grooming-other', parentId: 'men-grooming' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // KIDS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'kids',
    name: 'Kids',
    nameKa: 'ბავშვები',
    slug: 'kids',
    icon: '🧸',
    subcategories: [
      // GIRLS' CLOTHING
      {
        id: 'kids-girls',
        name: "Girls' clothing",
        nameKa: 'გოგონების ტანსაცმელი',
        slug: 'kids-girls',
        icon: '👧',
        parentId: 'kids',
        subcategories: [
          { id: 'kids-girls-shoes', name: 'Shoes', nameKa: 'ფეხსაცმელი', slug: 'kids-girls-shoes', parentId: 'kids-girls' },
          { id: 'kids-girls-sweaters-hoodies', name: 'Sweaters & hoodies', nameKa: 'სვიტერები და ჰუდები', slug: 'kids-girls-sweaters-hoodies', parentId: 'kids-girls' },
          { id: 'kids-girls-dresses', name: 'Dresses', nameKa: 'კაბები', slug: 'kids-girls-dresses', parentId: 'kids-girls' },
          { id: 'kids-girls-pants-shorts', name: 'Pants & shorts', nameKa: 'შარვლები და შორტები', slug: 'kids-girls-pants-shorts', parentId: 'kids-girls' },
          { id: 'kids-girls-accessories', name: 'Accessories', nameKa: 'აქსესუარები', slug: 'kids-girls-accessories', parentId: 'kids-girls' },
          { id: 'kids-girls-underwear-socks', name: 'Underwear & socks', nameKa: 'საცვლები და წინდები', slug: 'kids-girls-underwear-socks', parentId: 'kids-girls' },
          { id: 'kids-girls-sportswear', name: 'Sportswear', nameKa: 'სპორტული ტანსაცმელი', slug: 'kids-girls-sportswear', parentId: 'kids-girls' },
          { id: 'kids-girls-twins', name: 'Clothing for twins', nameKa: 'ტყუპებისთვის', slug: 'kids-girls-twins', parentId: 'kids-girls' },
          { id: 'kids-girls-formal', name: 'Formal wear & special occasions', nameKa: 'საზეიმო ტანსაცმელი', slug: 'kids-girls-formal', parentId: 'kids-girls' },
          { id: 'kids-girls-baby', name: 'Baby clothing', nameKa: 'ჩვილის ტანსაცმელი', slug: 'kids-girls-baby', parentId: 'kids-girls' },
          { id: 'kids-girls-coats-jackets', name: 'Coats & jackets', nameKa: 'პალტოები და ქურთუკები', slug: 'kids-girls-coats-jackets', parentId: 'kids-girls' },
          { id: 'kids-girls-tops-tshirts', name: 'Tops & T-shirts', nameKa: 'ტოპები და მაისურები', slug: 'kids-girls-tops-tshirts', parentId: 'kids-girls' },
          { id: 'kids-girls-skirts', name: 'Skirts', nameKa: 'ქვედაბოლოები', slug: 'kids-girls-skirts', parentId: 'kids-girls' },
          { id: 'kids-girls-bags-backpacks', name: 'Bags & backpacks', nameKa: 'ჩანთები და ზურგჩანთები', slug: 'kids-girls-bags-backpacks', parentId: 'kids-girls' },
          { id: 'kids-girls-swimwear', name: 'Swimwear', nameKa: 'საცურაო ტანსაცმელი', slug: 'kids-girls-swimwear', parentId: 'kids-girls' },
          { id: 'kids-girls-sleepwear', name: 'Sleepwear', nameKa: 'საძილე', slug: 'kids-girls-sleepwear', parentId: 'kids-girls' },
          { id: 'kids-girls-bundles', name: 'Clothing bundles', nameKa: 'ტანსაცმლის ნაკრებები', slug: 'kids-girls-bundles', parentId: 'kids-girls' },
          { id: 'kids-girls-costumes', name: 'Fancy dress & costumes', nameKa: 'კოსტიუმები', slug: 'kids-girls-costumes', parentId: 'kids-girls' },
          { id: 'kids-girls-other', name: "Other girls' clothing", nameKa: 'სხვა გოგონების ტანსაცმელი', slug: 'kids-girls-other', parentId: 'kids-girls' },
        ],
      },
      // BOYS' CLOTHING
      {
        id: 'kids-boys',
        name: "Boys' clothing",
        nameKa: 'ბიჭების ტანსაცმელი',
        slug: 'kids-boys',
        icon: '👦',
        parentId: 'kids',
        subcategories: [
          { id: 'kids-boys-shoes', name: 'Shoes', nameKa: 'ფეხსაცმელი', slug: 'kids-boys-shoes', parentId: 'kids-boys' },
          { id: 'kids-boys-sweaters-hoodies', name: 'Sweaters & hoodies', nameKa: 'სვიტერები და ჰუდები', slug: 'kids-boys-sweaters-hoodies', parentId: 'kids-boys' },
          { id: 'kids-boys-pants-overalls', name: 'Pants & overalls', nameKa: 'შარვლები და კომბინეზონები', slug: 'kids-boys-pants-overalls', parentId: 'kids-boys' },
          { id: 'kids-boys-accessories', name: 'Accessories', nameKa: 'აქსესუარები', slug: 'kids-boys-accessories', parentId: 'kids-boys' },
          { id: 'kids-boys-underwear-socks', name: 'Underwear & socks', nameKa: 'საცვლები და წინდები', slug: 'kids-boys-underwear-socks', parentId: 'kids-boys' },
          { id: 'kids-boys-sportswear', name: 'Sportswear', nameKa: 'სპორტული ტანსაცმელი', slug: 'kids-boys-sportswear', parentId: 'kids-boys' },
          { id: 'kids-boys-twins', name: 'Clothing for twins', nameKa: 'ტყუპებისთვის', slug: 'kids-boys-twins', parentId: 'kids-boys' },
          { id: 'kids-boys-formal', name: 'Formal wear & special occasions', nameKa: 'საზეიმო ტანსაცმელი', slug: 'kids-boys-formal', parentId: 'kids-boys' },
          { id: 'kids-boys-baby', name: 'Baby clothing', nameKa: 'ჩვილის ტანსაცმელი', slug: 'kids-boys-baby', parentId: 'kids-boys' },
          { id: 'kids-boys-coats-jackets', name: 'Coats & jackets', nameKa: 'პალტოები და ქურთუკები', slug: 'kids-boys-coats-jackets', parentId: 'kids-boys' },
          { id: 'kids-boys-tops-tshirts', name: 'Tops & T-shirts', nameKa: 'ტოპები და მაისურები', slug: 'kids-boys-tops-tshirts', parentId: 'kids-boys' },
          { id: 'kids-boys-bags-backpacks', name: 'Bags & backpacks', nameKa: 'ჩანთები და ზურგჩანთები', slug: 'kids-boys-bags-backpacks', parentId: 'kids-boys' },
          { id: 'kids-boys-swimwear', name: 'Swimwear', nameKa: 'საცურაო ტანსაცმელი', slug: 'kids-boys-swimwear', parentId: 'kids-boys' },
          { id: 'kids-boys-sleepwear', name: 'Sleepwear', nameKa: 'საძილე', slug: 'kids-boys-sleepwear', parentId: 'kids-boys' },
          { id: 'kids-boys-bundles', name: 'Clothing bundles', nameKa: 'ტანსაცმლის ნაკრებები', slug: 'kids-boys-bundles', parentId: 'kids-boys' },
          { id: 'kids-boys-costumes', name: 'Fancy dress & costumes', nameKa: 'კოსტიუმები', slug: 'kids-boys-costumes', parentId: 'kids-boys' },
          { id: 'kids-boys-other', name: "Other boys' clothing", nameKa: 'სხვა ბიჭების ტანსაცმელი', slug: 'kids-boys-other', parentId: 'kids-boys' },
        ],
      },
      // TOYS & GAMES
      {
        id: 'kids-toys',
        name: 'Toys & games',
        nameKa: 'სათამაშოები და თამაშები',
        slug: 'kids-toys',
        icon: '🧩',
        parentId: 'kids',
        subcategories: [
          { id: 'kids-toys-jigsaws-puzzles', name: 'Jigsaws & puzzles', nameKa: 'ფაზლები', slug: 'kids-toys-jigsaws-puzzles', parentId: 'kids-toys' },
          { id: 'kids-toys-gaming-consoles', name: 'Gaming consoles & video games', nameKa: 'თამაშის კონსოლები', slug: 'kids-toys-gaming-consoles', parentId: 'kids-toys' },
          { id: 'kids-toys-games', name: 'Games', nameKa: 'თამაშები', slug: 'kids-toys-games', parentId: 'kids-toys' },
          { id: 'kids-toys-toys', name: 'Toys', nameKa: 'სათამაშოები', slug: 'kids-toys-toys', parentId: 'kids-toys' },
        ],
      },
      // BABY CARE
      {
        id: 'kids-babycare',
        name: 'Baby care',
        nameKa: 'ბავშვის მოვლა',
        slug: 'kids-babycare',
        icon: '👶',
        parentId: 'kids',
        subcategories: [
          { id: 'kids-babycare-nursing-feeding', name: 'Nursing & feeding', nameKa: 'კვება', slug: 'kids-babycare-nursing-feeding', parentId: 'kids-babycare' },
          { id: 'kids-babycare-childcare-tech', name: 'Childcare accessories & tech', nameKa: 'აქსესუარები და ტექნოლოგია', slug: 'kids-babycare-childcare-tech', parentId: 'kids-babycare' },
          { id: 'kids-babycare-potties', name: 'Potties', nameKa: 'ნოჩნიკები', slug: 'kids-babycare-potties', parentId: 'kids-babycare' },
          { id: 'kids-babycare-sleep', name: 'Sleep accessories', nameKa: 'ძილის აქსესუარები', slug: 'kids-babycare-sleep', parentId: 'kids-babycare' },
          { id: 'kids-babycare-diapers-skincare', name: 'Diapers & skincare', nameKa: 'საფენები და კანის მოვლა', slug: 'kids-babycare-diapers-skincare', parentId: 'kids-babycare' },
          { id: 'kids-babycare-bibs', name: 'Bibs', nameKa: 'წინსაფრები', slug: 'kids-babycare-bibs', parentId: 'kids-babycare' },
          { id: 'kids-babycare-childproofing', name: 'Childproofing & safety', nameKa: 'უსაფრთხოება', slug: 'kids-babycare-childproofing', parentId: 'kids-babycare' },
        ],
      },
      // STROLLERS
      {
        id: 'kids-strollers',
        name: 'Strollers',
        nameKa: 'ეტლები',
        slug: 'kids-strollers',
        icon: '🚼',
        parentId: 'kids',
        subcategories: [
          { id: 'kids-strollers-sport', name: 'Sport strollers', nameKa: 'სპორტული ეტლები', slug: 'kids-strollers-sport', parentId: 'kids-strollers' },
          { id: 'kids-strollers-twins', name: 'Strollers for twins', nameKa: 'ტყუპების ეტლები', slug: 'kids-strollers-twins', parentId: 'kids-strollers' },
          { id: 'kids-strollers-umbrella', name: 'Umbrella strollers', nameKa: 'ქოლგა ეტლები', slug: 'kids-strollers-umbrella', parentId: 'kids-strollers' },
          { id: 'kids-strollers-universal', name: 'Universal strollers', nameKa: 'უნივერსალური ეტლები', slug: 'kids-strollers-universal', parentId: 'kids-strollers' },
          { id: 'kids-strollers-accessories', name: 'Accessories for strollers', nameKa: 'ეტლის აქსესუარები', slug: 'kids-strollers-accessories', parentId: 'kids-strollers' },
        ],
      },
      // OTHER KIDS' ITEMS
      {
        id: 'kids-other',
        name: "Other kids' items",
        nameKa: 'სხვა ბავშვის ნივთები',
        slug: 'kids-other',
        icon: '📦',
        parentId: 'kids',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'home',
    name: 'Home',
    nameKa: 'სახლი',
    slug: 'home',
    icon: '🏠',
    subcategories: [
      // TEXTILES
      {
        id: 'home-textiles',
        name: 'Textiles',
        nameKa: 'ტექსტილი',
        slug: 'home-textiles',
        icon: '🛏️',
        parentId: 'home',
        subcategories: [
          { id: 'home-textiles-blankets', name: 'Blankets', nameKa: 'საბნები', slug: 'home-textiles-blankets', parentId: 'home-textiles' },
          { id: 'home-textiles-throw-pillows', name: 'Throw pillows', nameKa: 'დეკორატიული ბალიშები', slug: 'home-textiles-throw-pillows', parentId: 'home-textiles' },
          { id: 'home-textiles-table-linen', name: 'Table linen', nameKa: 'სუფრის თეთრეული', slug: 'home-textiles-table-linen', parentId: 'home-textiles' },
          { id: 'home-textiles-towels', name: 'Towels', nameKa: 'პირსახოცები', slug: 'home-textiles-towels', parentId: 'home-textiles' },
          { id: 'home-textiles-bedding', name: 'Bedding', nameKa: 'თეთრეული', slug: 'home-textiles-bedding', parentId: 'home-textiles' },
          { id: 'home-textiles-curtains-drapes', name: 'Curtains & drapes', nameKa: 'ფარდები', slug: 'home-textiles-curtains-drapes', parentId: 'home-textiles' },
          { id: 'home-textiles-rugs-mats', name: 'Rugs & mats', nameKa: 'ხალიჩები და ფეხსაგები', slug: 'home-textiles-rugs-mats', parentId: 'home-textiles' },
          { id: 'home-textiles-tapestries', name: 'Tapestries & wall hangings', nameKa: 'გობელენები', slug: 'home-textiles-tapestries', parentId: 'home-textiles' },
        ],
      },
      // HOME ACCESSORIES
      {
        id: 'home-accessories',
        name: 'Home accessories',
        nameKa: 'სახლის აქსესუარები',
        slug: 'home-accessories',
        icon: '🖼️',
        parentId: 'home',
        subcategories: [
          { id: 'home-accessories-clocks', name: 'Clocks', nameKa: 'საათები', slug: 'home-accessories-clocks', parentId: 'home-accessories' },
          { id: 'home-accessories-frames', name: 'Picture & photo frames', nameKa: 'ჩარჩოები', slug: 'home-accessories-frames', parentId: 'home-accessories' },
          { id: 'home-accessories-storage', name: 'Storage', nameKa: 'შესანახი ყუთები', slug: 'home-accessories-storage', parentId: 'home-accessories' },
          { id: 'home-accessories-candles', name: 'Candles & candle holders', nameKa: 'სანთლები და სასანთლეები', slug: 'home-accessories-candles', parentId: 'home-accessories' },
          { id: 'home-accessories-shelves', name: 'Display shelves', nameKa: 'თაროები', slug: 'home-accessories-shelves', parentId: 'home-accessories' },
          { id: 'home-accessories-mirrors', name: 'Mirrors', nameKa: 'სარკეები', slug: 'home-accessories-mirrors', parentId: 'home-accessories' },
          { id: 'home-accessories-vases', name: 'Vases', nameKa: 'ვაზები', slug: 'home-accessories-vases', parentId: 'home-accessories' },
        ],
      },
      // TABLEWARE
      {
        id: 'home-tableware',
        name: 'Tableware',
        nameKa: 'სუფრის ჭურჭელი',
        slug: 'home-tableware',
        icon: '🍽️',
        parentId: 'home',
        subcategories: [
          { id: 'home-tableware-dinnerware', name: 'Dinnerware', nameKa: 'სადილის ჭურჭელი', slug: 'home-tableware-dinnerware', parentId: 'home-tableware' },
          { id: 'home-tableware-drinkware', name: 'Drinkware', nameKa: 'სასმელი ჭურჭელი', slug: 'home-tableware-drinkware', parentId: 'home-tableware' },
          { id: 'home-tableware-cutlery', name: 'Cutlery', nameKa: 'დანა-ჩანგალი', slug: 'home-tableware-cutlery', parentId: 'home-tableware' },
        ],
      },
      // BOOKS
      {
        id: 'home-books',
        name: 'Books',
        nameKa: 'წიგნები',
        slug: 'home-books',
        icon: '📚',
        parentId: 'home',
        subcategories: [
          { id: 'home-books-literature-fiction', name: 'Literature & fiction', nameKa: 'ლიტერატურა და მხატვრული', slug: 'home-books-literature-fiction', parentId: 'home-books' },
          { id: 'home-books-nonfiction', name: 'Nonfiction', nameKa: 'არამხატვრული', slug: 'home-books-nonfiction', parentId: 'home-books' },
          { id: 'home-books-kids-young-adults', name: 'Kids & young adults', nameKa: 'ბავშვებისა და მოზარდებისთვის', slug: 'home-books-kids-young-adults', parentId: 'home-books' },
        ],
      },
    ],
  },
];

/**
 * Get category name based on language
 */
// Alias for backwards compatibility
export const getCategoryById = findCategoryById;

/**
 * Get all category IDs in the system
 */
export function getAllCategoryIds(): string[] {
  const ids: string[] = [];
  for (const cat of categories) {
    ids.push(cat.id);
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        ids.push(sub.id);
        if (sub.subcategories) {
          for (const item of sub.subcategories) {
            ids.push(item.id);
          }
        }
      }
    }
  }
  return ids;
}

/**
 * Get the root category for any category ID
 */
export function getRootCategory(categoryId: string): Category | null {
  for (const cat of categories) {
    if (cat.id === categoryId) return cat;
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.id === categoryId) return cat;
        if (sub.subcategories) {
          for (const item of sub.subcategories) {
            if (item.id === categoryId) return cat;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Format category breadcrumb as string
 */
export function formatCategoryBreadcrumb(categoryId: string, language: 'en' | 'ka' = 'en', separator: string = ' > '): string {
  const path = getCategoryPath(categoryId);
  return path.map(cat => getCategoryName(cat, language)).join(separator);
}

/**
 * Get category name based on language
 */
export function getCategoryName(category: Category, language: 'en' | 'ka'): string {
  return language === 'ka' ? category.nameKa : category.name;
}

/**
 * Find a category by its ID (searches all levels)
 */
export function findCategoryById(id: string): Category | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.id === id) return sub;
        if (sub.subcategories) {
          for (const item of sub.subcategories) {
            if (item.id === id) return item;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Find a category by its slug
 */
export function findCategoryBySlug(slug: string): Category | null {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.slug === slug) return sub;
        if (sub.subcategories) {
          for (const item of sub.subcategories) {
            if (item.slug === slug) return item;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Get all descendant category IDs for a given category
 */
export function getDescendantIds(categoryId: string): string[] {
  const ids: string[] = [];
  const category = findCategoryById(categoryId);
  
  if (category?.subcategories) {
    for (const sub of category.subcategories) {
      ids.push(sub.id);
      if (sub.subcategories) {
        for (const item of sub.subcategories) {
          ids.push(item.id);
        }
      }
    }
  }
  
  return ids;
}

/**
 * Check if a category is a descendant of another
 */
export function isDescendantOf(childId: string, parentId: string): boolean {
  if (childId === parentId) return true;
  const descendants = getDescendantIds(parentId);
  return descendants.includes(childId);
}

/**
 * Get the full path of a category (breadcrumb)
 */
export function getCategoryPath(categoryId: string): Category[] {
  const path: Category[] = [];
  
  for (const cat of categories) {
    if (cat.id === categoryId) {
      path.push(cat);
      return path;
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.id === categoryId) {
          path.push(cat, sub);
          return path;
        }
        if (sub.subcategories) {
          for (const item of sub.subcategories) {
            if (item.id === categoryId) {
              path.push(cat, sub, item);
              return path;
            }
          }
        }
      }
    }
  }
  
  return path;
}

/**
 * Get parent category of a given category
 */
export function getParentCategory(categoryId: string): Category | null {
  const category = findCategoryById(categoryId);
  if (!category?.parentId) return null;
  return findCategoryById(category.parentId);
}

/**
 * Map old category IDs to new structure
 * Used for migrating existing listings
 */
export const categoryMigrationMap: Record<string, string> = {
  // Old women categories -> new structure
  'women-dresses': 'women-clothes-dresses',
  'women-tops': 'women-clothes-tops-tshirts',
  'women-shirts': 'women-clothes-tops-tshirts',
  'women-sweaters': 'women-clothes-jumpers-sweaters',
  'women-jackets': 'women-clothes-coats-jackets',
  'women-pants': 'women-clothes-pants-leggings',
  'women-skirts': 'women-clothes-skirts',
  'women-sportswear': 'women-clothes-activewear',
  'women-swimwear': 'women-clothes-swimwear',
  'women-underwear': 'women-clothes-lingerie-nightwear',
  'women-suits': 'women-clothes-suits-blazers',
  'women-plussize': 'women-clothes-other',
  
  // Old standalone categories -> women subcategories
  'shoes-sneakers': 'women-shoes-sports',
  'shoes-boots': 'women-shoes-boots',
  'shoes-heels': 'women-shoes-heels',
  'shoes-flats': 'women-shoes-flats',
  'shoes-sandals': 'women-shoes-sandals',
  'shoes-formal': 'women-shoes-oxfords-loafers',
  'shoes-sports': 'women-shoes-sports',
  
  'bags-handbags': 'women-bags-handbags',
  'bags-backpacks': 'women-bags-backpacks',
  'bags-crossbody': 'women-bags-shoulder',
  'bags-tote': 'women-bags-tote',
  'bags-clutches': 'women-bags-clutches',
  'bags-wallets': 'women-bags-purses-wallets',
  'bags-travel': 'women-bags-luggage',
  
  'accessories-jewelry': 'women-accessories-jewelry',
  'accessories-watches': 'women-accessories-watches',
  'accessories-belts': 'women-accessories-belts',
  'accessories-scarves': 'women-accessories-scarves',
  'accessories-hats': 'women-accessories-hats',
  'accessories-sunglasses': 'women-accessories-sunglasses',
  'accessories-gloves': 'women-accessories-gloves',
  
  // Old men categories
  'men-tops': 'men-clothes',
  'men-shirts': 'men-clothes',
  'men-sweaters': 'men-clothes',
  'men-jackets': 'men-clothes',
  'men-pants': 'men-clothes',
  'men-sportswear': 'men-clothes',
  'men-swimwear': 'men-clothes',
  'men-suits': 'men-clothes',
  'men-underwear': 'men-clothes',
  
  // Old kids categories
  'kids-baby': 'kids-clothes',
  'kids-clothing': 'kids-clothes',
  'kids-shoes': 'kids-shoes',
  'kids-accessories': 'kids-accessories',
  'kids-sportswear': 'kids-clothes',
  'kids-formal': 'kids-clothes',
};

/**
 * Migrate old category ID to new structure
 */
export function migrateCategory(oldCategoryId: string): string {
  return categoryMigrationMap[oldCategoryId] || oldCategoryId;
}
