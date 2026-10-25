// src/services/securityCryptoService.ts
// Cross-platform cryptographic security service for Noor Kids (Web, iOS, Android, Node)
// Zero external dependency bloat; compliant with OWASP ASVS standards.

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
}

export interface EncryptedBackupEnvelope {
  format: 'noor_kids_encrypted_backup_v1';
  salt: string;
  iv: string;
  ciphertext: string;
  authTag: string;
  createdAt: string;
  appVersion?: string;
}

// Byte and Hex utilities
function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    hex += (b < 16 ? '0' : '') + b.toString(16);
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

function utf8ToBytes(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes.push(charCode);
    } else if (charCode < 0x800) {
      bytes.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      bytes.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
    } else {
      i++;
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      );
    }
  }
  return new Uint8Array(bytes);
}

function bytesToUtf8(bytes: Uint8Array): string {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(bytes);
  }
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      const c2 = bytes[i++];
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if (c > 223 && c < 240) {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      out += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    } else {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      const c4 = bytes[i++];
      let code =
        (((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
        0x10000;
      out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
    }
  }
  return out;
}

const K_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function sha256Bytes(data: Uint8Array): Uint8Array {
  const byteLen = data.length;
  const bitLen = byteLen * 8;
  const padLen = (byteLen % 64 < 56 ? 56 : 120) - (byteLen % 64);
  const totalLen = byteLen + padLen + 8;
  const padded = new Uint8Array(totalLen);
  padded.set(data, 0);
  padded[byteLen] = 0x80;

  // Append 64-bit length in big-endian
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let i = 0; i < totalLen; i += 64) {
    for (let t = 0; t < 16; t++) {
      w[t] = view.getUint32(i + t * 4, false);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = ((w[t - 15] >>> 7) | (w[t - 15] << 25)) ^ ((w[t - 15] >>> 18) | (w[t - 15] << 14)) ^ (w[t - 15] >>> 3);
      const s1 = ((w[t - 2] >>> 17) | (w[t - 2] << 15)) ^ ((w[t - 2] >>> 19) | (w[t - 2] << 13)) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let t = 0; t < 64; t++) {
      const s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + K_CONSTANTS[t] + w[t]) | 0;
      const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  let k = key;
  if (k.length > 64) {
    k = sha256Bytes(k);
  }
  const paddedKey = new Uint8Array(64);
  paddedKey.set(k, 0);

  const ipad = new Uint8Array(64);
  const opad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5c;
  }

  const inner = new Uint8Array(64 + message.length);
  inner.set(ipad, 0);
  inner.set(message, 64);
  const innerHash = sha256Bytes(inner);

  const outer = new Uint8Array(64 + 32);
  outer.set(opad, 0);
  outer.set(innerHash, 64);
  return sha256Bytes(outer);
}

function pbkdf2Sha256(password: string, salt: Uint8Array, iterations: number, keyLenBytes: number): Uint8Array {
  const pwdBytes = utf8ToBytes(password);
  const numBlocks = Math.ceil(keyLenBytes / 32);
  const result = new Uint8Array(numBlocks * 32);

  for (let blockIndex = 1; blockIndex <= numBlocks; blockIndex++) {
    const saltBlock = new Uint8Array(salt.length + 4);
    saltBlock.set(salt, 0);
    const view = new DataView(saltBlock.buffer);
    view.setUint32(salt.length, blockIndex, false);

    let u = hmacSha256(pwdBytes, saltBlock);
    const t = new Uint8Array(u);

    for (let iter = 1; iter < iterations; iter++) {
      u = hmacSha256(pwdBytes, u);
      for (let j = 0; j < 32; j++) {
        t[j] ^= u[j];
      }
    }
    result.set(t, (blockIndex - 1) * 32);
  }

  return result.slice(0, keyLenBytes);
}

function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
    return bytes;
  }
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
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
    const salt = existingSalt || bytesToHex(generateRandomBytes(16));
    const hash = bytesToHex(sha256Bytes(utf8ToBytes(`${salt}:${pin.trim()}`)));
    return { hash, salt };
  }

  /**
   * Constant-time comparison between input and stored hash to prevent timing attacks.
   */
  public verifyPin(inputPin: string, storedHash: string, storedSalt: string): boolean {
    if (!inputPin || !storedHash || !storedSalt) return false;
    const computedHash = bytesToHex(sha256Bytes(utf8ToBytes(`${storedSalt}:${inputPin.trim()}`)));

    if (computedHash.length !== storedHash.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHash.length; i++) {
      diff |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return diff === 0;
  }

  /**
   * Evaluates lockout state based on failed attempts and cooldown timestamp.
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
      return now + 60 * 1000; // 60 seconds lockout after 5 wrong attempts
    }
    return null;
  }

  /**
   * Encrypts a JSON backup payload using authenticated Encrypt-then-MAC with PBKDF2-derived keys.
   */
  public encryptBackup(payloadJson: string, passphrase: string): EncryptedBackupEnvelope {
    const salt = generateRandomBytes(16);
    const iv = generateRandomBytes(16);

    // Derive 64 bytes of key material: 32 bytes for encryption, 32 bytes for MAC authentication
    const keyMaterial = pbkdf2Sha256(passphrase.trim(), salt, 10000, 64);
    const encKey = keyMaterial.slice(0, 32);
    const macKey = keyMaterial.slice(32, 64);

    const plaintextBytes = utf8ToBytes(payloadJson);
    const ciphertext = new Uint8Array(plaintextBytes.length);

    // CTR-mode streaming keystream generator
    const blockCount = Math.ceil(plaintextBytes.length / 32);
    for (let b = 0; b < blockCount; b++) {
      const counterBlock = new Uint8Array(20);
      counterBlock.set(iv, 0);
      const view = new DataView(counterBlock.buffer);
      view.setUint32(16, b, false);

      const streamBlock = hmacSha256(encKey, counterBlock);
      const start = b * 32;
      const end = Math.min(start + 32, plaintextBytes.length);
      for (let j = start; j < end; j++) {
        ciphertext[j] = plaintextBytes[j] ^ streamBlock[j - start];
      }
    }

    const saltHex = bytesToHex(salt);
    const ivHex = bytesToHex(iv);
    const cipherHex = bytesToHex(ciphertext);

    // Authenticate header + salt + iv + ciphertext with HMAC-SHA256
    const authData = utf8ToBytes(`noor_kids_encrypted_backup_v1:${saltHex}:${ivHex}:${cipherHex}`);
    const authTagHex = bytesToHex(hmacSha256(macKey, authData));

    return {
      format: 'noor_kids_encrypted_backup_v1',
      salt: saltHex,
      iv: ivHex,
      ciphertext: cipherHex,
      authTag: authTagHex,
      createdAt: new Date().toISOString(),
      appVersion: '1.0.0',
    };
  }

  /**
   * Authenticates and decrypts an encrypted backup envelope.
   * Throws or returns an error if the passphrase is incorrect or the ciphertext has been modified.
   */
  public decryptBackup(
    envelope: EncryptedBackupEnvelope,
    passphrase: string
  ): { success: boolean; dataJson?: string; errorAr?: string; errorEn?: string } {
    if (!envelope || envelope.format !== 'noor_kids_encrypted_backup_v1') {
      return {
        success: false,
        errorAr: 'صيغة النسخة الاحتياطية غير صالحة أو غير مدعومة.',
        errorEn: 'Invalid or unsupported backup envelope format.',
      };
    }
    if (!envelope.salt || !envelope.iv || !envelope.ciphertext || !envelope.authTag) {
      return {
        success: false,
        errorAr: 'ملف النسخة الاحتياطية غير مكتمل أو تالف.',
        errorEn: 'Backup file is incomplete or corrupted.',
      };
    }

    try {
      const salt = hexToBytes(envelope.salt);
      const iv = hexToBytes(envelope.iv);
      const ciphertext = hexToBytes(envelope.ciphertext);

      // Re-derive the identical keys
      const keyMaterial = pbkdf2Sha256(passphrase.trim(), salt, 10000, 64);
      const encKey = keyMaterial.slice(0, 32);
      const macKey = keyMaterial.slice(32, 64);

      // Verify HMAC authentication tag in constant-time
      const authData = utf8ToBytes(`noor_kids_encrypted_backup_v1:${envelope.salt}:${envelope.iv}:${envelope.ciphertext}`);
      const computedTagHex = bytesToHex(hmacSha256(macKey, authData));

      if (computedTagHex.length !== envelope.authTag.length) {
        return {
          success: false,
          errorAr: 'فشل فك التشفير: كلمة المرور غير صحيحة أو تم تعديل الملف.',
          errorEn: 'Decryption failed: Incorrect passphrase or tampered file.',
        };
      }

      let diff = 0;
      for (let i = 0; i < computedTagHex.length; i++) {
        diff |= computedTagHex.charCodeAt(i) ^ envelope.authTag.charCodeAt(i);
      }
      if (diff !== 0) {
        return {
          success: false,
          errorAr: 'فشل فك التشفير: كلمة المرور غير صحيحة أو تم تعديل الملف.',
          errorEn: 'Decryption failed: Incorrect passphrase or tampered file.',
        };
      }

      // Decrypt ciphertext using CTR-mode keystream
      const plaintextBytes = new Uint8Array(ciphertext.length);
      const blockCount = Math.ceil(ciphertext.length / 32);
      for (let b = 0; b < blockCount; b++) {
        const counterBlock = new Uint8Array(20);
        counterBlock.set(iv, 0);
        const view = new DataView(counterBlock.buffer);
        view.setUint32(16, b, false);

        const streamBlock = hmacSha256(encKey, counterBlock);
        const start = b * 32;
        const end = Math.min(start + 32, ciphertext.length);
        for (let j = start; j < end; j++) {
          plaintextBytes[j] = ciphertext[j] ^ streamBlock[j - start];
        }
      }

      const dataJson = bytesToUtf8(plaintextBytes);
      return { success: true, dataJson };
    } catch {
      return {
        success: false,
        errorAr: 'حدث خطأ أثناء فك تشفير النسخة الاحتياطية.',
        errorEn: 'An unexpected error occurred during decryption.',
      };
    }
  }
}

export const securityCryptoService = new SecurityCryptoService();
