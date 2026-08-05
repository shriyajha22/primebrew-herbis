import { Product, Category, Blog, Review, Coupon } from "./types";

export const initialCategories: Category[] = [
  {
    _id: "cat-1",
    name: "Blue Tea",
    slug: "blue-tea",
    description: "Mesmerising sapphire herbal infusions crafted from organic Butterfly Pea flowers.",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    itemCount: 3,
    featured: true,
  },
  {
    _id: "cat-2",
    name: "Wellness Tea",
    slug: "wellness-tea",
    description: "Targeted Ayurvedic formulas for blood sugar balance and holistic bodily health.",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80",
    itemCount: 1,
    featured: true,
  },
  {
    _id: "cat-3",
    name: "Ayurvedic Tea",
    slug: "ayurvedic-tea",
    description: "Tridosha balancing infusions infused with adaptogenic Ashwagandha & Sacred Tulsi.",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    itemCount: 1,
    featured: true,
  },
];

export const initialProducts: Product[] = [
  {
    _id: "prod-1",
    name: "Blue Tea",
    slug: "blue-tea",
    subtitle: "100% Pure Butterfly Pea Flower Infusion (30 Tea Bags)",
    description: "Harvested at dawn from organic botanical gardens, this signature Blue Tea features premium Clitoria Ternatea (Butterfly Pea) flowers. Celebrated for its mesmerising sapphire blue color that naturally shifts to royal purple with a splash of fresh lemon juice. Abundant in anthocyanin antioxidants, it naturally enhances skin glow, calms daily stress, and improves mental focus.",
    category: "blue-tea",
    categoryName: "Blue Tea",
    price: 249,
    mrp: 349,
    discountPercentage: 29,
    rating: 4.9,
    reviewCount: 148,
    stock: 85,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 249, mrp: 349 }
    ],
    keyHerbs: [
      "Butterfly Pea Flower (Clitoria Ternatea)",
      "Organic Lemongrass",
      "Stevia Leaf"
    ],
    benefits: [
      "Rich in anti-aging anthocyanin antioxidants",
      "Promotes radiant skin & healthy hair",
      "Eases mental fatigue & calms anxiety",
      "100% caffeine-free evening relaxation"
    ],
    flavorProfile: "Smooth, earthy, floral with light citrus herb undertones",
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "85°C / 185°F",
      steepTime: "3 to 5 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Add a squeeze of fresh lemon juice to watch the tea turn royal purple!"
    },
    storageInstructions: "Store in a cool, dry place away from direct sunlight in an airtight container.",
    ingredients: [
      { name: "Clitoria Ternatea (Butterfly Pea Flowers)", percentage: "85%", description: "Rich in anthocyanin polyphenols" },
      { name: "Organic Lemongrass", percentage: "15%", description: "Refreshing citrus aroma & digestive ease" }
    ],
    nutritionInfo: {
      calories: "2 kcal per cup",
      carbs: "0.4 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "380 mg Anthocyanins"
    },
    netQuantity: "30 Tea Bags",
    certifications: ["100% Organic", "Direct Farm Sourced", "Pesticide-Free", "ISO Certified Packaging"],
    sku: "PBH-BLU-001",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-2",
    name: "Blue Tea with Elaichi",
    slug: "blue-tea-with-elaichi",
    subtitle: "Butterfly Pea Infused with Aromatic Cardamom (30 Tea Bags)",
    description: "An aromatic masterpiece blending vibrant sapphire Butterfly Pea flowers with freshly crushed Tellicherry green cardamom (Elaichi). The calming blue infusion delivers a heartwarming spicy floral aroma that eases digestion, refreshes breath, and promotes serene tranquility after every meal.",
    category: "blue-tea",
    categoryName: "Blue Tea",
    price: 299,
    mrp: 399,
    discountPercentage: 25,
    rating: 4.95,
    reviewCount: 192,
    stock: 120,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 299, mrp: 399 }
    ],
    keyHerbs: [
      "Butterfly Pea Flower",
      "Green Elaichi (Cardamom)",
      "Sweet Fennel"
    ],
    benefits: [
      "Soothes digestive discomfort & post-meal bloating",
      "Aromatic Elaichi refreshes breath & uplifts spirits",
      "Protects cells against oxidative stress",
      "Relieves nervous tension & stress"
    ],
    flavorProfile: "Intensely aromatic, warm cardamom spice with subtle sweet floral notes",
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "4 to 5 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Best enjoyed warm after lunch or dinner."
    },
    storageInstructions: "Keep tin tightly sealed in a moisture-free pantry.",
    ingredients: [
      { name: "Butterfly Pea Flower", percentage: "70%", description: "Natural sapphire antioxidant infusion" },
      { name: "Crushed Green Cardamom (Elaichi)", percentage: "20%", description: "Digestive stimulant & aromatic comfort" },
      { name: "Sweet Fennel", percentage: "10%", description: "Calms stomach lining" }
    ],
    nutritionInfo: {
      calories: "3 kcal",
      carbs: "0.5 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "340 mg Polyphenols"
    },
    netQuantity: "30 Tea Bags",
    certifications: ["100% Organic", "Hand-Harvested Spices", "No Added Flavorings"],
    sku: "PBH-BLU-002",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-3",
    name: "Blue Tea with Ginger + Cinnamon",
    slug: "blue-tea-with-ginger-cinnamon",
    subtitle: "Invigorating Sapphire Blend with Ginger Kick & Ceylon Cinnamon (30 Tea Bags)",
    description: "A warming botanical tonic uniting Butterfly Pea flowers, sun-dried Zingiber ginger root, and fragrant Ceylon cinnamon bark. Designed to ignite metabolism, boost circulation, and protect the immune system against seasonal chills while mesmerising your senses with its vivid blue color.",
    category: "blue-tea",
    categoryName: "Blue Tea",
    price: 349,
    mrp: 449,
    discountPercentage: 22,
    rating: 4.88,
    reviewCount: 115,
    stock: 65,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 349, mrp: 449 }
    ],
    keyHerbs: [
      "Butterfly Pea Flower",
      "Organic Ginger Root",
      "Ceylon Cinnamon Bark",
      "Black Pepper"
    ],
    benefits: [
      "Accelerates metabolic rate & calorie burn",
      "Shields throat & chest against seasonal colds",
      "Potent anti-inflammatory & antioxidant action",
      "Improves circulation & morning vitality"
    ],
    flavorProfile: "Zesty ginger spice, sweet comforting cinnamon warmth, clean herbal finish",
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "95°C / 203°F",
      steepTime: "4 to 6 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Sip warm on chilly mornings or during afternoon slumps."
    },
    storageInstructions: "Store in an airtight container away from heat and moisture.",
    ingredients: [
      { name: "Butterfly Pea Flower", percentage: "55%", description: "Antioxidant powerhouse" },
      { name: "Organic Ginger Root", percentage: "25%", description: "Metabolism & throat comfort" },
      { name: "True Ceylon Cinnamon Bark", percentage: "15%", description: "Blood sugar stability & aroma" },
      { name: "Tellicherry Black Pepper", percentage: "5%", description: "Enhances nutrient absorption" }
    ],
    nutritionInfo: {
      calories: "4 kcal",
      carbs: "0.8 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "420 mg Active Polyphenols"
    },
    netQuantity: "30 Tea Bags",
    certifications: ["Organic Certified", "Single Estate Sourced", "Lab Tested Pure"],
    sku: "PBH-BLU-003",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-4",
    name: "Pre-Diabetic Tea",
    slug: "pre-diabetic-tea",
    subtitle: "Ayurvedic Sugar Balance & Glucose Support Formula (30 Tea Bags)",
    description: "Expertly formulated by traditional Ayurvedic physicians using time-tested blood-sugar regulating herbs. Features Gymnema Sylvestre (Gurmar - the 'Sugar Destroyer'), Jamun seed, Methi (Fenugreek), Vijaysar bark, and Ceylon cinnamon to help maintain healthy glucose levels naturally, control sweet cravings, and support optimal insulin sensitivity.",
    category: "wellness-tea",
    categoryName: "Wellness Tea",
    price: 425,
    mrp: 549,
    discountPercentage: 23,
    rating: 4.93,
    reviewCount: 176,
    stock: 90,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571934811356-5cc561d6821f?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 425, mrp: 549 }
    ],
    keyHerbs: [
      "Gymnema Sylvestre (Gurmar)",
      "Jamun Seed",
      "Methi (Fenugreek)",
      "Vijaysar Bark",
      "Ceylon Cinnamon"
    ],
    benefits: [
      "Regulates post-meal blood glucose spikes naturally",
      "Gurmar blocks sugar receptors and curbs sweet cravings",
      "Improves insulin sensitivity & metabolic health",
      "Supports pancreatic health & healthy body weight"
    ],
    flavorProfile: "Earthy, warm, woody with herbal bitter-sweet notes",
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "5 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Drink warm 30 minutes before or after main meals twice daily."
    },
    storageInstructions: "Store in a dry, cool environment in an airtight container.",
    ingredients: [
      { name: "Gurmar Leaves (Gymnema Sylvestre)", percentage: "30%", description: "Blocks sugar taste receptors & curbs cravings" },
      { name: "Jamun Seed Powder", percentage: "25%", description: "Supports healthy blood sugar metabolism" },
      { name: "Methi (Fenugreek)", percentage: "20%", description: "High soluble fiber for slow glucose absorption" },
      { name: "Vijaysar Bark", percentage: "15%", description: "Ayurvedic glucose balance agent" },
      { name: "Ceylon Cinnamon", percentage: "10%", description: "Enhances insulin responsiveness" }
    ],
    nutritionInfo: {
      calories: "2 kcal",
      carbs: "0.3 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "390 mg Active Botanicals"
    },
    netQuantity: "30 Tea Bags",
    certifications: ["100% Ayurvedic Formula", "Gluten-Free", "Zero Artificial Additives"],
    sku: "PBH-WEL-004",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-5",
    name: "Ayur Tea",
    slug: "ayur-tea",
    subtitle: "Holistic Tridosha Balancing Ayurvedic Brew (30 Tea Bags)",
    description: "Rooted in 5,000-year-old Ayurvedic wisdom, Ayur Tea is a sacred wellness infusion combining adaptogenic KSM-66 Ashwagandha, Sacred Krishna Tulsi, Giloy (Amrita), and Licorice (Mulethi). Harmonizes Vata, Pitta, and Kapha doshas to build core immunity, relieve stress, and revitalize overall stamina.",
    category: "ayurvedic-tea",
    categoryName: "Ayurvedic Tea",
    price: 380,
    mrp: 499,
    discountPercentage: 24,
    rating: 4.96,
    reviewCount: 210,
    stock: 105,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 380, mrp: 499 }
    ],
    keyHerbs: [
      "KSM-66 Ashwagandha Root",
      "Sacred Tulsi Trio",
      "Giloy (Amrita)",
      "Mulethi (Licorice Root)",
      "Shankhpushpi"
    ],
    benefits: [
      "Balances all three Ayurvedic doshas (Vata, Pitta, Kapha)",
      "Fortifies core immunity & daily stamina",
      "Lowers cortisol and relieves workday stress",
      "Soothes respiratory tract & clears throat"
    ],
    flavorProfile: "Rich herbal bouquet, sweet licorice undertones, soothing adaptogenic finish",
    caffeineLevel: "Zero Caffeine",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "5 to 7 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Sip warm morning and evening for holistic balance."
    },
    storageInstructions: "Store sealed in a cool, dry place away from moisture.",
    ingredients: [
      { name: "Sacred Tulsi Trio (Krishna, Rama, Vana)", percentage: "35%", description: "Adaptogenic immune fortress" },
      { name: "KSM-66 Ashwagandha Root", percentage: "25%", description: "Cortisol reduction & stress vitality" },
      { name: "Giloy Stem (Amrita)", percentage: "20%", description: "Ayurvedic detoxifier & fever defense" },
      { name: "Mulethi (Licorice Root)", percentage: "15%", description: "Throat soothing & natural sweetness" },
      { name: "Shankhpushpi", percentage: "5%", description: "Nootropic brain calm" }
    ],
    nutritionInfo: {
      calories: "2 kcal",
      carbs: "0.4 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "460 mg Adaptogenic Glycosides"
    },
    netQuantity: "30 Tea Bags",
    certifications: ["100% Organic", "Ayurvedic Pharmacopoeia Grade", "Pesticide-Free"],
    sku: "PBH-AYU-005",
    origin: "High-Altitude Organic Micro-Farms"
  }
];

export const initialBlogs: Blog[] = [
  {
    _id: "blog-1",
    title: "The Magic of Blue Tea: Antioxidants, Color Transformations & Calm",
    slug: "magic-of-blue-tea-antioxidants-calm",
    excerpt: "Discover why Butterfly Pea Blue Tea is captivating wellness lovers. From anthocyanin antioxidants to its magical purple citrus transformation.",
    content: `
# The Magic of Blue Tea

In the world of fine herbal infusions, few botanicals entrance the senses like Butterfly Pea (Clitoria Ternatea).

## Why Anthocyanin Antioxidants Matter

Blue Tea derives its rich indigo pigment from potent anthocyanins—the same antioxidants found in wild blueberries and acai berries.

- **Skin Glow**: Fights oxidative stress and preserves natural skin elasticity.
- **Mental Clarity**: Calms nervous tension without causing drowsiness.
- **Natural Color Shifting**: PH-sensitive polyphenols turn royal purple when infused with fresh lemon juice!

## How to Brew the Perfect Sapphire Cup

1. Steep 1 Blue Tea bag in 200ml of hot water (85°C) for 4 minutes.
2. Inhale the soothing botanical aroma.
3. Squeeze fresh lemon juice for a magical color transformation and citrus kick!
    `,
    category: "Tea Knowledge",
    author: "Dr. Ananya Sharma",
    authorRole: "Chief Herbalist & Ayurvedic Consultant",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    readTime: "4 min read",
    publishDate: "August 2, 2026",
    coverImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Blue Tea", "Mindfulness", "Wellness", "Antioxidants"],
    featured: true
  },
  {
    _id: "blog-2",
    title: "Ayurvedic Sugar Balance: How Gurmar & Jamun Support Health",
    slug: "ayurvedic-sugar-balance-gurmar-jamun",
    excerpt: "Explore ancient Ayurvedic herbs proven by modern research to support healthy blood glucose levels and curb sweet cravings.",
    content: `
# Natural Blood Glucose Harmony

Managing blood sugar spikes post-meal is essential for sustained daily energy and longevity.

## Key Botanicals in Pre-Diabetic Care

- **Gurmar (Gymnema Sylvestre)**: Known as 'The Sugar Destroyer' because it suppresses sweet taste receptors on the tongue.
- **Jamun Seed**: Packed with jamboline which helps slow down the conversion of starch into sugar.
- **Methi & Cinnamon**: Soluble fiber and polyphenols that improve insulin responsiveness naturally.
    `,
    category: "Health Tips",
    author: "Dr. Ananya Sharma",
    authorRole: "Chief Herbalist & Ayurvedic Consultant",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    readTime: "5 min read",
    publishDate: "July 28, 2026",
    coverImage: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
    tags: ["Pre-Diabetic Tea", "Ayurveda", "Glucose Control", "Wellness"],
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

## The Powerhouse Duo in Ayur Tea
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
    tags: ["Ayur Tea", "Adaptogens", "Ashwagandha", "Ayurveda"],
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
    title: "Mesmerising color & calm energy!",
    comment: "I've been drinking the Blue Tea every evening for 3 weeks. Watching it turn purple with lemon is magical, and it completely eases my workday stress.",
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
    title: "Aromatic cardamom bliss!",
    comment: "The Elaichi aroma in this Blue Tea blend is exquisite. It helps my digestion after heavy dinners and leaves a soothing floral warmth.",
    date: "July 29, 2026",
    verifiedBuyer: true,
    helpfulCount: 42
  },
  {
    _id: "rev-3",
    productId: "prod-4",
    userName: "Rajesh Kulkarni",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    title: "Excellent sugar management support",
    comment: "My doctor recommended adding Ayurvedic herbs to my daily routine. The Pre-Diabetic Tea with Gurmar and Jamun has helped stabilize my post-meal sugar readings naturally.",
    date: "July 24, 2026",
    verifiedBuyer: true,
    helpfulCount: 31
  },
  {
    _id: "rev-4",
    productId: "prod-5",
    userName: "Meera Nair",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    title: "True Ayurvedic vitality!",
    comment: "Ayur Tea has become my daily morning ritual. The Ashwagandha and Tulsi combination gives me sustained energy without any caffeine crash.",
    date: "July 20, 2026",
    verifiedBuyer: true,
    helpfulCount: 19
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: "HERBAL15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 299,
    maxDiscount: 200,
    expiryDate: "2026-12-31"
  },
  {
    code: "FARM2CUP",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 399,
    expiryDate: "2026-12-31"
  },
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 199,
    maxDiscount: 150,
    expiryDate: "2026-12-31"
  }
];
