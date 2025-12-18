import { Star, TrendingUp, Users, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardStats } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { mockSubscriptionBoxes, getCategoryDistribution } from '@/data/mockData';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error loading dashboard</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const {
    stats,
    topRatedBoxes,
    categoryDistribution,
    recentReviews
  } = data || {};

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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

  const categoryData = getCategoryDistribution();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Insights and analytics for subscription box performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Boxes</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalBoxes || 0}</p>
                </div>
                <div className="bg-primary-light p-3 rounded-xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-accent mr-1" />
                <span className="text-sm text-accent font-medium">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                  <p className="text-3xl font-bold text-foreground">${(stats?.averagePrice || 0).toFixed(2)}</p>
                </div>
                <div className="bg-accent-light p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-muted-foreground">Per month subscription</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalReviews || 0}</p>
                </div>
                <div className="bg-primary-light p-3 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-muted-foreground">Across all boxes</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold text-foreground">{(stats?.averageRating || 0).toFixed(1)}</p>
                </div>
                <div className="bg-accent-light p-3 rounded-xl">
                  <Star className="h-6 w-6 text-accent fill-current" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex items-center space-x-1">
                  {renderStars(stats?.averageRating || 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Rated Boxes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span>Top Rated Boxes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(topRatedBoxes || []).map((box, index) => (
                  <div 
                    key={box.id} 
                    className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-primary flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{box.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(box.averageRating)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {box.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({box.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <Badge className="tag-category">
                      {box.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution || []}
                    dataKey="count"
                    nameKey="category"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {(categoryDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Price Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Analysis by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData.map(item => ({
                  ...item,
                  averagePrice: mockSubscriptionBoxes
                    .filter(box => box.category === item.category)
                    .reduce((sum, box) => sum + box.price, 0) / 
                    mockSubscriptionBoxes.filter(box => box.category === item.category).length
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Average Price']} />
                <Bar dataKey="averagePrice" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentReviews || []).map((review, index) => (
                  <div 
                    key={review.id} 
                    className="flex items-start space-x-4 p-4 border border-border rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {review.user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground">{review.user.name}</span>
                        <span className="text-muted-foreground">reviewed</span>
                        <span className="font-medium text-foreground">{review.boxName}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}