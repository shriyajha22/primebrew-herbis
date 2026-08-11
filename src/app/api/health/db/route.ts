import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { UserModel } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics = {
    ENV_PRESENT: false,
    URI_VALID: false,
    NETWORK_OK: false,
    AUTH_OK: false,
    DATABASE_ACCESS_OK: false,
    USERS_COLLECTION_OK: false,
    SAFE_ERROR_CATEGORY: 'None',
  };

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri || rawUri.includes("username:password")) {
    diagnostics.SAFE_ERROR_CATEGORY = 'ENV_MISSING_OR_UNCONFIGURED';
    return NextResponse.json({ success: false, diagnostics });
  }

  diagnostics.ENV_PRESENT = true;

  if (rawUri.startsWith('mongodb+srv://') || rawUri.startsWith('mongodb://')) {
    diagnostics.URI_VALID = true;
  } else {
    diagnostics.SAFE_ERROR_CATEGORY = 'INVALID_URI_SCHEME';
    return NextResponse.json({ success: false, diagnostics });
  }

  try {
    const conn = await mongoose.connect(rawUri, {
      dbName: 'primebrew',
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    diagnostics.NETWORK_OK = true;
    diagnostics.AUTH_OK = true;

    if (conn.connection.db) {
      diagnostics.DATABASE_ACCESS_OK = true;
      const count = await UserModel.countDocuments();
      diagnostics.USERS_COLLECTION_OK = true;
      
      return NextResponse.json({
        success: true,
        message: 'MongoDB Production Connection Healthy',
        diagnostics,
        userCount: count,
      });
    }
  } catch (err: any) {
    const msg = err.message || '';
    if (err.name === 'MongoServerSelectionError' || msg.includes('selection timed out')) {
      diagnostics.SAFE_ERROR_CATEGORY = 'NETWORK_OR_IP_WHITELIST_BLOCKED';
    } else if (msg.includes('Authentication failed') || err.code === 18) {
      diagnostics.NETWORK_OK = true;
      diagnostics.SAFE_ERROR_CATEGORY = 'AUTHENTICATION_FAILED_CREDENTIALS_INVALID';
    } else if (err.name === 'MongoParseError') {
      diagnostics.SAFE_ERROR_CATEGORY = 'MALFORMED_URI_OR_UNENCODED_CHARACTERS';
    } else {
      diagnostics.SAFE_ERROR_CATEGORY = `CONNECTION_EXCEPTION_${err.name || 'UNKNOWN'}`;
    }
  }

  return NextResponse.json({ success: false, diagnostics });
}
