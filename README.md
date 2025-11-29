# 🚀 Crash Game Frontend

A real-time multiplayer crash game built with PixiJS, React, TypeScript, and Zustand.

## 🎮 Live Demo

**Development URL**: https://3000-ikjp6eafcxa00459k2u9t-3844e1b6.sandbox.novita.ai

## ✨ Features

### Completed (Phase 1 - MVP)
- ✅ PixiJS game engine with rocket animations
- ✅ Animated multiplier graph
- ✅ Real-time game loop with phases (waiting → starting → running → crashed)
- ✅ Bet placement and cashout functionality
- ✅ Auto-cashout feature
- ✅ Active bets display with live updates
- ✅ Round history with statistics
- ✅ **Mock data mode for development** (no backend required!)
- ✅ Responsive UI with TailwindCSS
- ✅ Zustand state management

### Mock Data Features
The game includes a complete **MockGameEngine** that simulates:
- 🤖 AI bot players placing random bets
- 📈 Realistic crash point generation
- 💰 Bot cashout behavior
- ⏱️ Full game cycle (waiting → starting → running → crashed)
- 📊 History generation

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Game Engine**: PixiJS v7.4.2
- **State Management**: Zustand
- **Styling**: TailwindCSS 3
- **Build Tool**: Vite 5

## 📦 Project Structure

```
crash-game-frontend/
├── src/
│   ├── components/        # React components
│   │   ├── GameCanvas.tsx # PixiJS canvas wrapper
│   │   ├── BetControls.tsx # Betting interface
│   │   ├── ActiveBets.tsx  # Live bets display
│   │   └── History.tsx     # Round history
│   ├── game/
│   │   └── CrashGame.ts   # PixiJS game engine
│   ├── mock/
│   │   └── MockGameEngine.ts # Development mock backend
│   ├── store/
│   │   └── gameStore.ts   # Zustand store
│   ├── hooks/
│   │   └── useGame.ts     # Game hook
│   ├── types/
│   │   └── game.ts        # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/
│   └── rocket.svg         # Favicon
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── ecosystem.config.cjs   # PM2 config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or with PM2
pm2 start ecosystem.config.cjs
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run clean:port   # Kill process on port 3000
```

## 🎮 How to Play

1. **Wait for betting phase** - "WAITING FOR BETS..."
2. **Place your bet** - Enter amount and click BET
3. **Watch the rocket fly** - Multiplier increases
4. **Cash out before crash!** - Click CASHOUT to secure winnings
5. **If you miss** - Lose your bet when rocket crashes

### Tips
- Use **Auto Cashout** to automatically cash out at a target multiplier
- Higher multipliers = higher risk
- Statistics show average, highest, and lowest crash points

## 🔧 Development Mode

The game runs entirely in **mock mode** - no backend server required!

The `MockGameEngine` simulates:
- Game round cycles (5s wait → 3s countdown → variable game → 3s crash display)
- Other players (bots) placing bets and cashing out
- Realistic crash point distribution (house edge ~3-4%)
- Full state management

### Mock Engine Configuration

In `src/mock/MockGameEngine.ts`:
```typescript
private readonly WAITING_TIME = 5000;    // Time between rounds
private readonly COUNTDOWN_TIME = 3000;  // Countdown before start
private readonly TICK_RATE = 50;         // Updates per second (20)
private readonly MULTIPLIER_GROWTH = 0.0015; // Growth rate
```

## 📝 Next Steps (Phase 2)

- [ ] Sound effects and background music
- [ ] Enhanced particle effects
- [ ] Auto-bet strategies
- [ ] Chat system
- [ ] Leaderboard
- [ ] Real WebSocket backend integration

## 🤝 Backend Integration

When ready to connect to a real backend, replace the mock engine in `useGame.ts`:

```typescript
// Replace:
import { mockGameEngine } from '../mock/MockGameEngine';

// With real WebSocket client:
import { WebSocketClient } from '../websocket/WebSocketClient';
```

Expected WebSocket events:
- `game:state` - Initial state
- `game:waiting` - Round waiting
- `game:starting` - Countdown started
- `game:started` - Round started
- `game:tick` - Multiplier update
- `game:crashed` - Round ended
- `bet:placed` - Bet confirmation
- `bet:cashed_out` - Cashout confirmation

---

**Built with ❤️ by Ricardo**

*Game development powered by PixiJS*
