# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based songwriting chord player application built with TypeScript, Vite, and TailwindCSS. The app allows users to play musical chords with Web Audio API synthesis, organized by key and mode (major/minor) with Roman numeral notation.

## Common Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture

### Core Application Structure
- **Entry Point**: `src/main.tsx` - Standard React 19 entry with StrictMode
- **Main Component**: `src/App.tsx` - Single-page chord player application
- **Styling**: TailwindCSS with custom configuration, index.css for global styles

### Key Features in App.tsx
- **Audio Engine**: Web Audio API synthesis with oscillators and gain envelopes
- **Music Theory**: Equal-tempered tuning frequencies, chord voicing generation, major/minor scale mappings
- **User Interface**: Key selector, mode toggle, Roman numeral chord organization
- **State Management**: React useState for chord playback, key selection, and mode

### Build Configuration
- **Vite Config**: Configured with base path `/chords/` for deployment
- **TypeScript**: Dual tsconfig setup (app + node) for optimal type checking
- **TailwindCSS**: Version 4.x with PostCSS integration

## Technology Stack

- React 19.1.1 with TypeScript
- Vite 7.x for build tooling
- TailwindCSS 4.x for styling
- ESLint with TypeScript support
- Web Audio API for sound synthesis

## Development Notes

The application is a single-component React app focused on musical chord generation and playback. The architecture is intentionally simple with all logic contained in App.tsx, making it easy to understand and modify the chord generation algorithms or audio synthesis parameters.