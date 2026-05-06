# Kabaddi Intelligence Pro (Tactical Analytics Platform)

## Overview
Kabaddi Intelligence Pro is a professional-grade tactical simulation and AI-powered match intelligence platform designed for elite Kabaddi teams and analysts. It provides real-time court event tracking, spatial heatmap analysis, momentum tracking, and AI-driven tactical recommendations.

## Project Structure
The project follows a scalable modular architecture for high maintainability and production readiness:

```
src/
├── app/          # Global application logic and state
├── components/   # Reusable UI and domain-specific components
│    ├── common/
│    ├── dashboard/
│    ├── analytics/
│    ├── tactical/
│    ├── heatmaps/
│    ├── tournament/
│    └── ui/
├── pages/        # Main application views
├── services/     # External integrations Layer
│    ├── ai/      # Gemini AI integration
│    ├── auth/    # Firebase Auth
│    ├── database/# Firestore Match & Player management
│    └── realtime/# Real-time sync mechanisms
├── hooks/        # Custom React hooks (Auth, Matches)
├── lib/          # Utilities and core libraries (Firebase, cn)
├── types/        # TypeScript interfaces and enums
├── constants/    # Global configuration and brand constants
└── styles/       # Global CSS and Tailwind themes
```

## Core Features
- **Cinematic UX**: Immersive stadium-grid atmosphere with fluid Framer Motion transitions.
- **AI Tactical Feed**: Generates real-time strategic insights using Google Gemini 2.0 Flash.
- **Match Logger**: Dynamic court event capture with integrated raid timers and momentum tracking.
- **Spatial Matrix**: 2D heatmap visualization for zone-based tactical analysis.
- **Cloud Persistence**: Fully integrated with Firebase Firestore for cross-session data stability.
- **Secure Auth**: Google Identity integration with Role-Based Access Control (RBAC).

## Installation

1. `npm install`
2. Configure `.env` (See `.env.example`)
3. `npm run dev`

## Deployment
Compatible with:
- **Frontend**: Vercel / Netlify
- **Backend**: Firebase / Render
- **Database**: Firebase Firestore

## AI Workflow
The platform utilizes the `gemini-service` to process live match telemetry. Every 5 tactical actions, the engine triggers a pattern-analysis prompt to Gemini, returning structured JSON insights used to calculate win probabilities and personnel efficiency.
