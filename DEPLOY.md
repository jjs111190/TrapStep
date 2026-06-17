# 🚀 TrapStep 웹 배포 가이드

## 빠른 배포 (Netlify - 무료)

### 1단계: 프로젝트 빌드

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

`dist` 폴더가 생성됩니다.

### 2단계: Netlify 배포

**방법 A: 드래그 앤 드롭 (가장 쉬움)**

1. https://app.netlify.com/drop 접속
2. `dist` 폴더를 드래그 앤 드롭
3. 즉시 URL 발급! (예: `random-name-123.netlify.app`)

**방법 B: Netlify CLI**

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
ntl login

# 배포
ntl deploy --prod
```

### 3단계: 친구들과 공유

발급받은 URL을 친구들에게 공유하면 바로 플레이 가능!

## 커스텀 도메인 (선택사항)

Netlify에서 무료로 설정 가능:
- `Site settings` → `Domain management`
- 원하는 도메인 연결 또는 Netlify 서브도메인 변경

## 게임 모드

- **1 Player**: 혼자 20개 레벨
- **2 Player - Co-op**: 협력, 둘 다 포탈 도착해야 클리어
- **2 Player - Race**: 경쟁, 먼저 도착하는 사람이 승리

## 조작법

**Player 1:**
- WASD: 이동
- Space: 점프

**Player 2:**
- Arrow Keys: 이동
- Enter: 점프

## 문제 해결

**빌드 에러:**
```bash
rm -rf node_modules
npm install
npm run build
```

**Netlify 배포 실패:**
- `netlify.toml` 파일이 프로젝트 루트에 있는지 확인
- Node 버전 확인: 16 이상 필요

---

## 무료 호스팅 비교

| 플랫폼 | 배포 | 속도 | 무료 대역폭 |
|--------|------|------|-------------|
| **Netlify** | ⭐⭐⭐ | 빠름 | 100GB/월 |
| Vercel | ⭐⭐ | 빠름 | 100GB/월 |
| GitHub Pages | ⭐ | 보통 | 무제한 |

Netlify 추천 이유:
✅ 드래그 앤 드롭 배포
✅ 자동 HTTPS
✅ 빠른 CDN
✅ 무료 도메인

---

**배포 후 URL 예시:**
`https://trapstep.netlify.app`

친구들에게 이 링크만 보내면 바로 2인 플레이 가능! 🎮
