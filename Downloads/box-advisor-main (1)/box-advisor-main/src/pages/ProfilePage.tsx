import { useState } from 'react';
import { User, Mail, Calendar, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserReviews();
      setUserReviews(data.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your profile</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleEditReview = (reviewId: string) => {
    setEditingReview(reviewId);
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await apiService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchUserReviews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete review');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {user.name}
                </h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {userReviews.length}
              </div>
              <p className="text-muted-foreground">Reviews Written</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {userReviews.length > 0 
                  ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <p className="text-muted-foreground">Average Rating Given</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {new Set(userReviews.map(review => review.boxId)).size}
              </div>
              <p className="text-muted-foreground">Boxes Reviewed</p>
            </CardContent>
          </Card>
        </div>

        {/* My Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Reviews</span>
              <Badge variant="secondary">
                {userReviews.length} reviews
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div>
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-destructive mb-4">Error: {error}</div>
                <Button onClick={fetchUserReviews}>
                  Try Again
                </Button>
              </div>
            ) : userReviews.length > 0 ? (
              <div className="space-y-6">
                {userReviews.map((review, index) => {
                  return (
                    <div 
                      key={review.id} 
                      className="border border-border rounded-lg p-6 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {review.box && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={review.box.imageUrl}
                                alt={review.box.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {review.box?.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="font-medium text-foreground">
                                {review.rating}.0
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditReview(review.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                      
                      {review.box && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <Badge className="tag-category">
                            {review.box.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ${review.box.price}/month
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No reviews yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring subscription boxes and share your experiences with the community
                </p>
                <Link to="/boxes">
                  <Button className="btn-hero">
                    Browse Subscription Boxes
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}