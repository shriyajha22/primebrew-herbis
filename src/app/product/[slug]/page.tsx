'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import BrewingGuideModal from '@/components/shop/BrewingGuideModal';
import { initialProducts, initialReviews } from '@/lib/seedData';
import { useStore } from '@/lib/storeContext';
import { Star, Heart, ShoppingBag, Timer, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronRight, Share2, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = initialProducts.find((p) => p.slug === slug || p._id === slug);

  if (!product) {
    return notFound();
  }

  const { addToCart, toggleWishlist, isInWishlist, showToast } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weightVariants?.[0]?.weight || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'benefits' | 'brewing' | 'nutrition' | 'reviews'>('ingredients');
  const [showBrewingGuide, setShowBrewingGuide] = useState(false);

  // New review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(initialReviews.filter((r) => r.productId === product._id || true));

  const selectedVariant = product.weightVariants?.find((v) => v.weight === selectedWeight);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const isWishlisted = isInWishlist(product._id);

  const relatedProducts = initialProducts.filter((p) => p._id !== product._id).slice(0, 4);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev = {
      _id: `rev-${Date.now()}`,
      productId: product._id,
      userName: reviewName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: reviewRating,
      title: reviewTitle || 'Great Herbal Blend',
      comment: reviewComment,
      date: 'Just now',
      verifiedBuyer: true,
      helpfulCount: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    showToast('Thank you! Your customer review has been published.', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-brand-green">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/shop" className="hover:text-brand-green">Shop</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-green">{product.categoryName}</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-semibold text-brand-darkGreen truncate">{product.name}</span>
        </nav>

        {/* Main Product Specs Card */}
        <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-image overflow-hidden bg-brand-beige border border-brand-mint/20 shadow-soft">
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-brand-gold text-brand-darkGreen font-bold text-xs px-3 py-1 rounded-badge shadow-gold">
                  {product.discountPercentage}% OFF
                </span>
              )}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-brand-darkGreen backdrop-blur-sm transition-colors shadow-soft"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-card overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === idx ? 'border-brand-green scale-105 shadow-soft' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Buy Information */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-brand-mint/30 text-brand-darkGreen text-xs font-bold px-3 py-1 rounded-badge uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <span className="text-xs text-gray-500 font-medium">Origin: {product.origin}</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-darkGreen leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                {product.subtitle}
              </p>

              {/* Rating Summary */}
              <div className="flex items-center gap-3 text-xs pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-brand-darkGreen">{product.rating} / 5.0</span>
                <span className="text-gray-400">({product.reviewCount} customer reviews)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-badge text-[11px]">
                  In Stock ({product.stock} units left)
                </span>
              </div>

              {/* Price & Savings */}
              <div className="bg-brand-beige/60 p-4 rounded-card border border-brand-mint/30 flex items-baseline gap-3">
                <span className="font-heading font-extrabold text-3xl text-brand-green">
                  ₹{currentPrice}
                </span>
                {currentMrp > currentPrice && (
                  <span className="text-base text-gray-400 line-through">₹{currentMrp}</span>
                )}
                <span className="text-xs font-bold text-emerald-700">
                  Save ₹{currentMrp - currentPrice} ({product.discountPercentage}%)
                </span>
              </div>

              {/* Size / Weight Variants */}
              {product.weightVariants && product.weightVariants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-darkGreen uppercase tracking-wider block">
                    Choose Packaging / Net Weight:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.weightVariants.map((v) => (
                      <button
                        key={v.weight}
                        onClick={() => setSelectedWeight(v.weight)}
                        className={`p-3 rounded-button border text-left text-xs transition-all ${
                          selectedWeight === v.weight
                            ? 'border-brand-green bg-brand-green text-white font-bold shadow-soft'
                            : 'border-gray-200 bg-white text-brand-charcoal hover:border-brand-green'
                        }`}
                      >
                        <div className="truncate">{v.weight}</div>
                        <div className="text-[11px] opacity-90 mt-0.5">₹{v.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-brand-darkGreen uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-button bg-brand-beige">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-xs text-brand-darkGreen font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-darkGreen">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-xs text-brand-darkGreen font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product, selectedWeight, quantity)}
                  className="flex-1 bg-brand-green hover:bg-brand-darkGreen text-white font-bold text-sm py-4 rounded-button shadow-soft flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                  Add to Cart • ₹{currentPrice * quantity}
                </button>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`p-4 rounded-button border transition-colors ${
                    isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-gray-500 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => setShowBrewingGuide(true)}
                className="w-full bg-brand-beige hover:bg-brand-mint/20 text-brand-darkGreen font-bold text-xs py-3 rounded-button border border-brand-mint/40 flex items-center justify-center gap-2 transition-colors"
              >
                <Timer className="w-4 h-4 text-brand-green" />
                Launch Interactive Steep Timer & Brewing Guide
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Express Dispatch in 24h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>100% Organically Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>7-Day Freshness Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs Section */}
        <div className="mt-12 bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 bg-brand-beige overflow-x-auto text-xs font-bold text-gray-600">
            {[
              { key: 'ingredients', label: '🌿 Ingredients & Botanicals' },
              { key: 'benefits', label: '✨ Health Benefits' },
              { key: 'brewing', label: '☕ Brewing Ritual' },
              { key: 'nutrition', label: '📊 Nutrition Facts' },
              { key: 'reviews', label: `💬 Customer Reviews (${reviewsList.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 flex-shrink-0 transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-brand-darkGreen border-t-2 border-brand-green shadow-soft'
                    : 'hover:text-brand-green'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-brand-darkGreen">Hand-Selected Organic Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ingredients.map((ing, i) => (
                    <div key={i} className="p-4 rounded-card bg-brand-beige border border-brand-mint/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs text-brand-darkGreen">
                          {ing.name} {ing.percentage && <span className="text-brand-green">({ing.percentage})</span>}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 font-light">{ing.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-brand-darkGreen">Targeted Health Advantages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-button bg-emerald-50 text-emerald-900 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'brewing' && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-brand-darkGreen">The Perfect Steep Instructions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-brand-beige p-4 rounded-card text-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Ideal Temperature</span>
                    <span className="font-bold text-base text-brand-darkGreen">{product.brewingGuide.temp}</span>
                  </div>
                  <div className="bg-brand-beige p-4 rounded-card text-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Steeping Time</span>
                    <span className="font-bold text-base text-brand-darkGreen">{product.brewingGuide.steepTime}</span>
                  </div>
                  <div className="bg-brand-beige p-4 rounded-card text-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Water Ratio</span>
                    <span className="font-bold text-base text-brand-darkGreen">{product.brewingGuide.waterAmount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 bg-white p-4 rounded-card border border-brand-mint/30">
                  <strong>Serving Suggestion:</strong> {product.brewingGuide.servingSuggestion}
                </p>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-4 max-w-md">
                <h3 className="font-heading font-bold text-lg text-brand-darkGreen">Nutritional Information (Per Cup)</h3>
                <table className="w-full text-xs text-left border border-gray-200 rounded-card overflow-hidden">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-brand-beige">
                      <td className="p-3 font-semibold text-brand-darkGreen">Calories</td>
                      <td className="p-3 text-gray-700">{product.nutritionInfo.calories}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-brand-darkGreen">Carbohydrates</td>
                      <td className="p-3 text-gray-700">{product.nutritionInfo.carbs}</td>
                    </tr>
                    <tr className="bg-brand-beige">
                      <td className="p-3 font-semibold text-brand-darkGreen">Protein</td>
                      <td className="p-3 text-gray-700">{product.nutritionInfo.protein}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-brand-darkGreen">Total Fat</td>
                      <td className="p-3 text-gray-700">{product.nutritionInfo.fat}</td>
                    </tr>
                    <tr className="bg-brand-beige">
                      <td className="p-3 font-semibold text-brand-darkGreen">Active Antioxidants</td>
                      <td className="p-3 text-emerald-700 font-bold">{product.nutritionInfo.antioxidants}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Reviews List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-heading font-bold text-lg text-brand-darkGreen">Customer Reviews</h3>
                    {reviewsList.map((rev) => (
                      <div key={rev._id} className="p-4 rounded-card border border-brand-mint/30 bg-brand-cream/50 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                              ))}
                            </div>
                            <h4 className="font-bold text-xs text-brand-darkGreen mt-1">{rev.title}</h4>
                          </div>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-light">{rev.comment}</p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                          <span className="font-semibold text-brand-darkGreen flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {rev.userName} (Verified Buyer)
                          </span>
                          <button className="flex items-center gap-1 hover:text-brand-green">
                            <ThumbsUp className="w-3 h-3" /> Helpful ({rev.helpfulCount})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <div className="bg-brand-beige p-5 rounded-card border border-brand-mint/40 h-fit space-y-4">
                    <h4 className="font-heading font-bold text-sm text-brand-darkGreen">Write a Review</h4>
                    <form onSubmit={handleAddReview} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-input border border-gray-300"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars (Good)</option>
                          <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          required
                          className="w-full text-xs p-2 rounded-input border border-gray-300"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Review Headline"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full text-xs p-2 rounded-input border border-gray-300"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Describe your taste experience & results..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={3}
                          required
                          className="w-full text-xs p-2 rounded-input border border-gray-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-brand-green text-white text-xs font-bold py-2.5 rounded-button hover:bg-brand-darkGreen transition-colors"
                      >
                        Submit Customer Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendations */}
        <div className="mt-16 space-y-6">
          <h2 className="font-heading font-bold text-2xl text-brand-darkGreen">You May Also Enjoy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {showBrewingGuide && (
        <BrewingGuideModal product={product} onClose={() => setShowBrewingGuide(false)} />
      )}
    </div>
  );
}
