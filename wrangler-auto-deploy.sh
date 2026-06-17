#!/bin/bash

# Cloudflare Pages 자동 배포 스크립트 (Wrangler CLI 사용)

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔═══════════════════════════════════════╗"
echo "║   Cloudflare Pages CLI 자동 배포 🚀    ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Step 1: Wrangler 확인
echo -e "${BLUE}1️⃣  Wrangler CLI 확인 중...${NC}"

if ! command -v npx &> /dev/null; then
    echo -e "${RED}✗ npx가 설치되지 않았습니다.${NC}"
    echo "Node.js를 먼저 설치해주세요: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓ npx 사용 가능${NC}"
echo ""

# Step 2: Cloudflare 로그인 확인
echo -e "${BLUE}2️⃣  Cloudflare 로그인 확인 중...${NC}"
echo ""

if npx wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✓ 이미 로그인되어 있습니다${NC}"
    ACCOUNT=$(npx wrangler whoami 2>/dev/null | grep "Account Name" | cut -d: -f2 | xargs)
    echo "  Account: $ACCOUNT"
else
    echo -e "${YELLOW}⚠ Cloudflare 로그인이 필요합니다${NC}"
    echo ""
    echo "브라우저가 열리면 Cloudflare 계정으로 로그인해주세요..."
    echo ""

    npx wrangler login

    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ 로그인 실패${NC}"
        exit 1
    fi

    echo ""
    echo -e "${GREEN}✓ 로그인 성공${NC}"
fi

echo ""

# Step 3: 환경 변수 확인
echo -e "${BLUE}3️⃣  환경 변수 확인 중...${NC}"
echo ""

if [ -f ".env" ]; then
    BACKEND_URL=$(grep VITE_SERVER_URL .env | cut -d= -f2)
    if [ -z "$BACKEND_URL" ]; then
        echo -e "${YELLOW}⚠ .env 파일에 VITE_SERVER_URL이 없습니다${NC}"
        read -p "Render 백엔드 URL을 입력하세요: " BACKEND_URL
        echo "VITE_SERVER_URL=$BACKEND_URL" > .env
    fi
else
    echo -e "${YELLOW}⚠ .env 파일이 없습니다${NC}"
    read -p "Render 백엔드 URL을 입력하세요 (예: https://trapstep-server.onrender.com): " BACKEND_URL
    echo "VITE_SERVER_URL=$BACKEND_URL" > .env
fi

echo -e "${GREEN}✓ 백엔드 URL: $BACKEND_URL${NC}"
echo ""

# Step 4: 빌드
echo -e "${BLUE}4️⃣  프로젝트 빌드 중...${NC}"
echo ""

export VITE_SERVER_URL=$BACKEND_URL
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 빌드 실패${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ 빌드 완료${NC}"
echo ""

# Step 5: Cloudflare Pages 배포
echo -e "${BLUE}5️⃣  Cloudflare Pages 배포 중...${NC}"
echo ""

# wrangler.toml 파일 생성 (없으면)
if [ ! -f "wrangler.toml" ]; then
    cat > wrangler.toml <<EOF
name = "trapstep"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
cwd = "."
watch_dirs = ["src"]

[build.upload]
format = "directory"
dir = "dist"

[[env.production]]
name = "trapstep"

[[env.production.vars]]
VITE_SERVER_URL = "$BACKEND_URL"
EOF
    echo -e "${GREEN}✓ wrangler.toml 생성 완료${NC}"
fi

# Pages 프로젝트 배포
echo ""
echo "Cloudflare Pages에 배포 중..."
echo ""

npx wrangler pages deploy dist --project-name=trapstep

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ 프로젝트가 없을 수 있습니다. 생성하시겠습니까? (y/n)${NC}"
    read -p "프로젝트 생성: " create_project

    if [ "$create_project" = "y" ]; then
        echo ""
        echo "프로젝트를 생성하고 다시 배포합니다..."
        npx wrangler pages project create trapstep --production-branch=main
        npx wrangler pages deploy dist --project-name=trapstep
    else
        echo -e "${RED}✗ 배포 취소${NC}"
        exit 1
    fi
fi

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║        배포 완료! 🎉                   ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# 배포 URL 가져오기
DEPLOYMENT_URL=$(npx wrangler pages deployment list --project-name=trapstep 2>/dev/null | grep -o "https://[^[:space:]]*" | head -1)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "${GREEN}🎮 게임 URL: $DEPLOYMENT_URL${NC}"
else
    echo -e "${GREEN}🎮 게임 URL: https://trapstep.pages.dev${NC}"
fi

echo -e "${GREEN}🔧 백엔드: $BACKEND_URL${NC}"
echo ""
echo "이제 친구들에게 게임 URL을 공유하세요!"
echo ""
echo "테스트 방법:"
echo "1. 게임 URL 접속"
echo "2. 'ONLINE MULTIPLAYER' 클릭"
echo "3. 'CREATE ROOM' 클릭"
echo "4. 방 코드를 친구에게 전달"
echo "5. 함께 플레이!"
echo ""
echo "즐거운 게임 되세요! 🎮🎉"
