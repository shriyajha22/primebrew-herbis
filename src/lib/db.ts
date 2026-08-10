import mongoose from 'mongoose';
import { initialProducts, initialCategories, initialBlogs, initialReviews, initialCoupons } from './seedData';
import { Product, Category, Blog, Review, Coupon, User, Order } from './types';

const MONGODB_URI = process.env.MONGODB_URI;

// In-Memory Data Store Fallback for instant local execution
class InMemoryStore {
  products: Product[] = [...initialProducts];
  categories: Category[] = [...initialCategories];
  blogs: Blog[] = [...initialBlogs];
  reviews: Review[] = [...initialReviews];
  coupons: Coupon[] = [...initialCoupons];
  users: User[] = [
    {
      _id: "usr-admin",
      name: "PrimeBrew Admin",
      email: "Contact.primebrew@gmail.com",
      role: "admin",
      addresses: [],
      wishlist: ["prod-1", "prod-2"],
      walletBalance: 500
    },
    {
      _id: "usr-customer",
      name: "Ananya Sharma",
      email: "customer@example.com",
      role: "customer",
      addresses: [
        {
          fullName: "Ananya Sharma",
          phone: "+91 9876543210",
          email: "customer@example.com",
          street: "42 Tea Plantation Road, Green Valley",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          isDefault: true
        }
      ],
      wishlist: ["prod-2"],
      walletBalance: 250
    }
  ];
  orders: Order[] = [
    {
      _id: "ord-1001",
      orderNumber: "PBH-2026-9812",
      createdAt: "2026-08-03T10:15:00Z",
      items: [
        {
          productId: "prod-1",
          productName: "Blue Tea",
          image: "/images/blue-tea.jpg",
          weight: "30 Tea Bags",
          quantity: 2,
          price: 249
        }
      ],
      shippingAddress: {
        fullName: "Ananya Sharma",
        phone: "+91 9876543210",
        email: "customer@example.com",
        street: "42 Tea Plantation Road, Green Valley",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true
      },
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      orderStatus: "Shipped",
      trackingNumber: "SR-884920194",
      courierName: "Shiprocket Express",
      subtotal: 498,
      discount: 50,
      shippingFee: 0,
      tax: 22.4,
      total: 470.4,
      estimatedDelivery: "August 6, 2026"
    }
  ];

  activeSessions = new Map<string, {
    email: string;
    name: string;
    currentPage: string;
    loginTime: string;
    lastActive: string;
    isOnline: boolean;
  }>();

  recordUserActivity(name: string, email: string, currentPage: string) {
    if (!email) return;
    const key = email.trim().toLowerCase();
    const existing = this.activeSessions.get(key);
    const now = new Date().toISOString();

    if (existing) {
      existing.name = name || existing.name;
      existing.currentPage = currentPage || existing.currentPage;
      existing.lastActive = now;
      existing.isOnline = true;
      this.activeSessions.set(key, existing);
    } else {
      this.activeSessions.set(key, {
        email: email.trim(),
        name: name || email.split('@')[0],
        currentPage: currentPage || '/',
        loginTime: now,
        lastActive: now,
        isOnline: true,
      });
    }
  }

  setUserOffline(email: string) {
    if (!email) return;
    const key = email.trim().toLowerCase();
    const existing = this.activeSessions.get(key);
    if (existing) {
      existing.isOnline = false;
      this.activeSessions.set(key, existing);
    }
  }

  getActiveSessions() {
    const nowMs = Date.now();
    const list: Array<{
      email: string;
      name: string;
      currentPage: string;
      loginTime: string;
      lastActive: string;
      isOnline: boolean;
    }> = [];

    this.activeSessions.forEach((session, key) => {
      const lastActiveMs = new Date(session.lastActive).getTime();
      // Mark offline if last heartbeat is older than 30 seconds
      if (nowMs - lastActiveMs > 30000) {
        session.isOnline = false;
      }
      list.push(session);
    });

    return list.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  }

  passwordResetTokens = new Map<string, { email: string; token: string; expiresAt: Date; used: boolean }>();

  createPasswordResetToken(email: string): string {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    this.passwordResetTokens.set(token, {
      email: email.trim().toLowerCase(),
      token,
      expiresAt,
      used: false,
    });

    return token;
  }

  validatePasswordResetToken(token: string, email: string): { valid: boolean; reason?: string } {
    if (!token || !email) {
      return { valid: false, reason: 'Invalid parameters' };
    }

    const record = this.passwordResetTokens.get(token);
    if (!record) {
      return { valid: false, reason: 'Password reset token not found or invalid' };
    }

    if (record.email.toLowerCase() !== email.trim().toLowerCase()) {
      return { valid: false, reason: 'Token email mismatch' };
    }

    if (record.used) {
      return { valid: false, reason: 'This password reset link has already been used' };
    }

    if (new Date() > record.expiresAt) {
      return { valid: false, reason: 'Password reset link has expired. Please request a new one.' };
    }

    return { valid: true };
  }

  resetUserPassword(token: string, email: string, newPassword: string): { success: boolean; message: string } {
    const validation = this.validatePasswordResetToken(token, email);
    if (!validation.valid) {
      return { success: false, message: validation.reason || 'Invalid reset token' };
    }

    // Find user in store
    const user = this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'User account not found' };
    }

    // Mark token as used
    const record = this.passwordResetTokens.get(token);
    if (record) {
      record.used = true;
      this.passwordResetTokens.set(token, record);
    }

    return { success: true, message: 'Password updated successfully' };
  }

  findUserByEmail(email: string): User | undefined {
    if (!email) return undefined;
    return this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  createUser(userData: Partial<User> & { name: string; email: string }): User {
    const newUser: User = {
      _id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone || '',
      role: userData.role || 'customer',
      addresses: userData.addresses || [],
      wishlist: userData.wishlist || [],
      walletBalance: userData.walletBalance || 250,
      passwordHash: userData.passwordHash,
    };
    this.users.unshift(newUser);
    return newUser;
  }

  sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  resetToDefaults() {
    this.products = [...initialProducts];
    this.categories = [...initialCategories];
    this.blogs = [...initialBlogs];
    this.reviews = [...initialReviews];
    this.coupons = [...initialCoupons];
    this.activeSessions.clear();
    this.passwordResetTokens.clear();
  }
}

export const inMemoryStore = new InMemoryStore();

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;
  if (!MONGODB_URI || MONGODB_URI.includes("username:password")) {
    console.log("Using In-Memory Database Fallback (No live MONGODB_URI detected)");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.warn("MongoDB connection warning, using in-memory store:", error);
  }
}
