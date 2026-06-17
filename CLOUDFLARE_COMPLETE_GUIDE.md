# 🌐 Cloudflare Pages 완벽 배포 가이드

**완전 무료로 전 세계에 게임 배포하기 (10분 완성)**

---

## 📋 준비물

1. **GitHub 계정** (무료) - https://github.com
2. **Cloudflare 계정** (무료) - https://cloudflare.com
3. **Render 계정** (무료) - https://render.com
4. ✅ 이미 준비된 것: Git 저장소 초기화 완료!

---

## 🎯 배포 구조

```
프론트엔드 (게임 화면)
    ↓
Cloudflare Pages (완전 무료)
    ↓
인터넷
    ↓
백엔드 서버 (멀티플레이어)
    ↓
Render.com (750시간/월 무료)
```

**결과**: 24시간 운영, 전 세계 접속 가능, 완전 무료!

---

## 1️⃣ GitHub에 코드 올리기 (3분)

### 방법 A: GitHub Desktop 사용 (가장 쉬움 - 추천!)

1. **GitHub Desktop 다운로드**
   - https://desktop.github.com/
   - 설치 후 실행

2. **로그인**
   - `Sign in to GitHub.com` 클릭
   - GitHub 계정으로 로그인

3. **저장소 퍼블리시**
   - `File` → `Add Local Repository` 클릭
   - 폴더 선택: `/Users/jaeseok/Desktop/TrapStep`
   - `Add Repository` 클릭
   - 좌측 상단 `Publish repository` 클릭
   - 설정:
     ```
     Name: TrapStep
     Description: 2D Multiplayer Platformer Game
     ☐ Keep this code private (체크 해제 - Public으로)
     ```
   - `Publish repository` 버튼 클릭

4. **완료!**
   - GitHub.com에서 저장소 확인
   - URL: `https://github.com/YOUR_USERNAME/TrapStep`

### 방법 B: 터미널 사용

```bash
# 1. GitHub.com에서 새 저장소 생성
# - 이름: TrapStep
# - Public
# - README, .gitignore, license 체크 안 함

# 2. 터미널에서 실행 (YOUR_USERNAME을 본인 것으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/TrapStep.git
git branch -M main
git push -u origin main
```

✅ **확인**: GitHub.com에서 코드가 보이면 성공!

---

## 2️⃣ 백엔드 배포 (Render) - 3분

백엔드 서버를 먼저 배포해야 URL을 얻을 수 있습니다.

### 단계별 진행

1. **Render 회원가입**
   - https://render.com
   - `Get Started` 클릭
   - `Sign up with GitHub` 선택 (가장 쉬움)
   - GitHub 계정으로 로그인
   - Render 권한 승인

2. **새 Web Service 생성**
   - 대시보드에서 `New +` 버튼 클릭
   - `Web Service` 선택

3. **저장소 연결**
   - `Connect a repository` 섹션에서
   - `TrapStep` 저장소 찾기
   - `Connect` 클릭

4. **서비스 설정**
   ```
   Name: trapstep-server
   Region: Singapore (또는 가장 가까운 지역)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **인스턴스 타입**
   - `Instance Type`: **Free** 선택 (중요!)
   - 750시간/월 무료

6. **환경 변수 추가**
   - `Environment Variables` 섹션 확장
   - 다음 변수 추가:
   ```
   Key: NODE_ENV
   Value: production

   Key: PORT
   Value: 3001
   ```

7. **배포 시작**
   - `Create Web Service` 버튼 클릭
   - 배포 시작 (3-5분 소요)

8. **URL 복사**
   - 배포 완료 후 상단에 URL 표시됨
   - 예: `https://trapstep-server-xxxx.onrender.com`
   - **이 URL을 복사해두세요!** (다음 단계에서 사용)

9. **작동 확인**
   - 브라우저에서 `https://trapstep-server-xxxx.onrender.com/health` 접속
   - `{"status":"ok"}` 표시되면 성공! ✅

⚠️ **주의**: 무료 티어는 15분 비활성 시 슬립 모드 진입. 첫 접속 시 30초 정도 기다리면 깨어납니다.

---

## 3️⃣ 프론트엔드 배포 (Cloudflare Pages) - 4분

이제 게임 화면을 Cloudflare Pages에 배포합니다.

### 단계별 진행

1. **Cloudflare 회원가입**
   - https://dash.cloudflare.com/sign-up
   - 이메일 입력 후 회원가입
   - 이메일 인증 완료

2. **Pages 섹션 이동**
   - 좌측 메뉴에서 `Workers & Pages` 클릭
   - `Create application` 버튼 클릭
   - `Pages` 탭 선택
   - `Connect to Git` 클릭

3. **GitHub 연결**
   - `Connect GitHub` 버튼 클릭
   - GitHub 계정으로 로그인
   - Cloudflare 권한 승인
   - 저장소 접근 권한 설정:
     - `Only select repositories` 선택
     - `TrapStep` 저장소 선택
     - `Install & Authorize` 클릭

4. **프로젝트 설정**
   ```
   Project name: trapstep
   Production branch: main
   ```

5. **빌드 설정**
   - `Framework preset`: None (또는 Vite)
   - `Build command`: npm run build
   - `Build output directory`: dist
   - `Root directory (optional)`: (비워둠)

6. **환경 변수 설정** (중요!)
   - `Environment variables (advanced)` 섹션 확장
   - `Add variable` 클릭
   - 다음 변수 추가:
   ```
   Variable name: VITE_SERVER_URL
   Value: https://trapstep-server-xxxx.onrender.com
   ```
   (위에서 복사한 Render URL 입력!)

7. **배포 시작**
   - `Save and Deploy` 버튼 클릭
   - 빌드 및 배포 시작 (2-3분 소요)
   - 빌드 로그 확인 가능

8. **배포 완료!**
   - 배포 완료 후 URL 표시됨
   - 예: `https://trapstep.pages.dev`
   - 또는 커스텀 도메인 설정 가능

9. **게임 접속**
   - 브라우저에서 URL 접속
   - TrapStep 게임이 로드됨! 🎮

---

## 🎉 배포 완료!

### 🌍 게임 URL

- **메인 게임**: `https://trapstep.pages.dev`
- **백엔드 서버**: `https://trapstep-server-xxxx.onrender.com`

### 🎮 테스트하기

1. **싱글플레이어 모드**
   - 게임 접속
   - `PLAY` 버튼 클릭
   - 20개 레벨 플레이

2. **온라인 멀티플레이어 모드**
   - 게임 접속
   - `ONLINE MULTIPLAYER` 버튼 클릭
   - 옵션 선택:
     - `CREATE ROOM` - 방 생성 (방 코드 나옴)
     - `JOIN ROOM` - 방 코드 입력해서 입장
     - `QUICK MATCH` - 자동 매칭
   - 2명 모이면 게임 시작!

3. **친구 초대 방법**
   - 방 생성 후 6자리 방 코드 복사
   - 친구에게 방 코드 전달
   - 친구가 `JOIN ROOM`으로 입장

---

## 🔧 고급 설정

### 커스텀 도메인 연결 (선택사항)

Cloudflare Pages에서 무료로 커스텀 도메인 사용 가능:

1. Cloudflare Pages 대시보드 접속
2. `trapstep` 프로젝트 선택
3. `Custom domains` 탭 클릭
4. `Set up a custom domain` 클릭
5. 본인 도메인 입력 (예: `trapstep.com`)
6. DNS 설정 완료

### 자동 배포 설정 (이미 활성화됨)

- GitHub에 코드 푸시할 때마다 자동 배포
- `main` 브랜치 푸시 → 자동으로 프로덕션 배포
- 다른 브랜치 푸시 → 프리뷰 배포 생성

---

## 🐛 문제 해결

### 1. 백엔드 서버 연결 실패

**증상**: "Failed to connect to server" 에러

**해결**:
1. Render 서버가 정상 작동 중인지 확인
   - Render 대시보드에서 상태 확인
   - 녹색 "Live" 표시가 있어야 함
2. Cloudflare Pages 환경 변수 확인
   - `VITE_SERVER_URL`이 올바른 Render URL인지 확인
   - 변경 후 재배포 필요: `Deployments` → `Retry deployment`

### 2. 빌드 실패

**증상**: Cloudflare Pages 빌드 에러

**해결**:
1. 빌드 로그 확인
2. 일반적인 원인:
   - Node 버전 문제 → 환경 변수에 `NODE_VERSION=18` 추가
   - 의존성 문제 → `package.json` 확인

### 3. Render 서버가 느림

**증상**: 첫 접속 시 30초 이상 소요

**원인**: 무료 티어는 15분 비활성 시 슬립 모드

**해결**: 정상 작동입니다. 첫 접속 후엔 빠르게 작동합니다.

### 4. 게임 화면이 안 나옴

**증상**: 흰 화면 또는 에러 화면

**해결**:
1. 브라우저 콘솔 확인 (F12)
2. 에러 메시지 확인
3. 캐시 삭제 후 새로고침 (Ctrl/Cmd + Shift + R)

### 5. 멀티플레이어가 작동 안 함

**증상**: 방 생성/입장 안 됨

**해결**:
1. 백엔드 서버 상태 확인
2. 환경 변수 `VITE_SERVER_URL` 확인
3. Render 서버 로그 확인:
   - Render 대시보드 → `Logs` 탭

---

## 💰 비용 확인

### 완전 무료!

- **Cloudflare Pages**: 무제한 무료
  - 대역폭: 무제한
  - 빌드: 월 500회
  - 프로젝트: 무제한

- **Render**: 750시간/월 무료
  - 계산: 750시간 = 약 31일
  - 한 달 내내 24시간 운영 가능!
  - 15분 비활성 시 슬립 모드 (정상)

- **총 비용**: **0원**

### 비용 걱정 없는 이유

- 신용카드 등록 안 해도 됨
- 무료 한도 초과 시 → 자동 정지 (돈 안 나감)
- 친구들과 게임하기엔 충분한 성능

---

## 📊 배포 상태 모니터링

### Cloudflare Pages

1. 대시보드: https://dash.cloudflare.com
2. `Workers & Pages` 클릭
3. `trapstep` 프로젝트 선택
4. 확인 가능한 정보:
   - 배포 히스토리
   - 빌드 로그
   - 방문자 수
   - 성능 지표

### Render

1. 대시보드: https://dashboard.render.com
2. `trapstep-server` 선택
3. 확인 가능한 정보:
   - 서버 상태
   - CPU/메모리 사용량
   - 로그
   - 사용 시간

---

## 🔄 업데이트 방법

코드 수정 후 재배포:

### GitHub Desktop 사용

1. 코드 수정
2. GitHub Desktop 실행
3. 변경사항 확인
4. 커밋 메시지 입력
5. `Commit to main` 클릭
6. `Push origin` 클릭
7. 자동으로 배포됨! (3분 소요)

### 터미널 사용

```bash
# 코드 수정 후
git add .
git commit -m "Update game features"
git push

# 자동으로 Cloudflare Pages에 배포됨!
```

---

## 🎯 다음 단계

### 게임 개선 아이디어

1. **더 많은 레벨** 추가
   - `src/data/levels.ts` 수정
   - GitHub에 푸시 → 자동 배포

2. **새로운 트랩** 추가
   - `src/game/traps/` 폴더에 새 파일 생성

3. **랭킹 시스템** 추가
   - 백엔드 서버에 DB 연결 (무료: Supabase)

4. **모바일 앱** 배포
   - Capacitor 이미 설정됨
   - `npm run cap:add:ios` / `npm run cap:add:android`

### 커뮤니티 공유

- 친구들에게 게임 링크 공유
- 소셜 미디어에 공유
- 피드백 받아서 개선

---

## 📞 도움말

### 공식 문서

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Render: https://render.com/docs
- Phaser.js: https://phaser.io/learn

### 문제 발생 시

1. 이 가이드의 문제 해결 섹션 확인
2. 브라우저 콘솔 에러 메시지 확인
3. Render/Cloudflare 로그 확인

---

## 🎉 완료!

**축하합니다!** 완전 무료로 전 세계에서 접속 가능한 온라인 멀티플레이어 게임을 배포했습니다!

### 최종 체크리스트

- [x] Git 저장소 초기화
- [x] GitHub에 코드 업로드
- [x] Render에 백엔드 배포
- [x] Cloudflare Pages에 프론트엔드 배포
- [x] 환경 변수 설정
- [ ] 게임 테스트
- [ ] 친구들과 플레이!

**게임 URL**: `https://trapstep.pages.dev`

이제 친구들에게 공유하고 함께 즐기세요! 🎮🎉
