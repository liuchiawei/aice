# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Information

This is a member introduction page inspired by Apple Watch OS, featuring an interactive draggable grid interface for displaying team members.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **UI**: Tailwind CSS 4, shadcn/ui components
- **Animation**: Motion/React (Framer Motion)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Vercel Blob for image storage
- **Package Manager**: pnpm with workspace configuration

## Common Commands

```bash
# Development
pnpm dev                    # Start development server with Turbopack

# Build & Deployment
pnpm build                  # Build production bundle with Turbopack
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint

# Database (Prisma)
pnpm dlx prisma generate         # Generate Prisma Client to src/generated/prisma
pnpm dlx prisma migrate dev      # Create and apply migrations
pnpm dlx prisma studio           # Open Prisma Studio GUI
pnpm dlx prisma db push          # Push schema changes without migrations
```

## Architecture

### Project Structure

- **App Routes**: Uses Next.js App Router with TypeScript
  - `/` - Landing page
  - `/team` - Interactive team member grid (Apple Watch OS-inspired)
  - `/team/[id]` - Individual team member detail pages
  - `/register` - Team member registration form with avatar upload

- **Data Management**:
  - Database-driven with PostgreSQL via Prisma ORM
  - Prisma schema at `prisma/schema.prisma`
  - Team member data includes multilingual support (firstName, lastName, furigana, nickname)
  - Database seeding from `src/data/team-members.json` via `prisma/seed.ts`

- **Component Organization**:
  - `src/components/ui/` - shadcn/ui components
  - `src/components/layout/` - Layout components (Nav, etc.)
  - `src/app/team/components/` - Team-specific components (Hero, TeamMemberCard)

- **Path Aliases**: Use `@/*` for `src/*` imports

### Key Features

1. **Interactive Grid System** (`src/app/team/components/hero.tsx`):
   - Draggable honeycomb-style grid using Motion/React
   - Dynamic viewport calculations with `useWindowSize` hook
   - Responsive grid columns (3-10) based on screen width
   - Transform-based animations with scale/translate effects
   - Click on icons to open team member detail cards
   - Plus button for adding new team members (links to `/register`)
   - Drag constraints: left: -200, right: 600, top: -500, bottom: 50 with dragElastic: 0.5

2. **Database Configuration**:
   - Uses Neon PostgreSQL (serverless)
   - Connection pooling configured via `DATABASE_URL` in `.env`
   - Schema fields: id, firstName, lastName, furigana, nickname, image, role, partTimeJob, description, age, joinReason, goal, message

3. **Avatar Upload System**:
   - Integrated Vercel Blob storage for avatar uploads
   - Upload endpoint combined with registration API at `/api/register`
   - 4MB file size limit enforced on both client and server
   - Accepts image files only
   - Optional field - registration works without avatar

4. **Styling**:
   - Tailwind CSS 4 with custom dot grid backgrounds (`@nauverse/tailwind-dot-grid-backgrounds`)
   - Custom font setup with Geist Sans and Geist Mono
   - Japanese language support (lang="ja" in layout)

### Important Configuration

- **pnpm Workspace** (`pnpm-workspace.yaml`):
  - Specific built dependencies listed: `@prisma/client`, `@tailwindcss/oxide`, `sharp`, `unrs-resolver`

- **Turbopack**: Development and build commands use `--turbopack` flag

- **Environment Variables**: Required in `.env`:
  - `DATABASE_URL` - PostgreSQL connection string (Neon)
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token for avatar uploads

### Development Notes

- Team member data fetched from PostgreSQL database (not static JSON)
- Server components used for data fetching in `/team` and `/team/[id]` pages
- Hero grid is client-side with `useWindowSize` hook for responsive calculations
- Registration form uses FormData for file uploads (not JSON)
- Avatar upload is optional - can register without uploading image
- Git workflow: Development on `dev` branch (no main branch configured)

### API Routes

- **POST `/api/register`**: Team member registration with optional avatar upload
  - Accepts FormData with all team member fields + optional `avatar` file
  - Validates file size (4MB max) and uploads to Vercel Blob
  - Creates database record with Prisma
  - Returns success with team member data including image URL

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
