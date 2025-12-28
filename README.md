# FinTrack - Personal Finance Tracker

FinTrack is a modern, comprehensive personal finance management application built to help you take control of your financial life.

## Features

- **Dashboard**: Get a bird's-eye view of your financial health.
- **Transactions**: Track every dollar with categorized income and expenses.
- **Budgeting**: Set and monitor monthly budgets for different categories.
- **Goals**: Create savings goals and track your progress.
- **AI Insights**: Receive personalized financial advice powered by AI.
- **Secure**: Authentication and data storage powered by Supabase.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI**: OpenAI API (Configurable)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or bun
- A Supabase account

### Installation

1. Clone the repository:

   ```sh
   git clone <YOUR_GIT_URL>
   cd fin_track
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase and OpenAI credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## Local Development

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
