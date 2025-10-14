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

- **Data Management**:
  - Static data stored in `src/data/team-members.json`
  - Prisma schema at `prisma/schema.prisma` with custom client output to `src/generated/prisma`
  - Team member data includes multilingual support (English names + Japanese furigana)

- **Component Organization**:
  - `src/components/ui/` - shadcn/ui components
  - `src/components/layout/` - Layout components (Nav, etc.)
  - `src/app/team/components/` - Team-specific components (Hero, TeamMemberCard)

- **Path Aliases**: Use `@/*` for `src/*` imports

### Key Features

1. **Interactive Grid System** (`src/app/team/components/hero.tsx`):
   - Draggable honeycomb-style grid using Motion/React
   - Dynamic viewport calculations with `useWindowSize` hook
   - Transform-based animations with scale/translate effects
   - Click on icons to open team member detail cards

2. **Database Configuration**:
   - Prisma generates client to `src/generated/prisma` (non-standard location)
   - Uses Neon PostgreSQL (serverless)
   - Connection pooling configured via `DATABASE_URL` in `.env`

3. **Styling**:
   - Tailwind CSS 4 with custom dot grid backgrounds (`@nauverse/tailwind-dot-grid-backgrounds`)
   - Custom font setup with Geist Sans and Geist Mono
   - Japanese language support (lang="ja" in layout)

### Important Configuration

- **pnpm Workspace** (`pnpm-workspace.yaml`):
  - Specific built dependencies listed: `@prisma/client`, `@tailwindcss/oxide`, `sharp`, `unrs-resolver`

- **Turbopack**: Development and build commands use `--turbopack` flag

- **Environment Variables**: Required in `.env`:
  - `DATABASE_URL` - PostgreSQL connection string
  - Additional Vercel Blob storage credentials if using image uploads

### Development Notes

- Team member images currently use placeholder service (pravatar.cc)
- Next.js Image component is commented out in hero.tsx - standard `<img>` tags in use
- Client-side only rendering for grid component with loading state
- Git workflow: Development on `dev` branch (no main branch configured)

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
