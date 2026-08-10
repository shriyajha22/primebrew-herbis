'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function ForgotPasswordPage() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);
    showToast(`Password reset link sent to ${email}`, 'success');
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-beige via-white to-brand-mint/20">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-card border border-brand-mint/50 space-y-6 z-10">
        
        {/* Back Link */}
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>

        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="PrimeBrew Herbis Logo"
              width={180}
              height={52}
              priority
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-brand-darkGreen">
            Reset Password
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Enter your registered email address and we will send you a secure verification link.
          </p>
        </div>

        {submitted ? (
          <div className="bg-sky-50 border border-sky-200 p-6 rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-sm text-sky-900">Check Your Email Inbox</h3>
            <p className="text-xs text-sky-700 font-light leading-relaxed">
              We sent a password reset link to <strong className="font-bold">{email}</strong>. Please click the link inside to set a new password.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-brand-darkGreen hover:underline pt-2 inline-block"
            >
              Didn&apos;t receive email? Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-brand-darkGreen uppercase mb-1">Your Registered Email</label>
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

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4 text-brand-gold" />
              <span>Send Reset Instructions</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
