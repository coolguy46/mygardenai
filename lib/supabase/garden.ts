import { createClient } from './client';
import type { GardenPlant, Garden} from '@/types/database';

export async function addToGarden(plantId: string, nickname?: string): Promise<Garden> {
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

export async function getGardenPlants(): Promise<GardenPlant[]> {
  const client = createClient();
  
  try {
    const { data: { session } } = await client.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    
    const { data, error } = await client
      .from('gardens')
      .select(`
        *,
        plant:plants(*),
        care_schedule:care_schedules(*)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching garden plants:', error);
      throw error;
    }
    
    return data as GardenPlant[];
  } catch (error) {
    console.error('getGardenPlants error:', error);
    throw new Error(`Failed to get garden plants: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function removeFromGarden(gardenId: string): Promise<boolean> {
  const client = createClient();

  try {
    // Delete care schedule first due to foreign key constraint
    const { error: careError } = await client
      .from('care_schedules')
      .delete()
      .eq('garden_id', gardenId)
      .throwOnError();

    if (careError) {
      console.error('Failed to delete care schedule:', careError);
      throw careError;
    }

    // Then delete the garden entry
    const { error: gardenError } = await client
      .from('gardens')
      .delete()
      .eq('id', gardenId)
      .throwOnError();

    if (gardenError) {
      console.error('Failed to delete garden entry:', gardenError);
      throw gardenError;
    }

    return true;
  } catch (error) {
    console.error('Failed to remove from garden:', error);
    throw error;
  }
}