// Default FAQ data for seeding
export const defaultFaqs = [
  // BUYING
  {
    question_ka: 'როგორ ვიყიდო ნივთი Twist-ზე?',
    question_en: 'How do I buy an item on Twist?',
    answer_ka: 'ნივთის შესაძენად: 1) აირჩიეთ სასურველი ნივთი 2) დააწკაპუნეთ "ყიდვა" ღილაკს 3) მიუთითეთ მიტანის მისამართი 4) გადაიხადეთ ბარათით. თანხა დაცულად ინახება სანამ ნივთს მიიღებთ.',
    answer_en: 'To buy an item: 1) Select the item you want 2) Click "Buy" button 3) Enter delivery address 4) Pay with card. Money is held safely until you receive the item.',
    category: 'buying',
    tags: ['ყიდვა', 'შეძენა', 'გადახდა'],
    priority: 10,
  },
  {
    question_ka: 'როგორ გავაკეთო ფასის შეთავაზება?',
    question_en: 'How do I make a price offer?',
    answer_ka: 'ნივთის გვერდზე დააწკაპუნეთ "შეთავაზება" ღილაკს. შეგიძლიათ აირჩიოთ სწრაფი შეთავაზება (-10%, -20%, -30%) ან მიუთითოთ თქვენი ფასი. გამყიდველი მიიღებს შეტყობინებას და 48 საათის განმავლობაში უპასუხებს.',
    answer_en: 'Click the "Make Offer" button on the item page. You can choose quick offers (-10%, -20%, -30%) or enter your own price. The seller will receive a notification and respond within 48 hours.',
    category: 'buying',
    tags: ['შეთავაზება', 'ფასი', 'მოლაპარაკება'],
    priority: 8,
  },
  {
    question_ka: 'რა არის მყიდველის დაცვა?',
    question_en: 'What is Buyer Protection?',
    answer_ka: 'მყიდველის დაცვა გარანტიას გაძლევთ, რომ თანხას მიიღებთ უკან თუ: ნივთი არ მივიდა, ნივთი განსხვავდება აღწერილობისგან, ან გამყიდველმა გააუქმა შეკვეთა. გადახდისას ემატება მცირე საკომისიო (5% + 0.50₾).',
    answer_en: 'Buyer Protection guarantees you get your money back if: item doesn\'t arrive, item differs from description, or seller cancels the order. A small fee (5% + 0.50₾) is added at checkout.',
    category: 'buying',
    tags: ['დაცვა', 'გარანტია', 'თანხის დაბრუნება'],
    priority: 9,
  },

  // SELLING
  {
    question_ka: 'როგორ ავტვირთო ნივთი გასაყიდად?',
    question_en: 'How do I list an item for sale?',
    answer_ka: 'დააწკაპუნეთ "გაყიდე" ღილაკს, ატვირთეთ ფოტოები, დაწერეთ სათაური და აღწერა, მიუთითეთ ფასი და კატეგორია. ატვირთვა უფასოა და რამდენიმე წუთი სჭირდება!',
    answer_en: 'Click "Sell" button, upload photos, write title and description, set price and category. Listing is free and takes just a few minutes!',
    category: 'selling',
    tags: ['გაყიდვა', 'ატვირთვა', 'განცხადება'],
    priority: 10,
  },
  {
    question_ka: 'რა კომისიას იღებს Twist?',
    question_en: 'What commission does Twist take?',
    answer_ka: 'გამყიდველებისთვის Twist-ი სრულიად უფასოა - 0% კომისია! თქვენ იღებთ ნივთის სრულ ფასს. მხოლოდ მყიდველი იხდის მცირე დაცვის საკომისიოს.',
    answer_en: 'For sellers, Twist is completely free - 0% commission! You receive the full price of your item. Only the buyer pays a small protection fee.',
    category: 'selling',
    tags: ['კომისია', 'საკომისიო', 'ფასი'],
    priority: 9,
  },
  {
    question_ka: 'როდის მივიღებ თანხას გაყიდვის შემდეგ?',
    question_en: 'When do I receive money after selling?',
    answer_ka: 'თანხა ავტომატურად ჩაირიცხება თქვენს ანგარიშზე ნივთის წარმატებით ჩაბარებიდან 24 საათში. თუ მყიდველმა დაადასტურა მიღება, თანხა უფრო სწრაფად მოვა.',
    answer_en: 'Money is automatically transferred to your account within 24 hours of successful delivery. If the buyer confirms receipt, money arrives even faster.',
    category: 'selling',
    tags: ['თანხა', 'გადარიცხვა', 'ანგარიში'],
    priority: 8,
  },

  // PAYMENTS
  {
    question_ka: 'რა გადახდის მეთოდები არის ხელმისაწვდომი?',
    question_en: 'What payment methods are available?',
    answer_ka: 'ამჟამად მხარდაჭერილია მხოლოდ ბარათით გადახდა (Visa, Mastercard). მომავალში დაემატება Apple Pay და Google Pay.',
    answer_en: 'Currently only card payments are supported (Visa, Mastercard). Apple Pay and Google Pay will be added in the future.',
    category: 'payments',
    tags: ['გადახდა', 'ბარათი', 'visa', 'mastercard'],
    priority: 8,
  },
  {
    question_ka: 'არის თუ არა გადახდა უსაფრთხო?',
    question_en: 'Is the payment secure?',
    answer_ka: 'დიახ! ყველა გადახდა დაშიფრულია და დაცულია. თანხა ინახება დაცულ ანგარიშზე (escrow) სანამ ნივთს მიიღებთ. ბარათის მონაცემები არ ინახება ჩვენს სერვერებზე.',
    answer_en: 'Yes! All payments are encrypted and secure. Money is held in a secure escrow account until you receive the item. Card details are not stored on our servers.',
    category: 'payments',
    tags: ['უსაფრთხოება', 'დაშიფვრა', 'escrow'],
    priority: 9,
  },

  // DELIVERY
  {
    question_ka: 'როგორ მუშაობს მიტანის სერვისი?',
    question_en: 'How does the delivery service work?',
    answer_ka: 'შეკვეთის შემდეგ კურიერი ჩამოვა გამყიდველთან ნივთის წასაღებად და მოგიტანთ მითითებულ მისამართზე. მიტანა ხდება 1-3 დღეში თბილისში.',
    answer_en: 'After ordering, a courier will pick up the item from the seller and deliver it to your address. Delivery takes 1-3 days in Tbilisi.',
    category: 'delivery',
    tags: ['მიტანა', 'კურიერი', 'დრო'],
    priority: 8,
  },
  {
    question_ka: 'რა ღირს მიტანა?',
    question_en: 'How much does delivery cost?',
    answer_ka: 'მიტანის საფასური დამოკიდებულია ნივთის ზომასა და წონაზე. საშუალო ფასი თბილისში 5-10₾. ერთი გამყიდველისგან რამდენიმე ნივთის შეძენისას მიტანა ერთხელ იხდება!',
    answer_en: 'Delivery cost depends on item size and weight. Average price in Tbilisi is 5-10₾. When buying multiple items from one seller, delivery is paid only once!',
    category: 'delivery',
    tags: ['მიტანის ფასი', 'ტარიფი'],
    priority: 7,
  },
  {
    question_ka: 'როგორ ვაკონტროლო ჩემი შეკვეთის სტატუსი?',
    question_en: 'How do I track my order status?',
    answer_ka: 'შეკვეთის სტატუსი ხილულია თქვენს პროფილში "შეკვეთები" განყოფილებაში. ასევე მიიღებთ SMS შეტყობინებებს სტატუსის ცვლილებისას.',
    answer_en: 'Order status is visible in your profile under "Orders" section. You will also receive SMS notifications when the status changes.',
    category: 'delivery',
    tags: ['თვალყური', 'სტატუსი', 'შეკვეთა'],
    priority: 6,
  },

  // SAFETY
  {
    question_ka: 'როგორ დავრწმუნდე გამყიდველის სანდოობაში?',
    question_en: 'How can I verify seller reliability?',
    answer_ka: 'შეამოწმეთ გამყიდველის: პროფილის შევსება, შეფასებები სხვა მყიდველებისგან, პირადობის ვერიფიკაციის სტატუსი (✓ ნიშანი). უპირატესობა მიანიჭეთ ვერიფიცირებულ გამყიდველებს.',
    answer_en: 'Check the seller\'s: profile completeness, reviews from other buyers, identity verification status (✓ badge). Prefer verified sellers.',
    category: 'safety',
    tags: ['სანდოობა', 'ვერიფიკაცია', 'შეფასება'],
    priority: 8,
  },
  {
    question_ka: 'რა ვქნა თუ თაღლითობის მსხვერპლი გავხდი?',
    question_en: 'What should I do if I was scammed?',
    answer_ka: 'დაუყოვნებლივ დაგვიკავშირდით! გახსენით დავა "შეკვეთები" განყოფილებაში ან მოგვწერეთ Twistingsocials@gmail.com-ზე. მყიდველის დაცვა გარანტიას გაძლევთ თანხის დაბრუნებას.',
    answer_en: 'Contact us immediately! Open a dispute in the "Orders" section or email us at Twistingsocials@gmail.com. Buyer Protection guarantees your money back.',
    category: 'safety',
    tags: ['თაღლითობა', 'დავა', 'დახმარება'],
    priority: 10,
  },

  // ACCOUNT
  {
    question_ka: 'როგორ შევცვალო პაროლი?',
    question_en: 'How do I change my password?',
    answer_ka: 'გადადით პროფილში → პარამეტრები → უსაფრთხოება → პაროლის შეცვლა. ან გამოიყენეთ "დამავიწყდა პაროლი" ლოგინის გვერდზე.',
    answer_en: 'Go to Profile → Settings → Security → Change Password. Or use "Forgot Password" on the login page.',
    category: 'account',
    tags: ['პაროლი', 'შეცვლა', 'უსაფრთხოება'],
    priority: 5,
  },
  {
    question_ka: 'როგორ წავშალო ჩემი ანგარიში?',
    question_en: 'How do I delete my account?',
    answer_ka: 'ანგარიშის წასაშლელად მოგვწერეთ Twistingsocials@gmail.com-ზე. გაითვალისწინეთ, რომ აქტიური შეკვეთების ან განცხადებების არსებობისას წაშლა შეუძლებელია.',
    answer_en: 'To delete your account, email us at Twistingsocials@gmail.com. Note that deletion is not possible if you have active orders or listings.',
    category: 'account',
    tags: ['ანგარიში', 'წაშლა', 'პროფილი'],
    priority: 3,
  },

  // GENERAL
  {
    question_ka: 'რა არის Twist?',
    question_en: 'What is Twist?',
    answer_ka: 'Twist არის საქართველოს პირველი უსაფრთხო მარკეტფლეისი მეორეული ნივთების ყიდვა-გაყიდვისთვის. ჩვენ გთავაზობთ უსაფრთხო გადახდებს, კურიერით მიტანას და მყიდველის დაცვას.',
    answer_en: 'Twist is Georgia\'s first secure marketplace for buying and selling secondhand items. We offer secure payments, courier delivery, and buyer protection.',
    category: 'general',
    tags: ['twist', 'მარკეტფლეისი', 'შესახებ'],
    priority: 10,
  },
];

export const faqCategories = [
  { id: 'general', icon: '📚', nameKa: 'ზოგადი', nameEn: 'General' },
  { id: 'buying', icon: '🛒', nameKa: 'ყიდვა', nameEn: 'Buying' },
  { id: 'selling', icon: '💰', nameKa: 'გაყიდვა', nameEn: 'Selling' },
  { id: 'payments', icon: '💳', nameKa: 'გადახდები', nameEn: 'Payments' },
  { id: 'delivery', icon: '🚚', nameKa: 'მიტანა', nameEn: 'Delivery' },
  { id: 'safety', icon: '🛡️', nameKa: 'უსაფრთხოება', nameEn: 'Safety' },
  { id: 'account', icon: '👤', nameKa: 'ანგარიში', nameEn: 'Account' },
];
