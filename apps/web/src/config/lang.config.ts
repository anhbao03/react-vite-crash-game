/**
 * Language Configuration
 * Determines which language is built into the bundle
 * Can be set via environment variable during build time
 */

export type SupportedLang = 'en_US' | 'vi_VN';

// Read from Vite's import.meta.env or fallback to en_US
export const LANG: SupportedLang = 
  (import.meta.env.VITE_LANG_CODE as SupportedLang) || 'en_US';

// Available languages metadata
export const AVAILABLE_LANGUAGES = {
  en_US: {
    code: 'en_US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr' as const,
  },
  vi_VN: {
    code: 'vi_VN',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr' as const,
  },
} as const;

// Current language metadata
export const CURRENT_LANG = AVAILABLE_LANGUAGES[LANG];

// Debug info
if (import.meta.env.DEV) {
  console.log(`[Localization] Current language: ${LANG} (${CURRENT_LANG.nativeName})`);
}
