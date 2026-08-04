'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { initialBlogs } from '@/lib/seedData';
import { Search, ArrowRight, Tag } from 'lucide-react';

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredBlogs = selectedCategory
    ? initialBlogs.filter((b) => b.category === selectedCategory)
    : initialBlogs;

  return (
    <div className="py-16 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
            Herbal Knowledge & Recipes
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-darkGreen">
            The PrimeBrew Journal
          </h1>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            Explore articles on tea brewing rituals, Ayurvedic adaptogens, mocktail recipes, and natural wellness tips.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['', 'Tea Knowledge', 'Tea Recipes', 'Health Tips', 'Lifestyle'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-button transition-colors ${
                selectedCategory === cat ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-brand-beige border border-gray-200'
              }`}
            >
              {cat || 'All Articles'}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
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
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{blog.publishDate}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-brand-darkGreen group-hover:text-brand-green transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 text-xs font-bold text-brand-green flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
