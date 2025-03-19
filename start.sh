#!/bin/bash
print_message() {
    GREEN='\033[0;32m'
    NC='\033[0m'
    echo -e "${GREEN}$1${NC}"
}

check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "Error: Docker is not running. Please start Docker and try again."
        exit 1
    fi
}
check_docker

while true; do
    echo "=== E-Learning Platform Development ==="
    echo "1. Start all services"
    echo "2. Start client only"
    echo "3. Start server only"
    echo "4. Start admin only"
    echo "5. Stop all services"
    echo "6. View logs"
    echo "7. Rebuild services"
    echo "8. Exit"
    read -p "Choose an option: " choice

    case $choice in
        1)
            print_message "Starting all services..."
            docker compose up -d
            ;;
        2)
            print_message "Starting client service..."
            docker compose up -d client
            ;;
        3)
            print_message "Starting server and database..."
            docker compose up -d server db
            ;;
        4)
            print_message "Starting admin service..."
            docker compose up -d admin
            ;;
        5)
            print_message "Stopping all services..."
            docker compose down
            ;;
        6)
            print_message "Viewing logs (press Ctrl+C to exit)..."
            docker compose logs -f
            ;;
        7)
            print_message "Rebuilding and starting services..."
            docker compose down
            docker compose build --no-cache
            docker compose up -d
            ;;
        8)
            print_message "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
    echo
done