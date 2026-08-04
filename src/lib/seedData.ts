import { Product, Category, Blog, Review, Coupon } from "./types";

export const initialCategories: Category[] = [
  {
    _id: "cat-1",
    name: "Detox Tea",
    slug: "detox-tea",
    description: "Rejuvenate your body with gentle, natural herbal cleanings.",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    itemCount: 8,
    featured: true,
  },
  {
    _id: "cat-2",
    name: "Weight Loss Tea",
    slug: "weight-loss-tea",
    description: "Boost metabolism and digest naturally with metabolism-enhancing herbs.",
    iconName: "Activity",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
    itemCount: 6,
    featured: true,
  },
  {
    _id: "cat-3",
    name: "Immunity Tea",
    slug: "immunity-tea",
    description: "Fortify your body's defenses with rich antioxidants and botanicals.",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    featured: true,
  },
  {
    _id: "cat-4",
    name: "Sleep Tea",
    slug: "sleep-tea",
    description: "Unwind with soothing Chamomile, Lavender, and Passionflower.",
    iconName: "Moon",
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
    itemCount: 7,
    featured: true,
  },
  {
    _id: "cat-5",
    name: "Stress Relief Tea",
    slug: "stress-relief-tea",
    description: "Calm your mind and restore emotional harmony with adaptogenic herbs.",
    iconName: "Sun",
    image: "https://images.unsplash.com/photo-1563822249510-04678c7870a4?auto=format&fit=crop&w=800&q=80",
    itemCount: 9,
    featured: true,
  },
  {
    _id: "cat-6",
    name: "Digestive Tea",
    slug: "digestive-tea",
    description: "Soothe gut discomfort and enhance nutrient absorption after meals.",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1571934811356-5cc561d6821f?auto=format&fit=crop&w=800&q=80",
    itemCount: 5,
    featured: false,
  },
  {
    _id: "cat-7",
    name: "Energy Tea",
    slug: "energy-tea",
    description: "Sustain natural vitality without jitters or energy crashes.",
    iconName: "Zap",
    image: "https://images.unsplash.com/photo-1531969177156-31688d070197?auto=format&fit=crop&w=800&q=80",
    itemCount: 6,
    featured: false,
  },
  {
    _id: "cat-8",
    name: "Women's Wellness Tea",
    slug: "womens-wellness-tea",
    description: "Hormonal balance, radiance, and graceful monthly comfort.",
    iconName: "Heart",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc86de5?auto=format&fit=crop&w=800&q=80",
    itemCount: 4,
    featured: true,
  },
  {
    _id: "cat-9",
    name: "Men's Wellness Tea",
    slug: "mens-wellness-tea",
    description: "Stamina, focus, and holistic male vitality with Ashwagandha & Ginseng.",
    iconName: "User",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    itemCount: 4,
    featured: false,
  },
  {
    _id: "cat-10",
    name: "Kids Herbal Tea",
    slug: "kids-herbal-tea",
    description: "Naturally caffeine-free, gentle sweet herbal infusions kids love.",
    iconName: "Smile",
    image: "https://images.unsplash.com/photo-1528733918455-5a59687cedf0?auto=format&fit=crop&w=800&q=80",
    itemCount: 3,
    featured: false,
  },
  {
    _id: "cat-11",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Curated artisanal herbal sets in luxury recyclable wooden caskets.",
    iconName: "Gift",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80",
    itemCount: 5,
    featured: true,
  },
  {
    _id: "cat-12",
    name: "Accessories",
    slug: "accessories",
    description: "Handcrafted ceramic teacups, borosilicate glass teapots, and strainers.",
    iconName: "Coffee",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    itemCount: 8,
    featured: false,
  },
];

export const initialProducts: Product[] = [
  {
    _id: "prod-1",
    name: "Himalayan Sunrise Detox Blend",
    slug: "himalayan-sunrise-detox-blend",
    subtitle: "Organic Green Tea, Dandelion Root & Lemongrass Infusion",
    description: "Harvested at dawn in high-altitude Himalayan micro-farms, this purifying blend unites wild dandelion root, lemon verbena, and antioxidant-rich organic green tea. Designed to gently cleanse the liver and flush toxins while invigorating your morning routine.",
    category: "detox-tea",
    categoryName: "Detox Tea",
    price: 499,
    mrp: 699,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 142,
    stock: 85,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Loose Leaf", price: 499, mrp: 699 },
      { weight: "250g Loose Leaf", price: 999, mrp: 1399 },
      { weight: "20 Pyramid Tea Bags", price: 549, mrp: 749 }
    ],
    ingredients: [
      { name: "Organic Himalayan Green Tea", percentage: "40%", description: "Rich in EGCG antioxidants" },
      { name: "Roasted Dandelion Root", percentage: "25%", description: "Supports natural liver detoxification" },
      { name: "Fresh Harvest Lemongrass", percentage: "20%", description: "Bright citrus flavor & digestive ease" },
      { name: "Milk Thistle", percentage: "15%", description: "Protect and restore cellular health" }
    ],
    benefits: [
      "Gently cleanses liver & digestive tract",
      "Reduces bloating & water retention",
      "Rich in natural EGCG polyphenols",
      "Elevates skin clarity & natural glow"
    ],
    caffeineLevel: "Low Caffeine",
    brewingGuide: {
      temp: "85°C / 185°F",
      steepTime: "3 to 4 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Drink warm on an empty stomach every morning."
    },
    nutritionInfo: {
      calories: "2 kcal per cup",
      carbs: "0.4 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "350 mg Polyphenols"
    },
    certifications: ["100% USDA Organic", "Direct Farm Sourced", "Pesticide-Free", "ISO Certified packaging"],
    sku: "PBH-DET-001",
    origin: "Darjeeling & HP High Altitude Bio-Farms"
  },
  {
    _id: "prod-2",
    name: "Midnight Serenity Sleep Elixir",
    slug: "midnight-serenity-sleep-elixir",
    subtitle: "Chamomile Flowers, French Lavender & Valerian Root",
    description: "Escape the noise of the day with our award-winning sleep elixir. Crafted from hand-picked German chamomile, soothing French lavender buds, and grounding valerian root, this aromatic floral tea signals your nervous system to ease into deep, restorative sleep.",
    category: "sleep-tea",
    categoryName: "Sleep Tea",
    price: 549,
    mrp: 750,
    discountPercentage: 27,
    rating: 4.95,
    reviewCount: 210,
    stock: 120,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563822249510-04678c7870a4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594631252845-29fc4cc86de5?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Whole Flower", price: 549, mrp: 750 },
      { weight: "250g Whole Flower", price: 1149, mrp: 1599 },
      { weight: "25 Biodegradable Pyramid Bags", price: 599, mrp: 799 }
    ],
    ingredients: [
      { name: "Whole Egyptian Chamomile Heads", percentage: "45%", description: "Calms brain activity & tension" },
      { name: "Culinary Grade Lavender Flowers", percentage: "25%", description: "Aromatherapeutic relaxation" },
      { name: "Organic Valerian Root", percentage: "15%", description: "Promotes deep slow-wave REM sleep" },
      { name: "Lemon Balm Leaves", percentage: "15%", description: "Eases restlessness" }
    ],
    benefits: [
      "Shortens time to fall asleep naturally",
      "Reduces night-time awakenings",
      "Soothes tension headaches & mental noise",
      "Zero caffeine – 100% bedtime safe"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "95°C / 203°F",
      steepTime: "5 to 7 minutes (Covered)",
      waterAmount: "250 ml",
      servingSuggestion: "Sip 30 minutes before sleep with an optional drop of raw honey."
    },
    nutritionInfo: {
      calories: "0 kcal",
      carbs: "0 g",
      protein: "0 g",
      fat: "0 g",
      antioxidants: "280 mg Flavonoids"
    },
    certifications: ["100% Organic", "Non-GMO", "Gluten Free", "Artisanal Harvest"],
    sku: "PBH-SLP-002",
    origin: "Kullu Valley Herbal Cooperative"
  },
  {
    _id: "prod-3",
    name: "Golden Armor Immunity Shield",
    slug: "golden-armor-immunity-shield",
    subtitle: "Wild Lakadong Turmeric, Tulsi & Ginger Wellness Infusion",
    description: "Powered by rare Lakadong turmeric containing over 7.5% curcumin content, combined with sacred Krishna Tulsi, black pepper, and spicy ginger. This golden tonic fortifies your immune defenses against seasonal changes and inflammation.",
    category: "immunity-tea",
    categoryName: "Immunity Tea",
    price: 475,
    mrp: 650,
    discountPercentage: 27,
    rating: 4.88,
    reviewCount: 98,
    stock: 60,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571934811356-5cc561d6821f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531969177156-31688d070197?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Botanical Blend", price: 475, mrp: 650 },
      { weight: "250g Botanical Blend", price: 950, mrp: 1300 }
    ],
    ingredients: [
      { name: "Lakadong High-Curcumin Turmeric", percentage: "35%", description: "Potent anti-inflammatory agent" },
      { name: "Sacred Holy Basil (Tulsi Trio)", percentage: "30%", description: "Adaptogenic immune booster" },
      { name: "Sun-dried Zingiber Ginger", percentage: "20%", description: "Soothes throat & aids circulation" },
      { name: "Tellicherry Black Peppercorn", percentage: "15%", description: "Enhances curcumin absorption by 2000%" }
    ],
    benefits: [
      "Protects against respiratory infections",
      "Potent anti-inflammatory response",
      "Strengthens cellular immunity",
      "Warming and comforting blend"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "4 to 6 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Add a squeeze of fresh lemon for enhanced vitamin C absorption."
    },
    nutritionInfo: {
      calories: "4 kcal",
      carbs: "0.8 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "480 mg Active Curcuminoids"
    },
    certifications: ["Organic Certified", "Single Estate Sourced", "Lab Tested Pure"],
    sku: "PBH-IMM-003",
    origin: "Meghalaya & Kerala Spices Reserve"
  },
  {
    _id: "prod-4",
    name: "SlimFit Botanical Metabolic Infusion",
    slug: "slimfit-botanical-metabolic-infusion",
    subtitle: "Garcinia Cambogia, Oolong Tea & Hibiscus",
    description: "Designed for active lifestyles, SlimFit blends high-mountain Ti Kuan Yin Oolong tea with tropical Garcinia Cambogia and tart hibiscus petals. Helps boost daily calorie burning, curb evening sugar cravings, and support healthy weight management.",
    category: "weight-loss-tea",
    categoryName: "Weight Loss Tea",
    price: 599,
    mrp: 799,
    discountPercentage: 25,
    rating: 4.79,
    reviewCount: 165,
    stock: 45,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Loose Leaf", price: 599, mrp: 799 },
      { weight: "250g Loose Leaf", price: 1199, mrp: 1599 }
    ],
    ingredients: [
      { name: "Formosa Roasted Oolong Tea", percentage: "40%", description: "Stimulates lipid metabolism" },
      { name: "Wild Garcinia Cambogia", percentage: "30%", description: "Natural HCA appetite regulator" },
      { name: "Ruby Hibiscus Petals", percentage: "20%", description: "Reduces fluid retention & adds ruby color" },
      { name: "Ceylon Cinnamon Bark", percentage: "10%", description: "Helps stabilize blood glucose spikes" }
    ],
    benefits: [
      "Accelerates basal metabolic rate",
      "Supports fat oxidation during workouts",
      "Curbs appetite & late-night cravings",
      "Refreshingly tart taste hot or iced"
    ],
    caffeineLevel: "Medium Caffeine",
    brewingGuide: {
      temp: "85°C / 185°F",
      steepTime: "3 minutes",
      waterAmount: "250 ml",
      servingSuggestion: "Enjoy 30 minutes before your workout or main meal."
    },
    nutritionInfo: {
      calories: "3 kcal",
      carbs: "0.5 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "310 mg Oolong Polyphenols"
    },
    certifications: ["Direct Sourced", "Keto Friendly", "Zero Synthetic Additives"],
    sku: "PBH-WGT-004",
    origin: "Assam & Western Ghats Foothills"
  },
  {
    _id: "prod-5",
    name: "Zen Harmony Stress Relief Brew",
    slug: "zen-harmony-stress-relief-brew",
    subtitle: "Organic Ashwagandha Root, Gotu Kola & Peppermint",
    description: "Find inner composure amidst hectic workdays. Zen Harmony blends revered Ayurvedic adaptogen Ashwagandha with memory-boosting Gotu Kola and crisp Egyptian peppermint to reduce cortisol spikes and maintain calm focus.",
    category: "stress-relief-tea",
    categoryName: "Stress Relief Tea",
    price: 520,
    mrp: 699,
    discountPercentage: 25,
    rating: 4.92,
    reviewCount: 178,
    stock: 95,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1563822249510-04678c7870a4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Loose Herbal", price: 520, mrp: 699 },
      { weight: "250g Loose Herbal", price: 1040, mrp: 1399 }
    ],
    ingredients: [
      { name: "KSM-66 Grade Ashwagandha Root", percentage: "35%", description: "Adaptogen that moderates cortisol response" },
      { name: "Gotu Kola (Brahmi Leaves)", percentage: "25%", description: "Enhances mental clarity & memory" },
      { name: "Refreshing Spearmint & Peppermint", percentage: "25%", description: "Soothes nervous stomach tension" },
      { name: "Rose Petals", percentage: "15%", description: "Aromatic emotional balancing" }
    ],
    benefits: [
      "Lower serum cortisol & nervous anxiety",
      "Sustained calm mental focus without fatigue",
      "Cooling digestive relief",
      "Delightful minty floral aroma"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "4 to 5 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Sip during afternoon work hours or high-stress moments."
    },
    nutritionInfo: {
      calories: "1 kcal",
      carbs: "0.2 g",
      protein: "0 g",
      fat: "0 g",
      antioxidants: "290 mg Active Adaptogens"
    },
    certifications: ["100% Organic", "Ayurvedic Pharmacopoeia Grade", "Pesticide-Free"],
    sku: "PBH-STR-005",
    origin: "Madhya Pradesh Organic Cultivation Zone"
  },
  {
    _id: "prod-6",
    name: "Goddess Balance Women's Harmony Tea",
    slug: "goddess-balance-womens-harmony-tea",
    subtitle: "Shatavari Root, Red Raspberry Leaf & Rose Buds",
    description: "Crafted specifically for women across all stages of life. Goddess Balance features Shatavari (the queen of Ayurvedic herbs), nutrient-rich red raspberry leaf, and fragrant Persian rose buds to support hormonal balance, skin radiance, and smooth cycles.",
    category: "womens-wellness-tea",
    categoryName: "Women's Wellness Tea",
    price: 580,
    mrp: 750,
    discountPercentage: 22,
    rating: 4.96,
    reviewCount: 189,
    stock: 70,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1594631252845-29fc4cc86de5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "100g Herbal Blend", price: 580, mrp: 750 },
      { weight: "250g Herbal Blend", price: 1150, mrp: 1500 }
    ],
    ingredients: [
      { name: "Organic Shatavari Root", percentage: "35%", description: "Rejuvenating female tonic" },
      { name: "Wild Red Raspberry Leaf", percentage: "30%", description: "Tones uterine wall & eases cramps" },
      { name: "Damask Rose Buds", percentage: "20%", description: "Nourishes skin radiance & mood" },
      { name: "Fennel Seeds", percentage: "15%", description: "Reduces fluid retention & bloating" }
    ],
    benefits: [
      "Promotes smooth, comfortable monthly cycles",
      "Balances hormonal mood fluctuations",
      "Enhances natural skin luminosity",
      "Rich in iron, magnesium, and calcium"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "5 to 6 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Enjoy 1-2 cups daily warm."
    },
    nutritionInfo: {
      calories: "2 kcal",
      carbs: "0.3 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "340 mg Phytoestrogenic Compounds"
    },
    certifications: ["Organic Certified", "Hormone Safe", "Pure Botanicals"],
    sku: "PBH-WMN-006",
    origin: "Rajasthan Botanical Gardens"
  },
  {
    _id: "prod-7",
    name: "Royale Wooden Teabox Gift Sampler",
    slug: "royale-wooden-teabox-gift-sampler",
    subtitle: "Collector's Edition with 6 Signature Organic Herbal Blends",
    description: "An exquisite gift for tea connoisseurs. Housed in a hand-carved mahogany wooden box with brass hinges, this set contains 6 airtight tin canisters featuring our bestselling organic teas: Himalayan Sunrise, Midnight Serenity, Golden Armor, SlimFit, Zen Harmony, and Goddess Balance.",
    category: "gift-boxes",
    categoryName: "Gift Boxes",
    price: 1899,
    mrp: 2499,
    discountPercentage: 24,
    rating: 5.0,
    reviewCount: 84,
    stock: 30,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "6 Tins Box Set (300g total)", price: 1899, mrp: 2499 }
    ],
    ingredients: [
      { name: "6 Assorted Signature Blends", description: "Detox, Sleep, Immunity, SlimFit, Zen & Goddess" }
    ],
    benefits: [
      "The ultimate luxury gift for wellness lovers",
      "Reusable artisan solid wood chest",
      "Includes personalized golden foil greeting card",
      "Direct farm fresh samples"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "Varies by blend (85°C - 95°C)",
      steepTime: "3 to 6 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Includes printed brewing masterclass guidebook."
    },
    nutritionInfo: {
      calories: "0-4 kcal",
      carbs: "< 1 g",
      protein: "0 g",
      fat: "0 g",
      antioxidants: "High"
    },
    certifications: ["Luxury Eco Packaging", "100% Organic Contents", "Handcrafted Box"],
    sku: "PBH-GFT-007",
    origin: "PrimeBrew Curated Reserve"
  },
  {
    _id: "prod-8",
    name: "Artisan Borosilicate Glass Teapot (800ml)",
    slug: "artisan-borosilicate-glass-teapot-800ml",
    subtitle: "Heat-Resistant Glass with Removable Stainless Micro-Filter",
    description: "Elevate your brewing ritual with our visual infuser teapot. Crafted from ultra-clear thermal borosilicate glass that withstands direct stovetop heat, featuring an ergonomic bamboo handle and precision micro-mesh stainless steel infuser for blooming teas.",
    category: "accessories",
    categoryName: "Accessories",
    price: 1299,
    mrp: 1799,
    discountPercentage: 27,
    rating: 4.91,
    reviewCount: 112,
    stock: 50,
    inStock: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563822249510-04678c7870a4?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "800ml Teapot", price: 1299, mrp: 1799 },
      { weight: "1200ml Teapot", price: 1599, mrp: 2199 }
    ],
    ingredients: [
      { name: "High Borosilicate Glass", description: "BPA free & thermal shock resistant from -20°C to 150°C" },
      { name: "304 Food-grade Stainless Steel", description: "Micro-perforated infuser basket" }
    ],
    benefits: [
      "Watch loose leaf herbs unfurl visually",
      "Stovetop and dishwasher safe",
      "Drip-free precision V-spout design",
      "Ideal capacity for 3-4 cups"
    ],
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "Up to 100°C direct flame safe",
      steepTime: "N/A",
      waterAmount: "800 ml max",
      servingSuggestion: "Pair with double-walled glass cups."
    },
    nutritionInfo: {
      calories: "N/A",
      carbs: "N/A",
      protein: "N/A",
      fat: "N/A",
      antioxidants: "N/A"
    },
    certifications: ["BPA Free", "Food Grade Standard", "Lead Free Glass"],
    sku: "PBH-ACC-008",
    origin: "Handcrafted Glass Workshop"
  }
];

export const initialBlogs: Blog[] = [
  {
    _id: "blog-1",
    title: "The Art of Mindful Brewing: How Herbal Teas Restore Inner Peace",
    slug: "art-of-mindful-brewing-herbal-teas",
    excerpt: "Discover why turning tea preparation into a 5-minute meditation can dramatically lower everyday stress and reset your nervous system.",
    content: `
# The Art of Mindful Brewing

In our fast-paced digital world, taking a pause seems almost radical. Yet, the simple act of brewing a cup of whole-leaf herbal tea can become a grounding sanctuary.

## Why Temperature and Timing Matter

Herbal teas are delicate extractions of nature's finest healing roots, leaves, and flowers. Boiling water violently can scorch volatile essential oils in chamomile or peppermint.

- **Chamomile & Lavender**: Best steeped at 95°C for 5-7 minutes covered to trap soothing aromatics.
- **Green & White Teas**: Best at 80°C - 85°C to preserve EGCG polyphenols without astringency.
- **Turmeric & Ginger**: Thrive in hot 90°C infusions allowing heavy curcumin compounds to dissolve.

## 3 Steps to a Tea Meditation

1. **Observe the Aroma**: As water touches dry leaves, inhale deeply and notice the fragrance notes.
2. **Watch the Color Bloom**: Observe the amber, ruby, or jade hues spread through your teapot.
3. **Sip with Full Presence**: Feel the warmth travel through your chest, relaxing tight shoulders.
    `,
    category: "Tea Knowledge",
    author: "Dr. Ananya Sharma",
    authorRole: "Chief Herbalist & Ayurvedic Consultant",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    readTime: "4 min read",
    publishDate: "August 2, 2026",
    coverImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Mindfulness", "Wellness", "Tea Ritual", "Stress Relief"],
    featured: true
  },
  {
    _id: "blog-2",
    title: "Iced Hibiscus & Lemongrass Mocktail: A Summer Refreshment Recipe",
    slug: "iced-hibiscus-lemongrass-mocktail-recipe",
    excerpt: "Cool down with this ruby-red antioxidant powerhouse recipe. 100% natural, zero sugar, and packed with vitamin C.",
    content: `
# Refreshing Summer Hibiscus Mocktail

Beat the heat with this vibrant herbal mocktail that pleases both your palate and your body!

## Ingredients
- 2 tablespoons PrimeBrew Himalayan Sunrise or Ruby Hibiscus
- 1 stalk fresh lemongrass, bruised
- 1 cup sparkling mineral water
- 1 tablespoon raw agave or raw honey
- Fresh mint leaves & lime slices

## Instructions
1. Steep hibiscus and lemongrass in 1 cup of 95°C water for 8 minutes to create a concentrated brew.
2. Strain and mix in honey while warm. Allow to cool in the refrigerator.
3. Fill a tall glass with ice cubes, pour the chilled concentrate halfway, and top with sparkling water.
4. Garnish with lime slices and crushed mint leaves. Enjoy!
    `,
    category: "Tea Recipes",
    author: "Chef Rohan Verma",
    authorRole: "Artisanal Beverage Creator",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    readTime: "3 min read",
    publishDate: "July 28, 2026",
    coverImage: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80",
    tags: ["Recipe", "Summer Drinks", "Mocktails", "Hibiscus"],
    featured: true
  },
  {
    _id: "blog-3",
    title: "Understanding Adaptogens: Why Ashwagandha & Tulsi Belong in Your Cup",
    slug: "understanding-adaptogens-ashwagandha-tulsi",
    excerpt: "What makes an herb adaptogenic? Learn how these intelligent plants read your body's stress signals and bring equilibrium.",
    content: `
# The Science of Plant Adaptogens

Adaptogens are a unique class of herbs that help your body adapt to physical, chemical, and biological stress factors.

## How Adaptogens Work in the HPA Axis

When you experience stress, your Hypothalamic-Pituitary-Adrenal (HPA) axis triggers a cascade of cortisol and adrenaline. Adaptogens act like a thermostat:
- If cortisol is too high (anxiety, insomnia), adaptogens bring it down.
- If cortisol is depleted (chronic fatigue, burnout), adaptogens nourish energy reserves.

## The Powerhouse Duo
- **Ashwagandha**: Known as 'Indian Ginseng', renowned for calming neuro-overdrive.
- **Tulsi (Holy Basil)**: Revered in India for thousands of years as the 'Queen of Herbs'.
    `,
    category: "Health Tips",
    author: "Dr. Ananya Sharma",
    authorRole: "Chief Herbalist & Ayurvedic Consultant",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    readTime: "6 min read",
    publishDate: "July 15, 2026",
    coverImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    tags: ["Adaptogens", "Ashwagandha", "Ayurveda", "Immunity"],
    featured: false
  }
];

export const initialReviews: Review[] = [
  {
    _id: "rev-1",
    productId: "prod-1",
    userName: "Vikram Malhotra",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    title: "Remarkable morning detox feel!",
    comment: "I have been sipping the Himalayan Sunrise Detox every morning for 3 weeks now. My morning bloating has vanished completely and it tastes crisp and clean without bitter astringency.",
    date: "August 1, 2026",
    verifiedBuyer: true,
    helpfulCount: 24
  },
  {
    _id: "rev-2",
    productId: "prod-2",
    userName: "Priya Sunder",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    title: "Best sleep of my adult life",
    comment: "As someone who struggled with racing thoughts before bed, Midnight Serenity has become my sacred ritual. The lavender and chamomile whole flowers smell heavenly. Highly recommended!",
    date: "July 29, 2026",
    verifiedBuyer: true,
    helpfulCount: 42
  },
  {
    _id: "rev-3",
    productId: "prod-5",
    userName: "Siddharth Rao",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    title: "Keeps me calm during crazy work sprints",
    comment: "The Ashwagandha and spearmint combination in Zen Harmony is spot on. Helps me focus through 8-hour coding sessions without caffeine jitters.",
    date: "July 24, 2026",
    verifiedBuyer: true,
    helpfulCount: 18
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: "HERBAL15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 499,
    maxDiscount: 300,
    expiryDate: "2026-12-31"
  },
  {
    code: "FARM2CUP",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 699,
    expiryDate: "2026-12-31"
  },
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 399,
    maxDiscount: 200,
    expiryDate: "2026-12-31"
  }
];
