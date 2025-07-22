# 🎰 Lucky Miner

A 3x3 crash-style Minesweeper game built for technical assessment and showcase. Find the treasure, avoid the mines, and cash out at the right time!

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules (scoped styling)
- **Architecture**: Clean architecture with SOLID principles

## 📋 Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Comes with Node.js

## 🚀 Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 🎮 Game Rules

- **Objective**: Find winning cards to earn coins while avoiding mines
- **Starting State**: 3x3 grid of face-down cards, 0 coins
- **Gameplay**:
  - Click a card to reveal it
  - **Win Card** (💰): Earn coins and continue playing or cash out
  - **Mine** (💣): Lose all coins and end the game
  - **Cash Out**: Keep your current winnings and end the round
- **Strategy**: Balance risk vs reward - cash out early for guaranteed coins or continue for higher rewards

## 🏗️ Project Structure

```
src/
├── api/           # Simulated API calls
├── components/    # React components with colocated CSS Modules
├── hooks/         # Custom React hooks
├── types/         # TypeScript interfaces and types
├── utils/         # Constants and helper functions
└── App.tsx        # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with TypeScript rules
- `npm run test:e2e` - Run comprehensive Playwright test suite
- `npm run test:e2e:ui` - Run tests in interactive UI mode
- `npm run test:e2e:debug` - Debug tests step by step

## ✨ Features

- **Mobile-First Responsive Design**: Optimized for mobile devices with progressive enhancement for larger screens
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support
- **Clean Architecture**: Modular components and clear separation of concerns
- **TypeScript**: Full type safety throughout the codebase

## 🎯 Architecture Highlights

- **SOLID Principles**: Clean, maintainable code structure
- **Component Isolation**: Each component has its own CSS Module
- **Custom Hooks**: Separation of business logic from UI components
- **Type Safety**: Comprehensive TypeScript coverage
- **API Simulation**: Realistic async behavior with loading states
