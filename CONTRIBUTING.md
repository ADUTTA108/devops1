# Contributing Guide

Thank you for contributing to the CUET Micro-Ops Hackathon Challenge! This guide will help you understand the development workflow and CI/CD process.

## Getting Started

### Prerequisites

- **Node.js**: >= 24.10.0
- **npm**: >= 10.x
- **Docker**: >= 24.x (for running services)
- **Docker Compose**: >= 2.x

### Setup Development Environment

1. **Clone the repository**

   ```bash
   git clone https://github.com/ADUTTA108/devops1
   cd devops1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions**:

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### 2. Make Changes and Test Locally

**Before every commit, run the validation suite**:

```bash
# Check code formatting
npm run format:check

# Run linter
npm run lint

# Run E2E tests (requires Docker)
npm run docker:dev
npm run test:e2e
```

**Fix issues automatically**:

```bash
# Auto-fix formatting
npm run format

# Auto-fix linting issues
npm run lint:fix
```

### 3. Commit Guidelines

Follow conventional commit format:

```bash
git commit -m "type(scope): description"
```

**Types**:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Test improvements

**Examples**:

```bash
git commit -m "feat(download): add progress tracking"
git commit -m "fix(health): correct S3 connectivity check"
git commit -m "docs(readme): update CI/CD section"
```

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create PR on GitHub with a descriptive title and explanation of changes.

## CI/CD Pipeline

The CI/CD pipeline runs automatically on every push and pull request.

### Pipeline Stages (in order)

```
1. Lint & Format (10 min)
   ↓
2. E2E Tests (30 min)
   ↓
3. Build Docker Images (20 min)
   ↓
4. Security Scanning (parallel)
   ↓
5. Final Status Check
```

### What Each Stage Does

**Stage 1: Lint & Format**

- Runs: `npm run lint` (ESLint)
- Runs: `npm run format:check` (Prettier)
- Fails if: Any linting or formatting issues

**Stage 2: E2E Tests**

- Runs: `npm run test:e2e`
- Services: MinIO for S3
- Fails if: Any test fails
- Uploads test results for 30 days

**Stage 3: Build Docker**

- Only on: Push events (not PRs)
- Builds: Production Docker image
- Pushes to: GitHub Container Registry
- Tags: Automatic semantic versioning

**Stage 4: Security Scanning**

- Trivy vulnerability scanner
- Results to GitHub Security tab

**Stage 5: Status Check**

- Reports overall pipeline result
- Fails if lint or test failed

### Pre-Push Checklist

Before pushing your branch:

- [ ] Code follows project style (`npm run format:check`)
- [ ] No linting errors (`npm run lint`)
- [ ] All tests pass (`npm run test:e2e`)
- [ ] Commit messages follow conventional format

**One-liner verification**:

```bash
npm run format:check && npm run lint && npm run test:e2e && echo "✅ Ready!"
```

## Code Style Guide

### TypeScript/JavaScript

```typescript
// Use TypeScript for type safety
const downloadFile = async (fileId: number): Promise<string> => {
  // ...
};

// Use const/let, avoid var
const config = { ... };
let counter = 0;

// Use async/await over .then()
const result = await fetchData();

// Use template literals
const message = `File ${id} processing...`;

// Use destructuring
const { status, checks } = response;
```

### Naming Conventions

- **Classes**: PascalCase (`DownloadManager`)
- **Functions**: camelCase (`checkS3Health`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Variables**: camelCase (`downloadUrl`)

## Testing

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with Docker services
npm run docker:dev
npm run test:e2e

# Run with development server
npm run dev
# In another terminal:
npm run test:e2e
```

## Docker Usage

### Development Mode

```bash
npm run docker:dev
# Services:
# - API: http://localhost:3000
# - MinIO: http://localhost:9001
```

### Production Mode

```bash
npm run docker:prod
```

## Debugging

### View Logs

```bash
# Development
npm run dev

# Docker
docker compose -f docker/compose.dev.yml logs -f delineate-app
```

### Common Issues

**Port already in use**:

```bash
lsof -ti:3000 | xargs kill -9
```

**Docker not running**:

```bash
docker ps  # Should show containers
```

**Tests failing locally but passing in CI**:

- Ensure Node.js 24+: `node --version`
- Check .env file against .env.example
- Run: `npm ci` instead of `npm install`

## Questions?

- Check [README.md](README.md) for project overview
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for design details
- Check GitHub Issues for known problems

---

**Happy coding! 🚀**
