'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginAsDemoCustomer, setCurrentUser, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setCurrentUser({
      _id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'customer',
      addresses: [
        {
          fullName: email.split('@')[0],
          phone: '+91 9876543210',
          email,
          street: '42 Tea Plantation Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      ],
      wishlist: [],
      walletBalance: 250,
    });

    showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-beige via-white to-brand-mint/20">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-card border border-brand-mint/50 space-y-8 z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-green text-white flex items-center justify-center mx-auto shadow-md">
            <User className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-darkGreen">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Sign in to access your tea wallet, order history, and saved wishlist.
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        <button
          type="button"
          onClick={() => {
            loginAsDemoCustomer();
            router.push('/dashboard');
          }}
          className="w-full py-3 px-4 bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/50 rounded-2xl text-brand-darkGreen text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-darkGreen" />
          <span>⚡ Instant Demo Login (Ananya Sharma)</span>
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-brand-darkGreen uppercase">Password</label>
              <Link href="/forgot-password" className="text-brand-green font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-brand-green focus:ring-brand-green"
            />
            <label htmlFor="remember" className="text-gray-600 font-medium">Remember me on this browser</label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>Sign In to Customer Account</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-brand-mint/30 text-center text-xs">
          <p className="text-gray-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-brand-green font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
