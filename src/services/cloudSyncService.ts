// src/services/cloudSyncService.ts
// Secure multi-tenant Cloud Synchronization Service for Noor Kids.
// Compliant with OWASP ASVS V2 (Authentication), V3 (Session Management) & V4 (Access Control).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { backupValidationService, ValidatedBackupData } from './backupValidationService';

const AUTH_STORAGE_KEY = '@noor_kids:parent_jwt_token';
const AUTH_USER_KEY = '@noor_kids:parent_user_session';
const LAST_SYNC_KEY = '@noor_kids:last_cloud_sync_time';

export interface ParentUserSession {
  id: string;
  email: string;
  token: string;
  expiresAt: number; // Unix timestamp in seconds
}

export interface SyncPushResult {
  success: boolean;
  syncedAt?: string;
  errorAr?: string;
  errorEn?: string;
}

export interface SyncPullResult {
  success: boolean;
  hasData: boolean;
  syncedAt?: string | null;
  data?: ValidatedBackupData | null;
  errorAr?: string;
  errorEn?: string;
}

export class CloudSyncService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    // In production or web, empty baseUrl routes to same origin (/api/...)
    this.baseUrl = baseUrl;
  }

  /**
   * Authenticate parent with credentials and securely store JWT session
   */
  public async login(email: string, password: string): Promise<{ success: boolean; session?: ParentUserSession; errorAr?: string; errorEn?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      if (!response.ok || !json.token) {
        return {
          success: false,
          errorAr: 'فشل تسجيل الدخول. يرجى التحقق من البريد وكلمة المرور.',
          errorEn: json.error || 'Login failed. Please check your credentials.',
        };
      }

      const session: ParentUserSession = {
        id: json.user?.id || 'usr_anonymous',
        email: json.user?.email || email,
        token: json.token,
        expiresAt: Math.floor(Date.now() / 1000) + (json.expiresIn || 7200),
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, session.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(session));

      return { success: true, session };
    } catch {
      return {
        success: false,
        errorAr: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
        errorEn: 'Could not connect to server. Check your connection.',
      };
    }
  }

  /**
   * Log out parent and scrub stored tokens
   */
  public async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
      await AsyncStorage.removeItem(LAST_SYNC_KEY);
    } catch (e) {
      console.warn('Failed to clear sync session', e);
    }
  }

  /**
   * Retrieve active session if token is still valid
   */
  public async getSession(): Promise<ParentUserSession | null> {
    try {
      const rawSession = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (!rawSession) return null;
      const session: ParentUserSession = JSON.parse(rawSession);

      const now = Math.floor(Date.now() / 1000);
      if (session.expiresAt && session.expiresAt <= now) {
        await this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Get last synchronization timestamp
   */
  public async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Push current child profiles & progress securely to the cloud
   */
  public async pushProgress(payload: {
    profiles: any[];
    activeProfileId: string;
    profilesProgress: Record<string, any>;
    parentSettings: any;
    gratitudeEntries: any[];
  }): Promise<SyncPushResult> {
    const session = await this.getSession();
    if (!session || !session.token) {
      return {
        success: false,
        errorAr: 'يرجى تسجيل الدخول أولاً للمزامنة السحابية.',
        errorEn: 'Please log in first to sync data.',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          ...payload,
          clientTimestamp: new Date().toISOString(),
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        return {
          success: false,
          errorAr: 'فشلت المزامنة السحابية. يرجى المحاولة لاحقاً.',
          errorEn: json.error || 'Cloud sync failed.',
        };
      }

      const syncTime = json.syncedAt || new Date().toISOString();
      await AsyncStorage.setItem(LAST_SYNC_KEY, syncTime);

      return {
        success: true,
        syncedAt: syncTime,
      };
    } catch {
      return {
        success: false,
        errorAr: 'خطأ في الشبكة أثناء رفع البيانات.',
        errorEn: 'Network error while syncing data to cloud.',
      };
    }
  }

  /**
   * Pull progress from the cloud, validate schema strictly, and return sanitized data
   */
  public async pullProgress(): Promise<SyncPullResult> {
    const session = await this.getSession();
    if (!session || !session.token) {
      return {
        success: false,
        hasData: false,
        errorAr: 'يرجى تسجيل الدخول أولاً لاستعادة البيانات.',
        errorEn: 'Please log in first to pull data.',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/sync/pull`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        return {
          success: false,
          hasData: false,
          errorAr: 'تعذر جلب البيانات السحابية.',
          errorEn: json.error || 'Failed to pull cloud snapshot.',
        };
      }

      if (!json.hasData || !json.snapshot) {
        return {
          success: true,
          hasData: false,
          syncedAt: null,
          data: null,
        };
      }

      // Strict schema validation & prototype pollution scrub
      const validation = backupValidationService.validate(JSON.stringify(json.snapshot));
      if (!validation.valid || !validation.sanitizedData) {
        return {
          success: false,
          hasData: true,
          errorAr: validation.errorAr || 'البيانات السحابية غير صالحة أو تالفة.',
          errorEn: validation.errorEn || 'Cloud snapshot contains invalid schema.',
        };
      }

      if (json.syncedAt) {
        await AsyncStorage.setItem(LAST_SYNC_KEY, json.syncedAt);
      }

      return {
        success: true,
        hasData: true,
        syncedAt: json.syncedAt,
        data: validation.sanitizedData,
      };
    } catch {
      return {
        success: false,
        hasData: false,
        errorAr: 'خطأ في الشبكة أثناء جلب البيانات.',
        errorEn: 'Network error while pulling cloud data.',
      };
    }
  }
}

export const cloudSyncService = new CloudSyncService();
