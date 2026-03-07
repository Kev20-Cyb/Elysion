# Elysion - Product Requirements Document

## Original Problem Statement
Build and enhance "Elysion," a comprehensive retirement planning and simulation tool for the French market. The application helps users understand their retirement prospects, simulate scenarios, and make informed decisions.

## User Personas
- **Salaries (Employees)**: Workers with CDI/CDD contracts who need to plan for retirement
- **Freelances/Independants**: Self-employed professionals who need to manage their own retirement planning
- **Chefs d'entreprise**: Business owners who need to optimize their retirement strategy

## Core Requirements
1. Two simulation flows: Employee and Freelance
2. User authentication and account management
3. Dashboard with real-time data and dynamic retirement age selector
4. Investment axes recommendations
5. Profile management with tabs (personal info, security, preferences)
6. Automatic saving of simulation results
7. Document management system
8. Newsletter subscription

## Tech Stack
- **Frontend**: React with Tailwind CSS, Shadcn/UI components
- **Backend**: FastAPI (Python) for Emergent environment / Node.js (Express) for production
- **Database**: MongoDB (dev) / PostgreSQL (production)
- **Authentication**: JWT tokens

## Architecture
```
/app/
├── backend/
│   └── server.py           # FastAPI backend (Emergent environment)
├── backend-node/           # Node.js backend (Production)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── newsletter.routes.js
│   │   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.js          # Routes and auth context
│   │   └── components/
│   │       ├── DashboardLayout.jsx   # Sidebar layout component
│   │       ├── MobileTabBar.jsx      # Mobile navigation
│   │       ├── Dashboard.js
│   │       ├── Documents.js
│   │       ├── InvestmentAxes.js
│   │       ├── ProfilePage.js
│   │       ├── EmployeeSimulator.js
│   │       ├── FreelanceSimulator.js
│   │       ├── OnboardingFlow.js
│   │       └── LandingPage.js
├── DATABASE_SCHEMA.sql       # v3.1
├── DATABASE_SCHEMA.md        # Documentation
└── memory/
    ├── PRD.md
    └── CHANGELOG.md
```

## What's Been Implemented

### Completed Features (as of Feb 2026)
- [x] Landing Page with hero, features, CTA, footer
- [x] Authentication (JWT) - login/register
- [x] Onboarding Flow (5 steps, conditional rendering)
- [x] Employee Simulator (private/public sectors, 7 steps)
- [x] Freelance Simulator (micro/EI/liberal, 7 steps) - REWRITTEN Feb 2026
- [x] Dynamic Dashboard with retirement age selector
- [x] Investment Axes page with personalized recommendations
- [x] Document management system (upload, categorize, delete)
- [x] Profile Page (3 tabs: info, security, preferences)
- [x] Newsletter subscription modal
- [x] Sidebar (DashboardLayout.jsx) - desktop
- [x] Mobile navigation (MobileTabBar + hamburger)
- [x] Automatic simulation saving
- [x] Full responsive design
- [x] Database Schema v3.1 (2026 parameters)
- [x] CHANGELOG.md - Complete project history

## Key API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/dashboard` - Fetch dashboard data
- `POST /api/simulation/save` - Save simulation results
- `GET /api/simulation/latest` - Get most recent simulation
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/documents` - Get user documents
- `POST /api/documents/upload` - Upload document

## Database Schema (MongoDB - Dev)
- **users**: User accounts and profiles
- **simulation_results**: Comprehensive simulation data
- **newsletter_subscribers**: Email subscriptions

## Prioritized Backlog

### P0 - Done
- [x] Changelog completed
- [x] Documents.js UI regression fixed - Restored tab-based navigation (underline style) for document categories (March 2026)

### P1 - High Priority (Next)
- [ ] Comprehensive Auth Flow Verification (token vs access_token)
- [ ] Charts Integration (Recharts) in Dashboard, simulators, InvestmentAxes
- [ ] PDF Export of simulation results

### P2 - Medium Priority
- [ ] Profile Card Gradient Bug in sidebar
- [ ] Interactive Investment Comparator
- [ ] Unsaved Changes Warning modal
- [ ] Age validation (min/max) for date of birth
- [ ] UI Consistency - Radio button primary color styling

### P3 - Low Priority
- [ ] Fix linter warnings for unescaped apostrophes in JSX

## Known Issues
- Authentication token handling: flexible `token || access_token` implemented but needs e2e verification
- Profile card gradient in sidebar doesn't render completely

## Test Credentials
- Email: `test.mobile@elysion.fr`
- Password: `TestPass123`

## Notes
- User language preference: French
- All communication must be in French
- Dual backend: FastAPI (dev Emergent) + Node.js (production)
- Database: MongoDB (dev) / PostgreSQL (production)
- 2026 official rates integrated in simulators