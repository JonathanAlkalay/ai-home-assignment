# AI Content Generator

A full-stack application that generates AI-powered content. The project uses Next.js for the frontend and Node.js with Express for the backend.

## Project Structure

```
.
├── frontend/     # Next.js frontend application
├── backend/      # Node.js backend application
├── package.json  # Root package.json for workspace management
└── README.md     # This file
```

## Prerequisites

- Node.js 18 or later
- npm 7 or later (for workspace support)
- Redis 6 or later (for caching)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Redis:
- Install Redis on your system (if not already installed):
  ```bash
  # Ubuntu/Debian
  sudo apt-get install redis-server

  # macOS with Homebrew
  brew install redis
  ```
- Start Redis server:
  ```bash
  # Ubuntu/Debian
  sudo service redis-server start

  # macOS with Homebrew
  brew services start redis
  ```

3. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables as needed, including Redis configuration:
  ```env
  # Redis Configuration
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_PASSWORD=
  REDIS_TTL=3600  # Cache TTL in seconds
  ```

4. Start the development servers:
```bash
npm run dev
```

This will start both the frontend and backend in development mode:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend in development mode
- `npm run dev:backend` - Start only the backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run start` - Start both frontend and backend in production mode

## Development

The project uses npm workspaces to manage the monorepo structure. You can run commands in specific workspaces using the `--workspace` flag:

```bash
npm run dev --workspace=frontend
npm run dev --workspace=backend
```

## Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
OPENAI_API_KEY=your_api_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600
```

## Features

- AI-powered blog post generation
- User authentication
- Post management dashboard
- Public post sharing
- Draft saving and editing
- Redis caching for improved performance

## Tech Stack

- Frontend:
  - Next.js
  - React Query
  - ShadCN UI
  - Tailwind CSS
  - TypeScript

- Backend:
  - Node.js
  - Express
  - TypeORM
  - PostgreSQL
  - Redis
  - JWT Authentication
  - OpenAI API 