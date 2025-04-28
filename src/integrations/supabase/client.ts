
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ukrehtjivmsjroreoosr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcmVodGppdm1zanJvcmVvb3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjI0NzcsImV4cCI6MjA2MDE5ODQ3N30.R9l5pmGxxsxRY9BejRcUC7IOm4IYInL7gJxp3ODb-As',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    realtime: {
      timeout: 10000,  // Increased timeout for better reliability
    },
    global: {
      fetch: (...args) => {
        // Add performance tracking to fetch requests
        const startTime = performance.now();
        return fetch(...args).then(response => {
          const endTime = performance.now();
          const timeElapsed = endTime - startTime;
          if (timeElapsed > 1000) {
            console.warn(`Supabase request took ${timeElapsed.toFixed(2)}ms to complete`);
          }
          return response;
        });
      },
    },
  }
);

// Preemptively check for an existing session on client load
// to make subsequent auth checks faster
supabase.auth.getSession().catch(error => {
  console.error("Error checking initial session:", error);
});
