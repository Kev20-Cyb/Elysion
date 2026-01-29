# Elysion - Product Requirements Document

## 📌 Original Problem Statement
Build and enhance "Elysion," a comprehensive retirement planning and simulation tool for the French market. The application helps users understand their retirement prospects, simulate scenarios, and make informed decisions.

## 👥 User Personas
- **Salariés (Employees)**: Workers with CDI/CDD contracts who need to plan for retirement
- **Freelances/Indépendants**: Self-employed professionals who need to manage their own retirement planning

## 🎯 Core Requirements
1. Two simulation flows: Employee and Freelance
2. User authentication and account management
3. Dashboard with real-time data
4. Investment axes recommendations
5. Profile management
6. Automatic saving of simulation results

## ✅ What's Been Implemented

### Session - January 2026

#### UI/UX Improvements
- [x] Removed blue background on selected risk tolerance options (step 6) - Jan 29, 2026
- [x] Replaced gradient backgrounds with solid colors for better text readability
- [x] Profile page with tabs for personal info, security, preferences

#### Core Features
- [x] Dashboard connected to live backend data
- [x] Dynamic Investment Axes page based on user simulation data
- [x] Automatic simulation saving for logged-in users
- [x] Onboarding flow with "Prénom" (First Name) field
- [x] Auto-login for existing email during registration

#### Bug Fixes
- [x] Backend routing issues for `/api/documents/*`
- [x] Frontend race condition causing "Not authenticated" errors
- [x] Pydantic validation error rendering in frontend
- [x] Dashboard ValidationError fix (pending verification)

## 🔴 Priority Tasks (P0)
1. **Dashboard Loading Bug** - Verify fix for ValidationError when loading dashboard after simulation + account creation
2. **Automatic Simulation Saving** - Verify feature works end-to-end

## 🟡 Upcoming Tasks (P1)
- **PDF Export** - Generate and download PDF summary of simulation results

## 🟢 Future Tasks (P2/P3)
- Interactive Investment Comparator
- Unsaved Changes Warning modal
- Age validation (min/max) for date of birth input
- UI Consistency - Radio button styling
- Code Quality - Fix unescaped apostrophes in JSX

## 🏗 Architecture

```
/app/
├── backend/
│   └── server.py           # FastAPI backend
├── frontend/
│   ├── src/
│   │   ├── App.js          # Routes and auth context
│   │   └── components/
│   │       ├── EmployeeSimulator.js
│   │       ├── FreelanceSimulator.js
│   │       ├── Dashboard.js
│   │       ├── InvestmentAxes.js
│   │       ├── ProfilePage.js
│   │       └── OnboardingFlow.js
└── export/
    └── Elysion-main/       # Synchronized export folder
```

## 🔑 Key API Endpoints
- `GET /api/dashboard` - Fetch user dashboard data
- `POST /api/simulation/save` - Save simulation results
- `GET /api/simulation/latest` - Get most recent simulation
- `PUT /api/user/profile` - Update personal information
- `POST /api/user/password` - Change password

## 📊 Database Schema (MongoDB)
- **users**: User accounts and profiles
- **simulation_results**: Comprehensive simulation data including investment breakdown

## ⚠️ Known Issues
- Dashboard loading may fail due to ValidationError (fix pending verification)
- Linter warnings for unescaped apostrophes in JSX files
