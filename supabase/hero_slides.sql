-- Create the hero_slides table
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  title_ka text,
  title_en text,
  title_ru text,
  subtitle_ka text,
  subtitle_en text,
  subtitle_ru text,
  link text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.hero_slides enable row level security;

-- Policy: Anyone can read (SELECT) hero slides
create policy "Public hero slides are viewable by everyone" 
on public.hero_slides for select 
using (true);

-- Policy: Only authenticated users can insert/update/delete (assuming only admins are authenticated)
create policy "Admins can insert hero slides" 
on public.hero_slides for insert 
with check (auth.role() = 'authenticated');

create policy "Admins can update hero slides" 
on public.hero_slides for update 
using (auth.role() = 'authenticated');

create policy "Admins can delete hero slides" 
on public.hero_slides for delete 
using (auth.role() = 'authenticated');
