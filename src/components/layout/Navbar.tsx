'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Search, ShoppingBag, Heart, User, Menu, X, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/storeContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, currentUser, isCartOpen, setIsCartOpen, loginAsDemoCustomer, loginAsDemoAdmin, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Tea Benefits', href: '/tea-benefits' },
    { name: 'About Us', href: '/about' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-brand-darkGreen text-brand-beige text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
        <span>🌿 Farm Fresh Harvest Season: Use code <strong className="text-brand-gold">HERBAL15</strong> for 15% OFF + Free Express Shipping above ₹799</span>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 glass-navbar shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-card bg-brand-green flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-brand-gold fill-brand-gold/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl sm:text-2xl text-brand-darkGreen tracking-tight leading-none">
                  PrimeBrew <span className="text-brand-green font-normal">Herbis</span>
                </span>
                <span className="text-[10px] text-brand-brown tracking-widest font-semibold uppercase mt-0.5">
                  Farm to Cup • Nature in Every Sip
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-brand-green relative py-1 ${
                      isActive ? 'text-brand-green font-semibold' : 'text-brand-charcoal'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Live Search Trigger */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-brand-charcoal hover:text-brand-green hover:bg-brand-beige rounded-button transition-colors"
                aria-label="Search Teas"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/dashboard?tab=wishlist"
                className="p-2 text-brand-charcoal hover:text-brand-green hover:bg-brand-beige rounded-button transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-white font-bold text-[10px] w-4 h-4 rounded-badge flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 bg-brand-green hover:bg-brand-darkGreen text-white rounded-button shadow-soft transition-all duration-300 flex items-center gap-2 group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-badge">
                  {totalCartCount}
                </span>
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-button text-brand-charcoal hover:bg-brand-beige transition-colors"
                >
                  <div className="w-8 h-8 rounded-badge bg-brand-mint/40 text-brand-darkGreen flex items-center justify-center font-bold text-xs border border-brand-green/30">
                    {currentUser ? currentUser.name.charAt(0) : <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-card border border-brand-mint/30 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {currentUser ? (
                      <div>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-brand-darkGreen">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-badge bg-brand-mint/40 text-brand-darkGreen capitalize">
                            Role: {currentUser.role}
                          </span>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-beige"
                        >
                          Customer Dashboard
                        </Link>
                        {currentUser.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-brand-green font-semibold hover:bg-brand-beige"
                          >
                            ⚡ Admin Control Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-3 py-2 text-xs font-semibold text-brand-darkGreen bg-brand-beige hover:bg-brand-mint/30 rounded-button text-center transition-colors"
                        >
                          Customer Account / Sign In
                        </Link>
                        <Link
                          href="/admin/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-3 py-2 text-xs font-semibold text-brand-brown hover:text-brand-darkGreen hover:bg-gray-50 rounded-button text-center transition-colors border border-gray-100"
                        >
                          🔒 Admin Portal Login
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-brand-charcoal hover:bg-brand-beige rounded-button"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-cream border-b border-brand-mint/30 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-brand-charcoal hover:text-brand-green py-2 px-3 rounded-button hover:bg-brand-beige"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Interactive Production-Ready Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
}
