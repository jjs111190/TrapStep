# 🚀 초간단 배포 가이드 (5분 완성!)

**복사/붙여넣기만 하면 끝나는 배포**

---

## ⚡ 3단계로 끝내기

### 1단계: Render 백엔드 배포 (2분)

1. **브라우저 열기**: https://render.com
2. **GitHub 로그인** (Sign up with GitHub)
3. **New + → Web Service**
4. **TrapStep 저장소 선택 → Connect**
5. **설정 입력**:
   ```
   Name: trapstep-server
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free ⭐ (중요!)
   ```
6. **환경 변수 추가**:
   ```
   NODE_ENV = production
   PORT = 3001
   ```
7. **Create Web Service** 클릭
8. **3-5분 대기** → 완료되면 URL 복사
   - 예: `https://trapstep-server.onrender.com`

---

### 2단계: Cloudflare Pages 프론트엔드 배포 (3분)

1. **브라우저 열기**: https://dash.cloudflare.com
2. **회원가입** (이메일 입력)
3. **Workers & Pages → Create → Pages**
4. **Connect to Git → GitHub 선택**
5. **TrapStep 저장소 선택 → Begin setup**
6. **프로젝트 설정**:
   ```
   Project name: trapstep
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   ```
7. **환경 변수 추가** ⭐ **매우 중요!**
   - **Environment variables (advanced)** 펼치기
   - **Add variable** 클릭
   - 입력:
   ```
   Variable name: VITE_SERVER_URL
   Value: https://trapstep-server.onrender.com
   ```
   ⚠️ **위의 URL을 1단계에서 복사한 Render URL로 변경!**
   ⚠️ **끝에 `/` 없이!**

8. **Save and Deploy** 클릭
9. **2-3분 대기** → 완료!

---

### 3단계: 완료! 🎉

배포 완료 후 받은 URL:
```
https://trapstep.pages.dev
```

이 URL로 접속해서 게임 시작!

---

## 🎮 게임 테스트

1. `https://trapstep.pages.dev` 접속
2. **ONLINE MULTIPLAYER** 클릭
3. **CREATE ROOM** 클릭
4. 방 코드가 나오면 → **성공!** ✅

친구에게 방 코드를 보내면 함께 플레이할 수 있습니다!

---

## 🐛 문제 해결

### "Failed to connect to server" 에러

**해결**:
1. Cloudflare Pages 대시보드 접속
2. **trapstep** 프로젝트 선택
3. **Settings** → **Environment variables**
4. `VITE_SERVER_URL` 확인:
   - 값이 올바른 Render URL인지 확인
   - 끝에 `/` 없는지 확인
5. 수정 후 **Deployments** → **Retry deployment**

### Render 서버가 느림

**정상입니다!**
- 무료 티어는 15분 비활성 시 슬립 모드
- 첫 접속 시 30초 정도 걸림
- 이후엔 빠르게 작동

### 빌드 실패

1. **Cloudflare Pages 빌드 로그 확인**
2. **일반적인 해결**:
   - Settings → Environment variables
   - `NODE_VERSION = 18` 추가
   - Retry deployment

---

## 💰 비용

- **Cloudflare Pages**: 완전 무료
- **Render**: 750시간/월 무료 (한 달 내내 가능)
- **총 비용: 0원!**

---

## 🔄 코드 업데이트 방법

코드 수정 후:

```bash
cd /Users/jaeseok/Desktop/TrapStep
git add .
git commit -m "Update game"
git push origin main
```

→ Cloudflare Pages와 Render가 **자동으로 재배포**!

---

## 📞 도움말

### 공식 문서
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Render: https://render.com/docs

### 더 자세한 가이드
- [완벽 가이드](CLOUDFLARE_COMPLETE_GUIDE.md) - 스크린샷과 함께
- [빠른 시작](QUICKSTART_CLOUDFLARE.md) - 요약 버전

---

## ✅ 체크리스트

배포 전:
- [x] GitHub에 코드 푸시 완료
- [x] package-lock.json 파일 존재

배포 중:
- [ ] Render 백엔드 배포
- [ ] Render URL 복사
- [ ] Cloudflare Pages 프론트엔드 배포
- [ ] 환경 변수 설정 (VITE_SERVER_URL)

배포 후:
- [ ] 게임 URL로 접속
- [ ] 온라인 멀티플레이어 테스트
- [ ] 친구들과 플레이!

---

## 🎉 완료!

**축하합니다!** 완전 무료로 전 세계에서 접속 가능한 게임을 배포했습니다!

이제 친구들에게 URL을 공유하고 함께 즐기세요! 🎮

---

**예상 총 시간: 5-7분**
**총 비용: 0원**
**전 세계 어디서나 접속 가능!**
