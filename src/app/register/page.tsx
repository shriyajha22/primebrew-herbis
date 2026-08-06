'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    if (!acceptTerms) {
      showToast('Please accept the Terms & Privacy Policy to register.', 'error');
      return;
    }

    setCurrentUser({
      _id: `usr-${Date.now()}`,
      name: fullName,
      email,
      role: 'customer',
      addresses: [
        {
          fullName,
          phone: phone || '+91 9876543210',
          email,
          street: '12 Organic Wellness Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
      ],
      wishlist: [],
      walletBalance: 250,
    });

    showToast(`Welcome to PrimeBrew Herbis, ${fullName}! ₹250 signup bonus added.`, 'success');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-beige via-white to-brand-mint/20">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-card border border-brand-mint/50 space-y-6 z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-darkGreen text-brand-gold flex items-center justify-center mx-auto shadow-md">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-darkGreen">
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Join the PrimeBrew Tea Circle and receive ₹250 instant cashback balance.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-brand-darkGreen uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ananya Sharma"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-brand-mint/30 focus:bg-white focus:border-brand-green outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-darkGreen uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-brand-mint/30 focus:bg-white focus:border-brand-green outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-darkGreen uppercase mb-1">Mobile Phone (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-brand-mint/30 focus:bg-white focus:border-brand-green outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-darkGreen uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-brand-cream/40 border border-brand-mint/30 focus:bg-white focus:border-brand-green outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-darkGreen"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded text-brand-green focus:ring-brand-green"
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600 font-medium leading-tight">
              I agree to the PrimeBrew Herbis{' '}
              <Link href="/terms" className="text-brand-green font-bold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-brand-green font-bold hover:underline">
                Privacy Policy
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-green hover:bg-brand-darkGreen text-white font-bold text-xs rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>Create Account & Claim ₹250 Wallet Bonus</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-brand-mint/30 text-center text-xs">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-green font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
