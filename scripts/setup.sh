#!/bin/bash

# OnchainMind Setup Script
# This script automates the setup of the OnchainMind dApp project

set -e  # Exit on any error

echo "🚀 OnchainMind Setup Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js $(node --version) is installed ✓"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "npm $(npm --version) is installed ✓"
}

# Check if Git is installed
check_git() {
    print_status "Checking Git installation..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_status "Git $(git --version | cut -d' ' -f3) is installed ✓"
}

# Install dependencies for all packages
install_dependencies() {
    print_header "Installing Dependencies"
    echo ""
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Smart contract dependencies
    print_status "Installing smart contract dependencies..."
    cd contracts
    npm install
    cd ..
    
    print_status "All dependencies installed successfully! ✓"
}

# Setup environment files
setup_environment() {
    print_header "Setting Up Environment Files"
    echo ""
    
    # Root .env
    if [ ! -f .env ]; then
        print_status "Creating root .env file..."
        cp env.example .env
        print_warning "Please update .env with your configuration values"
    else
        print_status "Root .env file already exists"
    fi
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        print_status "Creating backend .env file..."
        cp env.example backend/.env
        print_warning "Please update backend/.env with your configuration values"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        print_status "Creating frontend .env.local file..."
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_NETWORK=circleLayer
NEXT_PUBLIC_CHAIN_ID=1234
EOF
        print_status "Frontend .env.local file created"
    else
        print_status "Frontend .env.local file already exists"
    fi
}

# Compile smart contracts
compile_contracts() {
    print_header "Compiling Smart Contracts"
    echo ""
    
    cd contracts
    
    print_status "Compiling contracts..."
    npm run compile
    
    if [ $? -eq 0 ]; then
        print_status "Contracts compiled successfully! ✓"
    else
        print_error "Contract compilation failed"
        exit 1
    fi
    
    cd ..
}

# Run tests
run_tests() {
    print_header "Running Tests"
    echo ""
    
    cd contracts
    
    print_status "Running smart contract tests..."
    npm run test
    
    if [ $? -eq 0 ]; then
        print_status "All tests passed! ✓"
    else
        print_warning "Some tests failed. Please check the output above."
    fi
    
    cd ..
}

# Setup development environment
setup_dev_environment() {
    print_header "Setting Up Development Environment"
    echo ""
    
    # Create logs directory
    mkdir -p logs
    
    # Create necessary directories
    mkdir -p backend/uploads
    mkdir -p frontend/public/images
    
    print_status "Development directories created"
}

# Display next steps
show_next_steps() {
    print_header "Setup Complete! 🎉"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Configure Environment Variables:"
    echo "   - Update .env files with your API keys and configuration"
    echo "   - Set your OpenAI API key in backend/.env"
    echo "   - Configure Circle Layer RPC URL and chain ID"
    echo ""
    echo "2. Deploy Smart Contracts:"
    echo "   cd contracts"
    echo "   npm run deploy"
    echo ""
    echo "3. Start Development Servers:"
    echo "   npm run dev          # Start both frontend and backend"
    echo "   npm run dev:frontend # Start only frontend"
    echo "   npm run dev:backend  # Start only backend"
    echo ""
    echo "4. Access the Application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "5. Read the Documentation:"
    echo "   - README.md for project overview"
    echo "   - docs/demo.md for demo script"
    echo ""
    print_warning "Don't forget to set your OpenAI API key for AI features to work!"
}

# Main setup function
main() {
    echo "Starting OnchainMind setup..."
    echo ""
    
    # Check prerequisites
    check_nodejs
    check_npm
    check_git
    
    echo ""
    
    # Install dependencies
    install_dependencies
    
    echo ""
    
    # Setup environment
    setup_environment
    
    echo ""
    
    # Setup dev environment
    setup_dev_environment
    
    echo ""
    
    # Compile contracts
    compile_contracts
    
    echo ""
    
    # Run tests
    run_tests
    
    echo ""
    
    # Show next steps
    show_next_steps
}

# Check if script is run from project root
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ] || [ ! -d "contracts" ]; then
    print_error "Please run this script from the OnchainMind project root directory"
    exit 1
fi

# Run main setup
main
