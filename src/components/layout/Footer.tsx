'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, Mail, ShieldCheck, Truck, RefreshCw, Award, Instagram, Facebook, Twitter, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 15% discount voucher.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-darkGreen text-brand-beige pt-16 pb-12 border-t border-brand-green/30">
      {/* Brand Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-card bg-white/5 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-heading font-semibold text-white text-sm">100% Organic & Pure</h4>
            <p className="text-xs text-brand-mint/80 mt-1">Direct farm harvest without synthetic pesticides</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-card bg-white/5 backdrop-blur-sm border border-white/10">
            <Truck className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-heading font-semibold text-white text-sm">Express Pan-India Shipping</h4>
            <p className="text-xs text-brand-mint/80 mt-1">Free express delivery on orders above ₹799</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-card bg-white/5 backdrop-blur-sm border border-white/10">
            <RefreshCw className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-heading font-semibold text-white text-sm">Fresh Batch Guarantee</h4>
            <p className="text-xs text-brand-mint/80 mt-1">Small batch roasted & packed under 7 days</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-card bg-brand-gold flex items-center justify-center text-brand-darkGreen font-bold shadow-gold">
                <Leaf className="w-6 h-6 fill-brand-darkGreen" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                PrimeBrew <span className="text-brand-gold">Herbis</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-brand-mint/90 max-w-sm">
              Farm to Cup. Nature in Every Sip. We source artisanal herbal teas directly from trusted farming networks across Karnataka to deliver pure wellness, unmatched aroma, and zero-chemical vitality.
            </p>

            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/primebrew.herbis"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-darkGreen text-white text-xs font-semibold px-3.5 py-2 rounded-badge transition-all"
            >
              <Instagram className="w-4 h-4 text-brand-gold group-hover:text-brand-darkGreen" />
              <span>Follow & Chat @primebrew.herbis on Instagram</span>
            </a>
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Join Our Tea Circle & Get 15% OFF</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border border-brand-mint/30 rounded-input px-3.5 py-2 text-xs text-white placeholder-brand-mint/60 focus:outline-none focus:border-brand-gold flex-1"
                />
                <button
                  type="submit"
                  className="bg-brand-gold text-brand-darkGreen font-semibold text-xs px-4 py-2 rounded-button hover:bg-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-brand-gold mt-1.5 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Welcome to PrimeBrew Herbis!
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 border-b border-brand-gold/40 pb-1.5 inline-block">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-mint/80">
              <li><Link href="/shop?category=detox-tea" className="hover:text-brand-gold transition-colors">Detox Tea</Link></li>
              <li><Link href="/shop?category=sleep-tea" className="hover:text-brand-gold transition-colors">Sleep & Relaxation</Link></li>
              <li><Link href="/shop?category=immunity-tea" className="hover:text-brand-gold transition-colors">Immunity Boosters</Link></li>
              <li><Link href="/shop?category=weight-loss-tea" className="hover:text-brand-gold transition-colors">Weight Loss & Oolong</Link></li>
              <li><Link href="/shop?category=stress-relief-tea" className="hover:text-brand-gold transition-colors">Stress Relief & Adaptogens</Link></li>
              <li><Link href="/shop?category=womens-wellness-tea" className="hover:text-brand-gold transition-colors">Women&apos;s Wellness</Link></li>
              <li><Link href="/shop?category=gift-boxes" className="hover:text-brand-gold transition-colors">Luxury Gift Boxes</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-brand-gold transition-colors">Teapots & Infusers</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 border-b border-brand-gold/40 pb-1.5 inline-block">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-mint/80">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">Farm to Cup Story</Link></li>
              <li><Link href="/tea-benefits" className="hover:text-brand-gold transition-colors">Tea Health Benefits</Link></li>
              <li><Link href="/blogs" className="hover:text-brand-gold transition-colors">Herbal Recipes & Articles</Link></li>
              <li><Link href="/faq" className="hover:text-brand-gold transition-colors">Frequently Asked Questions (FAQ)</Link></li>
              <li><Link href="/track-order" className="hover:text-brand-gold transition-colors">Track Order Status</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-gold transition-colors">My Customer Account</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal & Policies Info */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 border-b border-brand-gold/40 pb-1.5 inline-block">
              Policies & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-mint/80">
              <li><Link href="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-brand-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-brand-gold transition-colors">Refund & Cancellation</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and payment icons */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-mint/70">
          <p>© {new Date().getFullYear()} PrimeBrew Herbis. All rights reserved. Crafted with care from Farm to Cup.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold">Secure Payment via</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[11px] text-white">Razorpay</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[11px] text-white">Stripe</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[11px] text-white">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
