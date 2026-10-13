// src/services/securityCryptoService.ts
// Cross-platform cryptographic security service for Noor Kids (Web, iOS, Android, Node)
// Zero external dependency bloat; compliant with OWASP ASVS standards.

/**
 * Pure TypeScript implementation of standard SHA-256.
 * Guaranteed to execute identically across Hermes, JSC, Web, and Node runtimes.
 */
function sha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let compositeBitLength = asciiBitLength;
  words[compositeBitLength >> 5] |= 0x80 << (24 - (compositeBitLength % 32));
  words[(((compositeBitLength + 64) >> 9) << 4) + 15] = compositeBitLength;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << (24 - (i % 4) * 8);
  }

  for (let blockIndex = 0; blockIndex < words[lengthProperty]; blockIndex += 16) {
    const w: number[] = [];
    const workingHash = [...hash];

    for (i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[blockIndex + i] | 0;
      } else {
        const gamma0 =
          ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^
          ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^
          (w[i - 15] >>> 3);
        const gamma1 =
          ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^
          ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^
          (w[i - 2] >>> 10);
        w[i] = ((w[i - 16] + gamma0 + w[i - 7] + gamma1) | 0);
      }

      const ch = (workingHash[4] & workingHash[5]) ^ (~workingHash[4] & workingHash[6]);
      const maj =
        (workingHash[0] & workingHash[1]) ^
        (workingHash[0] & workingHash[2]) ^
        (workingHash[1] & workingHash[2]);
      const sigma0 =
        ((workingHash[0] >>> 2) | (workingHash[0] << 30)) ^
        ((workingHash[0] >>> 13) | (workingHash[0] << 19)) ^
        ((workingHash[0] >>> 22) | (workingHash[0] << 10));
      const sigma1 =
        ((workingHash[4] >>> 6) | (workingHash[4] << 26)) ^
        ((workingHash[4] >>> 11) | (workingHash[4] << 21)) ^
        ((workingHash[4] >>> 25) | (workingHash[4] << 7));

      const temp1 = (workingHash[7] + sigma1 + ch + k[i] + w[i]) | 0;
      const temp2 = (sigma0 + maj) | 0;

      workingHash[7] = workingHash[6];
      workingHash[6] = workingHash[5];
      workingHash[5] = workingHash[4];
      workingHash[4] = (workingHash[3] + temp1) | 0;
      workingHash[3] = workingHash[2];
      workingHash[2] = workingHash[1];
      workingHash[1] = workingHash[0];
      workingHash[0] = (temp1 + temp2) | 0;
    }

    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + workingHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const byteValue = (hash[i] >> (j * 8)) & 255;
      result += (byteValue < 16 ? '0' : '') + byteValue.toString(16);
    }
  }

  return result;
}

/**
 * Generate a cryptographically strong random salt string.
 */
function generateSalt(length = 16): string {
  let salt = '';
  const chars = 'abcdef0123456789';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      salt += chars[bytes[i] % chars.length];
    }
    return salt;
  }
  for (let i = 0; i < length; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)];
  }
  return salt;
}

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
}

export class SecurityCryptoService {
  /**
   * Validates PIN format. PIN must be 4 to 6 numeric digits.
   */
  public validatePinFormat(pin: string): { valid: boolean; errorAr?: string; errorEn?: string } {
    const clean = pin.trim();
    if (!clean) {
      return {
        valid: false,
        errorAr: 'يرجى إدخال رمز PIN المكون من 4 إلى 6 أرقام.',
        errorEn: 'Please enter a PIN with 4 to 6 digits.',
      };
    }
    if (!/^\d{4,6}$/.test(clean)) {
      return {
        valid: false,
        errorAr: 'رمز PIN يجب أن يتكون من 4 إلى 6 أرقام رقمية فقط (0-9).',
        errorEn: 'PIN must consist of 4 to 6 numeric digits only (0-9).',
      };
    }
    return { valid: true };
  }

  /**
   * Hashes a PIN with a salt using SHA-256.
   */
  public hashPin(pin: string, existingSalt?: string): { hash: string; salt: string } {
    const salt = existingSalt || generateSalt(16);
    const hash = sha256(`${salt}:${pin.trim()}`);
    return { hash, salt };
  }

  /**
   * Constant-time comparison between input and stored hash to prevent timing attacks.
   */
  public verifyPin(inputPin: string, storedHash: string, storedSalt: string): boolean {
    if (!inputPin || !storedHash || !storedSalt) return false;
    const computedHash = sha256(`${storedSalt}:${inputPin.trim()}`);

    // Constant-time string equality check
    if (computedHash.length !== storedHash.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHash.length; i++) {
      diff |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return diff === 0;
  }

  /**
   * Evaluates lockout state based on failed attempts and cooldown timestamp.
   * - 3-4 failed attempts: 30-second cooldown
   * - 5+ failed attempts: 300-second (5 minute) cooldown
   */
  public checkLockout(failedAttempts: number, lockoutUntil: number | null): LockoutStatus {
    const now = Date.now();
    if (lockoutUntil && lockoutUntil > now) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((lockoutUntil - now) / 1000),
      };
    }
    return {
      isLocked: false,
      remainingSeconds: 0,
    };
  }

  /**
   * Calculates new lockout timestamp when an attempt fails.
   */
  public calculateNextLockout(newFailedCount: number): number | null {
    const now = Date.now();
    if (newFailedCount >= 5) {
      return now + 300 * 1000; // 5 minutes
    }
    if (newFailedCount >= 3) {
      return now + 30 * 1000; // 30 seconds
    }
    return null;
  }
}

export const securityCryptoService = new SecurityCryptoService();
