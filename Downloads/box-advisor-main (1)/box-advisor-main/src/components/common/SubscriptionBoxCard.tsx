import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import { SubscriptionBox } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SubscriptionBoxCardProps {
  box: SubscriptionBox;
  showCompareButton?: boolean;
  isInComparison?: boolean;
  onAddToComparison?: (box: SubscriptionBox) => void;
  onRemoveFromComparison?: (boxId: string) => void;
}

export default function SubscriptionBoxCard({
  box,
  showCompareButton = false,
  isInComparison = false,
  onAddToComparison,
  onRemoveFromComparison,
}: SubscriptionBoxCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInComparison && onRemoveFromComparison) {
      onRemoveFromComparison(box.id);
    } else if (!isInComparison && onAddToComparison) {
      onAddToComparison(box);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card-subscription group relative">
      <Link to={`/boxes/${box.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl mb-4 bg-muted aspect-video">
          <img
            src={box.imageUrl}
            alt={box.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-accent-light animate-pulse" />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="tag-category">
              {box.category}
            </Badge>
          </div>

          {/* Compare Button */}
          {showCompareButton && (
            <div className="absolute top-3 right-3">
              <Button
                size="sm"
                variant={isInComparison ? "default" : "secondary"}
                onClick={handleCompareClick}
                className={`rounded-full ${
                  isInComparison 
                    ? 'bg-accent hover:bg-accent-hover text-accent-foreground' 
                    : 'bg-white/90 hover:bg-white text-foreground'
                }`}
              >
                {isInComparison ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {box.name}
            </h3>
            <div className="price-display">${box.price}</div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {box.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(box.averageRating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {box.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({box.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Features Preview */}
          <div className="flex flex-wrap gap-1">
            {box.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
              >
                {feature}
              </span>
            ))}
            {box.features.length > 2 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{box.features.length - 2} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}