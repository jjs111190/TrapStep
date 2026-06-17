# TrapStep

A tricky 2D platformer game with hidden traps. Watch your step!

🎮 **Play online:** [Coming soon - Deploy your own for free!]

## Features

### 🎯 게임 모드
- **싱글 플레이어**: 혼자서 30개 레벨 클리어
- **온라인 협력 모드**: 친구와 함께 클리어 (2인)
- **온라인 경쟁 모드**: 친구와 레이스 (먼저 도착하기)

### ⚡ 핵심 기능
- **30개 독특한 레벨**: 점진적 난이도 증가
- **5가지 함정**: 사라지는 바닥, 움직이는 벽, 떨어지는 블록, 가짜 플랫폼, 보이지 않는 가시
- **온라인 멀티플레이어**: 전 세계 어디서나 친구와 플레이
- **크로스 플랫폼**: 웹, iOS, Android
- **별점 시스템**: 시간과 사망 횟수 기반
- **미니멀 픽셀 아트**: 부드러운 애니메이션

## Tech Stack

- **Frontend**: React + TypeScript + Phaser.js 3
- **Backend**: Node.js + Express + Socket.io
- **Real-time**: WebSocket (온라인 멀티플레이어)
- **Build**: Vite
- **Mobile**: Capacitor (iOS/Android)
- **Deployment**: Docker + Railway/Netlify (완전 무료)
- **Storage**: LocalStorage

## Installation

### Prerequisites

You need to have Node.js installed (version 16 or higher recommended).

**Install Node.js:**

- **macOS**:
  ```bash
  brew install node
  ```

- **Windows**:
  Download from [nodejs.org](https://nodejs.org/)

- **Linux**:
  ```bash
  sudo apt-get install nodejs npm
  ```

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Building

### Web Build

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Mobile Build (iOS/Android)

#### Initial Setup

```bash
# Initialize Capacitor
npm run cap:init

# Add iOS platform
npm run cap:add:ios

# Add Android platform
npm run cap:add:android
```

#### Build and Deploy

```bash
# Build web assets
npm run build

# Sync with Capacitor
npm run cap:sync

# Open iOS in Xcode
npm run cap:open:ios

# Open Android in Android Studio
npm run cap:open:android
```

**Note**: You'll need Xcode (macOS) for iOS builds and Android Studio for Android builds.

## Game Controls

### Keyboard (PC/Web)

- **Arrow Keys**: Move left/right, jump
- **WASD Keys**: Alternative movement
- **Space**: Jump
- **R**: Restart level
- **ESC**: Return to menu

### Mobile

- **Left Side**: Touch buttons for left/right movement
- **Right Side**: Jump button

## Game Mechanics

### Trap Types

1. **Disappearing Floor**: Steps on to trigger, then vanishes
2. **Falling Block**: Shakes then drops when stepped on
3. **Fake Platform**: Looks solid but kills on contact
4. **Moving Wall**: Patrols back and forth
5. **Invisible Spike**: Appears when player gets close

### Star Rating

Stars are awarded based on:
- Completion time
- Number of deaths
- 3 stars = Fast completion with few deaths
- 2 stars = Moderate performance
- 1 star = Level completed

## Project Structure

```
TrapStep/
├── src/
│   ├── game/
│   │   ├── scenes/          # Phaser game scenes
│   │   │   ├── BootScene.ts
│   │   │   ├── MenuScene.ts
│   │   │   ├── GameScene.ts
│   │   │   └── GameOverScene.ts
│   │   ├── entities/        # Game entities
│   │   │   └── Player.ts
│   │   ├── traps/           # Trap implementations
│   │   │   ├── DisappearingFloor.ts
│   │   │   ├── MovingWall.ts
│   │   │   ├── FallingBlock.ts
│   │   │   ├── FakePlatform.ts
│   │   │   └── InvisibleSpike.ts
│   │   └── config.ts        # Game configuration
│   ├── components/          # React components
│   │   ├── MobileControls.tsx
│   │   └── MobileControls.css
│   ├── data/
│   │   └── levels.ts        # Level data (20 levels)
│   ├── utils/
│   │   └── storage.ts       # LocalStorage wrapper
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # Entry point
│   └── index.css
├── public/                  # Static assets
├── capacitor.config.ts      # Capacitor configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Design Philosophy

- **Original Design**: Completely original assets, no copying from existing games
- **Minimalist**: Clean, Apple-inspired UI
- **Accessible**: Easy to pick up, hard to master
- **No Ads/IAP**: Currently free, with structure for future monetization

## Color Palette

- **Coral**: `#FF7F7F` - Primary accent
- **Navy**: `#2D3E50` - Background dark
- **Cream**: `#FFF4E6` - Text and UI
- **Gold**: `#FFD700` - Portal and stars

## Development

### Adding New Levels

Edit `src/data/levels.ts` and add a new level object:

```typescript
{
  id: 21,
  playerStart: { x: 2, y: 15 },
  portalPos: { x: 22, y: 15 },
  tiles: [
    // 18 rows x 25 columns
    // 0 = empty, 1 = platform, 2-5 = traps
  ],
  movingWalls: [
    { x: 10, y: 10, moveX: 5, moveY: 0, speed: 2000 }
  ]
}
```

### Creating New Traps

1. Create a new file in `src/game/traps/`
2. Extend `Phaser.Physics.Arcade.Sprite`
3. Implement trap logic
4. Add to `GameScene.ts` tile switch

## License

MIT License - Feel free to use and modify

## Credits

Built with ❤️ using Phaser, React, and TypeScript

---

**Have fun and watch your step!** 🎮
