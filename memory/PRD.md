# VetBones - PRD (Product Requirements Document)

## Problem Statement
Mobile application in Spanish for veterinary students to study the skeletal system of animals, starting with the horse. Structured hierarchically based on anatomical divisions, displaying region-specific images with visual bone markers for identification quizzes.

## User Persona
- Veterinary students studying animal anatomy
- Language: Spanish
- Platform: Mobile-first web (Expo)

## Core Requirements
1. **Hierarchical navigation**: Animal → Division (Axial/Apendicular) → Region → Quiz
2. **Region-specific images**: Each anatomical region must display a DIFFERENT, realistic anatomical image
3. **Quiz system**: Multiple-choice identification of highlighted bones with colored markers
4. **205 bones organized** across 5 regions for the horse

## Architecture
- **Frontend**: Expo (React Native) web app with file-based routing
- **Backend**: FastAPI serving data + static image assets
- **Data**: Hardcoded Python dictionary (no database yet)
- **Images**: AI-generated with Gemini Nano Banana, served as static assets

## What's Implemented (Feb 28, 2026)
- ✅ Full-stack scaffolding (Expo + FastAPI)
- ✅ Hierarchical data structure for 205 horse bones
- ✅ Multi-level navigation (Home → Division → Region → Quiz)
- ✅ Dynamic quiz engine with scoring and results
- ✅ Visual bone markers (colored dots with position coordinates)
- ✅ 5 unique AI-generated anatomical images (skull, spine, thorax, forelimb, hindlimb)
- ✅ Static image serving from /api/assets/
- ✅ API field alignment between frontend and backend
- ✅ Thorax image generated (was missing)
- ✅ Duplicate file cleanup ([subdivisionId].tsx removed)

## API Endpoints
- GET /api/animals - List available animals
- GET /api/divisions/{animal_id} - Get divisions for an animal
- GET /api/regions/{animal_id}/{division_id} - Get regions with images
- GET /api/exam/{animal_id}/{division_id}/{region_id} - Generate quiz
- GET /api/assets/{filename} - Serve static images

## Backlog
- P1: Expand to other animals
- P1: Quiz distractors now prioritize same anatomical region (completed Mar 1, 2026)
- P2: Migrate data to MongoDB for scalability
- P2: User registration and progress tracking
- P3: More quiz modes (timed, practice, study)
