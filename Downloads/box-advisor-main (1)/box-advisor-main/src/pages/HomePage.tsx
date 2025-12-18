import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubscriptionBoxCard from '@/components/common/SubscriptionBoxCard';
import { mockSubscriptionBoxes, getTopRatedBoxes } from '@/data/mockData';

export default function HomePage() {
  const featuredBoxes = getTopRatedBoxes(3);
  const categories = ['Streaming', 'Music', 'Gaming', 'Productivity', 'Cloud Storage', 'Social Media'];

  const features = [
    {
      icon: Star,
      title: 'Curated Reviews',
      description: 'Real user reviews and ratings to help you make informed decisions',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of users sharing their subscription experiences',
    },
    {
      icon: Zap,
      title: 'Smart Comparison',
      description: 'Compare features, prices, and benefits side by side',
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Verified reviews and transparent pricing information',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Find Your Perfect
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Subscription Service
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Compare, review, and discover the best OTT platforms, streaming services, and subscription apps. 
              Make informed decisions with real user insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/boxes">
                <Button className="btn-hero">
                  Explore All Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/compare">
                <Button className="btn-hero-outline">
                  Start Comparing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SubCompare?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make finding the perfect subscription service simple, transparent, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="text-center group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover subscription boxes across all your favorite categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category}
                to={`/boxes?category=${category}`}
                className="group"
              >
                <div className="card-subscription text-center p-6 h-32 flex flex-col justify-center animate-scale-in"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockSubscriptionBoxes.filter(box => box.category === category).length} boxes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boxes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Top Rated Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the highest-rated subscription services loved by our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBoxes.map((box, index) => (
              <div 
                key={box.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <SubscriptionBoxCard box={box} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/boxes">
              <Button className="btn-hero-outline">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who've found their ideal subscription services through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/boxes">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-2xl font-semibold text-lg">
                Start Exploring
              </Button>
            </Link>
            <Link to="/compare">
              <Button className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-semibold text-lg">
                Compare Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}