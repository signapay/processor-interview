import crypto from "crypto";

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export class CryptoService {
  private readonly algorithm = "aes-256-gcm";
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly tagLength = 16; // 128 bits
  private readonly key: Buffer;

  constructor(encryptionKey?: string) {
    // Use provided key or generate a random one (for development only)
    if (encryptionKey) {
      // Use the provided key, ensuring it's the right length
      this.key = crypto.scryptSync(encryptionKey, "salt", this.keyLength);
    } else {
      // For production, always provide a key
      const envKey = process.env.ENCRYPTION_KEY;
      if (envKey) {
        this.key = crypto.scryptSync(envKey, "salt", this.keyLength);
      } else {
        // Fallback for development only - in production, this should throw an error
        console.warn(
          "WARNING: No encryption key provided. Using a random key. This is not secure for production!",
        );
        this.key = crypto.randomBytes(this.keyLength);
      }
    }
  }

  // Encrypt data using AES-256-GCM
  encrypt(data: string): EncryptionResult {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(this.ivLength);

    // Create a cipher
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv, {
      authTagLength: this.tagLength,
    });

    // Encrypt the data
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get the authentication tag
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  }

  // Decrypt data using AES-256-GCM
  decrypt(encryptedData: string, iv: string, authTag: string): string {
    try {
      // Create a decipher
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, "hex"),
        {
          authTagLength: this.tagLength,
        },
      );

      // Set the authentication tag
      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      // Decrypt the data
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${(error as Error).message}`);
    }
  }
}
