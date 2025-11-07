# 🚀 Crash Game Frontend

A production-ready, scalable multiplayer crash game frontend built with modern web technologies.

## 📋 Project Overview

**Crash Game Frontend** is a real-time multiplayer betting game where players place bets and cash out before the rocket crashes. Built using Turborepo monorepo architecture with PixiJS game engine, React, TypeScript, and TailwindCSS.

## ✨ Features

### Phase 1 - MVP (Completed)
- ✅ PixiJS game engine with rocket animations and multiplier graph
- ✅ Real-time WebSocket communication
- ✅ Bet placement and cashout functionality
- ✅ Active bets display with live updates
- ✅ Round history visualization
- ✅ Responsive UI with TailwindCSS
- ✅ TypeScript strict mode
- ✅ Turborepo monorepo structure

### 🎯 Upcoming Features (Phase 2+)
- 🔊 Sound effects and background music
- ✨ Particle effects and enhanced animations
- 🤖 Auto-cashout strategies
- 💬 Chat system
- 📊 Statistics dashboard
- 🏆 Leaderboard
- 👤 User profiles

## 🏗️ Tech Stack

- **Monorepo**: Turborepo
- **Build Tool**: Vite 5.x
- **Framework**: React 18.x + TypeScript
- **Game Engine**: PixiJS v7.4.2
- **State Management**: Zustand
- **Styling**: TailwindCSS 3.x
- **WebSocket**: Socket.io-client
- **Package Manager**: npm

## 📦 Project Structure

```
crash-game-frontend/
├── apps/
│   └── web/                    # Main web application
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   └── main.tsx        # Entry point
│       ├── index.html
│       └── vite.config.ts
│
├── packages/
│   ├── game-engine/           # PixiJS game engine
│   │   ├── src/
│   │   │   ├── Game.ts        # Main game class
│   │   │   ├── entities/      # Rocket, particles
│   │   │   ├── managers/      # Graph, assets
│   │   │   └── scenes/        # Game scenes
│   │
│   ├── websocket-client/      # WebSocket client
│   │   ├── src/
│   │   │   ├── WebSocketClient.ts
│   │   │   ├── hooks/         # React hooks
│   │   │   └── types/         # TypeScript types
│   │
│   ├── store/                 # State management (Zustand)
│   ├── utils/                 # Shared utilities
│   ├── ui-components/         # Shared UI components
│   └── config/                # Shared configs
│
├── turbo.json                 # Turborepo config
├── package.json               # Root package.json
└── ecosystem.config.cjs       # PM2 config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 10+

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cd apps/web
   cp .env.example .env
   # Edit .env with your backend URLs
   ```

3. **Development mode:**
   ```bash
   # Run all packages in dev mode
   npm run dev

   # Or run only web app
   npm run dev:web
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎮 Usage

### Development

```bash
# Start development server with PM2
pm2 start ecosystem.config.cjs

# View logs
pm2 logs crash-game-web --nostream

# Stop server
pm2 stop crash-game-web

# Delete from PM2
pm2 delete crash-game-web
```

### Environment Variables

```env
# apps/web/.env

# Backend URLs
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/game

# Feature Flags
VITE_ENABLE_CHAT=false
VITE_ENABLE_SOUND=true
VITE_ENABLE_ANIMATIONS=true

# Debug
VITE_DEBUG_MODE=true
```

### Backend Integration

This frontend expects a WebSocket server with the following events:

**Server → Client Events:**
- `game:state` - Initial game state
- `game:starting` - Round starting countdown
- `game:started` - Round started
- `game:tick` - Multiplier updates (emitted ~10 times/second)
- `game:crashed` - Round ended with crash point
- `bet:placed` - Bet confirmation
- `bet:cashed_out` - Cashout confirmation

**Client → Server Events:**
- `place:bet` - Place a bet
- `cashout` - Cash out current bet
- `get:state` - Request current state

## 🎨 Components

### Core Components

**GamePage** - Main game page layout
- Manages PixiJS game initialization
- Connects WebSocket
- Coordinates game state

**BetControls** - Betting interface
- Bet amount input
- Quick bet buttons
- Auto-cashout toggle
- Place bet / Cashout buttons

**ActiveBets** - Live bets display
- Shows all active player bets
- Real-time multiplier updates
- Cashout status indicators

**History** - Round history
- Last 10 rounds display
- Color-coded multipliers
- Hover tooltips

**GameCanvas** - PixiJS canvas wrapper
- Rocket animations
- Multiplier graph
- Status overlays

## 🔧 Packages

### `@crash-game/game-engine`
PixiJS-based game engine with:
- Rocket entity with animations
- Graph manager for multiplier visualization
- Game scenes
- Asset management

### `@crash-game/websocket-client`
WebSocket client with:
- Connection management
- Event handling
- React hooks (`useWebSocket`, `useGameState`, `useBetting`)

### `@crash-game/store`
Zustand state management:
- User settings (bet amount, auto-cashout)
- Balance management
- UI state (modals, panels)

### `@crash-game/utils`
Shared utilities:
- Constants (game config, events)
- Formatters (currency, multiplier)
- Validators (bet amount, balance)
- Helpers (calculations, storage)

## 📝 Scripts

```bash
# Development
npm run dev              # Run all packages in dev mode
npm run dev:web          # Run only web app

# Build
npm run build            # Build all packages
npm run build:web        # Build only web app

# Code Quality
npm run lint             # Lint all packages
npm run typecheck        # TypeScript checks
npm run format           # Format code with Prettier

# Utilities
npm run clean            # Clean all node_modules
npm run clean:port       # Kill process on port 3000
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run clean:port
# Or manually
fuser -k 3000/tcp
```

### WebSocket connection fails
1. Check backend server is running
2. Verify `VITE_WS_URL` in `.env`
3. Check browser console for errors

### PixiJS canvas not rendering
1. Ensure container element exists
2. Check browser console for WebGL errors
3. Try disabling browser extensions

## 📈 Performance

- **Bundle Size**: ~500KB (gzipped)
- **Initial Load**: < 2s
- **WebSocket Latency**: < 50ms
- **Frame Rate**: 60 FPS

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit pull request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- **PixiJS** - WebGL game engine
- **Socket.io** - Real-time communication
- **Turborepo** - Monorepo management
- **TailwindCSS** - Utility-first CSS

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](#)
- Documentation: [View docs](#)

---

**Built with ❤️ by Ricardo**

*Game development powered by PixiJS*
