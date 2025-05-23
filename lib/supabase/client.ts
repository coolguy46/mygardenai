import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

export async function uploadPlantImage(file: File): Promise<string> {
  const client = createClient();

  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await client.storage
      .from('plant-images')
      .upload(`plants/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    if (!data?.path) throw new Error('Upload failed');

    const { data: { publicUrl } } = client.storage
      .from('plant-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
}
