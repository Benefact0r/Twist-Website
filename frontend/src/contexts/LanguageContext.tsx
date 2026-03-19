import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ka' | 'en';

interface Translations {
  [key: string]: {
    ka: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.sell': { ka: 'გაყიდვა', en: 'Sell' },
  'nav.favorites': { ka: 'ფავორიტები', en: 'Favorites' },
  'nav.messages': { ka: 'შეტყობინებები', en: 'Messages' },
  'nav.cart': { ka: 'კალათა', en: 'Cart' },
  'nav.login': { ka: 'შესვლა', en: 'Login' },
  'nav.search': { ka: 'ძიება ნივთების, ბრენდების...', en: 'Search for items, brands...' },
  'nav.searchShort': { ka: 'ძიება...', en: 'Search items...' },
  'nav.freeShipping': { ka: '🇬🇪 უფასო მიტანა ₾100-ზე მეტ შეკვეთაზე', en: '🇬🇪 Free shipping on orders over ₾100' },
  'nav.help': { ka: 'დახმარება', en: 'Help' },
  'nav.about': { ka: 'Twist-ის შესახებ', en: 'About Twist' },
  'nav.categories': { ka: 'კატეგორიები', en: 'Categories' },
  'nav.myOrders': { ka: 'ჩემი შეკვეთები', en: 'My Orders' },
  'nav.sellAnItem': { ka: 'ნივთის გაყიდვა', en: 'Sell an Item' },
  'nav.helpCenter': { ka: 'დახმარების ცენტრი', en: 'Help Center' },

  // Categories
  'cat.women': { ka: 'ქალი', en: 'Women' },
  'cat.women.clothes': { ka: 'ტანსაცმელი', en: 'Clothes' },
  'cat.women.shoes': { ka: 'ფეხსაცმელი', en: 'Shoes' },
  'cat.women.bags': { ka: 'ჩანთები', en: 'Bags' },
  'cat.women.accessories': { ka: 'აქსესუარები', en: 'Accessories' },
  'cat.women.beauty': { ka: 'სილამაზე', en: 'Beauty' },
  'cat.men': { ka: 'კაცი', en: 'Men' },
  'cat.men.clothes': { ka: 'ტანსაცმელი', en: 'Clothes' },
  'cat.men.shoes': { ka: 'ფეხსაცმელი', en: 'Shoes' },
  'cat.men.accessories': { ka: 'აქსესუარები', en: 'Accessories' },
  'cat.men.grooming': { ka: 'მოვლა', en: 'Grooming' },
  'cat.kids': { ka: 'ბავშვი', en: 'Kids' },
  'cat.kids.girls': { ka: 'გოგოები', en: 'Girls' },
  'cat.kids.boys': { ka: 'ბიჭები', en: 'Boys' },
  'cat.kids.baby': { ka: 'ჩვილები', en: 'Baby' },
  'cat.kids.toys': { ka: 'სათამაშოები', en: 'Toys' },
  'cat.kids.school': { ka: 'სასკოლო ნივთები', en: 'School Supplies' },
  'cat.home': { ka: 'სახლი', en: 'Home' },
  'cat.home.textiles': { ka: 'ტექსტილი', en: 'Textiles' },
  'cat.home.decor': { ka: 'დეკორი', en: 'Decor' },
  'cat.home.tableware': { ka: 'ჭურჭელი', en: 'Tableware' },
  'cat.entertainment': { ka: 'გართობა', en: 'Entertainment' },
  'cat.entertainment.games': { ka: 'ვიდეო თამაშები', en: 'Video Games' },
  'cat.entertainment.consoles': { ka: 'კონსოლები', en: 'Consoles' },
  'cat.entertainment.books': { ka: 'წიგნები', en: 'Books' },
  'cat.pets': { ka: 'შინაური ცხოველები', en: 'Pets' },
  'cat.pets.dogs': { ka: 'ძაღლები', en: 'Dogs' },
  'cat.pets.cats': { ka: 'კატები', en: 'Cats' },
  'cat.pets.small': { ka: 'პატარა ცხოველები', en: 'Small Pets' },

  // Home page
  'home.hero.title': { ka: 'იყიდე და გაყიდე მეორადი ნივთები', en: 'Buy & Sell Second-Hand Items' },
  'home.hero.subtitle': { ka: 'შეუერთდი საქართველოს უდიდეს მარკეტპლეისს მეორადი მოდისა და მეტისთვის', en: 'Join Georgia\'s largest marketplace for second-hand fashion and more' },
  'home.hero.browse': { ka: 'ნივთების ნახვა', en: 'Browse Items' },
  'home.hero.sell': { ka: 'გაყიდვის დაწყება', en: 'Start Selling' },
  'home.featured': { ka: 'გამორჩეული ნივთები', en: 'Featured Items' },
  'home.seeAll': { ka: 'ყველას ნახვა', en: 'See All' },
  'home.shopByCategory': { ka: 'კატეგორიით ყიდვა', en: 'Shop by Category' },
  'home.sellerPromo.title': { ka: 'გაყიდე უფასოდ', en: 'Sell for Free' },
  'home.sellerPromo.subtitle': { ka: 'გაყიდვაზე 0% საკომისიო. შეინახე შენი მოგების 100%', en: '0% commission on sales. Keep 100% of your earnings' },
  'home.sellerPromo.cta': { ka: 'გაყიდვის დაწყება', en: 'Start Selling Now' },

  // Listing detail
  'listing.buyNow': { ka: 'ყიდვა', en: 'Buy Now' },
  'listing.makeOffer': { ka: 'შეთავაზება', en: 'Make an Offer' },
  'listing.message': { ka: 'შეტყობინება', en: 'Message Seller' },
  'listing.delivery': { ka: 'მიტანა', en: 'delivery' },
  'listing.buyerProtection': { ka: 'მყიდველის დაცვა', en: 'Buyer Protection' },
  'listing.buyerProtectionDesc': { ka: 'სრული თანხის დაბრუნება თუ არ მიიღეთ', en: 'Full refund if not delivered' },
  'listing.doorToDoor': { ka: 'კარიდან კარამდე', en: 'Door-to-Door' },
  'listing.doorToDoorDesc': { ka: '2-4 დღეში მიტანა', en: '2-4 days delivery' },
  'listing.description': { ka: 'აღწერა', en: 'Description' },
  'listing.condition': { ka: 'მდგომარეობა', en: 'Condition' },
  'listing.size': { ka: 'ზომა', en: 'Size' },
  'listing.brand': { ka: 'ბრენდი', en: 'Brand' },
  'listing.views': { ka: 'ნახვები', en: 'Views' },
  'listing.verified': { ka: 'დადასტურებული', en: 'Verified' },
  'listing.sales': { ka: 'გაყიდვები', en: 'sales' },
  'listing.response': { ka: 'პასუხი', en: 'response' },
  'listing.youMayLike': { ka: 'შეიძლება მოგეწონოთ', en: 'You may also like' },
  'listing.oneSize': { ka: 'უნივერსალური', en: 'One Size' },
  'listing.noBrand': { ka: 'ბრენდის გარეშე', en: 'No brand' },

  // Condition labels
  'condition.new': { ka: 'ახალი ეტიკეტით', en: 'New with tags' },
  'condition.likeNew': { ka: 'თითქმის ახალი', en: 'Like New' },
  'condition.good': { ka: 'კარგი', en: 'Good' },
  'condition.fair': { ka: 'საშუალო', en: 'Fair' },

  // Offer modal
  'offer.title': { ka: 'შეთავაზების გაგზავნა', en: 'Make an Offer' },
  'offer.quickOffers': { ka: 'სწრაფი შეთავაზებები', en: 'Quick offers' },
  'offer.customPrice': { ka: 'თქვენი ფასი', en: 'Your offer price' },
  'offer.enterPrice': { ka: 'შეიყვანეთ თანხა', en: 'Enter amount' },
  'offer.minPrice': { ka: 'მინიმალური შეთავაზება: ₾{min}', en: 'Minimum offer: ₾{min}' },
  'offer.tooLow': { ka: 'შეთავაზება ძალიან დაბალია', en: 'Offer is too low' },
  'offer.send': { ka: 'შეთავაზების გაგზავნა', en: 'Send Offer' },
  'offer.sent': { ka: 'შეთავაზება გაიგზავნა', en: 'Offer Sent' },
  'offer.sentDesc': { ka: 'თქვენი შეთავაზება გაიგზავნა გამყიდველთან', en: 'Your offer has been sent to the seller' },

  // Checkout
  'checkout.title': { ka: 'გადახდა', en: 'Checkout' },
  'checkout.backToCart': { ka: 'კალათაში დაბრუნება', en: 'Back to Cart' },
  'checkout.shipping': { ka: 'მიტანა', en: 'Shipping' },
  'checkout.payment': { ka: 'გადახდა', en: 'Payment' },
  'checkout.review': { ka: 'გადახედვა', en: 'Review' },
  'checkout.shippingAddress': { ka: 'მიტანის მისამართი', en: 'Shipping Address' },
  'checkout.fullName': { ka: 'სრული სახელი', en: 'Full Name' },
  'checkout.phone': { ka: 'ტელეფონი', en: 'Phone Number' },
  'checkout.street': { ka: 'მისამართი', en: 'Street Address' },
  'checkout.city': { ka: 'ქალაქი', en: 'City' },
  'checkout.region': { ka: 'რეგიონი', en: 'Region' },
  'checkout.postalCode': { ka: 'საფოსტო კოდი', en: 'Postal Code' },
  'checkout.continueToPayment': { ka: 'გადახდაზე გადასვლა', en: 'Continue to Payment' },
  'checkout.paymentMethod': { ka: 'გადახდის მეთოდი', en: 'Payment Method' },
  'checkout.creditCard': { ka: 'საკრედიტო / სადებეტო ბარათი', en: 'Credit / Debit Card' },
  'checkout.cardTypes': { ka: 'Visa, Mastercard ან ადგილობრივი ბარათები', en: 'Visa, Mastercard, or local cards' },
  'checkout.cardNumber': { ka: 'ბარათის ნომერი', en: 'Card Number' },
  'checkout.expiryDate': { ka: 'ვადა', en: 'Expiry Date' },
  'checkout.cvv': { ka: 'CVV', en: 'CVV' },
  'checkout.nameOnCard': { ka: 'სახელი ბარათზე', en: 'Name on Card' },
  'checkout.securePayment': { ka: 'თქვენი გადახდის ინფორმაცია დაშიფრულია', en: 'Your payment information is encrypted and secure' },
  'checkout.back': { ka: 'უკან', en: 'Back' },
  'checkout.reviewOrder': { ka: 'შეკვეთის გადახედვა', en: 'Review Order' },
  'checkout.reviewYourOrder': { ka: 'შეკვეთის გადახედვა', en: 'Review Your Order' },
  'checkout.edit': { ka: 'რედაქტირება', en: 'Edit' },
  'checkout.items': { ka: 'ნივთები', en: 'Items' },
  'checkout.placeOrder': { ka: 'შეკვეთის გაფორმება', en: 'Place Order' },
  'checkout.processing': { ka: 'მუშავდება...', en: 'Processing...' },
  'checkout.orderSummary': { ka: 'შეკვეთის შეჯამება', en: 'Order Summary' },
  'checkout.itemPrice': { ka: 'ნივთის ფასი', en: 'Item Price' },
  'checkout.subtotal': { ka: 'ჯამი', en: 'Subtotal' },
  'checkout.deliveryCost': { ka: 'მიტანა', en: 'Delivery' },
  'checkout.buyerProtectionFee': { ka: 'მყიდველის დაცვის საკომისიო', en: 'Buyer Protection Fee' },
  'checkout.total': { ka: 'სულ', en: 'Total' },
  'checkout.buyerProtectionNote': { ka: 'სრული თანხის დაბრუნება თუ ნივთი არ შეესაბამება აღწერას', en: 'Full refund if not as described' },

  // Sell page
  'sell.title': { ka: 'ნივთის განთავსება', en: 'List an Item' },
  'sell.subtitle': { ka: 'შეავსეთ დეტალები თქვენი ნივთის გასაყიდად', en: 'Fill in the details below to list your item for sale' },
  'sell.photos': { ka: 'ფოტოები', en: 'Photos' },
  'sell.photosDesc': { ka: 'დაამატეთ 12-მდე ფოტო. პირველი ფოტო იქნება გარეკანი.', en: 'Add up to 12 photos. The first photo will be your cover image.' },
  'sell.addPhoto': { ka: 'ფოტოს დამატება', en: 'Add Photo' },
  'sell.cover': { ka: 'გარეკანი', en: 'Cover' },
  'sell.details': { ka: 'დეტალები', en: 'Details' },
  'sell.titleField': { ka: 'სათაური', en: 'Title' },
  'sell.titlePlaceholder': { ka: 'მაგ., Zara შავი კაბა M ზომა', en: 'e.g., Zara Black Dress Size M' },
  'sell.descriptionField': { ka: 'აღწერა', en: 'Description' },
  'sell.descriptionPlaceholder': { ka: 'აღწერეთ ნივთი: მდგომარეობა, ზომები, ნაკლოვანებები...', en: 'Describe your item: condition, measurements, any flaws...' },
  'sell.categoryAttributes': { ka: 'კატეგორია და ატრიბუტები', en: 'Category & Attributes' },
  'sell.category': { ka: 'კატეგორია', en: 'Category' },
  'sell.selectCategory': { ka: 'აირჩიეთ კატეგორია', en: 'Select category' },
  'sell.brandField': { ka: 'ბრენდი', en: 'Brand' },
  'sell.brandPlaceholder': { ka: 'მაგ., Zara, H&M, Nike', en: 'e.g., Zara, H&M, Nike' },
  'sell.sizeField': { ka: 'ზომა', en: 'Size' },
  'sell.selectSize': { ka: 'აირჩიეთ ზომა', en: 'Select size' },
  'sell.conditionField': { ka: 'მდგომარეობა', en: 'Condition' },
  'sell.selectCondition': { ka: 'აირჩიეთ მდგომარეობა', en: 'Select condition' },
  'sell.pricing': { ka: 'ფასი', en: 'Pricing' },
  'sell.price': { ka: 'ფასი (₾)', en: 'Price (₾)' },
  'sell.suggestedPrice': { ka: 'შემოთავაზებული ფასი', en: 'Suggested price' },
  'sell.basedOnSimilar': { ka: 'მსგავსი ნივთების მიხედვით', en: 'Based on similar items sold recently' },
  'sell.use': { ka: 'გამოყენება', en: 'Use' },
  'sell.youReceive': { ka: 'თქვენ მიიღებთ', en: 'You\'ll receive' },
  'sell.noCommission': { ka: '0% საკომისიო! თქვენ ინახავთ სრულ თანხას. მყიდველი იხდის მომსახურების საკომისიოს.', en: '0% commission! You keep the full amount. Buyers pay a small service fee.' },
  'sell.saveDraft': { ka: 'დრაფტის შენახვა', en: 'Save Draft' },
  'sell.publish': { ka: 'გამოქვეყნება', en: 'Publish Listing' },
  'sell.publishing': { ka: 'ქვეყნდება...', en: 'Publishing...' },

  // Search page
  'search.filters': { ka: 'ფილტრები', en: 'Filters' },
  'search.clearAll': { ka: 'ყველას გასუფთავება', en: 'Clear all' },
  'search.category': { ka: 'კატეგორია', en: 'Category' },
  'search.condition': { ka: 'მდგომარეობა', en: 'Condition' },
  'search.price': { ka: 'ფასი (₾)', en: 'Price (₾)' },
  'search.min': { ka: 'მინ', en: 'Min' },
  'search.max': { ka: 'მაქს', en: 'Max' },
  'search.itemsFound': { ka: 'ნაპოვნია {count} ნივთი', en: '{count} items found' },
  'search.for': { ka: '"{query}"-ისთვის', en: 'for "{query}"' },
  'search.showResults': { ka: '{count} შედეგის ჩვენება', en: 'Show {count} Results' },
  'search.sort.relevance': { ka: 'რელევანტურობა', en: 'Relevance' },
  'search.sort.newest': { ka: 'უახლესი', en: 'Newest First' },
  'search.sort.priceLow': { ka: 'ფასი: დაბლიდან მაღლა', en: 'Price: Low to High' },
  'search.sort.priceHigh': { ka: 'ფასი: მაღლიდან დაბლა', en: 'Price: High to Low' },
  'search.sort.popular': { ka: 'პოპულარული', en: 'Most Popular' },

  // Favorites
  'favorites.title': { ka: 'ფავორიტები', en: 'My Favorites' },
  'favorites.empty': { ka: 'ფავორიტები არ არის', en: 'No favorites yet' },
  'favorites.emptyDesc': { ka: 'შეინახეთ ნივთები რომლებიც მოგწონთ', en: 'Save items you love to find them here' },
  'favorites.browseItems': { ka: 'ნივთების ნახვა', en: 'Browse Items' },

  // Cart
  'cart.title': { ka: 'თქვენი კალათა', en: 'Your Cart' },
  'cart.empty': { ka: 'კალათა ცარიელია', en: 'Your cart is empty' },
  'cart.emptyDesc': { ka: 'დაამატეთ ნივთები თქვენს კალათაში', en: 'Add items to your cart' },
  'cart.continueShopping': { ka: 'ყიდვის გაგრძელება', en: 'Continue Shopping' },
  'cart.checkout': { ka: 'გადახდა', en: 'Proceed to Checkout' },

  // Messages
  'messages.title': { ka: 'შეტყობინებები', en: 'Messages' },
  'messages.empty': { ka: 'შეტყობინებები არ არის', en: 'No messages yet' },
  'messages.emptyDesc': { ka: 'დაიწყეთ საუბარი გამყიდველთან', en: 'Start a conversation by messaging a seller about an item' },
  'messages.browseItems': { ka: 'ნივთების ნახვა', en: 'Browse Items' },
  'messages.selectConversation': { ka: 'აირჩიეთ საუბარი', en: 'Select a conversation to start messaging' },
  'messages.typePlaceholder': { ka: 'შეიყვანეთ შეტყობინება...', en: 'Type a message...' },
  'messages.offerReceived': { ka: 'მიღებულია შეთავაზება', en: 'Offer received' },
  'messages.offerSent': { ka: 'შეთავაზება გაიგზავნა', en: 'Offer sent' },
  'messages.originalPrice': { ka: 'თავდაპირველი ფასი', en: 'Original price' },
  'messages.offeredPrice': { ka: 'შეთავაზებული ფასი', en: 'Offered price' },
  'messages.accept': { ka: 'მიღება', en: 'Accept' },
  'messages.decline': { ka: 'უარყოფა', en: 'Decline' },

  // Login
  'login.title': { ka: 'კეთილი იყოს თქვენი მობრძანება', en: 'Welcome Back' },
  'login.subtitle': { ka: 'შედით თქვენს ანგარიშზე', en: 'Sign in to your account to continue' },
  'login.email': { ka: 'ელ-ფოსტა', en: 'Email' },
  'login.password': { ka: 'პაროლი', en: 'Password' },
  'login.forgotPassword': { ka: 'დაგავიწყდათ პაროლი?', en: 'Forgot password?' },
  'login.signIn': { ka: 'შესვლა', en: 'Sign In' },
  'login.signingIn': { ka: 'შესვლა...', en: 'Signing in...' },
  'login.noAccount': { ka: 'არ გაქვთ ანგარიში?', en: 'Don\'t have an account?' },
  'login.signUp': { ka: 'რეგისტრაცია', en: 'Sign up' },
  'login.orContinueWith': { ka: 'ან გააგრძელეთ', en: 'Or continue with' },

  // Footer
  'footer.description': { ka: 'მარტივი და უსაფრთხო პლატფორმა მეორადი ნივთებისთვის საქართველოში.', en: 'A simple and secure platform for second-hand items in Georgia.' },
  'footer.buy': { ka: 'ყიდვა', en: 'Buy' },
  'footer.browseAll': { ka: 'ყველას ნახვა', en: 'Browse All' },
  'footer.sell': { ka: 'გაყიდვა', en: 'Sell' },
  'footer.startSelling': { ka: 'გაყიდვის დაწყება', en: 'Start Selling' },
  'footer.sellerGuide': { ka: 'გამყიდველის გზამკვლევი', en: 'Seller Guide' },
  'footer.shippingInfo': { ka: 'მიტანის ინფორმაცია', en: 'Shipping Info' },
  'footer.feesPricing': { ka: 'ფასები და საკომისიო', en: 'Fees & Pricing' },
  'footer.helpInfo': { ka: 'დახმარება და ინფო', en: 'Help & Info' },
  'footer.helpCenter': { ka: 'დახმარების ცენტრი', en: 'Help Center' },
  'footer.safetyTips': { ka: 'უსაფრთხოების რჩევები', en: 'Safety Tips' },
  'footer.aboutUs': { ka: 'ჩვენ შესახებ', en: 'About Us' },
  'footer.contact': { ka: 'კონტაქტი', en: 'Contact' },
  'footer.copyright': { ka: '© 2024 Twist. ყველა უფლება დაცულია.', en: '© 2024 Twist. All rights reserved.' },
  'footer.privacy': { ka: 'კონფიდენციალურობა', en: 'Privacy Policy' },
  'footer.terms': { ka: 'პირობები', en: 'Terms of Service' },

  // Seller Guide
  'sellerGuide.title': { ka: 'გამყიდველის გზამკვლევი', en: 'Seller Guide' },
  'sellerGuide.subtitle': { ka: 'გაყიდვა Twist-ზე მარტივია და უფასო', en: 'Selling on Twist is easy and free' },
  'sellerGuide.step1.title': { ka: 'გადაიღეთ ფოტოები', en: 'Snap Photos' },
  'sellerGuide.step1.desc': { ka: 'გადაიღეთ რამდენიმე ფოტო თქვენი ნივთის. კარგი განათება და მრავალი კუთხე დაგეხმარებათ უფრო სწრაფად გაყიდოთ.', en: 'Take several photos of your item. Good lighting and multiple angles help sell faster.' },
  'sellerGuide.step2.title': { ka: 'აღწერეთ და დააწესეთ ფასი', en: 'Describe & Price' },
  'sellerGuide.step2.desc': { ka: 'დაწერეთ აღწერა, აირჩიეთ კატეგორია და დააწესეთ ფასი. იყავით გულწრფელი მდგომარეობის შესახებ.', en: 'Write a description, select a category, and set your price. Be honest about condition.' },
  'sellerGuide.step3.title': { ka: 'გაყიდვისას მიიღეთ ეტიკეტი', en: 'Get a Shipping Label' },
  'sellerGuide.step3.desc': { ka: 'როცა ნივთს იყიდიან, ჩვენ გამოგიგზავნით წინასწარ გადახდილ მიტანის ეტიკეტს.', en: 'When your item sells, we\'ll send you a pre-paid shipping label automatically.' },
  'sellerGuide.step4.title': { ka: 'შეფუთეთ და დაელოდეთ კურიერს', en: 'Pack & Wait for Courier' },
  'sellerGuide.step4.desc': { ka: 'შეფუთეთ ნივთი უსაფრთხოდ. კურიერი მოვა თქვენს კართან.', en: 'Pack the item securely. Our courier will come to your door for pickup.' },
  'sellerGuide.step5.title': { ka: 'მიიღეთ 100%', en: 'Get Paid 100%' },
  'sellerGuide.step5.desc': { ka: 'როცა მყიდველი მიიღებს ნივთს, თქვენ მიიღებთ თქვენი მოთხოვნილი ფასის 100%-ს.', en: 'Once the buyer receives the item, you get 100% of your asking price.' },
  'sellerGuide.cta': { ka: 'დაიწყეთ გაყიდვა ახლავე', en: 'Start Selling Now' },

  // Shipping Info
  'shippingInfo.title': { ka: 'მიტანის ინფორმაცია', en: 'Shipping Information' },
  'shippingInfo.subtitle': { ka: 'კარიდან კარამდე მიტანა მთელ საქართველოში', en: 'Door-to-door delivery across all of Georgia' },
  'shippingInfo.howItWorks': { ka: 'როგორ მუშაობს', en: 'How it Works' },
  'shippingInfo.step1': { ka: 'ჩვენ ვიყენებთ კარიდან-კარამდე კურიერებს ყველა შეკვეთისთვის საქართველოში.', en: 'We use door-to-door couriers for all orders within Georgia.' },
  'shippingInfo.step2': { ka: 'მყიდველი იხდის მიტანის საფასურს შეკვეთის დროს.', en: 'Buyers pay the shipping cost at checkout.' },
  'shippingInfo.step3': { ka: 'გაყიდვის შემდეგ, გამყიდველი იღებს წინასწარ გადახდილ მიტანის ეტიკეტს.', en: 'After a sale, sellers receive a pre-paid shipping label.' },
  'shippingInfo.step4': { ka: 'კურიერი მოდის გამყიდველის კართან ნივთის ასაღებად.', en: 'The courier picks up the item from the seller\'s door.' },
  'shippingInfo.step5': { ka: 'თვალყურის დევნება ხელმისაწვდომია შეკვეთის დეტალებში.', en: 'Tracking is available in your Order details.' },
  'shippingInfo.deliveryTime': { ka: 'მიტანის დრო', en: 'Delivery Time' },
  'shippingInfo.deliveryTimeDesc': { ka: 'ტიპიური მიტანა იღებს 2-4 სამუშაო დღეს საქართველოში.', en: 'Typical delivery takes 2-4 business days within Georgia.' },
  'shippingInfo.shippingCost': { ka: 'მიტანის ფასი', en: 'Shipping Cost' },
  'shippingInfo.shippingCostDesc': { ka: 'მიტანის ფასი დამოკიდებულია ნივთის წონასა და დანიშნულების ადგილზე. ფასი ნაჩვენებია შეკვეთის დროს.', en: 'Shipping cost depends on item weight and destination. The price is shown at checkout.' },

  // Common
  'common.loading': { ka: 'იტვირთება...', en: 'Loading...' },
  'common.error': { ka: 'შეცდომა', en: 'Error' },
  'common.success': { ka: 'წარმატება', en: 'Success' },
  'common.cancel': { ka: 'გაუქმება', en: 'Cancel' },
  'common.save': { ka: 'შენახვა', en: 'Save' },
  'common.delete': { ka: 'წაშლა', en: 'Delete' },
  'common.remove': { ka: 'ამოშლა', en: 'Remove' },
  'common.characters': { ka: 'სიმბოლო', en: 'characters' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('twist-language');
      return (saved as Language) || 'ka';
    }
    return 'ka';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('twist-language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    let text = translation[language];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
