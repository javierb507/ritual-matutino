# Ritual Matutino

## Overview

A bilingual (Spanish/English) Progressive Web App (PWA) for guided morning and night mindfulness rituals. The app guides users through timed meditation exercises including breathing techniques, visualization, and intention setting. It tracks user progress with streak counters, mood logging, and a diary history feature.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS v4 with custom theme variables, shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions and animations
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **Build Tool**: Vite for frontend, esbuild for server bundling
- **Development**: tsx for TypeScript execution

### Data Storage
- **Client-side**: localStorage for diary entries, streaks, and user preferences
- **Database Schema**: PostgreSQL with Drizzle ORM (schema defined but primarily using client-side storage)
- **Schema Location**: `shared/schema.ts` contains user table definition

### Key Design Patterns
- **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
- **Path Aliases**: `@/` maps to client/src, `@shared/` to shared/, `@assets/` to attached_assets
- **Internationalization**: Custom i18n system with React Context, supporting Spanish and English
- **PWA Support**: Service worker ready with manifest.json for installable app experience

### Build System
- **Development**: Vite dev server with HMR on port 5000
- **Production**: Vite builds to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command

## External Dependencies

### Third-Party Services
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans)

### Core Libraries
- **Database**: Drizzle ORM with PostgreSQL dialect, connect-pg-simple for sessions
- **Validation**: Zod with drizzle-zod integration
- **Date Handling**: date-fns with locale support

### Replit-Specific
- **Plugins**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer (dev only)
- **Meta Images**: Custom Vite plugin for OpenGraph image handling with Replit domains