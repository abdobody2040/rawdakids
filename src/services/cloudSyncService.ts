// src/services/cloudSyncService.ts
// Disabled permanently per Privacy Policy (Zero remote sync).
export interface ParentUserSession {
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
}

export class CloudSyncService {
  async getSession(): Promise<ParentUserSession | null> {
    return null;
  }
  async getLastSyncTime(): Promise<string | null> {
    return null;
  }
  async login(_email: string, _pass: string): Promise<{ success: boolean; session?: ParentUserSession; errorAr?: string; errorEn?: string }> {
    return { success: false, errorAr: 'المزامنة السحابية غير متاحة', errorEn: 'Cloud sync is disabled' };
  }
  async logout(): Promise<void> {}
  async pushProgress(_data: any): Promise<{ success: boolean; syncedAt?: string; errorAr?: string; errorEn?: string }> {
    return { success: false, errorAr: 'المزامنة السحابية غير متاحة', errorEn: 'Cloud sync is disabled' };
  }
  async pullProgress(): Promise<{ success: boolean; hasData?: boolean; snapshot?: any; syncedAt?: string; errorAr?: string; errorEn?: string }> {
    return { success: false, errorAr: 'المزامنة السحابية غير متاحة', errorEn: 'Cloud sync is disabled' };
  }
}

export const cloudSyncService = new CloudSyncService();
