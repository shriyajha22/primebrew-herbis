'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentUser(data.user);
        showToast('Welcome back, Admin! Access Granted.', 'success');
        router.push('/admin');
      } else {
        setErrorMsg(data.message || 'Invalid admin credentials');
        showToast(data.message || 'Access Denied', 'error');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server');
      showToast('Authentication connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-beige/50 to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-brand-mint/40">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-darkGreen text-brand-gold flex items-center justify-center shadow-soft">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-darkGreen tracking-tight">
            Admin Portal Access
          </h2>
          <p className="text-xs text-brand-brown font-medium">
            Authorized Personnel Security Portal • PrimeBrew Herbis
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-darkGreen uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@primebrewherbis.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-darkGreen uppercase tracking-wider mb-1.5">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-darkGreen"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-brand-darkGreen hover:bg-brand-green text-brand-beige font-bold text-sm rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Admin Credentials...</span>
            ) : (
              <>
                <span>Log In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-xs text-brand-brown hover:text-brand-green font-medium inline-flex items-center gap-1 transition-colors"
            >
              ← Return to Main Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
