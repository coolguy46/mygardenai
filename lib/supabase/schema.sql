-- Plants table
create table plants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  summary text,
  description text,
  care_instructions text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gardens table (user's saved plants)
create table gardens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  plant_id uuid references plants(id) not null,
  nickname text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Care schedules table
create table care_schedules (
  id uuid default uuid_generate_v4() primary key,
  garden_id uuid references gardens(id) not null,
  plant_id uuid references plants(id) not null,
  water_frequency integer not null,
  sunlight_needs text not null,
  next_water_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security)
alter table plants enable row level security;
alter table gardens enable row level security;
alter table care_schedules enable row level security;

-- Create policies
create policy "Users can view their own plants"
  on plants for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plants"
  on plants for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own garden"
  on gardens for select
  using (auth.uid() = user_id);

create policy "Users can manage their own garden"
  on gardens for insert
  with check (auth.uid() = user_id);

create policy "Users can view their care schedules"
  on care_schedules for select
  using (
    exists (
      select 1 from gardens
      where gardens.id = garden_id
      and gardens.user_id = auth.uid()
    )
  );

-- Update foreign key constraints to cascade deletes
ALTER TABLE care_schedules 
DROP CONSTRAINT IF EXISTS care_schedules_garden_id_fkey,
ADD CONSTRAINT care_schedules_garden_id_fkey 
  FOREIGN KEY (garden_id) 
  REFERENCES gardens(id) 
  ON DELETE CASCADE;

-- Add policy for deleting care schedules
create policy "Users can delete their care schedules"
  on care_schedules for delete
  using (
    exists (
      select 1 from gardens
      where gardens.id = garden_id
      and gardens.user_id = auth.uid()
    )
  );

-- Add policy for deleting garden entries
create policy "Users can delete their garden entries"
  on gardens for delete
  using (auth.uid() = user_id);
