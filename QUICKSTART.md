# ⚡ TrapStep 빠른 시작 가이드

## 🎯 3가지 실행 방법

### 1️⃣ Docker로 한 번에 실행 (가장 쉬움)

```bash
# Docker 설치 확인
docker --version

# 실행 (자동으로 빌드 + 실행)
docker-compose up
```

**결과:**
- 웹: http://localhost
- 서버: http://localhost:3001

---

### 2️⃣ 로컬 개발 환경

**백엔드 서버 시작:**
```bash
# 서버 폴더로 이동
cd server

# 의존성 설치
npm install

# 서버 시작
npm start
```

**프론트엔드 시작 (새 터미널):**
```bash
# 프로젝트 루트로
cd ..

# 의존성 설치
npm install

# 환경 변수 설정
echo "VITE_SERVER_URL=http://localhost:3001" > .env

# 개발 서버 시작
npm run dev
```

**결과:**
- 웹: http://localhost:3000

---

### 3️⃣ 온라인 배포 (무료)

자세한 내용은 [NETWORK_DEPLOY.md](NETWORK_DEPLOY.md) 참고

**가장 빠른 방법:**
```bash
# 1. Railway CLI 설치
npm install -g @railway/cli

# 2. 로그인
railway login

# 3. 백엔드 배포
cd server
railway up

# 4. URL 복사하고 환경 변수 설정
cd ..
echo "VITE_SERVER_URL=https://your-server.railway.app" > .env

# 5. 프론트엔드 빌드
npm run build

# 6. Netlify에 배포
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🎮 게임 모드

### 싱글 플레이어
- 혼자서 20개 레벨 클리어
- 키보드: WASD 또는 방향키

### 온라인 멀티플레이어

**협력 모드 (Co-op):**
- 2명이 함께 플레이
- 둘 다 포탈에 도착해야 클리어
- 한 명이 죽으면 둘 다 재시작

**경쟁 모드 (Race):**
- 2명이 경쟁
- 먼저 포탈에 도착하는 사람이 승리

---

## 🔑 조작키

**Player 1 (웹/PC):**
- WASD: 이동
- Space: 점프

**Player 2 (로컬 멀티플레이):**
- 방향키: 이동
- Enter: 점프

**모바일:**
- 왼쪽: 이동 버튼
- 오른쪽: 점프 버튼

---

## 🌐 온라인 플레이 방법

1. 배포된 웹사이트 접속
2. **Online Multiplayer** 클릭
3. **Create Room** → 방 코드 받음 (예: ABC123)
4. 친구에게 코드 공유
5. 친구가 **Join Room** → 코드 입력
6. 함께 플레이!

---

## 📱 모바일 앱 빌드

### iOS
```bash
npm install
npm run build
npx cap add ios
npx cap sync
npx cap open ios
# Xcode에서 실행
```

### Android
```bash
npm install
npm run build
npx cap add android
npx cap sync
npx cap open android
# Android Studio에서 실행
```

---

## 🐛 문제 해결

### Node.js 없음
```bash
# macOS
brew install node

# Windows/Linux
# https://nodejs.org 에서 다운로드
```

### Docker 없음
```bash
# macOS
brew install --cask docker

# Windows/Linux
# https://www.docker.com/get-started 에서 다운로드
```

### 포트 충돌
```bash
# 3000 포트 사용 중
npm run dev -- --port 3001

# 3001 포트 사용 중
# server/index.js에서 PORT 변경
```

---

## 📚 더 많은 정보

- **게임 가이드:** [README.md](README.md)
- **온라인 배포:** [NETWORK_DEPLOY.md](NETWORK_DEPLOY.md)
- **배포 가이드:** [DEPLOY.md](DEPLOY.md)
- **개발 상태:** [STATUS.md](STATUS.md)

---

## 🎉 지금 바로 시작!

**Docker가 있다면:**
```bash
docker-compose up
```

**Node.js만 있다면:**
```bash
# 터미널 1
cd server && npm install && npm start

# 터미널 2
npm install && npm run dev
```

**배포하려면:**
```bash
# NETWORK_DEPLOY.md 참고
```

즐거운 게임 되세요! 🎮
