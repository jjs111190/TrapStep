# 🌐 TrapStep 온라인 멀티플레이어 배포 가이드

완전 무료로 전 세계 어디서나 접속 가능한 온라인 게임 배포 방법입니다.

---

## 🎯 배포 옵션

### 옵션 A: Railway (추천 - 가장 쉬움)
- ✅ Docker 자동 인식
- ✅ 무료: 500시간/월 ($5 크레딧)
- ✅ 자동 HTTPS
- ✅ 글로벌 CDN
- ⏱️ 배포 시간: 5분

### 옵션 B: Render
- ✅ 무료: 750시간/월
- ✅ 자동 HTTPS
- ⏱️ 배포 시간: 10분

### 옵션 C: Docker (로컬 또는 VPS)
- ✅ 완전한 제어
- ⏱️ 배포 시간: 5분

---

## 🚀 옵션 A: Railway 배포 (추천)

### 1단계: Railway 가입

1. https://railway.app 접속
2. GitHub 계정으로 로그인
3. 무료 플랜 선택 ($5 크레딧 자동 제공)

### 2단계: 백엔드 서버 배포

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 백엔드 배포
cd server
railway up
```

**또는 웹 UI 사용:**

1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. TrapStep 저장소 선택
4. Root directory를 `/server`로 설정
5. 자동으로 Dockerfile 감지하고 빌드 시작

**배포 후 URL 확인:**
- 예: `https://trapstep-server-production.up.railway.app`
- 이 URL을 복사해두세요!

### 3단계: 프론트엔드 배포

**방법 1: Netlify (웹만)**

```bash
# 빌드
npm install
VITE_SERVER_URL=https://your-server.railway.app npm run build

# Netlify에 배포
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**방법 2: Railway (웹 + 앱)**

1. 새 프로젝트 생성
2. Root directory를 `/` (루트)로 설정
3. 환경 변수 추가:
   ```
   VITE_SERVER_URL=https://trapstep-server-production.up.railway.app
   ```
4. 자동 빌드 시작

### 4단계: 테스트

1. 프론트엔드 URL 접속 (예: https://trapstep.up.railway.app)
2. "Online Multiplayer" 클릭
3. "Create Room" 클릭
4. 다른 기기에서 같은 URL 접속
5. "Join Room" → 방 코드 입력
6. 2명이 함께 플레이!

---

## 🐳 옵션 C: Docker로 로컬 실행

### 전체 시스템 한 번에 실행

```bash
# Docker 설치 확인
docker --version
docker-compose --version

# 프로젝트 루트에서
docker-compose up --build
```

**접속:**
- 프론트엔드: http://localhost
- 백엔드: http://localhost:3001

### 개별 실행

**백엔드:**
```bash
cd server
docker build -t trapstep-server .
docker run -p 3001:3001 trapstep-server
```

**프론트엔드:**
```bash
docker build -t trapstep-web .
docker run -p 80:80 trapstep-web
```

---

## 📱 모바일 앱 빌드

### iOS 앱

```bash
# 의존성 설치
npm install

# 환경 변수 설정
echo "VITE_SERVER_URL=https://your-server.railway.app" > .env

# 빌드 및 동기화
npm run build
npx cap add ios
npx cap sync

# Xcode에서 열기
npx cap open ios
```

**Xcode에서:**
1. 시뮬레이터 선택
2. ▶️ Run 버튼 클릭
3. 앱 실행!

### Android 앱

```bash
# 의존성 설치
npm install

# 환경 변수 설정
echo "VITE_SERVER_URL=https://your-server.railway.app" > .env

# 빌드 및 동기화
npm run build
npx cap add android
npx cap sync

# Android Studio에서 열기
npx cap open android
```

**Android Studio에서:**
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. APK 파일 생성됨
3. 폰에 설치!

---

## 🎮 게임 플레이 방법

### 웹 브라우저

1. 배포된 URL 접속
2. **Online Multiplayer** 선택
3. **Create Room** 또는 **Quick Match**
4. 방 코드를 친구에게 공유
5. 친구가 **Join Room** → 코드 입력
6. 함께 플레이!

### 모바일 앱

1. 앱 실행
2. 같은 방식으로 진행
3. WiFi 또는 모바일 데이터로 접속 가능

---

## 🔧 환경 변수 설정

### 로컬 개발

`.env` 파일 생성:
```
VITE_SERVER_URL=http://localhost:3001
```

### 프로덕션

**Railway:**
- Settings → Variables 에서 추가:
  ```
  VITE_SERVER_URL=https://your-server.railway.app
  ```

**Netlify:**
- Site settings → Build & deploy → Environment:
  ```
  VITE_SERVER_URL=https://your-server.railway.app
  ```

---

## 📊 비용 및 제한

### Railway (무료 플랜)
- ✅ $5 크레딧/월 (500시간)
- ✅ 슬립 모드 없음
- ✅ 무제한 프로젝트
- ⚠️ 5GB 아웃바운드 대역폭

### Netlify (무료 플랜)
- ✅ 100GB 대역폭/월
- ✅ 무제한 사이트
- ✅ 자동 HTTPS

### 예상 사용량
- 동시 접속 10명: ~50MB/일
- 월 1,500명 플레이어: 무료 범위 내

---

## 🌍 실제 배포 URL 예시

배포가 완료되면 다음과 같은 URL을 받게 됩니다:

**백엔드:**
```
https://trapstep-server-production.up.railway.app
```

**프론트엔드:**
```
https://trapstep.up.railway.app
```

또는 Netlify:
```
https://trapstep-game.netlify.app
```

### 이 URL을 친구들에게 공유하면:
- ✅ 전 세계 어디서나 접속 가능
- ✅ PC, Mac, 폰, 태블릿 모두 지원
- ✅ 다운로드 불필요
- ✅ 완전 무료

---

## 🐛 문제 해결

### 서버 연결 실패

**증상:** "Connection failed" 에러

**해결:**
1. 백엔드 URL 확인:
   ```bash
   curl https://your-server.railway.app/health
   ```
2. 환경 변수 확인:
   ```bash
   echo $VITE_SERVER_URL
   ```
3. CORS 설정 확인 (서버의 index.js)

### 방 입장 실패

**증상:** "Room not found" 에러

**해결:**
1. 방 코드 다시 확인 (대소문자 구분)
2. 서버 재시작:
   ```bash
   railway restart
   ```

### 느린 연결

**해결:**
1. Railway 지역 변경 (Settings → Region)
2. 또는 Render 사용 (더 많은 지역 지원)

---

## 📝 완전 배포 체크리스트

- [ ] Railway 계정 생성
- [ ] 백엔드 서버 배포
- [ ] 백엔드 URL 복사
- [ ] 프론트엔드 환경 변수 설정
- [ ] 프론트엔드 빌드 및 배포
- [ ] 웹에서 테스트
- [ ] iOS 앱 빌드 (선택)
- [ ] Android 앱 빌드 (선택)
- [ ] 친구와 멀티플레이 테스트
- [ ] URL 공유!

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 친구들과 TrapStep을 플레이할 수 있습니다!

**다음 단계:**
- 커스텀 도메인 연결
- Google Analytics 추가
- 리더보드 구현
- 소셜 로그인 추가

---

## 💡 팁

1. **빠른 테스트:** 폰 2대로 테스트
2. **방 코드 공유:** 카톡, 디스코드 등
3. **모니터링:** Railway 대시보드에서 실시간 로그 확인
4. **업데이트:** Git push → 자동 재배포

**질문이나 문제가 있으면 GitHub Issues에 올려주세요!**

즐거운 게임 되세요! 🎮
