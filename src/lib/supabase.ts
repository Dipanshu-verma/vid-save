import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSessionId(): string {
  let id = localStorage.getItem('vidsave_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('vidsave_session', id);
  }
  return id;
}
