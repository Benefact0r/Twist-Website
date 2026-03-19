// Demo listings for Twist marketplace
// Realistic second-hand fashion items with proper categories matching Phase 1 structure

// Import all demo images
import womenDenimJacket from '@/assets/demo/women-denim-jacket.jpg';
import sneakersWhiteNike from '@/assets/demo/sneakers-white-nike.jpg';
import bagBlackCrossbody from '@/assets/demo/bag-black-crossbody.jpg';
import womenFloralDress from '@/assets/demo/women-floral-dress.jpg';
import menLevisJeans from '@/assets/demo/men-levis-jeans.jpg';
import menAdidasHoodie from '@/assets/demo/men-adidas-hoodie.jpg';
import bagCoachBrown from '@/assets/demo/bag-coach-brown.jpg';
import womenWhiteBlouse from '@/assets/demo/women-white-blouse.jpg';
import menTommyPolo from '@/assets/demo/men-tommy-polo.jpg';
import sneakersConverseBlack from '@/assets/demo/sneakers-converse-black.jpg';
import womenTrenchCoat from '@/assets/demo/women-trench-coat.jpg';
import menRalphShirt from '@/assets/demo/men-ralph-shirt.jpg';
import accessoryBeltGuess from '@/assets/demo/accessory-belt-guess.jpg';
import womenPinkSweater from '@/assets/demo/women-pink-sweater.jpg';
import sneakersNikeRunning from '@/assets/demo/sneakers-nike-running.jpg';
import womenBlackSkirt from '@/assets/demo/women-black-skirt.jpg';
import menCkTshirt from '@/assets/demo/men-ck-tshirt.jpg';
import bagMkTote from '@/assets/demo/bag-mk-tote.jpg';
import womenGreenBlouse from '@/assets/demo/women-green-blouse.jpg';
import menBossBlazer from '@/assets/demo/men-boss-blazer.jpg';
import womenBlackTrousers from '@/assets/demo/women-black-trousers.jpg';
import sneakersStanSmith from '@/assets/demo/sneakers-stan-smith.jpg';
import womenGreyCardigan from '@/assets/demo/women-grey-cardigan.jpg';
import menNikeSweatpants from '@/assets/demo/men-nike-sweatpants.jpg';
import womenAnkleBoots from '@/assets/demo/women-ankle-boots.jpg';
import menNavyCoat from '@/assets/demo/men-navy-coat.jpg';
import accessorySilkScarf from '@/assets/demo/accessory-silk-scarf.jpg';
import womenDenimShorts from '@/assets/demo/women-denim-shorts.jpg';
import menPumaJacket from '@/assets/demo/men-puma-jacket.jpg';
import bagLongchampTote from '@/assets/demo/bag-longchamp-tote.jpg';
import womenLinenBlazer from '@/assets/demo/women-linen-blazer.jpg';
import menTimberlandBoots from '@/assets/demo/men-timberland-boots.jpg';
import womenRedDress from '@/assets/demo/women-red-dress.jpg';
import accessoryRayban from '@/assets/demo/accessory-rayban.jpg';
import menLacostePolo from '@/assets/demo/men-lacoste-polo.jpg';
import bagLeatherBackpack from '@/assets/demo/bag-leather-backpack.jpg';
import womenLeatherJacket from '@/assets/demo/women-leather-jacket.jpg';
import menNavyChinos from '@/assets/demo/men-navy-chinos.jpg';
import womenWhiteSandals from '@/assets/demo/women-white-sandals.jpg';
import accessoryWoolHat from '@/assets/demo/accessory-wool-hat.jpg';

export interface DemoListing {
  title: string;
  description: string;
  category: string; // Uses new simplified category IDs
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  image: string;
  brand: string;
  size?: string;
}

// Realistic demo listings using NEW SIMPLIFIED category structure
export const demoListings: DemoListing[] = [
  // ═══════════════════════════════════════════════════════════════
  // WOMEN
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Zara ჯინსის ქურთუკი, ზომა M',
    description: 'ლამაზი ჯინსის ქურთუკი, ძალიან კარგ მდგომარეობაში. იდეალურია გაზაფხულისთვის.',
    category: 'women-jackets',
    price: 45,
    condition: 'good',
    image: womenDenimJacket,
    brand: 'Zara',
    size: 'M'
  },
  {
    title: 'H&M ყვავილებიანი კაბა, ზომა S',
    description: 'მსუბუქი საზაფხულო კაბა ყვავილების პრინტით. ძალიან კომფორტული.',
    category: 'women-dresses',
    price: 35,
    condition: 'like_new',
    image: womenFloralDress,
    brand: 'H&M',
    size: 'S'
  },
  {
    title: 'Zara თეთრი ბლუზა, ზომა S',
    description: 'ელეგანტური თეთრი ბლუზა, იდეალურია ოფისისთვის ან საღამოსთვის.',
    category: 'women-shirts',
    price: 28,
    condition: 'good',
    image: womenWhiteBlouse,
    brand: 'Zara',
    size: 'S'
  },
  {
    title: 'Massimo Dutti ტრენჩი პალტო, ზომა M',
    description: 'კლასიკური ბეჟი ტრენჩი, მაღალი ხარისხის ქსოვილი.',
    category: 'women-jackets',
    price: 120,
    condition: 'like_new',
    image: womenTrenchCoat,
    brand: 'Massimo Dutti',
    size: 'M'
  },
  {
    title: 'Mango ვარდისფერი სვიტერი, ზომა M',
    description: 'რბილი კაშმირის სვიტერი, ძალიან თბილი და კომფორტული.',
    category: 'women-sweaters',
    price: 55,
    condition: 'good',
    image: womenPinkSweater,
    brand: 'Mango',
    size: 'M'
  },
  {
    title: 'Bershka შავი მინი ქვედაბოლო, ზომა S',
    description: 'სტილიანი შავი ქვედაბოლო, იდეალურია ყოველდღიური ტარებისთვის.',
    category: 'women-skirts',
    price: 22,
    condition: 'good',
    image: womenBlackSkirt,
    brand: 'Bershka',
    size: 'S'
  },
  {
    title: 'Stradivarius მწვანე სატინის ბლუზა, ზომა M',
    description: 'ელეგანტური მწვანე ბლუზა, იდეალურია საღამოსთვის.',
    category: 'women-shirts',
    price: 32,
    condition: 'like_new',
    image: womenGreenBlouse,
    brand: 'Stradivarius',
    size: 'M'
  },
  {
    title: 'Zara შავი შარვალი, ზომა S',
    description: 'კლასიკური შავი შარვალი მაღალი წელით.',
    category: 'women-pants',
    price: 38,
    condition: 'good',
    image: womenBlackTrousers,
    brand: 'Zara',
    size: 'S'
  },
  {
    title: 'H&M რუხი კარდიგანი, ზომა M',
    description: 'რბილი ტრიკოტაჟის კარდიგანი ღილაკებით.',
    category: 'women-sweaters',
    price: 30,
    condition: 'good',
    image: womenGreyCardigan,
    brand: 'H&M',
    size: 'M'
  },
  {
    title: 'Bershka ჯინსის შორტები, ზომა S',
    description: 'საზაფხულო დენიმის შორტები ნაჭრების ეფექტით.',
    category: 'women-skirts',
    price: 25,
    condition: 'good',
    image: womenDenimShorts,
    brand: 'Bershka',
    size: 'S'
  },
  {
    title: 'Mango ლენის ბლეიზერი, ზომა M',
    description: 'მსუბუქი ზეთისხილისფერი ბლეიზერი ზაფხულისთვის.',
    category: 'women-suits',
    price: 65,
    condition: 'like_new',
    image: womenLinenBlazer,
    brand: 'Mango',
    size: 'M'
  },
  {
    title: 'Stradivarius წითელი კაბა, ზომა S',
    description: 'ელეგანტური წითელი მიდი კაბა რფინებით.',
    category: 'women-dresses',
    price: 48,
    condition: 'like_new',
    image: womenRedDress,
    brand: 'Stradivarius',
    size: 'S'
  },
  {
    title: 'Zara ტყავის ქურთუკი, ზომა M',
    description: 'კლასიკური შავი ტყავის ქურთუკი ბაიკერის სტილში.',
    category: 'women-jackets',
    price: 95,
    condition: 'good',
    image: womenLeatherJacket,
    brand: 'Zara',
    size: 'M'
  },

  // ═══════════════════════════════════════════════════════════════
  // MEN
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Levi's 501 ჯინსები, ზომა 32",
    description: 'კლასიკური ლურჯი ჯინსები, ორიგინალი, კარგ მდგომარეობაში.',
    category: 'men-pants',
    price: 55,
    condition: 'good',
    image: menLevisJeans,
    brand: "Levi's",
    size: '32'
  },
  {
    title: 'Adidas Originals ჰუდი, ზომა L',
    description: 'შავი ჰუდი კლასიკური ლოგოთი, ძალიან კომფორტული.',
    category: 'men-sweaters',
    price: 48,
    condition: 'good',
    image: menAdidasHoodie,
    brand: 'Adidas',
    size: 'L'
  },
  {
    title: 'Tommy Hilfiger პოლო პერანგი, ზომა M',
    description: 'ლურჯი პოლო პერანგი ნაქარგი ლოგოთი.',
    category: 'men-tops',
    price: 42,
    condition: 'like_new',
    image: menTommyPolo,
    brand: 'Tommy Hilfiger',
    size: 'M'
  },
  {
    title: 'Ralph Lauren ზოლიანი პერანგი, ზომა L',
    description: 'კლასიკური ზოლიანი პერანგი, იდეალურია ოფისისთვის.',
    category: 'men-shirts',
    price: 45,
    condition: 'good',
    image: menRalphShirt,
    brand: 'Ralph Lauren',
    size: 'L'
  },
  {
    title: 'Calvin Klein თეთრი მაისური, ზომა M',
    description: 'მინიმალისტური თეთრი მაისური, მაღალი ხარისხის ბამბა.',
    category: 'men-tops',
    price: 25,
    condition: 'like_new',
    image: menCkTshirt,
    brand: 'Calvin Klein',
    size: 'M'
  },
  {
    title: 'Hugo Boss ბლეიზერი, ზომა 50',
    description: 'ელეგანტური რუხი ბლეიზერი, იდეალურია საქმიანი შეხვედრებისთვის.',
    category: 'men-suits',
    price: 150,
    condition: 'like_new',
    image: menBossBlazer,
    brand: 'Hugo Boss',
    size: '50'
  },
  {
    title: 'Nike Sportswear შარვალი, ზომა L',
    description: 'კომფორტული რუხი სპორტული შარვალი.',
    category: 'men-sportswear',
    price: 35,
    condition: 'good',
    image: menNikeSweatpants,
    brand: 'Nike',
    size: 'L'
  },
  {
    title: 'Massimo Dutti ლურჯი პალტო, ზომა L',
    description: 'კლასიკური ლურჯი შალის პალტო, მაღალი ხარისხი.',
    category: 'men-jackets',
    price: 130,
    condition: 'like_new',
    image: menNavyCoat,
    brand: 'Massimo Dutti',
    size: 'L'
  },
  {
    title: 'Puma სპორტული ქურთუკი, ზომა M',
    description: 'შავი სპორტული ქურთუკი, იდეალურია ვარჯიშისთვის.',
    category: 'men-sportswear',
    price: 40,
    condition: 'good',
    image: menPumaJacket,
    brand: 'Puma',
    size: 'M'
  },
  {
    title: 'Lacoste თეთრი პოლო, ზომა M',
    description: 'კლასიკური თეთრი პოლო ნიანგის ლოგოთი.',
    category: 'men-tops',
    price: 50,
    condition: 'like_new',
    image: menLacostePolo,
    brand: 'Lacoste',
    size: 'M'
  },
  {
    title: 'Zara ლურჯი ჩინოსი, ზომა 32',
    description: 'კლასიკური ლურჯი ჩინოს შარვალი.',
    category: 'men-pants',
    price: 35,
    condition: 'good',
    image: menNavyChinos,
    brand: 'Zara',
    size: '32'
  },

  // ═══════════════════════════════════════════════════════════════
  // SHOES (Standalone category)
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Nike Air Force 1 თეთრი, ზომა 40',
    description: 'კლასიკური თეთრი Air Force 1, კარგ მდგომარეობაში.',
    category: 'shoes-sneakers',
    price: 75,
    condition: 'good',
    image: sneakersWhiteNike,
    brand: 'Nike',
    size: '40'
  },
  {
    title: 'Converse Chuck Taylor შავი, ზომა 42',
    description: 'კლასიკური შავი Converse მაღალი ყელით.',
    category: 'shoes-sneakers',
    price: 45,
    condition: 'good',
    image: sneakersConverseBlack,
    brand: 'Converse',
    size: '42'
  },
  {
    title: 'Nike Running ფეხსაცმელი, ზომა 43',
    description: 'სპორტული სარბენი ფეხსაცმელი რუხი/მწვანე ფერში.',
    category: 'shoes-sports',
    price: 55,
    condition: 'good',
    image: sneakersNikeRunning,
    brand: 'Nike',
    size: '43'
  },
  {
    title: 'Adidas Stan Smith, ზომა 41',
    description: 'თეთრი Stan Smith მწვანე დეტალებით, კლასიკა.',
    category: 'shoes-sneakers',
    price: 65,
    condition: 'like_new',
    image: sneakersStanSmith,
    brand: 'Adidas',
    size: '41'
  },
  {
    title: 'ბორდო ტყავის წვივსაცმელი, ზომა 38',
    description: 'ელეგანტური ტყავის წვივსაცმელი, იდეალურია შემოდგომისთვის.',
    category: 'shoes-boots',
    price: 60,
    condition: 'good',
    image: womenAnkleBoots,
    brand: 'Mango',
    size: '38'
  },
  {
    title: 'Timberland ჩექმები, ზომა 44',
    description: 'კლასიკური ყავისფერი Timberland ჩექმები.',
    category: 'shoes-boots',
    price: 85,
    condition: 'good',
    image: menTimberlandBoots,
    brand: 'Timberland',
    size: '44'
  },
  {
    title: 'თეთრი საზაფხულო სანდლები, ზომა 37',
    description: 'კომფორტული თეთრი სანდლები ზაფხულისთვის.',
    category: 'shoes-sandals',
    price: 28,
    condition: 'good',
    image: womenWhiteSandals,
    brand: 'H&M',
    size: '37'
  },

  // ═══════════════════════════════════════════════════════════════
  // BAGS (Standalone category)
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'შავი ტყავის კროსბოდი ჩანთა',
    description: 'მინიმალისტური შავი ჩანთა ოქროსფერი დეტალებით.',
    category: 'bags-crossbody',
    price: 45,
    condition: 'like_new',
    image: bagBlackCrossbody,
    brand: 'Mango'
  },
  {
    title: 'Coach ყავისფერი ჩანთა',
    description: 'ელეგანტური Coach ხელჩანთა ნატურალური ტყავისგან.',
    category: 'bags-handbags',
    price: 180,
    condition: 'good',
    image: bagCoachBrown,
    brand: 'Coach'
  },
  {
    title: 'Michael Kors ბეჟი შოპერი',
    description: 'დიდი შოპერი ჩანთა ოქროსფერი ფურნიტურით.',
    category: 'bags-tote',
    price: 150,
    condition: 'like_new',
    image: bagMkTote,
    brand: 'Michael Kors'
  },
  {
    title: 'Longchamp Le Pliage ჩანთა',
    description: 'კლასიკური ბეჟი Longchamp ტოტი.',
    category: 'bags-tote',
    price: 75,
    condition: 'good',
    image: bagLongchampTote,
    brand: 'Longchamp'
  },
  {
    title: 'ყავისფერი ტყავის ზურგჩანთა',
    description: 'სტილიანი ტყავის ზურგჩანთა ყოველდღიური გამოყენებისთვის.',
    category: 'bags-backpacks',
    price: 65,
    condition: 'good',
    image: bagLeatherBackpack,
    brand: 'Zara'
  },

  // ═══════════════════════════════════════════════════════════════
  // ACCESSORIES (Standalone category)
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Guess შავი ტყავის ქამარი',
    description: 'შავი ტყავის ქამარი ვერცხლისფერი ბალთით.',
    category: 'accessories-belts',
    price: 35,
    condition: 'like_new',
    image: accessoryBeltGuess,
    brand: 'Guess'
  },
  {
    title: 'აბრეშუმის შარფი გეომეტრიული პრინტით',
    description: 'ელეგანტური აბრეშუმის შარფი, იდეალურია აქსესუარად.',
    category: 'accessories-scarves',
    price: 40,
    condition: 'like_new',
    image: accessorySilkScarf,
    brand: 'Mango'
  },
  {
    title: 'Ray-Ban Clubmaster სათვალე',
    description: 'კლასიკური Ray-Ban სათვალე შავი ჩარჩოთი.',
    category: 'accessories-sunglasses',
    price: 85,
    condition: 'like_new',
    image: accessoryRayban,
    brand: 'Ray-Ban'
  },
  {
    title: 'ბეჟი ნაქსოვი ქუდი',
    description: 'თბილი ზამთრის ქუდი ბეჟი ფერში.',
    category: 'accessories-hats',
    price: 18,
    condition: 'like_new',
    image: accessoryWoolHat,
    brand: 'H&M'
  },
];

// Get demo listings distributed across sellers
export function getDemoListingsForSeller(sellerIndex: number): DemoListing[] {
  // Distribute listings across 4-5 sellers, 5-8 items each
  const sellersCount = 5;
  const startIndex = sellerIndex * Math.ceil(demoListings.length / sellersCount);
  const endIndex = Math.min(startIndex + 8, demoListings.length);
  return demoListings.slice(startIndex, endIndex);
}
