# ⚡ Cloudflare 빠른 시작 가이드

**10분 안에 배포 완료!**

---

## 🎯 3단계로 끝내기

### 1단계: GitHub에 올리기 (3분)

**GitHub Desktop 사용** (가장 쉬움):
```
1. GitHub Desktop 다운로드: https://desktop.github.com
2. File → Add Local Repository → TrapStep 폴더 선택
3. Publish repository (Public으로 체크 해제)
4. 완료!
```

**또는 터미널**:
```bash
# GitHub.com에서 새 저장소 'TrapStep' 생성 후:
git remote add origin https://github.com/YOUR_USERNAME/TrapStep.git
git push -u origin main
```

---

### 2단계: 백엔드 배포 (3분)

**Render.com에서**:
```
1. https://render.com → GitHub 로그인
2. New + → Web Service
3. TrapStep 저장소 연결
4. 설정:
   - Name: trapstep-server
   - Root Directory: server
   - Build: npm install
   - Start: npm start
   - Instance: Free
5. 환경 변수:
   - NODE_ENV=production
   - PORT=3001
6. Create Web Service
7. URL 복사: https://trapstep-server-xxxx.onrender.com
```

---

### 3단계: 프론트엔드 배포 (4분)

**Cloudflare Pages에서**:
```
1. https://dash.cloudflare.com → 회원가입
2. Workers & Pages → Create → Pages → Connect to Git
3. GitHub 연결 → TrapStep 저장소 선택
4. 설정:
   - Project name: trapstep
   - Build command: npm run build
   - Build output: dist
5. 환경 변수:
   - VITE_SERVER_URL=https://trapstep-server-xxxx.onrender.com
   (위에서 복사한 Render URL!)
6. Save and Deploy
7. 완료! 게임 URL: https://trapstep.pages.dev
```

---

## ✅ 완료!

**게임 URL**: https://trapstep.pages.dev

친구들에게 공유하고 온라인 멀티플레이어를 즐기세요! 🎮

---

## 🔗 상세 가이드

더 자세한 설명과 스크린샷은:
- [CLOUDFLARE_COMPLETE_GUIDE.md](CLOUDFLARE_COMPLETE_GUIDE.md) 참고

---

## 💰 비용

- Cloudflare Pages: **완전 무료**
- Render: **750시간/월 무료** (한 달 내내 운영 가능)
- **총 비용: 0원!**

---

## 🐛 문제?

### 서버 연결 안 됨
→ Cloudflare Pages 환경 변수 `VITE_SERVER_URL` 확인

### 빌드 실패
→ Build command가 `npm run build`인지 확인

### 서버가 느림
→ 정상입니다! 무료 티어는 첫 접속 시 30초 소요

---

**끝!** 10분 안에 전 세계 배포 완료! 🚀
