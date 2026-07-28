import { supabase } from '../lib/supabaseClient';

export async function uploadResume(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'pdf';
  // Use a unique file name
  const fileName = `${userId}_${Date.now()}_resume.${fileExt}`;

  // Standard Supabase upload
  const { data, error: uploadError } = await supabase.storage
    .from('resume') // Using 'resume' based on user prompt 'created "resume" bucket'
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Supabase Upload Error:", uploadError);
    throw new Error(`Failed to upload resume: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('resume')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
