# ASP.NET Core Clean Architecture Application

This repository contains an ASP.NET Core application built using Clean Architecture principles with PostgreSQL as the database backend. The application is containerized using Docker for ease of development and deployment.

## Project Structure

The application follows Clean Architecture principles with the following layers:

-   **Domain**: Contains enterprise business rules and entities
-   **Application**: Contains business rules specific to the application
-   **Infrastructure**: Contains implementations of interfaces defined in the application layer
-   **WebApi**: Contains controllers and API endpoints

## Prerequisites

-   [Docker](https://www.docker.com/products/docker-desktop)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0) (for local development)
-   [Visual Studio Code](https://code.visualstudio.com/) (recommended)
-   [PostgreSQL Extension](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres) for VS Code (optional)

## Getting Started

### Running with Docker

1. Clone this repository
2. Navigate to the project directory
3. Run the following command to build and start the application:

```bash
docker-compose up -d
```

This will start:

-   PostgreSQL database on port 5432
-   ASP.NET Core Web API on port 8080 (HTTP) and 8443 (HTTPS)

### Accessing the Application

-   API: http://localhost:8080
-   Swagger Documentation: http://localhost:8080/swagger

### Database Connection

The PostgreSQL database is accessible with these credentials:

-   Host: localhost
-   Port: 5432
-   Database: aspnetdb
-   Username: postgres
-   Password: postgres

These settings are configured in:

-   `docker-compose.yml` for the containerized environment
-   `.vscode/settings.json` for VS Code connection

## Development Workflow

### Local Development (without Docker)

1. Ensure PostgreSQL is installed and running locally or connect to the containerized database
2. Update the connection string in `WebApi/appsettings.json`
3. Navigate to the WebApi project directory
4. Run the application:

```bash
cd WebApi
dotnet run
```

### Using Entity Framework Migrations

To create and apply database migrations:

```bash
# Navigate to the WebApi project
cd WebApi

# Add a new migration
dotnet ef migrations add MigrationName --project ../Infrastructure

# Apply migrations to the database
dotnet ef database update --project ../Infrastructure
```

## Configuration

The application configuration is stored in `WebApi/appsettings.json`. For local development, you can create `appsettings.Development.json` with environment-specific settings.

### Connection String Format

```
Host=postgres;Port=5432;Database=aspnetdb;Username=postgres;Password=postgres;
```

## Troubleshooting

### Docker Issues

If you encounter issues with Docker:

```bash
# Restart containers
docker-compose down
docker-compose up -d

# View logs
docker-compose logs -f
```

### Database Connection Issues

-   Ensure the PostgreSQL container is running: `docker ps`
-   Check container logs: `docker-compose logs postgres`
-   Verify connection settings in appsettings.json
