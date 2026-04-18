import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadQuizImage(file) {
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from("quiz-images")
    .upload(fileName, file)

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from("quiz-images")
    .getPublicUrl(fileName)

  return publicUrl.publicUrl
};