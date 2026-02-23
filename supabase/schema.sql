-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text,
  email text,
  avatar_url text,
  currency text default 'USD',
  theme text default 'light',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create categories table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null, -- 'income' or 'expense'
  color text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  amount decimal not null,
  type text not null, -- 'income' or 'expense'
  description text,
  date date not null default CURRENT_DATE,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create goals table
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target_amount decimal not null,
  current_amount decimal default 0,
  deadline date,
  status text default 'in_progress', -- 'in_progress', 'completed'
  color text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatars." on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid);

create policy "Users can update their own avatars." on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid);

create policy "Users can delete their own avatars." on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid() = (storage.foldername(name))[1]::uuid);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Categories Policies
create policy "Users can view their own categories" on public.categories
  for select using (auth.uid() = user_id);

create policy "Users can insert their own categories" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own categories" on public.categories
  for update using (auth.uid() = user_id);

create policy "Users can delete their own categories" on public.categories
  for delete using (auth.uid() = user_id);

-- Transactions Policies
create policy "Users can view their own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own transactions" on public.transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own transactions" on public.transactions
  for delete using (auth.uid() = user_id);

-- Goals Policies
create policy "Users can view their own goals" on public.goals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own goals" on public.goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own goals" on public.goals
  for update using (auth.uid() = user_id);

create policy "Users can delete their own goals" on public.goals
  for delete using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Default Categories (Optional: function to seed defaults)
create or replace function public.handle_new_user_categories()
returns trigger as $$
begin
  insert into public.categories (user_id, name, type, color, icon) values
  (new.id, 'Food & Dining', 'expense', '#FF5733', 'Utensils'),
  (new.id, 'Transportation', 'expense', '#33FF57', 'Car'),
  (new.id, 'Shopping', 'expense', '#3357FF', 'ShoppingCart'),
  (new.id, 'Entertainment', 'expense', '#F333FF', 'Film'),
  (new.id, 'Bills & Utilities', 'expense', '#33FFF5', 'Zap'),
  (new.id, 'Salary', 'income', '#57FF33', 'Briefcase'),
  (new.id, 'Freelance', 'income', '#FF33A8', 'Laptop');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created_categories
  after insert on auth.users
  for each row execute procedure public.handle_new_user_categories();
