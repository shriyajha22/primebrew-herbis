'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSlider from '@/components/home/HeroSlider';
import FarmToCupStory from '@/components/home/FarmToCupStory';
import BenefitsSection from '@/components/home/BenefitsSection';
import ProductCard from '@/components/shop/ProductCard';
import { initialCategories, initialProducts, initialBlogs } from '@/lib/seedData';
import { ArrowRight, Star, ShieldCheck, Package, Truck, Leaf, Sparkles, Heart, Instagram } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'blue' | 'wellness'>('all');

  const displayedProducts = initialProducts.filter((p) => {
    if (activeTab === 'blue') return p.category === 'blue-tea';
    if (activeTab === 'wellness') return p.category === 'wellness-tea' || p.category === 'ayurvedic-tea';
    return true;
  });

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSlider />

      {/* Categories Showcase Grid */}
      <section className="py-14 bg-white border-b border-brand-mint/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3 py-1 rounded-badge">
                Curated Herbal Collections
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-darkGreen mt-2">
                Shop by Wellness Goal
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-brand-green hover:text-brand-darkGreen flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All 3 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-card p-6 border border-brand-mint/30 shadow-card hover:shadow-premium hover:border-brand-green transition-all duration-300 flex items-center gap-5"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-brand-bgLight shadow-soft group-hover:scale-105 transition-transform">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-brand-darkGreen group-hover:text-brand-green transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="text-[11px] font-bold text-brand-green mt-2 block">
                    {cat.itemCount} Teas Available →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Tabbed Section */}
      <section className="py-16 bg-brand-bgSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
              Farm Fresh Selection
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] text-brand-darkGreen">
              Our 5 Bestselling Herbal Teas
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every box contains exactly 30 Tea Bags of 100% organic botanicals, high-altitude green teas, and ancient Ayurvedic remedies.
            </p>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-bold px-5 py-2.5 rounded-button transition-all ${
                  activeTab === 'all'
                    ? 'btn-primary-gradient shadow-soft'
                    : 'bg-white text-brand-darkGrey hover:bg-brand-bgLight border border-gray-200'
                }`}
              >
                🌿 All Teas (5)
              </button>
              <button
                onClick={() => setActiveTab('blue')}
                className={`text-xs font-bold px-5 py-2.5 rounded-button transition-all ${
                  activeTab === 'blue'
                    ? 'btn-primary-gradient shadow-soft'
                    : 'bg-white text-brand-darkGrey hover:bg-brand-bgLight border border-gray-200'
                }`}
              >
                🍵 Blue Teas (3)
              </button>
              <button
                onClick={() => setActiveTab('wellness')}
                className={`text-xs font-bold px-5 py-2.5 rounded-button transition-all ${
                  activeTab === 'wellness'
                    ? 'btn-primary-gradient shadow-soft'
                    : 'bg-white text-brand-darkGrey hover:bg-brand-bgLight border border-gray-200'
                }`}
              >
                ✨ Wellness & Ayur (2)
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs px-8 py-4 rounded-button shadow-premium transition-all duration-300 hover:scale-105"
            >
              <span>Explore All 5 Herbal Teas</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Farm to Cup Story */}
      <FarmToCupStory />

      {/* Benefits Grid */}
      <BenefitsSection />

      {/* Why Choose PrimeBrew Herbis & Our Commitment */}
      <section className="py-16 bg-brand-cardWhite border-y border-brand-mint/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
              Why Choose PrimeBrew Herbis
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-darkGreen">
              Our Commitment to Pure Herbal Quality
            </h2>
            <p className="text-xs sm:text-sm text-brand-mediumGrey leading-relaxed font-light">
              We partner directly with trusted farming networks across Karnataka to bring you 100% natural, additive-free botanical infusions.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-brand-bgBeige p-6 rounded-card border border-brand-mint/30 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-sm text-brand-darkGreen">100% Natural Botanicals</h3>
              <p className="text-xs text-brand-mediumGrey font-light leading-relaxed">
                Zero artificial flavors, synthetic colors, or preservatives. Only pure dried flowers, roots & spices.
              </p>
            </div>

            <div className="bg-brand-bgBeige p-6 rounded-card border border-brand-mint/30 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-sm text-brand-darkGreen">Lab Checked Quality</h3>
              <p className="text-xs text-brand-mediumGrey font-light leading-relaxed">
                Every micro-batch is tested for heavy metals, pesticides, and essential oil aroma purity.
              </p>
            </div>

            <div className="bg-brand-bgBeige p-6 rounded-card border border-brand-mint/30 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-sm text-brand-darkGreen">Small-Batch Packaging</h3>
              <p className="text-xs text-brand-mediumGrey font-light leading-relaxed">
                Hand-packed in airtight, eco-friendly tin canisters to preserve fragile volatile oils.
              </p>
            </div>

            <div className="bg-brand-bgBeige p-6 rounded-card border border-brand-mint/30 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-sm text-brand-darkGreen">Fast Pan-India Shipping</h3>
              <p className="text-xs text-brand-mediumGrey font-light leading-relaxed">
                Free express courier shipping across India on orders above ₹799 with real-time tracking.
              </p>
            </div>
          </div>

          {/* Modest Realistic Startup Metrics Bar */}
          <div className="bg-brand-darkGreen text-white rounded-card p-6 sm:p-8 shadow-premium grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold block">10+</span>
              <span className="text-xs text-brand-mint/90 font-medium">Curated Herbal Blends</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold block">500+</span>
              <span className="text-xs text-brand-mint/90 font-medium">Orders Fulfilled</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold block">100+</span>
              <span className="text-xs text-brand-mint/90 font-medium">Happy Customers</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold block">100%</span>
              <span className="text-xs text-brand-mint/90 font-medium">Single-Estate Sourced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
                Tea Wisdom & Articles
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-darkGreen mt-2">
                Knowledge & Recipes
              </h2>
            </div>
            <Link href="/blogs" className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1">
              Read All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="group bg-white rounded-card overflow-hidden border border-brand-mint/30 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-brand-beige">
                    <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-brand-darkGreen text-brand-gold text-[10px] font-bold px-2.5 py-1 rounded-badge">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{blog.publishDate}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-brand-darkGreen group-hover:text-brand-green transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 font-light leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 text-xs font-bold text-brand-green flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid Showcase */}
      <section className="py-14 bg-white border-t border-brand-mint/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-brand-green">
            <Instagram className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Follow @primebrew_herbis</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-brand-darkGreen">
            Join Our Instagram Tea Community
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Tag #PrimeBrewHerbis in your daily tea rituals for a chance to be featured!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
            {[
              "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80",
            ].map((img, i) => (
              <div key={i} className="relative aspect-square rounded-card overflow-hidden group cursor-pointer">
                <Image src={img} alt="Instagram Tea Post" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
