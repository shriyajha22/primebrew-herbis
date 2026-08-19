import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/storeContext';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'PrimeBrew Herbis | Farm to Cup Herbal Teas',
  description: 'Discover premium artisanal herbal teas sourced directly from trusted farming networks across Karnataka. 100% organic, pesticide-free, and crafted for pure natural wellness.',
  keywords: ['herbal tea', 'organic tea', 'detox tea', 'sleep tea', 'immunity tea', 'farm to cup', 'Karnataka herbal tea', 'PrimeBrew Herbis'],
  metadataBase: new URL('https://primebrew-herbis.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'PrimeBrew Herbis | Farm to Cup Herbal Teas',
    description: 'Farm to Cup. Nature in Every Sip. 100% Organic artisanal herbal teas.',
    url: 'https://primebrew-herbis.vercel.app',
    siteName: 'PrimeBrew Herbis',
    images: [
      {
        url: '/images/logo_opaque.png',
        width: 1731,
        height: 502,
        alt: 'PrimeBrew Herbis Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrimeBrew Herbis | Farm to Cup Herbal Teas',
    description: 'Farm to Cup. Nature in Every Sip.',
    images: ['/images/logo_opaque.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PrimeBrew Herbis',
    url: 'https://primebrew-herbis.vercel.app',
    logo: 'https://primebrew-herbis.vercel.app/images/logo.png',
    image: 'https://primebrew-herbis.vercel.app/images/logo.png',
    description: 'Farm to Cup. Nature in Every Sip. Premium artisanal herbal teas sourced directly from trusted farms in Karnataka.',
    email: 'Contact.primebrew@gmail.com',
    sameAs: ['https://instagram.com/primebrew_herbis'],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-cream text-brand-charcoal antialiased min-h-screen flex flex-col justify-between selection:bg-brand-mint selection:text-brand-darkGreen">
        <StoreProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
