export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SubscriptionBox {
  id: string;
  name: string;
  category: Category;
  price: number;
  customization: string;
  imageUrl: string;
  description: string;
  features: string[];
  createdAt: string;
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  boxId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export type Category = 'Streaming' | 'Music' | 'Gaming' | 'News' | 'Fitness' | 'Education' | 'Cloud Storage' | 'Productivity' | 'Social Media' | 'E-commerce';

export interface ComparisonState {
  selectedBoxes: SubscriptionBox[];
  maxBoxes: number;
}

export interface FilterState {
  category: Category | 'All';
  priceRange: [number, number];
  minRating: number;
  searchQuery: string;
}