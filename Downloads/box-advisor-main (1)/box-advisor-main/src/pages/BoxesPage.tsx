import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import SubscriptionBoxCard from '@/components/common/SubscriptionBoxCard';
import { SubscriptionBox, Category, FilterState, ComparisonState } from '@/types';
import { useBoxes } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoxesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [comparisonState, setComparisonState] = useState<ComparisonState>({
    selectedBoxes: [],
    maxBoxes: 3,
  });

  const [filters, setFilters] = useState<FilterState>({
    category: (searchParams.get('category') as Category) || 'All',
    priceRange: [0, 100],
    minRating: 0,
    searchQuery: '',
  });

  const categories: (Category | 'All')[] = ['All', 'Food', 'Books', 'Beauty', 'Fitness', 'Tech', 'Lifestyle'];

  const { data, loading, error } = useBoxes({
    category: filters.category !== 'All' ? filters.category : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    minRating: filters.minRating,
    search: filters.searchQuery || undefined,
  });

  const filteredBoxes = data?.boxes || [];

  const handleAddToComparison = (box: SubscriptionBox) => {
    if (comparisonState.selectedBoxes.length < comparisonState.maxBoxes) {
      setComparisonState(prev => ({
        ...prev,
        selectedBoxes: [...prev.selectedBoxes, box],
      }));
    }
  };

  const handleRemoveFromComparison = (boxId: string) => {
    setComparisonState(prev => ({
      ...prev,
      selectedBoxes: prev.selectedBoxes.filter(box => box.id !== boxId),
    }));
  };

  const clearComparison = () => {
    setComparisonState(prev => ({ ...prev, selectedBoxes: [] }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      priceRange: [0, 100],
      minRating: 0,
      searchQuery: '',
    });
    setSearchParams({});
  };

  useEffect(() => {
    const category = searchParams.get('category') as Category;
    if (category && categories.includes(category)) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            All Subscription Boxes
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and compare subscription boxes across all categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-card">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search subscription boxes..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="pl-10 py-3 text-lg rounded-xl"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(filters).some(value => 
                (typeof value === 'string' && value !== 'All' && value !== '') ||
                (Array.isArray(value) && (value[0] !== 0 || value[1] !== 100)) ||
                (typeof value === 'number' && value !== 0)
              ) && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredBoxes.length} boxes found`}
              </span>
              {Object.values(filters).some(value => 
                (typeof value === 'string' && value !== 'All' && value !== '') ||
                (Array.isArray(value) && (value[0] !== 0 || value[1] !== 100)) ||
                (typeof value === 'number' && value !== 0)
              ) && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/50 rounded-xl animate-fade-in">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value as Category | 'All' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum Rating: {filters.minRating} stars
                </label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                  max={5}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Comparison Bar */}
        {comparisonState.selectedBoxes.length > 0 && (
          <div className="bg-accent-light border border-accent rounded-2xl p-4 mb-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-accent-foreground">
                  Comparing {comparisonState.selectedBoxes.length} of {comparisonState.maxBoxes} boxes
                </span>
                <div className="flex space-x-2">
                  {comparisonState.selectedBoxes.map(box => (
                    <Badge key={box.id} variant="secondary">
                      {box.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => window.open('/compare', '_blank')}
                  disabled={comparisonState.selectedBoxes.length < 2}
                  className="bg-accent hover:bg-accent-hover text-accent-foreground"
                >
                  Compare Now
                </Button>
                <Button variant="outline" size="sm" onClick={clearComparison}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card-subscription p-6">
                <Skeleton className="w-full h-48 mb-4 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center space-x-2 mb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-destructive mb-4">Error: {error}</div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : filteredBoxes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBoxes.map((box, index) => (
              <div 
                key={box.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SubscriptionBoxCard
                  box={box}
                  showCompareButton
                  isInComparison={comparisonState.selectedBoxes.some(b => b.id === box.id)}
                  onAddToComparison={handleAddToComparison}
                  onRemoveFromComparison={handleRemoveFromComparison}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No boxes found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}