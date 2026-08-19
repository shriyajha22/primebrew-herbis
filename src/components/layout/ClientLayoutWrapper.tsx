'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import FloatingChat from '@/components/home/FloatingChat';
import ActivityTracker from '@/components/layout/ActivityTracker';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-between">
        <ToastContainer />
        <div className="flex-1 w-full">{children}</div>
      </div>
    );
  }

  return (
    <>
      <ActivityTracker />
      <Navbar />
      <CartDrawer />
      <ToastContainer />
      <main className="flex-1">{children}</main>
      <FloatingChat />
      <Footer />
    </>
  );
}
