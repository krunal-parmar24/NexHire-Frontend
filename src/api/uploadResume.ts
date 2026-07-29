import { supabase } from "../lib/supabaseClient";

export async function uploadResume(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop() || "pdf";

  const fileName = `${userId}_${Date.now()}_resume.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("resume")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase Upload Error:", uploadError);
    throw new Error(`Failed to upload resume: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("resume")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
