#!/bin/bash

# TrapStep 원클릭 배포 스크립트
# 사용법: ./deploy.sh

set -e  # 에러 발생시 중단

echo "╔═══════════════════════════════════════╗"
echo "║   TrapStep 자동 배포 스크립트 🚀       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 필수 도구 확인
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1이(가) 설치되지 않았습니다.${NC}"
        echo -e "${YELLOW}설치 방법: $2${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $1 설치됨${NC}"
    fi
}

echo "1️⃣  필수 도구 확인 중..."
check_command "docker" "https://www.docker.com/get-started"
check_command "docker-compose" "Docker Desktop에 포함됨"

# Railway CLI 확인 (선택)
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠ Railway CLI 미설치 (온라인 배포에 필요)${NC}"
    echo -e "${YELLOW}설치: npm install -g @railway/cli${NC}"
    RAILWAY_AVAILABLE=false
else
    echo -e "${GREEN}✓ Railway CLI 설치됨${NC}"
    RAILWAY_AVAILABLE=true
fi

echo ""
echo "배포 방식을 선택하세요:"
echo "1) 로컬 Docker (localhost에서 즉시 실행)"
echo "2) Railway 온라인 배포 (전 세계 접속 가능)"
echo "3) 둘 다"
echo ""
read -p "선택 (1/2/3): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        echo ""
        echo "2️⃣  Docker 로컬 배포 시작..."
        echo ""

        # 기존 컨테이너 정리
        echo "기존 컨테이너 정리 중..."
        docker-compose down 2>/dev/null || true

        # 빌드 및 실행
        echo "Docker 이미지 빌드 및 실행 중..."
        docker-compose up --build -d

        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║        배포 완료! 🎉                   ║${NC}"
        echo -e "${GREEN}╠═══════════════════════════════════════╣${NC}"
        echo -e "${GREEN}║  웹사이트: http://localhost          ║${NC}"
        echo -e "${GREEN}║  백엔드: http://localhost:3001       ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
        echo ""
        echo "컨테이너 상태 확인:"
        docker-compose ps
        echo ""
        echo "로그 보기: docker-compose logs -f"
        echo "중지: docker-compose down"
        ;;

    2)
        if [ "$RAILWAY_AVAILABLE" = false ]; then
            echo -e "${RED}Railway CLI가 설치되지 않았습니다.${NC}"
            echo "설치: npm install -g @railway/cli"
            exit 1
        fi

        echo ""
        echo "2️⃣  Railway 온라인 배포 시작..."
        echo ""

        # Railway 로그인 확인
        if ! railway whoami &> /dev/null; then
            echo "Railway 로그인이 필요합니다..."
            railway login
        fi

        echo "백엔드 배포 중..."
        cd server

        # Railway 프로젝트 초기화
        if [ ! -f "railway.json" ]; then
            railway init
        fi

        # 배포
        railway up

        # 서버 URL 가져오기
        SERVER_URL=$(railway domain)

        if [ -z "$SERVER_URL" ]; then
            echo -e "${YELLOW}도메인이 아직 설정되지 않았습니다.${NC}"
            echo "Railway 대시보드에서 도메인을 생성하세요."
            SERVER_URL="YOUR_RAILWAY_DOMAIN"
        else
            SERVER_URL="https://$SERVER_URL"
        fi

        cd ..

        echo ""
        echo "프론트엔드 빌드 중..."

        # 환경 변수 설정
        echo "VITE_SERVER_URL=$SERVER_URL" > .env

        # 빌드
        npm install
        npm run build

        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║        배포 준비 완료! 🎉             ║${NC}"
        echo -e "${GREEN}╠═══════════════════════════════════════╣${NC}"
        echo -e "${GREEN}║  백엔드 URL: $SERVER_URL${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
        echo ""
        echo "다음 단계:"
        echo "1. Netlify 배포:"
        echo "   npm install -g netlify-cli"
        echo "   netlify deploy --prod --dir=dist"
        echo ""
        echo "2. 또는 Railway에 프론트엔드도 배포:"
        echo "   railway init"
        echo "   railway up"
        ;;

    3)
        echo ""
        echo "2️⃣  로컬 + 온라인 배포 시작..."
        echo ""

        # 로컬 배포
        echo "로컬 Docker 배포..."
        docker-compose down 2>/dev/null || true
        docker-compose up --build -d

        echo -e "${GREEN}✓ 로컬 배포 완료${NC}"
        echo ""

        # Railway 배포
        if [ "$RAILWAY_AVAILABLE" = true ]; then
            echo "Railway 온라인 배포..."

            if ! railway whoami &> /dev/null; then
                railway login
            fi

            cd server
            railway up
            cd ..

            echo -e "${GREEN}✓ 온라인 배포 완료${NC}"
        fi

        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║        모든 배포 완료! 🎉             ║${NC}"
        echo -e "${GREEN}╠═══════════════════════════════════════╣${NC}"
        echo -e "${GREEN}║  로컬: http://localhost              ║${NC}"
        echo -e "${GREEN}║  온라인: Railway 대시보드 확인        ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
        ;;

    *)
        echo -e "${RED}잘못된 선택입니다.${NC}"
        exit 1
        ;;
esac

echo ""
echo "배포 완료! 🎮"
