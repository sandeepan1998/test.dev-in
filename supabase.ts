import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwzzesvocpcrvcubbggo.supabase.co';
const supabaseAnonKey = 'sb_publishable_Fhjg7CCupaEnQmaalOD1XQ_rMd9Fjfd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);