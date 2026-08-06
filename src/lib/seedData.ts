import { Product, Category, Blog, Review, Coupon } from "./types";

export const initialCategories: Category[] = [
  {
    _id: "cat-1",
    name: "Blue Tea",
    slug: "blue-tea",
    description: "Mesmerising sapphire herbal infusions crafted from organic Butterfly Pea flowers.",
    iconName: "Sparkles",
    image: "/images/blue-tea.jpg",
    itemCount: 3,
    featured: true,
  },
  {
    _id: "cat-2",
    name: "Wellness Tea",
    slug: "wellness-tea",
    description: "Targeted Ayurvedic formulas for blood sugar balance and holistic bodily health.",
    iconName: "HeartPulse",
    image: "/images/guava-jamun-neem.jpg",
    itemCount: 1,
    featured: true,
  },
  {
    _id: "cat-3",
    name: "Ayurvedic Tea",
    slug: "ayurvedic-tea",
    description: "Tridosha balancing infusions infused with adaptogenic Ashwagandha & Sacred Tulsi.",
    iconName: "ShieldCheck",
    image: "/images/ayurvedic-kashayam.jpg",
    itemCount: 1,
    featured: true,
  },
];

export const initialProducts: Product[] = [
  {
    _id: "prod-1",
    name: "Blue Tea (Butterfly Pea Flower Tea)",
    slug: "blue-tea",
    subtitle: "Discover the natural wellness of PrimeBrew Herbis Blue Tea, made from carefully selected Butterfly Pea Flowers. This vibrant, caffeine-free herbal infusion is packed with natural antioxidants that support your overall well-being. Enjoy a soothing cup any time of the day as part of a healthy lifestyle.",
    description: "Discover the natural wellness of PrimeBrew Herbis Blue Tea, made from carefully selected Butterfly Pea Flowers. This vibrant, caffeine-free herbal infusion is packed with natural antioxidants that support your overall well-being. Enjoy a soothing cup any time of the day as part of a healthy lifestyle.",
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
      "/images/blue-tea.jpg",
      "/images/blue-tea-cup.png",
      "/images/blue-tea-flowers.png"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 249, mrp: 349 },
      { weight: "50g Loose Tea", price: 349, mrp: 449 },
      { weight: "100g Value Pack", price: 599, mrp: 799 }
    ],
    keyHerbs: [
      "100% Premium Butterfly Pea Flower (Clitoria Ternatea)"
    ],
    benefits: [
      "Supports metabolism & healthy weight management",
      "Calms the nervous system, reduces stress & promotes restful sleep",
      "Helps stabilize blood sugar after meals",
      "Rich in antioxidants that help fight free radicals and inflammation",
      "Naturally caffeine-free"
    ],
    flavorProfile: "Mild • Earthy • Floral",
    caffeineLevel: "Naturally Caffeine-Free",
    brewingGuide: {
      temp: "85°C / 185°F",
      steepTime: "3 to 5 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Add a squeeze of fresh lemon juice to watch the tea turn royal purple!"
    },
    storageInstructions: "Store in a cool, dry place away from direct sunlight in an airtight container.",
    ingredients: [
      { name: "100% Premium Butterfly Pea Flowers", percentage: "100%", description: "Pure hand-picked Clitoria Ternatea whole blossoms" }
    ],
    nutritionInfo: {
      calories: "2 kcal per cup",
      carbs: "0.4 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "380 mg Anthocyanins"
    },
    netQuantity: "30 Tea Bags / 50g",
    certifications: ["100% Organic", "Direct Farm Sourced", "Pesticide-Free", "Vegan & Gluten-Free"],
    sku: "PBH-BLU-001",
    origin: "High-Altitude Himalayan Bio-Farms"
  },
  {
    _id: "prod-2",
    name: "Blue Tea + Elaichi",
    slug: "blue-tea-with-elaichi",
    subtitle: "Caffeine-Free | Digestive & Calming | Antioxidant Rich | Supports Metabolism",
    description: "Experience the perfect fusion of vibrant Butterfly Pea Flowers and aromatic Green Cardamom (Elaichi). This naturally caffeine-free herbal infusion combines the antioxidant benefits of Blue Tea with the digestive and soothing properties of Elaichi, creating a refreshing and calming wellness drink for any time of the day.",
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
      "/images/blue-tea-elaichi.jpg",
      "/images/blue-tea-cup.png",
      "/images/blue-tea-flowers.png"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 299, mrp: 399 },
      { weight: "50g Loose Tea", price: 399, mrp: 499 },
      { weight: "100g Value Pack", price: 699, mrp: 899 }
    ],
    keyHerbs: [
      "Premium Butterfly Pea Flowers",
      "Premium Green Cardamom (Elaichi)"
    ],
    benefits: [
      "Supports Healthy Metabolism",
      "Rich in Natural Antioxidants",
      "Supports Healthy Digestion",
      "Calming & Refreshing",
      "100% Naturally Caffeine-Free"
    ],
    flavorProfile: "Floral • Mild • Refreshingly Aromatic • Smooth Finish",
    caffeineLevel: "Naturally Caffeine-Free",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "4 to 5 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Add a drop of honey or squeeze of lemon for a refreshing twist!"
    },
    storageInstructions: "Store in a cool, dry place away from direct sunlight in an airtight container.",
    ingredients: [
      { name: "Premium Butterfly Pea Flowers", percentage: "70%", description: "Organic Clitoria Ternatea whole blossoms" },
      { name: "Premium Green Cardamom (Elaichi)", percentage: "30%", description: "Crushed Tellicherry aromatic cardamom pods" }
    ],
    nutritionInfo: {
      calories: "3 kcal",
      carbs: "0.5 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "340 mg Polyphenols"
    },
    netQuantity: "30 Tea Bags / 50g",
    certifications: ["Farm-to-Cup Quality", "Premium Natural Ingredients", "No Artificial Colours", "No Artificial Flavours", "No Preservatives", "Vegan", "Gluten-Free"],
    sku: "PBH-BLU-002",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-3",
    name: "Blue Tea + Ginger Cinnamon (Butterfly Pea Flower, Ginger & Cinnamon Herbal Tea)",
    slug: "blue-tea-with-ginger-cinnamon",
    subtitle: "Warming • Caffeine-Free • Supports Digestion, Metabolism & Blood Sugar Balance",
    description: "Enjoy the perfect fusion of Butterfly Pea Flowers, Ginger, and Cinnamon in a comforting herbal infusion. This naturally caffeine-free blend combines antioxidant-rich Blue Tea with the warming goodness of ginger and cinnamon, making it an ideal wellness beverage to support digestion, metabolism, and overall health.",
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
      "/images/blue-tea-ginger-cinnamon.jpg",
      "/images/blue-tea-cup.png",
      "/images/blue-tea-flowers.png"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 349, mrp: 449 },
      { weight: "50g Loose Tea", price: 449, mrp: 549 },
      { weight: "100g Value Pack", price: 749, mrp: 949 }
    ],
    keyHerbs: [
      "Premium Butterfly Pea Flowers",
      "Natural Ginger",
      "Premium Cinnamon"
    ],
    benefits: [
      "Supports Healthy Digestion",
      "Supports Metabolism",
      "Supports Healthy Blood Sugar Balance",
      "Rich in Natural Antioxidants",
      "Naturally Caffeine-Free",
      "Warming & Comforting Blend"
    ],
    flavorProfile: "Floral • Warm & Spicy • Mildly Sweet • Smooth Finish",
    caffeineLevel: "Naturally Caffeine-Free",
    brewingGuide: {
      temp: "95°C / 203°F",
      steepTime: "4 to 6 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Sip warm on chilly mornings or during afternoon slumps."
    },
    storageInstructions: "Store in an airtight container away from heat and moisture.",
    ingredients: [
      { name: "Premium Butterfly Pea Flowers", percentage: "55%", description: "Organic Clitoria Ternatea whole blossoms" },
      { name: "Natural Ginger", percentage: "25%", description: "Sun-dried Zingiber ginger root" },
      { name: "Premium Cinnamon", percentage: "20%", description: "True fragrant Ceylon cinnamon bark" }
    ],
    nutritionInfo: {
      calories: "4 kcal",
      carbs: "0.8 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "420 mg Active Polyphenols"
    },
    netQuantity: "30 Tea Bags / 50g",
    certifications: ["Farm-to-Cup Quality", "Premium Natural Ingredients", "Antioxidant Rich", "No Artificial Colours", "No Artificial Flavours", "No Preservatives", "Vegan", "Gluten-Free"],
    sku: "PBH-BLU-003",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-4",
    name: "Guava + Jamun + Neem Herbal Blend",
    slug: "guava-jamun-neem-herbal-blend",
    subtitle: "Supports Digestion & Traditional Wellness | Part of a Balanced Healthy Lifestyle",
    description: "Discover the goodness of three time-honored herbs in one refreshing cup. Our Guava + Jamun + Neem Herbal Blend is thoughtfully crafted using premium natural ingredients to support digestive wellness and promote overall well-being. This caffeine-free herbal infusion is a perfect addition to a balanced, healthy lifestyle and can be enjoyed any time of the day.",
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
      "/images/guava-jamun-neem.jpg",
      "/images/blue-tea-flowers.png",
      "/images/blue-tea-cup.png"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 425, mrp: 549 },
      { weight: "50g Loose Tea", price: 525, mrp: 649 },
      { weight: "100g Value Pack", price: 899, mrp: 1099 }
    ],
    keyHerbs: [
      "Premium Guava Leaves",
      "Natural Jamun",
      "Premium Neem Leaves"
    ],
    benefits: [
      "Supports Healthy Digestion",
      "Supports Traditional Wellness",
      "Rich in Natural Plant Compounds",
      "Daily Wellness Support",
      "Naturally Caffeine-Free"
    ],
    flavorProfile: "Mild Herbal • Earthy • Smooth • Refreshing",
    caffeineLevel: "Naturally Caffeine-Free",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "5 minutes",
      waterAmount: "200 ml",
      servingSuggestion: "Drink warm after main meals or any time of the day as part of your daily wellness ritual."
    },
    storageInstructions: "Store in a dry, cool environment in an airtight container.",
    ingredients: [
      { name: "Premium Guava Leaves", percentage: "40%", description: "Rich in polyphenols & flavonoid antioxidants for digestive comfort" },
      { name: "Natural Jamun", percentage: "35%", description: "Time-honored botanical for traditional wellness & vitality" },
      { name: "Premium Neem Leaves", percentage: "25%", description: "Cleansing plant compounds to support daily body harmony" }
    ],
    nutritionInfo: {
      calories: "2 kcal",
      carbs: "0.3 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "390 mg Active Plant Compounds"
    },
    netQuantity: "30 Tea Bags / 50g",
    certifications: ["Farm-to-Cup Quality", "Premium Natural Ingredients", "100% Herbal Blend", "Rich in Natural Antioxidants", "No Artificial Colours", "No Artificial Flavours", "No Preservatives", "Vegan", "Gluten-Free"],
    sku: "PBH-WEL-004",
    origin: "High-Altitude Organic Micro-Farms"
  },
  {
    _id: "prod-5",
    name: "Authentic Ayurvedic Kashayam",
    slug: "authentic-ayurvedic-kashayam",
    subtitle: "Supports Digestion, Immunity & Metabolism",
    description: "Experience the wisdom of Ayurveda with PrimeBrew Herbis Authentic Ayurvedic Kashayam. Crafted from a carefully selected blend of traditional herbs and spices, this caffeine-free herbal drink is designed to support digestion, strengthen immunity, and promote healthy metabolism. Enjoy this comforting wellness beverage as part of your daily healthy lifestyle.",
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
      "/images/ayurvedic-kashayam.jpg",
      "/images/blue-tea-flowers.png",
      "/images/blue-tea-cup.png"
    ],
    weightVariants: [
      { weight: "30 Tea Bags", price: 380, mrp: 499 },
      { weight: "50g Loose Tea", price: 480, mrp: 599 },
      { weight: "100g Value Pack", price: 799, mrp: 999 }
    ],
    keyHerbs: [
      "Ginger",
      "Cinnamon",
      "Black Pepper",
      "Cardamom",
      "Coriander",
      "Traditional Ayurvedic Herbs & Spices"
    ],
    benefits: [
      "Supports Healthy Digestion",
      "Supports Natural Immunity",
      "Supports Healthy Metabolism",
      "Traditional Ayurvedic Wellness",
      "Naturally Caffeine-Free"
    ],
    flavorProfile: "Warm • Spicy • Herbal • Comforting",
    caffeineLevel: "Naturally Caffeine-Free",
    brewingGuide: {
      temp: "90°C / 194°F",
      steepTime: "5 to 7 minutes",
      waterAmount: "220 ml",
      servingSuggestion: "Sip warm morning or evening for holistic digestion and immunity."
    },
    storageInstructions: "Store sealed in a cool, dry place away from moisture.",
    ingredients: [
      { name: "Zingiber Officinale (Ginger)", percentage: "25%", description: "Ignites digestive fire & eases throat" },
      { name: "Ceylon Cinnamon", percentage: "20%", description: "Warming spice for metabolism & balance" },
      { name: "Black Pepper & Cardamom", percentage: "25%", description: "Aromatic bio-enhancers for bioavailability" },
      { name: "Coriander & Ayurvedic Spices", percentage: "30%", description: "Cooling & soothing digestive harmony" }
    ],
    nutritionInfo: {
      calories: "2 kcal",
      carbs: "0.4 g",
      protein: "0.1 g",
      fat: "0 g",
      antioxidants: "460 mg Active Botanicals"
    },
    netQuantity: "30 Tea Bags / 50g",
    certifications: ["Farm-to-Cup Quality", "Premium Natural Ingredients", "Traditional Ayurvedic Blend", "Rich in Natural Plant Compounds", "No Artificial Colours", "No Artificial Flavours", "No Preservatives", "Vegan", "Gluten-Free"],
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
    coverImage: "/images/blue-tea.jpg",
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
    coverImage: "/images/guava-jamun-neem.jpg",
    tags: ["Guava Jamun Neem", "Ayurveda", "Digestive Wellness", "Daily Care"],
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
    coverImage: "/images/ayurvedic-kashayam.jpg",
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
