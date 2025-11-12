# 🌍 Localization System

## Overview

This is a **build-time localization system** that only includes the selected language in the final bundle, resulting in smaller bundle sizes and better performance.

## Features

- ✅ **Build-time language selection** - Only one language per build
- ✅ **Tree-shakable** - Unused languages are removed from bundle
- ✅ **Type-safe** - Full TypeScript support with autocomplete
- ✅ **Easy to add languages** - Just create a new folder
- ✅ **Supports assets** - Different images/sounds per language
- ✅ **Parameter interpolation** - Dynamic text with `{param}` syntax
- ✅ **Nested keys** - Use dot notation like `GAME.STATUS.FLYING`

## Quick Start

### 1. Using translations in code

```typescript
import { t } from '@/localization/localizationManager';

// Simple translation
const text = t('GAME.STATUS.WAITING');
// Result: "Waiting for round..." (en_US) or "Đang chờ vòng mới..." (vi_VN)

// With parameters
const message = t('PLAYER.CASHED_OUT', {
  player: 'Alice',
  multiplier: 2.5,
  amount: 100
});
// Result: "Alice cashed out at 2.5x (+100)"
```

### 2. Using assets

```typescript
import { getAsset, getAssetCategory } from '@/localization/localizationManager';

// Get single asset
const crashSound = getAsset('SOUNDS.CRASH');
// Result: "/assets/en_US/sounds/crash.mp3"

// Get asset category
const allSounds = getAssetCategory('SOUNDS');
// Result: { BET_PLACED: "/assets/en_US/sounds/bet_placed.mp3", ... }
```

### 3. Get current language info

```typescript
import { CURRENT_LANG } from '@/config/lang.config';

console.log(CURRENT_LANG.nativeName); // "English" or "Tiếng Việt"
console.log(CURRENT_LANG.flag); // "🇺🇸" or "🇻🇳"
```

## Building

### Build for specific language

```bash
# Build English version
npm run build:en

# Build Vietnamese version
npm run build:vi

# Build all languages
npm run build:all
```

### Development with specific language

```bash
# Dev server with English
npm run dev:en

# Dev server with Vietnamese
npm run dev:vi
```

### Build outputs

Each language build creates a separate output folder:
```
dist/
├── en_US/
│   ├── index.html
│   └── assets/
│       └── index-en_US-[hash].js
└── vi_VN/
    ├── index.html
    └── assets/
        └── index-vi_VN-[hash].js
```

## Adding a New Language

### 1. Create language folders

```bash
mkdir -p src/localization/zh_CN
mkdir -p public/assets/zh_CN/{sounds,images,fonts,animations}
```

### 2. Create `texts.json`

Copy from `en_US/texts.json` and translate:

```json
{
  "APP": {
    "TITLE": "崩溃游戏",
    "SUBTITLE": "多人投注游戏"
  },
  "GAME": {
    "STATUS": {
      "WAITING": "等待下一轮...",
      "FLYING": "飞行中！"
    }
  }
}
```

### 3. Create `assets.json`

```json
{
  "SOUNDS": {
    "CRASH": "/assets/zh_CN/sounds/crash.mp3"
  },
  "IMAGES": {
    "LOGO": "/assets/zh_CN/images/logo.png"
  }
}
```

### 4. Update `lang.config.ts`

```typescript
export type SupportedLang = 'en_US' | 'vi_VN' | 'zh_CN';

export const AVAILABLE_LANGUAGES = {
  en_US: { /* ... */ },
  vi_VN: { /* ... */ },
  zh_CN: {
    code: 'zh_CN',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr' as const,
  },
} as const;
```

### 5. Update `localizationManager.ts`

```typescript
import zh_CN_texts from './zh_CN/texts.json';
import zh_CN_assets from './zh_CN/assets.json';

const TEXTS_MAP: Record<SupportedLang, TextsData> = {
  en_US: en_US_texts,
  vi_VN: vi_VN_texts,
  zh_CN: zh_CN_texts,
};

const ASSETS_MAP: Record<SupportedLang, AssetsData> = {
  en_US: en_US_assets,
  vi_VN: vi_VN_assets,
  zh_CN: zh_CN_assets,
};
```

### 6. Add build scripts

```json
{
  "scripts": {
    "dev:zh": "VITE_LANG_CODE=zh_CN vite --host 0.0.0.0 --port 3000",
    "build:zh": "VITE_LANG_CODE=zh_CN tsc && vite build"
  }
}
```

Done! Now you can build with `npm run build:zh`

## Translation Keys Reference

### APP
- `APP.TITLE` - Application title
- `APP.SUBTITLE` - Application subtitle

### CONNECTION
- `CONNECTION.CONNECTED` - Connected status
- `CONNECTION.DISCONNECTED` - Disconnected status
- `CONNECTION.CONNECTING` - Connecting status

### GAME
- `GAME.STATUS.WAITING` - Waiting for round
- `GAME.STATUS.BETTING` - Betting phase
- `GAME.STATUS.STARTING` - Starting phase
- `GAME.STATUS.FLYING` - Flying phase
- `GAME.STATUS.CRASHED` - Crashed (with {crashPoint})

### BET
- `BET.TITLE` - Bet controls title
- `BET.AMOUNT` - Bet amount label
- `BET.PLACE_BET` - Place bet button (with {amount})
- `BET.CASHOUT` - Cashout button (with {multiplier})
- `BET.AUTO_CASHOUT` - Auto cashout label
- `BET.YOUR_BET` - Your bet label
- `BET.ERRORS.*` - Various error messages

### ACTIVE_BETS
- `ACTIVE_BETS.TITLE` - Active bets title
- `ACTIVE_BETS.PLAYERS` - Player count (with {count})
- `ACTIVE_BETS.NO_BETS` - No bets message

### HISTORY
- `HISTORY.TITLE` - History title
- `HISTORY.LAST_ROUNDS` - Last rounds (with {count})
- `HISTORY.ROUND_INFO` - Round info (with {number}, {crashPoint})

### NOTIFICATIONS
- `NOTIFICATIONS.BET_PLACED` - Bet placed success
- `NOTIFICATIONS.CASHOUT_SUCCESS` - Cashout success
- `NOTIFICATIONS.LAST_WIN` - Last win label
- `NOTIFICATIONS.PROFIT` - Profit amount (with {amount})

## Asset Keys Reference

### SOUNDS
- `SOUNDS.BET_PLACED` - Bet placed sound
- `SOUNDS.CASHOUT` - Cashout sound
- `SOUNDS.CRASH` - Crash sound
- `SOUNDS.COUNTDOWN` - Countdown sound
- `SOUNDS.FLYING` - Flying sound
- `SOUNDS.WIN` - Win sound
- `SOUNDS.LOSE` - Lose sound
- `SOUNDS.BACKGROUND_MUSIC` - Background music

### IMAGES
- `IMAGES.BACKGROUND` - Background image
- `IMAGES.LOGO` - Logo image
- `IMAGES.ROCKET` - Rocket sprite
- `IMAGES.EXPLOSION` - Explosion sprite
- `IMAGES.COIN` - Coin icon

### FONTS
- `FONTS.PRIMARY` - Primary font
- `FONTS.SECONDARY` - Secondary font

### ANIMATIONS
- `ANIMATIONS.ROCKET_FLYING` - Rocket flying animation
- `ANIMATIONS.EXPLOSION` - Explosion animation
- `ANIMATIONS.PARTICLES` - Particles animation

## Best Practices

### DO ✅
- Use `t()` for all user-facing text
- Use `getAsset()` for language-specific assets
- Add new keys to both language files
- Use descriptive key names
- Keep translation files organized by feature

### DON'T ❌
- Don't hardcode text in components
- Don't mix translation keys with UI code
- Don't forget to update both languages
- Don't use complex logic in translation strings

## Performance Benefits

| Aspect | Traditional i18n | Build-time i18n |
|--------|------------------|-----------------|
| Bundle size | All languages | Single language |
| Runtime overhead | Dictionary lookup | Direct string |
| Tree-shaking | Partial | Full |
| Load time | All files | One file |

**Example savings:**
- Traditional: 50KB (all languages)
- Build-time: 15KB (single language)
- **Saving: 70% smaller!**

## FAQ

**Q: Can I switch languages at runtime?**
A: No, this is build-time selection. You need different builds for each language.

**Q: Why not runtime switching?**
A: Runtime switching requires loading all languages, increasing bundle size. Build-time selection is more performant and results in smaller bundles.

**Q: How do I deploy multiple languages?**
A: Build each language separately and deploy to different paths:
- `https://example.com/en/` - English version
- `https://example.com/vi/` - Vietnamese version

**Q: Can I have a language switcher?**
A: Yes, but it needs to navigate to a different build/path, not switch in-place.

**Q: What if a translation is missing?**
A: The system returns the key path as fallback and logs a warning in console.

## Support

For issues or questions:
- Check console for warnings about missing keys
- Verify JSON syntax in translation files
- Ensure all languages have the same key structure
- Test with `npm run dev:en` and `npm run dev:vi`
