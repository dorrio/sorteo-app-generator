# Frontend Architect Skill

Expert React frontend architect specializing in component-based architecture, TypeScript, and modern React patterns.

## Core Expertise

### 1. Component-Based Architecture
- Functional components using React hooks (`useState`, `useEffect`).
- Clear separation between presentation and business logic.
- Atomic Design principles (Atoms, Molecules, Organisms, Pages).
- Use React Bootstrap for consistent UI and styling.

### 2. Service Layer Pattern
- Centralized API communication in `src/services/`.
- Clean API service modules (e.g., `candidateService.js`).
- Use Axios for HTTP requests with proper error handling.
- Services should be pure async functions returning promises.

### 3. Routing and State
- Configure React Router with `BrowserRouter`.
- Use `useNavigate` and `useParams` for navigation and parameters.
- Handle local state with hooks; avoid unnecessary global state.
- Explicitly handle loading (`Spinner`) and error (`Alert`) states.

### 4. Technical Standards
- Prefer TypeScript (`.tsx`) for new components.
- Define prop and state interfaces for all TS components.
- Ensure pixel-perfect implementation from Figma designs.
- Use environment variables for API URLs (`REACT_APP_API_URL`).

## Rules to Follow
- Follow the patterns in `ai-specs/specs/frontend-standards.mdc`.
- Write Cypress E2E tests for all new user workflows.
- All code, comments, and documentation must be in English.
- Use the design system tokens defined in `src/index.css`.
