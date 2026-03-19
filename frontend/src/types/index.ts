export type UserRole = 'buyer' | 'seller' | 'admin' | 'courier';

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair';

export type ListingStatus = 'draft' | 'active' | 'sold' | 'archived';

export type OrderStatus = 
  | 'created' 
  | 'paid' 
  | 'pickup_scheduled' 
  | 'picked_up' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'canceled' 
  | 'refunded';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  role: UserRole;
  createdAt: Date;
}

export interface SellerProfile extends User {
  displayName: string;
  rating: number;
  numReviews: number;
  numSales: number;
  responseRate: number;
  bio?: string;
  location?: string;
  lastOnline?: Date;
  followers?: number;
  following?: number;
}

export interface Category {
  id: string;
  name: string;
  nameKa: string;
  slug: string;
  icon?: string;
  parentId?: string;
  subcategories?: Category[];
}

export interface Listing {
  id: string;
  sellerId: string;
  seller?: SellerProfile;
  title: string;
  description: string;
  price: number;
  currency: 'GEL';
  categoryId: string;
  category?: Category;
  condition: ListingCondition;
  size?: string;
  brand?: string;
  tags: string[];
  images: ListingImage[];
  status: ListingStatus;
  weightGrams?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  viewCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  order: number;
}

export interface CartItem {
  id: string;
  listing: Listing;
  addedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listing: Listing;
  totalCents: number;
  deliveryCostCents: number;
  marketplaceFeeCents: number;
  status: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  deliveryAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  body: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listing?: Listing;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface Review {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewer?: User;
  rating: number;
  text: string;
  createdAt: Date;
}
