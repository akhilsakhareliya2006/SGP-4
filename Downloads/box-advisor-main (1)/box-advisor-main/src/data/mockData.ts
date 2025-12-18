import { SubscriptionBox, Review, User } from '../types';
import gourmetKitchenImage from '../assets/gourmet-kitchen-box.jpg';
import literaryAdventuresImage from '../assets/literary-adventures-box.jpg';
import beautyEssentialsImage from '../assets/beauty-essentials-box.jpg';
import fitlifeGearImage from '../assets/fitlife-gear-box.jpg';
import techInnovatorsImage from '../assets/tech-innovators-box.jpg';
import mindfulLivingImage from '../assets/mindful-living-box.jpg';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    createdAt: '2024-02-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    createdAt: '2024-03-10T09:45:00Z',
  },
];

export const mockSubscriptionBoxes: SubscriptionBox[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'Streaming',
    price: 15.49,
    customization: 'Multiple plans, device preferences',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Netflix_2015_logo.svg',
    description: 'Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime.',
    features: ['4K Ultra HD', 'Multiple devices', 'Download offline', 'No ads'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.7,
    reviewCount: 2847,
  },
  {
    id: '2',
    name: 'Disney+ Hotstar',
    category: 'Streaming',
    price: 8.25,
    customization: 'Regional content, language preferences',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Disney%2B_Hotstar_logo.svg',
    description: 'Disney, Marvel, Star Wars, and local content in one platform',
    features: ['Live sports', 'Regional content', 'Multiple languages', 'Kids content'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.5,
    reviewCount: 1923,
  },
  {
    id: '3',
    name: 'Amazon Prime Video',
    category: 'Streaming',
    price: 12.99,
    customization: 'Prime membership benefits',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
    description: 'Watch movies, TV shows, and original content with Prime membership',
    features: ['Prime delivery', 'Music included', 'Original content', 'Multiple devices'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.6,
    reviewCount: 2156,
  },
  {
    id: '4',
    name: 'Spotify Premium',
    category: 'Music',
    price: 9.99,
    customization: 'Individual, Family, or Student plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    description: 'Music streaming with ad-free listening and offline downloads',
    features: ['Ad-free music', 'Offline downloads', 'High quality audio', 'Podcasts'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.8,
    reviewCount: 3456,
  },
  {
    id: '5',
    name: 'YouTube Premium',
    category: 'Streaming',
    price: 11.99,
    customization: 'Individual or Family plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    description: 'Ad-free YouTube with background play and offline downloads',
    features: ['Ad-free videos', 'Background play', 'Offline downloads', 'YouTube Music'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.4,
    reviewCount: 1876,
  },
  {
    id: '6',
    name: 'Apple Music',
    category: 'Music',
    price: 10.99,
    customization: 'Individual, Family, or Student plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Apple_Music_logo.svg',
    description: 'Stream millions of songs with high-quality audio and exclusive content',
    features: ['Lossless audio', 'Spatial audio', 'Exclusive content', 'Siri integration'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.6,
    reviewCount: 2234,
  },
  {
    id: '7',
    name: 'Xbox Game Pass',
    category: 'Gaming',
    price: 14.99,
    customization: 'PC or Console plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_game_pass_logo.svg',
    description: 'Access to hundreds of games with new titles added regularly',
    features: ['Hundreds of games', 'New releases', 'Cloud gaming', 'EA Play included'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.7,
    reviewCount: 1456,
  },
  {
    id: '8',
    name: 'PlayStation Plus',
    category: 'Gaming',
    price: 9.99,
    customization: 'Essential, Extra, or Premium tiers',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    description: 'Online multiplayer, monthly games, and exclusive discounts',
    features: ['Online multiplayer', 'Monthly games', 'Exclusive discounts', 'Cloud saves'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.5,
    reviewCount: 1987,
  },
  {
    id: '9',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    price: 22.99,
    customization: 'Individual or Team plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    description: 'Complete suite of creative tools for designers and content creators',
    features: ['All Adobe apps', 'Cloud storage', 'Collaboration tools', 'Regular updates'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.3,
    reviewCount: 1234,
  },
  {
    id: '10',
    name: 'Microsoft 365',
    category: 'Productivity',
    price: 6.99,
    customization: 'Personal or Family plans',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    description: 'Office apps, cloud storage, and collaboration tools',
    features: ['Office apps', '1TB OneDrive', 'Skype minutes', 'Advanced security'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.4,
    reviewCount: 2567,
  },
  {
    id: '11',
    name: 'iCloud+',
    category: 'Cloud Storage',
    price: 2.99,
    customization: 'Storage size options',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Apple_iCloud_logo.svg',
    description: 'Secure cloud storage with privacy features and device sync',
    features: ['End-to-end encryption', 'Device sync', 'Hide My Email', 'Private Relay'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.2,
    reviewCount: 987,
  },
  {
    id: '12',
    name: 'LinkedIn Premium',
    category: 'Social Media',
    price: 29.99,
    customization: 'Career, Business, or Sales Navigator',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    description: 'Professional networking with advanced features and insights',
    features: ['InMail messages', 'Advanced search', 'Learning courses', 'Insights'],
    createdAt: '2024-01-01T00:00:00Z',
    averageRating: 4.1,
    reviewCount: 654,
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    boxId: '1',
    rating: 5,
    comment: 'Netflix has the best original content and the interface is so user-friendly. Worth every penny!',
    createdAt: '2024-03-15T18:30:00Z',
    user: { name: 'Alice Johnson' },
  },
  {
    id: '2',
    userId: '2',
    boxId: '1',
    rating: 4,
    comment: 'Great content library but the price keeps increasing. Still good value though.',
    createdAt: '2024-03-10T12:45:00Z',
    user: { name: 'Bob Smith' },
  },
  {
    id: '3',
    userId: '3',
    boxId: '2',
    rating: 5,
    comment: 'Disney+ Hotstar is perfect for families. Great mix of Disney classics and local content!',
    createdAt: '2024-03-08T09:20:00Z',
    user: { name: 'Carol Davis' },
  },
  {
    id: '4',
    userId: '1',
    boxId: '4',
    rating: 5,
    comment: 'Spotify Premium is amazing! The music discovery features and offline downloads are game-changers.',
    createdAt: '2024-03-05T14:15:00Z',
    user: { name: 'Alice Johnson' },
  },
  {
    id: '5',
    userId: '2',
    boxId: '7',
    rating: 5,
    comment: 'Xbox Game Pass is incredible value. So many great games and new releases added regularly!',
    createdAt: '2024-03-01T16:40:00Z',
    user: { name: 'Bob Smith' },
  },
  {
    id: '6',
    userId: '3',
    boxId: '3',
    rating: 4,
    comment: 'Amazon Prime Video is good, especially with the Prime delivery benefits. Original content is hit or miss.',
    createdAt: '2024-02-28T11:30:00Z',
    user: { name: 'Carol Davis' },
  },
  {
    id: '7',
    userId: '1',
    boxId: '9',
    rating: 4,
    comment: 'Adobe Creative Cloud is essential for designers. Expensive but worth it for professional work.',
    createdAt: '2024-02-25T09:15:00Z',
    user: { name: 'Alice Johnson' },
  },
  {
    id: '8',
    userId: '2',
    boxId: '10',
    rating: 5,
    comment: 'Microsoft 365 is perfect for work and personal use. OneDrive integration is seamless.',
    createdAt: '2024-02-20T14:22:00Z',
    user: { name: 'Bob Smith' },
  },
];

// Helper functions for data manipulation
export const getBoxesByCategory = (category: string) => {
  if (category === 'All') return mockSubscriptionBoxes;
  return mockSubscriptionBoxes.filter(box => box.category === category);
};

export const getReviewsForBox = (boxId: string) => {
  return mockReviews.filter(review => review.boxId === boxId);
};

export const getTopRatedBoxes = (limit: number = 5) => {
  return [...mockSubscriptionBoxes]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
};

export const getCategoryDistribution = () => {
  const distribution: Record<string, number> = {};
  mockSubscriptionBoxes.forEach(box => {
    distribution[box.category] = (distribution[box.category] || 0) + 1;
  });
  return Object.entries(distribution).map(([category, count]) => ({
    category,
    count,
  }));
};