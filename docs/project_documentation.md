# FinTrack Project Documentation

## 1. Technlogy Stack (Tech Stack)

### Frontend

- **Framework**: [Next.js 15+](https://nextjs.org/) (using App Router for routing and server-side features).
- **Library**: [React 18+](https://reactjs.org/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS and [shadcn/ui](https://ui.shadcn.com/) for high-quality, accessible UI components.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth UI transitions and interactions.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Charts**: [Recharts](https://recharts.org/) for data visualization in the dashboard and reports.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

### Backend & Infrastructure

- **BaaS (Backend as a Service)**: [Supabase](https://supabase.com/).
  - **Database**: PostgreSQL with Row Level Security (RLS) for data privacy.
  - **Authentication**: Supabase Auth for secure user sign-up, login, and session management.
  - **Client**: `@supabase/supabase-js` and `@supabase/ssr` for seamless integration.
- **Intelligence**: [OpenAI API](https://openai.com/) (GPT-4o/GPT-4o-mini) integrated via Next.js API routes for generating financial insights.

---

## 2. Project Structure Breakdown

The project follows a modular and modern Next.js structure within the `src` directory:

### `/src/app` (The Routing Layer)

- **`layout.tsx`**: Main entry point that sets up the global structure and providers.
- **`page.tsx`**: Landing page of the application.
- **Nested Routes**: `dashboard`, `transactions`, `goals`, `ai-insights`, `reports`, `settings`, `login`, `signup`.
- **`/api`**: Contains backend logic (e.g., `/api/ai-insights`) for server-side operations like calling the OpenAI API.

### `/src/components` (The UI Layer)

- **`ui/`**: Low-level shadcn components (Buttons, Inputs, Modals, etc.).
- **Feature Components**:
  - `AIInsightsCard.tsx`: Displays AI-generated financial wisdom.
  - `AddTransactionModal.tsx`: Form for loging new transactions.
  - `AppLayout.tsx`: The sidebar/navigation layout for the logged-in experience.
  - `ProtectedRoute.tsx`: Ensures only authenticated users can access certain pages.

### `/src/hooks` (The Logic Layer)

- **`useAuth.tsx`**: Manages user authentication state and methods (login, logout, sign up).
- **`useTransactions.tsx`**: Logic for fetching, adding, and deleting transactions.
- **`useGoals.tsx`**: Logic for financial goal setting and tracking.
- **`useAIInsights.tsx`**: Handles requests to the AI service and manages insight states.

### `/src/lib` (Utilities)

- **`utils.ts`**: Common utility functions (e.g., `cn` for Tailwind merging).
- **`ai-insights-types.ts`**: TypeScript definitions specifically for AI data structures.

---

## 3. How it Works (The "Mental Model")

1.  **Authentication**: When a user lands, `useAuth` checks the session via Supabase. If authenticated, they are redirected to the `/dashboard`.
2.  **Data Operations**: All financial data (transactions, goals) is stored in Supabase. The custom hooks (`useTransactions`, `useGoals`) use the Supabase client to perform CRUD operations.
3.  **UI Updates**: React Query (though present in `package.json`, likely managed within hooks or providers) or standard state management ensures the UI updates instantly when data changes.
4.  **AI Insights**: When the user requests insights, the `useAIInsights` hook sends the user's transaction history to the `/api/ai-insights` endpoint. This endpoint securely calls OpenAI and returns a JSON response containing personalized advice.
5.  **Responsive Design**: The app is fully responsive, utilizing Tailwind's grid and flexbox systems alongside `use-mobile` hooks to adapt the sidebar and cards for mobile devices.
