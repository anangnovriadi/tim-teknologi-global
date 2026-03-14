#!/bin/bash
# Quick test runner script
# Usage: ./run_tests.sh [backend|frontend|all]

TARGET=${1:-all}

echo "=========================================="
echo "Inventory Management System - Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend tests
run_backend_tests() {
    echo -e "${BLUE}Running Backend Tests...${NC}"
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "Installing dependencies..."
        pip install -r requirements.txt -q
    fi
    
    echo ""
    echo "Running pytest..."
    pytest tests/ -v --tb=short
    BACKEND_STATUS=$?
    
    cd ..
    return $BACKEND_STATUS
}

# Frontend tests
run_frontend_tests() {
    echo -e "${BLUE}Running Frontend Tests...${NC}"
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install -q
    fi
    
    echo ""
    echo "Running Jest..."
    npm test -- --coverage
    FRONTEND_STATUS=$?
    
    cd ..
    return $FRONTEND_STATUS
}

# Run based on target
case $TARGET in
    backend)
        run_backend_tests
        ;;
    frontend)
        run_frontend_tests
        ;;
    all)
        run_backend_tests
        BACKEND_STATUS=$?
        
        echo ""
        echo "=========================================="
        echo ""
        
        run_frontend_tests
        FRONTEND_STATUS=$?
        
        echo ""
        echo "=========================================="
        echo "Test Results Summary"
        echo "=========================================="
        echo -e "Backend:  $([ $BACKEND_STATUS -eq 0 ] && echo -e "${GREEN}PASSED${NC}" || echo "FAILED")"
        echo -e "Frontend: $([ $FRONTEND_STATUS -eq 0 ] && echo -e "${GREEN}PASSED${NC}" || echo "FAILED")"
        echo "=========================================="
        
        if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
            exit 0
        else
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        exit 1
        ;;
esac
