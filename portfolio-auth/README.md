# Portfolio with Spring Boot Authentication

## What was added

- **Spring Boot backend** (`/backend`) — handles login, JWT token issuance, and protected content editing
- **Auth context + login modal** — a lock icon in the navbar lets you log in as admin
- **Admin edit panel** — a slide-out panel (only visible when logged in) lets you edit job title, location, about-me text, and project details in real time

## Credentials

| Username     | Password  |
|-------------|-----------|
| David010105 | Dat010105 |

## Project structure

```
portfolio-auth/
├── backend/                  ← Spring Boot (Java 17, Maven)
│   └── src/main/java/com/davidlam/portfolio/
│       ├── controller/       AuthController.java, PortfolioController.java
│       ├── security/         JwtAuthFilter.java, SecurityConfig.java
│       ├── service/          JwtService.java, PortfolioContentService.java
│       └── model/            LoginRequest.java, PortfolioContent.java
└── frontend/                 ← your existing React + Vite portfolio
    └── src/
        ├── AuthContext.jsx   ← auth state (login/logout/token)
        ├── LoginModal.jsx    ← login popup
        ├── AdminPanel.jsx    ← slide-out edit panel (admin only)
        ├── NavBar.jsx        ← added lock icon for login
        ├── App.jsx           ← wraps everything in AuthProvider
        ├── Introduction.jsx  ← accepts dynamicContent prop
        ├── AboutMe.jsx       ← accepts dynamicContent prop
        └── Project.jsx       ← accepts dynamicContent prop

```

## Running locally

### 1. Start the backend

Requirements: Java 17+, Maven 3.8+

```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 2. Start the frontend

Requirements: Node 18+

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Log in

1. Open http://localhost:5173
2. Click the 🔒 lock icon in the top-right of the navbar
3. Enter credentials above
4. The lock turns green 🔓 and the **Edit** button appears in the bottom-right corner
5. Click **Edit** to open the admin panel and update any content
6. Click **Save Changes** — changes are sent to the backend and reflected immediately

## API endpoints

| Method | Path                    | Auth required | Description                |
|--------|-------------------------|---------------|----------------------------|
| POST   | `/api/auth/login`       | No            | Returns JWT token          |
| GET    | `/api/auth/verify`      | No            | Verifies a token           |
| GET    | `/api/content`          | No            | Get current portfolio data |
| PUT    | `/api/admin/content`    | Yes (JWT)     | Update portfolio content   |

## Notes

- Content is stored **in-memory** in the backend. Restarting the server resets edits.
  To persist across restarts, swap `PortfolioContentService` for a PostgreSQL-backed implementation.
- The JWT secret is in `application.properties` — change it before deploying to production.
- CORS is configured for `localhost:5173` and `localhost:4173`. Update `cors.allowed-origins` for production.
