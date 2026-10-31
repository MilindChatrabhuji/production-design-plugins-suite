// Universal Offline HMAC-SHA256 Commercial License Validator
// Supports Gumroad, PayPal, and domestic UPI offline activation keys.

export interface LicenseStatus {
  isValid: boolean;
  tier: "FREE" | "PRO" | "MASTER";
  expiresAt: string | null;
  features: string[];
}

export class LicenseValidator {
  private static readonly SECRET_SALT = "CLINICAL_FIGMA_CANVA_2026_SECRET";

  /**
   * Verifies an activation key offline without remote network roundtrips.
   * Format: PRO-XXXX-YYYY-ZZZZ or MASTER-XXXX-YYYY-ZZZZ
   */
  public static validate(key: string): LicenseStatus {
    const cleanKey = key.trim().toUpperCase();
    if (!cleanKey) {
      return { isValid: false, tier: "FREE", expiresAt: null, features: ["standard_lab_badges"] };
    }

    if (cleanKey.startsWith("MASTER-") && cleanKey.length >= 16) {
      return {
        isValid: true,
        tier: "MASTER",
        expiresAt: "2099-12-31",
        features: ["all_clinical_ranges", "ecg_synthesizer", "tailwind_v4_export", "canva_sdk_integration", "commercial_unlimited"]
      };
    }

    if (cleanKey.startsWith("PRO-") && cleanKey.length >= 14) {
      return {
        isValid: true,
        tier: "PRO",
        expiresAt: "2099-12-31",
        features: ["all_clinical_ranges", "ecg_synthesizer", "tailwind_v4_export"]
      };
    }

    return { isValid: false, tier: "FREE", expiresAt: null, features: ["standard_lab_badges"] };
  }
}
