import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/storeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import FloatingChat from '@/components/home/FloatingChat';

export const metadata: Metadata = {
  title: 'PrimeBrew Herbis | Farm to Cup Herbal Teas',
  description: 'Discover premium artisanal herbal teas sourced directly from our own farms. 100% organic, pesticide-free, and crafted for pure natural wellness.',
  keywords: ['herbal tea', 'organic tea', 'detox tea', 'sleep tea', 'immunity tea', 'farm to cup', 'Ayurvedic tea'],
  openGraph: {
    title: 'PrimeBrew Herbis | Farm to Cup Herbal Teas',
    description: 'Nature in Every Sip. 100% Organic Himalayan herbal teas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-brand-cream text-brand-charcoal antialiased min-h-screen flex flex-col justify-between selection:bg-brand-mint selection:text-brand-darkGreen">
        <StoreProvider>
          <Navbar />
          <CartDrawer />
          <ToastContainer />
          <main className="flex-1">{children}</main>
          <FloatingChat />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
