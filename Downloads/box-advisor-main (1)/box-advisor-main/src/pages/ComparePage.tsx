import { useState } from 'react';
import { Plus, X, Star, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSubscriptionBoxes } from '@/data/mockData';
import { SubscriptionBox } from '@/types';

export default function ComparePage() {
  const [selectedBoxes, setSelectedBoxes] = useState<(SubscriptionBox | null)[]>([null, null, null]);
  const maxBoxes = 3;

  const availableBoxes = mockSubscriptionBoxes.filter(
    box => !selectedBoxes.some(selected => selected?.id === box.id)
  );

  const addBox = (box: SubscriptionBox, index: number) => {
    const newSelectedBoxes = [...selectedBoxes];
    newSelectedBoxes[index] = box;
    setSelectedBoxes(newSelectedBoxes);
  };

  const removeBox = (index: number) => {
    const newSelectedBoxes = [...selectedBoxes];
    newSelectedBoxes[index] = null;
    setSelectedBoxes(newSelectedBoxes);
  };

  const clearAll = () => {
    setSelectedBoxes([null, null, null]);
  };

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

  const getLowestPrice = () => {
    const prices = selectedBoxes
      .filter(box => box !== null)
      .map(box => box!.price);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const getHighestRating = () => {
    const ratings = selectedBoxes
      .filter(box => box !== null)
      .map(box => box!.averageRating);
    return ratings.length > 0 ? Math.max(...ratings) : null;
  };

  const lowestPrice = getLowestPrice();
  const highestRating = getHighestRating();

  const comparisonFeatures = [
    'Monthly Price',
    'Average Rating',
    'Review Count', 
    'Customization',
    'Category',
    'Features'
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Compare Subscription Boxes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select up to {maxBoxes} subscription boxes to compare their features, pricing, and reviews side by side
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-muted-foreground">
            {selectedBoxes.filter(box => box !== null).length} of {maxBoxes} boxes selected
          </div>
          {selectedBoxes.some(box => box !== null) && (
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedBoxes.map((box, index) => (
            <Card key={index} className="relative">
              {box ? (
                <>
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                    onClick={() => removeBox(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Box Content */}
                  <div className="p-6">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-xl mb-4 bg-muted aspect-video">
                      <img
                        src={box.imageUrl}
                        alt={box.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="tag-category">
                          {box.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Title and Price */}
                    <h3 className="font-bold text-xl text-foreground mb-2">
                      {box.name}
                    </h3>
                    <div className={`text-2xl font-bold mb-4 ${
                      lowestPrice === box.price ? 'text-accent' : ''
                    }`}>
                      ${box.price}/month
                      {lowestPrice === box.price && (
                        <Badge className="ml-2 bg-accent text-accent-foreground">
                          Best Price
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className={`flex items-center space-x-2 mb-4 ${
                      highestRating === box.averageRating ? 'text-accent' : ''
                    }`}>
                      <div className="flex items-center space-x-1">
                        {renderStars(box.averageRating)}
                      </div>
                      <span className="font-semibold">
                        {box.averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({box.reviewCount})
                      </span>
                      {highestRating === box.averageRating && (
                        <Badge className="bg-accent text-accent-foreground">
                          Top Rated
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4">
                      {box.description}
                    </p>

                    {/* Customization */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Customization</h4>
                      <p className="text-sm text-muted-foreground">
                        {box.customization}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-2">Features</h4>
                      <div className="space-y-1">
                        {box.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-accent" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full btn-hero">
                      Subscribe Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                /* Empty Slot */
                <div className="p-6 h-96 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Add a Box to Compare
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Select a subscription box to add to this comparison slot
                  </p>
                  
                  <Select onValueChange={(value) => {
                    const selectedBox = mockSubscriptionBoxes.find(box => box.id === value);
                    if (selectedBox) addBox(selectedBox, index);
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a box..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBoxes.map(box => (
                        <SelectItem key={box.id} value={box.id}>
                          {box.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Comparison Table (when 2+ boxes selected) */}
        {selectedBoxes.filter(box => box !== null).length >= 2 && (
          <Card className="mt-12 animate-fade-in">
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Feature
                      </th>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <th key={index} className="text-left py-3 px-4 font-semibold text-foreground">
                            {box.name}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">Monthly Price</td>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <td key={index} className={`py-3 px-4 ${
                            lowestPrice === box.price ? 'text-accent font-bold' : 'text-foreground'
                          }`}>
                            ${box.price}
                            {lowestPrice === box.price && (
                              <Badge className="ml-2 bg-accent text-accent-foreground text-xs">
                                Cheapest
                              </Badge>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">Average Rating</td>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <td key={index} className={`py-3 px-4 ${
                            highestRating === box.averageRating ? 'text-accent font-bold' : 'text-foreground'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(box.averageRating)}
                              </div>
                              <span>{box.averageRating.toFixed(1)}</span>
                            </div>
                            {highestRating === box.averageRating && (
                              <Badge className="mt-1 bg-accent text-accent-foreground text-xs">
                                Highest Rated
                              </Badge>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">Review Count</td>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <td key={index} className="py-3 px-4 text-foreground">
                            {box.reviewCount} reviews
                          </td>
                        )
                      )}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">Category</td>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <td key={index} className="py-3 px-4">
                            <Badge className="tag-category">
                              {box.category}
                            </Badge>
                          </td>
                        )
                      )}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Customization</td>
                      {selectedBoxes.map((box, index) => 
                        box && (
                          <td key={index} className="py-3 px-4 text-muted-foreground">
                            {box.customization}
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {selectedBoxes.filter(box => box !== null).length === 0 && (
          <div className="text-center py-16">
            <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Your Comparison
            </h3>
            <p className="text-muted-foreground mb-6">
              Add subscription boxes to compare their features, pricing, and reviews
            </p>
            <Button className="btn-hero-outline">
              Browse All Boxes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}