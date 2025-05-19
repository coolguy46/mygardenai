import { createClient } from './client';
import type { Database } from '@/types/supabase';
import type { GardenPlant } from '@/types/database';

export async function addToGarden(plantId: string, nickname?: string) {
  const client = createClient();
  try {
    const { data: { session } } = await client.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // First, create the garden entry
    const { data: garden, error: gardenError } = await client
      .from('gardens')
      .insert({
        user_id: session.user.id,
        plant_id: plantId,
        nickname
      })
      .select()
      .single();

    if (gardenError) {
      console.error('Error inserting into gardens table:', gardenError);
      throw new Error(`Failed to add to garden: ${gardenError.message}`);
    }

    // Then, create a default care schedule
    const { error: scheduleError } = await client
      .from('care_schedules')
      .insert({
        garden_id: garden.id,
        plant_id: plantId,
        water_frequency: 7, // Default to weekly
        sunlight_needs: 'Medium',
        next_water_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (scheduleError) {
      console.error('Error inserting into care_schedules table:', scheduleError);
      throw new Error(`Failed to create care schedule: ${scheduleError.message}`);
    }

    return garden;
  } catch (error) {
    console.error('addToGarden error:', error);
    throw new Error(`Failed to add to garden: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getGardenPlants() {
  const client = createClient();
  
  const { data, error } = await client
    .from('gardens')
    .select(`
      *,
      plant:plants(*),
      care_schedule:care_schedules(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GardenPlant[];
}

export async function removeFromGarden(gardenId: string) {
  const client = createClient();

  // Delete care schedule first due to foreign key constraint
  await client
    .from('care_schedules')
    .delete()
    .eq('garden_id', gardenId);

  // Then delete the garden entry
  const { error } = await client
    .from('gardens')
    .delete()
    .eq('id', gardenId);

  if (error) throw error;
}
