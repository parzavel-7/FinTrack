# FinTrack Backend Code Snippets

Here are the most critical lines of code from each of the primary backend processing components.

---

## 1. Authentication Gatekeeper

**File**: `src/middleware.ts`
This snippet shows how the system identifies the user and protects routes.

```typescript
// Check if user is logged in
const {
  data: { user },
} = await supabase.auth.getUser();

// Protected routes logic
const protectedRoutes = [
  "/dashboard",
  "/transactions",
  "/reports",
  "/ai-insights",
  "/goals",
  "/settings",
];
const isProtectedRoute = protectedRoutes.some((route) =>
  request.nextUrl.pathname.startsWith(route)
);

if (isProtectedRoute && !user) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

---

## 2. AI Intelligence Engine

**File**: `src/app/api/ai-insights/route.ts`
This snippet highlights the prompt construction and the secure call to the AI provider.

```typescript
const prompt = `
  As a personal financial advisor, analyze the following financial data and provide 3-5 actionable insights.
  
  Financial Summary:
  - Total Income: $${totals.income}
  - Total Expenses: $${totals.expenses}
  - Current Savings: $${totals.savings}
  ... (detailed goals and transactions)
`;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  }),
});
```

---

## 3. Database Security (RLS)

**File**: `supabase/schema.sql`
This SQL snippet demonstrates Row Level Security (RLS), ensuring users only access their own data.

```sql
-- Enable RLS on tables
alter table public.transactions enable row level security;

-- Policy: Users can only see their own transactions
create policy "Users can view their own transactions"
  on public.transactions
  for select using (auth.uid() = user_id);

-- Policy: Users can only insert their own transactions
create policy "Users can insert their own transactions"
  on public.transactions
  for insert with check (auth.uid() = user_id);
```

---

## 4. Automatic Profile Creation

**File**: `supabase/schema.sql`
This trigger ensures every new sign-up automatically gets a matching database profile.

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 5. Supabase Client Initialization

**File**: `src/integrations/supabase/client.ts`
The simple but essential connection point.

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```
