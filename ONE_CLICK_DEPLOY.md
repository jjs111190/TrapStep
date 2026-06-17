# 🚀 원클릭 배포 가이드

**중요:** 제가 직접 배포할 수는 없지만, 여러분이 **한 번의 클릭**으로 배포할 수 있습니다!

---

## 🎯 3가지 배포 방법

### 방법 1: 로컬 Docker (5초 만에 실행)

**가장 빠름! 지금 바로 플레이 가능!**

```bash
./deploy.sh
# 선택: 1 (로컬 Docker)
```

**결과:**
- ✅ 웹사이트: http://localhost
- ✅ 백엔드: http://localhost:3001
- ✅ 친구와 같은 WiFi에서 플레이 가능

---

### 방법 2: Railway 원클릭 배포 (무료, 전 세계 접속 가능)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/trapstep)

**또는 CLI 사용:**

```bash
# 1. Railway CLI 설치
npm install -g @railway/cli

# 2. 자동 배포 스크립트 실행
./deploy.sh
# 선택: 2 (Railway 온라인 배포)

# 3. 브라우저에서 Railway 로그인
# 4. 자동으로 배포됨!
```

**5분 후:**
- ✅ 백엔드: `https://trapstep-server-xxx.railway.app`
- ✅ 프론트엔드: Netlify로 배포
- ✅ 전 세계 어디서나 접속 가능!

---

### 방법 3: Render 원클릭 배포 (무료)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**단계:**
1. GitHub에 코드 푸시
2. Render에서 "Deploy" 버튼 클릭
3. 자동 배포 시작
4. 5분 후 완료!

---

## 🎮 배포 후 즉시 플레이

### 로컬 배포한 경우

```bash
# 웹 브라우저에서
http://localhost

# 친구도 같은 WiFi에서 접속
http://192.168.x.x  # 내 로컬 IP
```

### 온라인 배포한 경우

```bash
# 받은 URL을 친구들에게 공유
https://your-app.netlify.app
```

친구들이 URL만 열면 바로 함께 플레이!

---

## 📋 배포 스크립트 상세 사용법

### ./deploy.sh 옵션

```bash
./deploy.sh
```

**대화형 메뉴:**
```
배포 방식을 선택하세요:
1) 로컬 Docker (localhost에서 즉시 실행)
2) Railway 온라인 배포 (전 세계 접속 가능)
3) 둘 다
```

### 옵션 1: 로컬 Docker

**필요한 것:**
- Docker Desktop 설치

**결과:**
- 5초 만에 실행
- http://localhost 에서 플레이
- 같은 WiFi의 친구도 접속 가능

### 옵션 2: Railway

**필요한 것:**
- Railway 계정 (무료)
- Railway CLI

**결과:**
- 5분 만에 전 세계 배포
- `https://xxx.railway.app` URL
- 무료 500시간/월

### 옵션 3: 둘 다

**결과:**
- 로컬에서 테스트
- 온라인으로도 배포
- 최고의 선택!

---

## 🔧 문제 해결

### "docker: command not found"

```bash
# Docker 설치
# macOS
brew install --cask docker

# Windows/Linux
# https://www.docker.com/get-started
```

### "railway: command not found"

```bash
npm install -g @railway/cli
```

### "Permission denied"

```bash
chmod +x deploy.sh
```

---

## 💡 추천 워크플로우

### 개발할 때
```bash
./deploy.sh
# 선택: 1 (로컬)
```

### 친구들과 플레이할 때
```bash
./deploy.sh
# 선택: 3 (둘 다)
```

---

## 🌟 자동 배포 설정 (선택사항)

GitHub에 푸시하면 자동으로 배포:

### Railway
1. Railway 대시보드에서 GitHub 연동
2. 푸시할 때마다 자동 배포

### Render
1. `render.yaml` 파일이 이미 있음
2. Render에서 GitHub 연동
3. 푸시할 때마다 자동 배포

---

## 📊 배포 비교

| 방법 | 시간 | 비용 | 접속 범위 | 추천 |
|------|------|------|-----------|------|
| **로컬 Docker** | 5초 | 무료 | WiFi 내 | ⭐⭐⭐⭐⭐ 개발 |
| **Railway** | 5분 | 무료* | 전 세계 | ⭐⭐⭐⭐⭐ 공유 |
| **Render** | 5분 | 무료* | 전 세계 | ⭐⭐⭐⭐ 대안 |

*무료 플랜 제한:
- Railway: 500시간/월
- Render: 750시간/월

---

## 🎉 배포 완료 후

### 확인 사항

**로컬:**
```bash
# 백엔드 확인
curl http://localhost:3001/health

# 프론트엔드 확인
open http://localhost
```

**온라인:**
```bash
# 백엔드 확인
curl https://your-server.railway.app/health

# 프론트엔드 확인
open https://your-app.netlify.app
```

### 친구 초대

1. URL 공유
2. "Online Multiplayer" 선택
3. "Create Room" 클릭
4. 방 코드 공유
5. 함께 플레이!

---

## 🚨 중요 참고사항

**제가 직접 배포해드릴 수 없는 이유:**
- 배포 서비스는 개인 계정이 필요합니다
- 무료 플랜도 본인 인증이 필요합니다
- 보안상 계정 정보를 공유할 수 없습니다

**하지만!**
- ✅ 위 방법들로 **5분 안에** 직접 배포 가능
- ✅ 완전 **무료**
- ✅ **원클릭** 또는 **한 줄 명령어**로 가능

---

## 📞 도움이 필요하면

1. `./deploy.sh` 실행 → 에러 메시지 확인
2. [NETWORK_DEPLOY.md](NETWORK_DEPLOY.md) 참고
3. [QUICKSTART.md](QUICKSTART.md) 참고

---

**지금 바로 시작하세요!**

```bash
./deploy.sh
```

즐거운 게임 되세요! 🎮
