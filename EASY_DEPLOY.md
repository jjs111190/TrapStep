# 🚀 초간단 무료 배포 가이드 (5분 완성)

**CLI 설치 필요 없음! 웹에서 클릭만으로 배포**

---

## 📋 준비물

1. GitHub 계정 (무료)
2. Render 계정 (무료) - GitHub으로 로그인 가능
3. Netlify 계정 (무료) - GitHub으로 로그인 가능

---

## 1️⃣ GitHub에 코드 올리기 (1분)

### 방법 1: GitHub Desktop 사용 (추천)

1. [GitHub Desktop 다운로드](https://desktop.github.com/)
2. GitHub Desktop 실행 → `File` → `Add Local Repository`
3. `/Users/jaeseok/Desktop/TrapStep` 폴더 선택
4. `Publish repository` 클릭
   - Name: `TrapStep`
   - Private 체크 해제 (Public으로)
5. `Publish repository` 버튼 클릭

### 방법 2: 터미널 사용

```bash
cd /Users/jaeseok/Desktop/TrapStep

# Git 초기화 (이미 되어있으면 스킵)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 만들고 (github.com에서)
# 아래 명령어 실행 (YOUR_USERNAME을 본인 것으로)
git remote add origin https://github.com/YOUR_USERNAME/TrapStep.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ 백엔드 배포 (Render) - 2분

1. **Render 접속**: https://render.com
2. **GitHub 로그인** → `Sign Up` → `GitHub` 선택
3. **New Web Service** 클릭
4. **Connect Repository**: `TrapStep` 저장소 선택
5. **설정 입력**:
   ```
   Name: trapstep-server
   Region: Singapore (가장 빠름)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
6. **Environment Variables** 추가:
   ```
   NODE_ENV = production
   PORT = 3001
   ```
7. **Create Web Service** 클릭
8. **배포 대기** (3-5분) ⏳
9. **URL 복사**: `https://trapstep-server-XXXX.onrender.com` 형식

---

## 3️⃣ 프론트엔드 배포 (Netlify) - 2분

### 먼저: 환경 변수 설정

1. 터미널에서:
   ```bash
   cd /Users/jaeseok/Desktop/TrapStep

   # .env 파일 생성 (Render에서 복사한 URL 사용)
   echo "VITE_SERVER_URL=https://trapstep-server-XXXX.onrender.com" > .env

   # Git에 푸시
   git add .env
   git commit -m "Add server URL"
   git push
   ```

### Netlify 배포:

1. **Netlify 접속**: https://netlify.com
2. **GitHub 로그인** → `Sign Up` → `GitHub` 선택
3. **Add new site** → **Import an existing project**
4. **GitHub** 선택 → `TrapStep` 저장소 선택
5. **설정 입력**:
   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: dist
   ```
6. **Environment variables** 추가:
   ```
   VITE_SERVER_URL = https://trapstep-server-XXXX.onrender.com
   ```
   (위에서 복사한 Render URL)
7. **Deploy site** 클릭
8. **배포 대기** (2-3분) ⏳
9. **URL 확인**: `https://wonderful-name-XXXX.netlify.app` 형식

---

## ✅ 완료!

**게임 URL**: `https://wonderful-name-XXXX.netlify.app`

이 링크를 친구들에게 공유하면 전 세계 어디서나 접속 가능! 🎮

---

## 🔧 문제 해결

### 백엔드 빌드 실패

**증상**: Render에서 빌드 실패
**해결**: Root Directory가 `server`로 설정되었는지 확인

### 프론트엔드에서 서버 연결 안 됨

**증상**: "Failed to connect to server"
**해결**:
1. Netlify 환경 변수 `VITE_SERVER_URL` 확인
2. Render 서버가 정상 작동 중인지 확인 (녹색 "Live" 표시)

### Render 서버가 느림

**원인**: 무료 티어는 15분 비활성 시 슬립 모드
**해결**: 첫 접속 시 30초 정도 기다리면 깨어남 (정상)

---

## 💰 비용 확인

- **Render**: 750시간/월 무료 = 한 달 24시간 운영 가능
- **Netlify**: 완전 무료, 제한 없음
- **총 비용**: 0원!

---

## 🎯 다음 단계

1. 게임 URL 친구들에게 공유
2. 방 코드 생성해서 함께 플레이
3. 즐기기! 🎉

---

**전 세계 어디서나 접속 가능한 게임이 완성되었습니다!** 🌍
