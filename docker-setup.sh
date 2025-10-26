#!/bin/bash

# Docker Setup Script for Next.js Authentication System
# This script helps set up and manage the Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        if ! docker compose version &> /dev/null; then
            print_error "docker-compose is not installed."
            exit 1
        else
            DOCKER_COMPOSE="docker compose"
        fi
    else
        DOCKER_COMPOSE="docker-compose"
    fi
    print_success "docker-compose is available"
}

# Function to create environment file if it doesn't exist
setup_environment() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.docker..."
        cp .env.docker .env
        print_status "Please edit .env file with your actual configuration values"
        print_warning "Especially update NEXTAUTH_SECRET and Google OAuth credentials"
    else
        print_success ".env file exists"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p public/uploads/avatars
    mkdir -p docker/postgres
    mkdir -p docker/nginx
    print_success "Directories created"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml up -d
    print_success "Development environment started"
    print_status "Application is available at http://localhost:3000"
    print_status "Database is available at localhost:5432"
    print_status "Redis is available at localhost:6379"
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    $DOCKER_COMPOSE -f docker-compose.yml up -d
    print_success "Production environment started"
    print_status "Application is available at http://localhost"
    print_status "Health check available at http://localhost/api/health"
}

# Function to stop containers
stop() {
    print_status "Stopping containers..."
    if [ -f docker-compose.dev.yml ]; then
        $DOCKER_COMPOSE -f docker-compose.dev.yml down
    fi
    if [ -f docker-compose.yml ]; then
        $DOCKER_COMPOSE -f docker-compose.yml down
    fi
    print_success "Containers stopped"
}

# Function to show logs
logs() {
    if [ -f docker-compose.dev.yml ]; then
        $DOCKER_COMPOSE -f docker-compose.dev.yml logs -f
    else
        $DOCKER_COMPOSE -f docker-compose.yml logs -f
    fi
}

# Function to run database migrations
migrate() {
    print_status "Running database migrations..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml exec app bun run db:migrate
    print_success "Database migrations completed"
}

# Function to seed database
seed() {
    print_status "Seeding database with default users..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml exec app bun run db:seed
    print_success "Database seeding completed"
}

# Function to create admin user
create_admin() {
    print_status "Creating admin user..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml exec app bun run db:seed admin
    print_success "Admin user creation completed"
    print_warning "Default credentials are shown in the output above"
    print_warning "Please change the password after first login"
}

# Function to reset admin password
reset_admin_password() {
    local new_password="${1:-admin123456}"
    print_status "Resetting admin password..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml exec app bun run db:seed reset-password "$new_password"
    print_success "Admin password reset completed"
}

# Function to show status
status() {
    print_status "Container status:"
    if [ -f docker-compose.dev.yml ]; then
        $DOCKER_COMPOSE -f docker-compose.dev.yml ps
    else
        $DOCKER_COMPOSE -f docker-compose.yml ps
    fi
}

# Function to show health check
health() {
    print_status "Checking application health..."
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Application is healthy"
        curl -s http://localhost:3000/api/health | jq .
    else
        print_error "Application health check failed"
        exit 1
    fi
}

# Function to clean up
clean() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        $DOCKER_COMPOSE -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
        $DOCKER_COMPOSE -f docker-compose.yml down -v --remove-orphans 2>/dev/null || true
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to show usage
usage() {
    echo "Next.js Authentication Docker Setup Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  logs        Show container logs"
    echo "  migrate     Run database migrations"
    echo "  seed        Seed database with default users"
    echo "  admin       Create admin user only"
    echo "  reset-pwd   Reset admin password (optional: new password)"
    echo "  status      Show container status"
    echo "  health      Check application health"
    echo "  clean       Clean up all Docker resources"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev              # Start development environment"
    echo "  $0 prod             # Start production environment"
    echo "  $0 logs             # Show logs"
    echo "  $0 seed             # Seed database with all default users"
    echo "  $0 admin            # Create admin user only"
    echo "  $0 reset-pwd        # Reset admin password to default"
    echo "  $0 reset-pwd new123 # Reset admin password to 'new123'"
    echo ""
    echo "Environment Variables:"
    echo "  ADMIN_EMAIL        Admin user email (default: admin@example.com)"
    echo "  ADMIN_PASSWORD     Admin user password (default: admin123456)"
    echo "  ADMIN_NAME         Admin user name (default: Admin User)"
}

# Main script logic
main() {
    print_status "Next.js Authentication Docker Setup"
    echo ""

    check_docker
    check_docker_compose
    setup_environment
    create_directories

    case "${1:-help}" in
        dev)
            start_dev
            ;;
        prod)
            start_prod
            ;;
        stop)
            stop
            ;;
        logs)
            logs
            ;;
        migrate)
            migrate
            ;;
        seed)
            seed
            ;;
        admin)
            create_admin
            ;;
        reset-pwd)
            reset_admin_password "$2"
            ;;
        status)
            status
            ;;
        health)
            health
            ;;
        clean)
            clean
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            print_error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"