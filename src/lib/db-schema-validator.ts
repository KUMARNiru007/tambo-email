import { createSupabaseServerClient } from "./superbase/server";

export async function validateDatabaseSchema() {
  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase
      .from('emails')
      .select('direction, from_email')
      .limit(0);
    
    if (error) {
      throw new Error('Missing required columns: direction and from_email');
    }
  } catch (err) {
    console.error('Database schema validation failed:', err);
    return false;
  }
  
  return true;
}