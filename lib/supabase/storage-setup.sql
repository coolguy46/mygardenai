-- Reset everything first
drop policy if exists "Allow public viewing of images" on storage.objects;
drop policy if exists "Allow authenticated users to upload images" on storage.objects;
drop policy if exists "Allow users to update their own images" on storage.objects;
drop policy if exists "Allow users to delete their own images" on storage.objects;

-- Ensure bucket exists
insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do nothing;

-- Simple permissive policy for development
create policy "Allow all operations"
on storage.objects for all
using ( bucket_id = 'plant-images' )
with check ( bucket_id = 'plant-images' );
