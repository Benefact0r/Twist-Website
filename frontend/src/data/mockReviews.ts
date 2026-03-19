// Mock reviews for demo sellers - Georgian-focused data
// This is seed/mock data for demo purposes only

export interface MockReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  sellerId: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export const mockReviews: MockReview[] = [
  // Reviews for Anna K. (seller-1)
  {
    id: 'review-1',
    reviewerId: 'buyer-1',
    reviewerName: 'ნინო გ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    sellerId: 'seller-1',
    rating: 5,
    text: 'შესანიშნავი გამყიდველი! ნივთი ზუსტად ისეთი იყო როგორც სურათზე. სწრაფი მიწოდება.',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'review-2',
    reviewerId: 'buyer-2',
    reviewerName: 'გიორგი მ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    sellerId: 'seller-1',
    rating: 5,
    text: 'ძალიან კმაყოფილი ვარ. კარგი კომუნიკაცია და სწრაფი მიწოდება.',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'review-3',
    reviewerId: 'buyer-3',
    reviewerName: 'მარიამ დ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    sellerId: 'seller-1',
    rating: 4,
    text: 'კარგი ხარისხი, რეკომენდაციას ვუწევ.',
    createdAt: new Date('2024-11-28'),
  },
  {
    id: 'review-4',
    reviewerId: 'buyer-4',
    reviewerName: 'ლუკა ბ.',
    reviewerAvatar: null,
    sellerId: 'seller-1',
    rating: 5,
    text: 'საუკეთესო გამყიდველი! უკვე მეორედ ვყიდულობ.',
    createdAt: new Date('2024-11-20'),
  },

  // Reviews for Giorgi M. (seller-2)
  {
    id: 'review-5',
    reviewerId: 'buyer-5',
    reviewerName: 'ანა კ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    sellerId: 'seller-2',
    rating: 5,
    text: 'ვინტაჟ ნივთები უნიკალურია! გირჩევთ ყველას.',
    createdAt: new Date('2024-12-12'),
  },
  {
    id: 'review-6',
    reviewerId: 'buyer-6',
    reviewerName: 'დათო ს.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    sellerId: 'seller-2',
    rating: 4,
    text: 'კარგი სერვისი, მიწოდება ცოტა დაგვიანდა მაგრამ ნივთი შესანიშნავია.',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'review-7',
    reviewerId: 'buyer-7',
    reviewerName: 'სალომე თ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    sellerId: 'seller-2',
    rating: 5,
    text: 'ძალიან კარგი კომუნიკაცია და სწრაფი პასუხი.',
    createdAt: new Date('2024-11-30'),
  },

  // Reviews for Nino T. (seller-3)
  {
    id: 'review-8',
    reviewerId: 'buyer-8',
    reviewerName: 'თამარ ნ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop',
    sellerId: 'seller-3',
    rating: 5,
    text: 'დიზაინერ ჩანთა იდეალურ მდგომარეობაში იყო! მადლობა!',
    createdAt: new Date('2024-12-18'),
  },
  {
    id: 'review-9',
    reviewerId: 'buyer-9',
    reviewerName: 'ელენე კ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
    sellerId: 'seller-3',
    rating: 5,
    text: 'საუკეთესო! ნამდვილად პრემიუმ ხარისხი.',
    createdAt: new Date('2024-12-08'),
  },
  {
    id: 'review-10',
    reviewerId: 'buyer-10',
    reviewerName: 'ნათია გ.',
    reviewerAvatar: null,
    sellerId: 'seller-3',
    rating: 5,
    text: 'ყველაფერი სრულყოფილი იყო. მადლობა!',
    createdAt: new Date('2024-11-25'),
  },

  // Reviews for Dato B. (seller-4)
  {
    id: 'review-11',
    reviewerId: 'buyer-11',
    reviewerName: 'ზურა მ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    sellerId: 'seller-4',
    rating: 5,
    text: 'iPhone კარგ ფასად ვიყიდე. მუშაობს იდეალურად.',
    createdAt: new Date('2024-12-16'),
  },
  {
    id: 'review-12',
    reviewerId: 'buyer-12',
    reviewerName: 'ვახო ლ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    sellerId: 'seller-4',
    rating: 4,
    text: 'კარგი ტექნიკაა, რეკომენდირებულია.',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'review-13',
    reviewerId: 'buyer-13',
    reviewerName: 'ნიკა ჯ.',
    reviewerAvatar: null,
    sellerId: 'seller-4',
    rating: 5,
    text: 'პროფესიონალური მიდგომა, კარგი ფასი.',
    createdAt: new Date('2024-11-22'),
  },

  // Reviews for Mari S. (seller-5)
  {
    id: 'review-14',
    reviewerId: 'buyer-14',
    reviewerName: 'ეკა შ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    sellerId: 'seller-5',
    rating: 5,
    text: 'საბავშვო ტანსაცმელი შესანიშნავ მდგომარეობაში იყო!',
    createdAt: new Date('2024-12-14'),
  },
  {
    id: 'review-15',
    reviewerId: 'buyer-15',
    reviewerName: 'ნანა კ.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    sellerId: 'seller-5',
    rating: 5,
    text: 'დედა ბავშვის საჭიროებებს კარგად იცნობს. მადლობა!',
    createdAt: new Date('2024-12-03'),
  },
  {
    id: 'review-16',
    reviewerId: 'buyer-16',
    reviewerName: 'თინა ბ.',
    reviewerAvatar: null,
    sellerId: 'seller-5',
    rating: 4,
    text: 'კარგი ნივთები კარგ ფასად.',
    createdAt: new Date('2024-11-18'),
  },
];

export function getReviewsForSeller(sellerId: string): MockReview[] {
  return mockReviews.filter(r => r.sellerId === sellerId);
}

export function getAverageRating(sellerId: string): { average: number; count: number } {
  const reviews = getReviewsForSeller(sellerId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}
