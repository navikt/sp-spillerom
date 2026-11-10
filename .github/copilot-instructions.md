# Spillerom - Copilot Agent Instructions

## Repository Overview

**Spillerom** is a Next.js 16 frontend application (Norwegian: "spillerom" = "playroom") that serves as the frontend for the backend service "bakrommet". This is a NAV (Norwegian Labour and Welfare Administration) internal application for case processing.

- **Type**: Next.js 16 web application with TypeScript
- **Size**: ~25,000 lines of TypeScript/TSX code
- **Runtime**: Node.js 24, pnpm 10.28.0
- **Key Technologies**: Next.js 16, React 19, TypeScript, Tailwind CSS, NAV Design System (@navikt/ds-*), TanStack Query, Vitest
- **Deployment**: NAIS platform (Kubernetes) on GCP with Azure AD authentication

## Critical Prerequisites

### NPM Authentication Token Required

This repository depends on @navikt packages from GitHub Package Registry. Put a GitHub token with `read:packages` scope in your user-level `~/.npmrc` before running pnpm:

```
//npm.pkg.github.com/:_authToken=<your-github-token-with-read:packages>
```

pnpm does not expand environment variables in the project `.npmrc`. Without the token, `pnpm install` fails with 401 Unauthorized.

## Build & Validation Commands

### Installation (ALWAYS run first)

```bash
pnpm install --frozen-lockfile
```

**Note**: The repository uses `pnpm-workspace.yaml` with security configurations including `ignoreScripts: true` and `preferFrozenLockfile: true`.

### Validation Order (Run in this exact order)

The CI pipeline runs validation steps in this order. **ALWAYS follow this sequence:**

1. **Type checking**: `pnpm run tsc`
2. **Code formatting check**: `pnpm run prettier:check`
3. **Linting**: `pnpm run lint`
4. **Unit tests**: `pnpm run test`

### Building

**Before building, ALWAYS copy the appropriate environment file:**

```bash
cp .nais/envs/.env.demo .env.production

# Then build
pnpm run build
```

### Running Locally

```bash
# Development mode (uses .env.development)
pnpm run dev

# Local with lokal environment
pnpm run lokal

# Production mode (requires prior build)
pnpm run start
```

### Testing

**Unit Tests (Vitest):**
```bash
pnpm run test
```

### Formatting & Linting

```bash
# Check formatting
pnpm run prettier:check

# Fix formatting
pnpm run prettier:write

# Check linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format and fix everything
pnpm run format
```

## Project Structure

### Key Directories

```
/src
  /app              - Next.js App Router pages
    /api            - API route handlers
    /oauth2         - OAuth2 authentication flow
    /person         - Person detail pages
    /testscenarioer - Test scenario pages
    layout.tsx      - Root layout with providers
    page.tsx        - Homepage (task list)
  /components       - React components organized by feature
  /hooks            - Custom React hooks
    /mutations      - TanStack Query mutations
    /queries        - TanStack Query queries
  /schemas          - Zod validation schemas
  /types            - TypeScript type definitions
  /utils            - Utility functions
  /styles           - Global CSS styles
  /auth             - Authentication utilities
  /mock-api         - Mock API for local development
  env.ts            - Environment configuration with Zod validation

/.github
  /workflows        - GitHub Actions workflows
    deploy.yml        - Build, test and deploy demo (main branch)
    pull-requests.yml - Build and test pull requests
  /actions
    /setup-npm-deps   - Sets up Node 24, pnpm, and installs dependencies

/.nais              - NAIS deployment configurations
  /envs             - Environment-specific .env files
  sp-spillerom.yaml - Demo deployment (dev-gcp, namespace tbd)
```

### Configuration Files

- `package.json` - Dependencies and scripts (packageManager: pnpm@10.28.0)
- `tsconfig.json` - TypeScript config with path aliases (@/, @components/, etc.)
- `next.config.ts` - Next.js config (standalone output, React compiler enabled)
- `eslint.config.ts` - ESLint with Next.js + @navikt/tsm-eslint-react
- `prettier.config.js` - Prettier with Tailwind plugin
- `tailwind.config.ts` - Tailwind with @navikt/ds-tailwind preset
- `vitest.config.mts` - Vitest unit test configuration
- `pnpm-workspace.yaml` - pnpm workspace config with security settings
- `.npmrc` - NPM registry config (token goes in `~/.npmrc`)

## CI/CD Pipeline

### GitHub Actions Workflows

**deploy.yml** runs on push to main, weekly (Wednesday 04:00) and on demand:

1. **test-and-lint**: `pnpm run lint`, `pnpm run tsc`, `pnpm run prettier:check`, `pnpm run test`
2. **build-demo**: Builds with `.nais/envs/.env.demo` and pushes the image with `nais/docker-build-push` (team tbd). Static files are served from the image, not from a CDN.
3. **deploy-demo**: Deploys `.nais/sp-spillerom.yaml` to dev-gcp with `deploy-v2.yml` from sykepenger-github-workflows

**pull-requests.yml** runs the same checks and a build on pull requests, plus dependency review.

### Deployment Environments

- **demo**: The app `sp-spillerom` in namespace `tbd` on dev-gcp, deployed from main
  - Ingress: spillerom.ekstern.dev.nav.no

## Common Issues & Workarounds

### 1. NPM Authentication Failures

**Symptom**: `ERR_PNPM_FETCH_401` when running `pnpm install`

**Solution**: Put a token with `read:packages` in `~/.npmrc` (see above).

### 2. Node Version Mismatch

**Required**: Node.js 24 (specified in engines)

**Current environment may have**: Node.js 20

**Workaround**: Commands should still work but you may see warnings. Consider using nvm to install Node 24.

### 3. Build Requires Environment File

**Symptom**: Build fails with environment validation errors

**Solution**: ALWAYS copy the appropriate .env file before building:
```bash
cp .nais/envs/.env.demo .env.production
```

## Path Aliases

The following path aliases are configured in `tsconfig.json` and `vitest.config.mts`:

- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@typer/*` → `./src/types/*`
- `@utils/*` → `./src/utils/*`
- `@schemas/*` → `./src/schemas/*`

**ALWAYS use these aliases** in imports instead of relative paths when possible.

## Code Style & Conventions

- **Formatting**: Prettier with @navikt/tsm-prettier + prettier-plugin-tailwindcss
- **Linting**: ESLint with Next.js + @navikt/tsm-eslint-react presets
- **Editor Config**: 4 spaces for most files, 2 spaces for JSON/YAML
- **React**: React 19 with React Compiler enabled, TypeScript strict mode
- **Styling**: Tailwind CSS with NAV Design System (@navikt/ds-tailwind)

## Key Dependencies

- **Next.js 16** with App Router and standalone output
- **React 19** with React Compiler
- **@navikt/ds-react** - NAV Design System components
- **@tanstack/react-query** - Server state management
- **Zod 4.x** - Schema validation (imported from 'zod/v4')
- **Vitest** - Unit testing

## Important Notes

1. **ALWAYS have a `read:packages` token in `~/.npmrc`** before any pnpm command
2. **Run validation commands in order**: tsc → prettier:check → lint → test
3. **Copy environment file before building** from `.nais/envs/`
4. **Use --frozen-lockfile** when installing dependencies
5. **Never modify pnpm-lock.yaml** manually
6. **Use path aliases** (@/, @components/, etc.) in imports
7. **Follow the CI pipeline order** when validating changes locally

## Quick Reference

```bash
# Initial setup (token in ~/.npmrc)
pnpm install --frozen-lockfile

# Full validation (same as CI)
pnpm run tsc
pnpm run prettier:check
pnpm run lint
pnpm run test

# Development
pnpm run dev  # Starts on http://localhost:3000

# Building
cp .nais/envs/.env.demo .env.production
pnpm run build
```

Trust these instructions. Only search for additional information if instructions are incomplete or found to be incorrect.
