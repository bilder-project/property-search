import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase;
  private stripe;

  constructor() {
    const supabaseUrl = 'https://dqundwtpkgtfhreonqkd.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }



}