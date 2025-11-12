/**
 * Localization Manager
 * Handles text translations and asset paths based on selected language
 * Tree-shakable: only includes the selected language in the bundle
 */

import { LANG, CURRENT_LANG } from '../config/lang.config';
import type { SupportedLang } from '../config/lang.config';

// Import language files - tree-shaking will remove unused ones
import en_US_texts from './en_US/texts.json';
import vi_VN_texts from './vi_VN/texts.json';
import en_US_assets from './en_US/assets.json';
import vi_VN_assets from './vi_VN/assets.json';

// Type definitions
type TextsData = typeof en_US_texts;
type AssetsData = typeof en_US_assets;

// Language data map
const TEXTS_MAP: Record<SupportedLang, TextsData> = {
  en_US: en_US_texts,
  vi_VN: vi_VN_texts,
};

const ASSETS_MAP: Record<SupportedLang, AssetsData> = {
  en_US: en_US_assets,
  vi_VN: vi_VN_assets,
};

/**
 * Localization Manager Singleton
 * Provides translation and asset path resolution
 */
class LocalizationManager {
  private static _instance: LocalizationManager;
  private texts: TextsData;
  private assets: AssetsData;
  public readonly lang: SupportedLang;
  public readonly langInfo: typeof CURRENT_LANG;

  private constructor() {
    this.lang = LANG;
    this.langInfo = CURRENT_LANG;
    this.texts = TEXTS_MAP[LANG];
    this.assets = ASSETS_MAP[LANG];

    if (import.meta.env.DEV) {
      console.log(
        `[LocalizationManager] Initialized with ${this.lang} (${this.langInfo.nativeName})`
      );
    }
  }

  /**
   * Get singleton instance
   */
  static get instance(): LocalizationManager {
    if (!this._instance) {
      this._instance = new LocalizationManager();
    }
    return this._instance;
  }

  /**
   * Get translated text by key path
   * Supports nested keys with dot notation (e.g., "GAME.STATUS.FLYING")
   * Supports parameter interpolation with {key} syntax
   * 
   * @param path - Dot-separated key path (e.g., "GAME.STATUS.WAITING")
   * @param params - Optional parameters for interpolation (e.g., { player: "Alice", amount: 100 })
   * @returns Translated text with interpolated parameters
   * 
   * @example
   * t('GAME.STATUS.WAITING') // "Waiting for round..."
   * t('PLAYER.CASHED_OUT', { player: 'Alice', multiplier: 2.5, amount: 100 })
   * // "Alice cashed out at 2.5x (+100)"
   */
  t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split('.');
    let result: any = this.texts;

    // Navigate through nested object
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        // Key not found, return path as fallback
        console.warn(`[LocalizationManager] Missing translation key: ${path}`);
        return path;
      }
    }

    // Convert to string
    let text = String(result);

    // Interpolate parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        text = text.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    return text;
  }

  /**
   * Get asset path by key
   * Supports nested keys with dot notation (e.g., "SOUNDS.CRASH")
   * 
   * @param path - Dot-separated asset key path
   * @returns Asset file path
   * 
   * @example
   * getAsset('SOUNDS.CRASH') // "/assets/en_US/sounds/crash.mp3"
   */
  getAsset(path: string): string {
    const keys = path.split('.');
    let result: any = this.assets;

    // Navigate through nested object
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        console.warn(`[LocalizationManager] Missing asset key: ${path}`);
        return '';
      }
    }

    return String(result);
  }

  /**
   * Get all assets in a category
   * @param category - Asset category (e.g., "SOUNDS", "IMAGES")
   * @returns Object with all assets in category
   */
  getAssetCategory<K extends keyof AssetsData>(category: K): AssetsData[K] {
    return this.assets[category];
  }

  /**
   * Check if a translation key exists
   * @param path - Translation key path
   * @returns True if key exists
   */
  hasKey(path: string): boolean {
    const keys = path.split('.');
    let result: any = this.texts;

    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return false;
    }

    return true;
  }

  /**
   * Get all texts (useful for debugging)
   * @returns All translation texts
   */
  getAllTexts(): TextsData {
    return this.texts;
  }

  /**
   * Get all assets (useful for preloading)
   * @returns All asset paths
   */
  getAllAssets(): AssetsData {
    return this.assets;
  }
}

// Export singleton instance methods
const localization = LocalizationManager.instance;

/**
 * Translate text by key
 * Shorthand for LocalizationManager.instance.t()
 * 
 * @example
 * import { t } from '@/localization/localizationManager';
 * 
 * // Simple translation
 * const text = t('GAME.STATUS.WAITING');
 * 
 * // With parameters
 * const message = t('PLAYER.CASHED_OUT', { 
 *   player: 'Alice', 
 *   multiplier: 2.5, 
 *   amount: 100 
 * });
 */
export const t = (path: string, params?: Record<string, string | number>): string =>
  localization.t(path, params);

/**
 * Get asset path by key
 * Shorthand for LocalizationManager.instance.getAsset()
 * 
 * @example
 * import { getAsset } from '@/localization/localizationManager';
 * 
 * const crashSound = getAsset('SOUNDS.CRASH');
 * // "/assets/en_US/sounds/crash.mp3"
 */
export const getAsset = (path: string): string =>
  localization.getAsset(path);

/**
 * Get all assets in a category
 * 
 * @example
 * import { getAssetCategory } from '@/localization/localizationManager';
 * 
 * const allSounds = getAssetCategory('SOUNDS');
 */
export const getAssetCategory = <K extends keyof AssetsData>(category: K): AssetsData[K] =>
  localization.getAssetCategory(category);

// Export the singleton instance for advanced usage
export { LocalizationManager };
export default localization;

// Export types
export type { TextsData, AssetsData };
