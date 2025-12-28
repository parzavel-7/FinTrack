# FinTrack Backend Processing Pages

In this project, "backend processing" is distributed across Next.js server-side logic and Supabase infrastructure. Below are the most important files responsible for major backend work:

---

## 1. `src/middleware.ts`

**Responsibility**: **Security & Routing Gatekeeper**

- **What it does**: This script runs before every request. It initializes the Supabase server client to check the user's session.
- **Key Processing**:
  - Guards protected routes like `/dashboard`, `/transactions`, and `/goals`.
  - Redirects unauthenticated users to `/login`.
  - Refreshes auth tokens automatically using cookies, ensuring the user stays logged in without manual intervention.

## 2. `src/app/api/ai-insights/route.ts`

**Responsibility**: **Intelligence Engine & Secure API Proxy**

- **What it does**: This is a dedicated backend API route that processes financial analysis requests.
- **Key Processing**:
  - Receives sensitive transaction data from the client.
  - Securely accesses the server-side logic to communicate with **OpenRouter/OpenAI** (keeping API keys hidden from the browser).
  - Formulates complex prompts based on the user's spending patterns and returns structured AI advice as JSON.

## 3. `supabase/schema.sql` (and Migrations)

**Responsibility**: **Data Integrity & Server-Side Security (RLS)**

- **What it does**: While not a "page" in the traditional sense, this SQL defines the entire backend environment in Supabase.
- **Key Processing**:
  - Sets up the database tables (`profiles`, `transactions`, `goals`).
  - Implements **Row Level Security (RLS)** which acts as the "backend firewall," ensuring User A cannot see User B's transactions at the database level.
  - Manages automatic timestamp updates and profile creation triggers.

## 4. `src/integrations/supabase/client.ts`

**Responsibility**: **Backend Connectivity Layer**

- **What it does**: Configures and initializes the connection between the application and the Supabase backend.
- **Key Processing**:
  - Manages the singleton instance of the Supabase client.
  - Ensures that every request to the database is signed with the correct project URL and anonymous key, facilitating authenticated data fetching.

## 5. `src/app/api/auth/route.ts` (Implicitly managed via Supabase SSR)

**Responsibility**: **Session Persistence**

- **What it does**: Handles the exchange of tokens during the login/signup process and manages cookie-based sessions.
- **Key Processing**:
  - Ensures that when a user logs in, their identity is securely stored in a server-side cookie, allowing for consistent access across different pages of the app.
