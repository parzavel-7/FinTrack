-- Add missing INSERT policy for profiles
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = user_id);
