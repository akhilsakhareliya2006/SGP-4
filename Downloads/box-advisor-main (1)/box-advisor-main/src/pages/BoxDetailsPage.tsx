import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Check, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/types';
import { useBox, useBoxReviews } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoxDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const { data: boxData, loading: boxLoading, error: boxError } = useBox(id || '');
  const { data: reviewsData, loading: reviewsLoading, error: reviewsError, refetch: refetchReviews } = useBoxReviews(id || '');

  const box = boxData?.box;
  const reviews = reviewsData?.reviews || [];

  if (boxLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-video rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (boxError || !box) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {boxError || 'Box not found'}
          </h1>
          <Link to="/boxes">
            <Button>Back to All Boxes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive && onStarClick ? () => onStarClick(i + 1) : undefined}
      />
    ));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please sign in to write a review');
      return;
    }

    if (!id) return;

    setIsSubmitting(true);
    try {
      await apiService.createReview({
        boxId: id,
        rating: newReview.rating,
        comment: newReview.comment || undefined,
      });
      
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      refetchReviews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/boxes" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Boxes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-muted aspect-video">
              <img
                src={box.imageUrl}
                alt={box.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="tag-category">
                  {box.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {box.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {box.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(box.averageRating)}
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {box.averageRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({box.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="price-display text-4xl mb-2">
                  ${box.price}
                </div>
                <p className="text-muted-foreground">per month</p>
              </div>

              {/* Customization */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Customization Options</h3>
                <p className="text-muted-foreground">{box.customization}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button className="btn-hero flex-1">
                  Subscribe Now
                </Button>
                <Button variant="outline" className="flex-1">
                  Add to Compare
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {box.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Reviews ({reviews.length})
            </h2>
            <Button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Review</span>
            </Button>
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Review
                  </label>
                  <Textarea
                    placeholder="Share your experience with this subscription box..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reviewsError ? (
              <div className="text-center py-12">
                <div className="text-destructive mb-4">Error loading reviews: {reviewsError}</div>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Card key={review.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {review.user.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No reviews yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your experience with this subscription box
                </p>
                {user ? (
                  <Button onClick={() => setShowReviewForm(true)}>
                    Write First Review
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button>
                      Sign In to Write Review
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}