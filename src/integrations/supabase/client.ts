
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ukrehtjivmsjroreoosr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcmVodGppdm1zanJvcmVvb3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjI0NzcsImV4cCI6MjA2MDE5ODQ3N30.R9l5pmGxxsxRY9BejRcUC7IOm4IYInL7gJxp3ODb-As',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
