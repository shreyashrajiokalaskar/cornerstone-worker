# Cornerstone Worker

A NestJS-based worker application for processing documents, extracting embeddings, and managing background tasks using AWS SQS and S3 integration.

## Overview

Cornerstone Worker is a backend service built with [NestJS](https://nestjs.com/) that handles:
- **Document Processing**: PDF parsing and chunking
- **Vector Embeddings**: Generate embeddings using OpenAI
- **AWS Integration**: S3 storage and SQS message queue processing
- **Database Management**: PostgreSQL with TypeORM
- **Background Jobs**: SQS-driven worker processes

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cloud Services**: AWS S3, AWS SQS
- **AI/ML**: OpenAI (for embeddings)
- **PDF Processing**: pdf-parse
- **Container**: Docker & Docker Compose

## Project Structure

```
src/
├── app.controller.ts          # Application controller
├── app.service.ts             # Application service
├── app.module.ts              # Root module
├── main.ts                    # Application entry point
├── common/                    # Shared interfaces and utilities
│   └── common.interface.ts
├── config/                    # Configuration files
│   ├── common.constant.ts
│   └── typeorm.config.ts
├── db/                        # Database layer
│   └── entities/              # TypeORM entities
│       ├── common.entity.ts
│       ├── document.entity.ts
│       ├── document-chunk.entity.ts
│       ├── document-vector.entity.ts
│       ├── user.entity.ts
│       ├── user-auth.entity.ts
│       └── workspace.entity.ts
├── embeddings/                # Embedding generation service
│   └── embeddings.service.ts
├── pdf/                       # PDF processing service
│   └── pdf.service.ts
├── s3/                        # AWS S3 integration
│   └── s3-client.service.ts
├── sqs/                       # AWS SQS integration
│   ├── sqs-client.service.ts
│   └── sqs-consumer.service.ts
└── worker/                    # Background job processing
    └── worker.service.ts
```

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: For containerized deployment
- **PostgreSQL**: 12.x or higher
- **AWS Account**: With S3 and SQS access configured

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cornerstone-worker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=cornerstone
   DATABASE_USER=postgres
   DATABASE_PASSWORD=password
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   OPENAI_API_KEY=your_openai_key
   ```

## Development

### Run in Development Mode
```bash
npm run start:dev
```
Starts the application with hot-reload enabled.

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` directory.

### Run Production Build
```bash
npm run start:prod
```
Runs the compiled application.

### Format Code
```bash
npm run format
```
Formats code using Prettier.

### Lint
```bash
npm run lint
```
Runs ESLint to check code quality.

## Testing

### Run Tests
```bash
npm run test
```
Runs unit tests using Jest.

### Watch Mode
```bash
npm run test:watch
```
Runs tests in watch mode.

### Coverage Report
```bash
npm run test:cov
```
Generates test coverage report.

### E2E Tests
```bash
npm run test:e2e
```
Runs end-to-end tests.

## Docker

### Build Docker Image
```bash
docker build -t cornerstone-worker:latest .
```

### Run with Docker Compose
```bash
docker-compose up
```
Starts the application along with PostgreSQL in containers.

## Configuration

The application uses environment variables and configuration files:

- **tsconfig.json**: TypeScript compilation settings
- **tsconfig.build.json**: Build-specific TypeScript settings
- **nest-cli.json**: NestJS CLI configuration
- **docker-compose.yml**: Container orchestration setup

## Key Services

### SQS Consumer
Processes messages from AWS SQS queues for background job execution.

### S3 Client
Handles document storage and retrieval from AWS S3.

### PDF Service
Parses PDF files and extracts content for processing.

### Embeddings Service
Generates vector embeddings using OpenAI API.

### Worker Service
Orchestrates background job processing and task execution.

## Database

The application uses TypeORM with PostgreSQL. Key entities include:

- **User**: User account information
- **Workspace**: Tenant/workspace isolation
- **Document**: Document metadata
- **DocumentChunk**: Chunked document content
- **DocumentVector**: Vector embeddings for chunks
- **UserAuth**: Authentication credentials

Run migrations with:
```bash
npm run typeorm migration:run
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Database name | `cornerstone` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | - |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |
| `OPENAI_API_KEY` | OpenAI API key | - |

## API Endpoints

The main API endpoints are defined in the application controller. See [src/app.controller.ts](src/app.controller.ts) for details.

## Workflows

### Document Processing Workflow
1. Document is uploaded to S3
2. SQS message is queued with document metadata
3. Worker service consumes the message
4. PDF service extracts content and chunks
5. Embeddings are generated using OpenAI
6. Vectors are stored in PostgreSQL
7. Document metadata is updated in database

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with clear messages
5. Submit a pull request

## License

UNLICENSED

## Support

For issues or questions, please open an issue in the repository.
