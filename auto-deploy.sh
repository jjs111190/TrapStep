#!/bin/bash

# TrapStep 자동 배포 스크립트
# 사용자가 최소한의 작업만 하도록 자동화

# 에러 발생해도 계속 진행
set +e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔═══════════════════════════════════════╗"
echo "║   TrapStep 자동 배포 스크립트 🚀       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Step 1: GitHub 확인
echo -e "${BLUE}1️⃣  GitHub 설정 확인 중...${NC}"
echo ""

if git remote -v | grep -q origin; then
    echo -e "${GREEN}✓ GitHub 리모트가 이미 설정되어 있습니다.${NC}"
    GITHUB_URL=$(git remote get-url origin)
    echo -e "   URL: ${GITHUB_URL}"
else
    echo -e "${YELLOW}⚠ GitHub 리모트가 설정되지 않았습니다.${NC}"
    echo ""
    echo "GitHub 설정 방법:"
    echo "1. GitHub.com에 로그인"
    echo "2. 새 저장소 생성 (이름: TrapStep, Public)"
    echo "3. 아래 명령어 실행:"
    echo ""
    echo -e "${GREEN}git remote add origin https://github.com/YOUR_USERNAME/TrapStep.git${NC}"
    echo -e "${GREEN}git push -u origin main${NC}"
    echo ""
    read -p "GitHub 설정을 완료했습니까? (y/n): " github_ready

    if [ "$github_ready" != "y" ]; then
        echo -e "${RED}GitHub 설정을 먼저 완료해주세요.${NC}"
        exit 1
    fi
fi

# Step 2: GitHub Desktop 체크
echo ""
echo -e "${BLUE}2️⃣  GitHub Desktop 확인 중...${NC}"
echo ""

if command -v github &> /dev/null; then
    echo -e "${GREEN}✓ GitHub Desktop이 설치되어 있습니다.${NC}"
    echo ""
    echo "GitHub Desktop으로 푸시하려면:"
    echo "1. GitHub Desktop 열기"
    echo "2. 'Push origin' 버튼 클릭"
    echo ""
else
    echo -e "${YELLOW}⚠ GitHub Desktop이 설치되어 있지 않습니다.${NC}"
    echo ""
    echo "터미널로 푸시하려면:"
    echo -e "${GREEN}git push origin main${NC}"
    echo ""
fi

read -p "GitHub에 푸시를 완료했습니까? (y/n): " pushed

if [ "$pushed" != "y" ]; then
    echo -e "${YELLOW}먼저 GitHub에 푸시해주세요.${NC}"
    exit 1
fi

# Step 3: 배포 URL 수집
echo ""
echo -e "${BLUE}3️⃣  배포 설정 중...${NC}"
echo ""

echo "이제 웹 브라우저에서 다음 단계를 진행해주세요:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}백엔드 배포 (Render)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. https://render.com 접속"
echo "2. GitHub 로그인"
echo "3. New + → Web Service"
echo "4. TrapStep 저장소 선택"
echo "5. 설정:"
echo "   - Name: trapstep-server"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Instance Type: Free"
echo "6. 환경 변수:"
echo "   - NODE_ENV=production"
echo "   - PORT=3001"
echo "7. Create Web Service"
echo "8. 배포 완료될 때까지 대기 (3-5분)"
echo ""

read -p "Render 배포를 완료했습니까? (y/n): " render_done

if [ "$render_done" != "y" ]; then
    echo -e "${YELLOW}Render 배포를 먼저 완료해주세요.${NC}"
    exit 1
fi

echo ""
read -p "Render 백엔드 URL을 입력하세요 (예: https://trapstep-server-xxxx.onrender.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}URL을 입력해야 합니다.${NC}"
    exit 1
fi

# .env 파일 생성 (로컬용)
echo "VITE_SERVER_URL=$BACKEND_URL" > .env
echo -e "${GREEN}✓ .env 파일 생성 완료 (로컬용)${NC}"
echo -e "${YELLOW}⚠ .env 파일은 Git에 올라가지 않습니다 (보안상 정상)${NC}"
echo -e "${YELLOW}  Cloudflare Pages에서 환경 변수를 직접 설정해야 합니다.${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}프론트엔드 배포 (Cloudflare Pages)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. https://dash.cloudflare.com 접속"
echo "2. 회원가입 / 로그인"
echo "3. Workers & Pages → Create → Pages"
echo "4. Connect to Git → GitHub 연결"
echo "5. TrapStep 저장소 선택"
echo "6. 설정:"
echo "   - Project name: trapstep"
echo "   - Build command: npm run build"
echo "   - Build output: dist"
echo ""
echo -e "${RED}7. 환경 변수 (중요! 반드시 설정):${NC}"
echo "   - Environment variables (advanced) 펼치기"
echo "   - Add variable 클릭"
echo -e "${GREEN}   - Variable name: VITE_SERVER_URL${NC}"
echo -e "${GREEN}   - Value: $BACKEND_URL${NC}"
echo "   (끝에 / 없이!)"
echo ""
echo "8. Save and Deploy"
echo ""

read -p "Cloudflare Pages 배포를 완료했습니까? (y/n): " cloudflare_done

if [ "$cloudflare_done" != "y" ]; then
    echo -e "${YELLOW}Cloudflare Pages 배포를 완료해주세요.${NC}"
    exit 1
fi

echo ""
read -p "Cloudflare Pages URL을 입력하세요 (예: https://trapstep.pages.dev): " FRONTEND_URL

# 최종 완료
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║        배포 완료! 🎉                   ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎮 게임 URL: $FRONTEND_URL${NC}"
echo -e "${GREEN}🔧 백엔드: $BACKEND_URL${NC}"
echo ""
echo "이제 친구들에게 게임 URL을 공유하세요!"
echo ""
echo "테스트 방법:"
echo "1. $FRONTEND_URL 접속"
echo "2. 'ONLINE MULTIPLAYER' 클릭"
echo "3. 'CREATE ROOM' 클릭"
echo "4. 방 코드를 친구에게 전달"
echo "5. 친구가 'JOIN ROOM'으로 입장"
echo "6. 함께 플레이!"
echo ""
echo "즐거운 게임 되세요! 🎮🎉"
