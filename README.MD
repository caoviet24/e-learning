# E-Learning Platform

Full-stack E-Learning platform built with Next.js, Express.js, Prisma, and MySQL.

## Project Structure

```
.
├── client/            # Next.js frontend application
└── server/            # Express.js backend application
```

## Docker Support

Both client and server applications include Docker support for easy development and deployment.

### Starting the Entire Application

1. Start the client:
```bash
cd client
docker-compose up -d
```

2. Start the server and database:
```bash
cd server
docker-compose up -d
```

### Accessing the Applications

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- MySQL Database: localhost:3306

### Stopping the Applications

Stop the client:
```bash
cd client
docker-compose down
```

Stop the server and database:
```bash
cd server
docker-compose down
```

## Development Without Docker

1. Start the server:
```bash
cd server
npm install
npm run dev
```

2. Start the client:
```bash
cd client
npm install
npm run dev
```

## Additional Documentation

- [Client Documentation](client/README.md)
- [Server Documentation](server/README.md)