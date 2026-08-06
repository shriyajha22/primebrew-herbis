'use client';

import React from 'react';
import Image from 'next/image';
import FarmToCupStory from '@/components/home/FarmToCupStory';
import { ShieldCheck, Mountain, Heart, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 bg-brand-cream min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-mint/30 px-3.5 py-1.5 rounded-badge">
            Our Root Purpose
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-darkGreen">
            Farm to Cup. Nature in Every Sip.
          </h1>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            PrimeBrew Herbis was founded to bridge the gap between traditional herbal farmers across Karnataka and conscious wellness seekers.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-card border border-brand-mint/30 shadow-card space-y-3">
            <div className="w-12 h-12 bg-brand-mint/30 text-brand-green rounded-button flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Our Mission</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              To deliver premium herbal teas sourced directly from trusted bio-farms while promoting a healthier lifestyle through natural wellness, ethical trade, and environmental stewardship.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-brand-mint/30 shadow-card space-y-3">
            <div className="w-12 h-12 bg-brand-gold/20 text-brand-darkGreen rounded-button flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Our Vision</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Become India’s most trusted farm-to-cup herbal tea brand by combining artisanal quality, sustainable recyclable packaging, and Ayurvedic innovation.
            </p>
          </div>
        </div>

        {/* Story Component */}
        <FarmToCupStory />

        {/* Certifications */}
        <div className="bg-brand-darkGreen text-white p-10 rounded-card shadow-premium space-y-6 text-center mt-16">
          <h2 className="font-heading font-bold text-2xl text-white">Our Quality & Sustainability Promise</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-brand-beige">
            <div className="p-4 bg-white/10 rounded-card border border-white/10">
              <ShieldCheck className="w-8 h-8 text-brand-gold mx-auto mb-2" />
              <h4 className="font-bold text-white">100% USDA Organic</h4>
            </div>
            <div className="p-4 bg-white/10 rounded-card border border-white/10">
              <Heart className="w-8 h-8 text-brand-gold mx-auto mb-2" />
              <h4 className="font-bold text-white">Direct Farmer Trade</h4>
            </div>
            <div className="p-4 bg-white/10 rounded-card border border-white/10">
              <Award className="w-8 h-8 text-brand-gold mx-auto mb-2" />
              <h4 className="font-bold text-white">FSSAI Certified</h4>
            </div>
            <div className="p-4 bg-white/10 rounded-card border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-brand-gold mx-auto mb-2" />
              <h4 className="font-bold text-white">Zero Chemicals</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
