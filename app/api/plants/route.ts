import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { uploadPlantImage } from '@/lib/supabase/client';
import { identifyPlant } from '@/lib/gemini/client';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    const imageUrl = await uploadPlantImage(file);
    // Convert file to base64 for Gemini
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const plantInfo = await identifyPlant(base64);
    
    const { data, error } = await supabase
      .from('plants')
      .insert({
        user_id: session.user.id,
        name: plantInfo.name,
        description: plantInfo.description,
        care_instructions: plantInfo.careInstructions,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting plant:', error);
      throw new Error(`Failed to insert plant: ${error.message}`);
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
