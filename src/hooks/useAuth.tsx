
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (!currentSession && mounted) {
          // Only show toast if we're not on the auth page already
          if (!window.location.pathname.includes('/auth')) {
            toast({
              title: "Authentication required",
              description: "Please sign in to access this page",
              variant: "destructive",
            });
            navigate("/auth");
          }
        }
        
        // Always update checking state regardless of result
        setIsChecking(false);
      }
    );
    
    // Quick check for existing session with a timeout
    const sessionTimeout = setTimeout(() => {
      if (mounted && isChecking) {
        // If we're still checking after 2s, force complete to avoid UI freeze
        setIsChecking(false);
        navigate("/auth");
      }
    }, 2000);
    
    // Then check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!existingSession && mounted) {
          // Only redirect if we're not already on the auth page
          if (!window.location.pathname.includes('/auth')) {
            navigate("/auth");
          }
        }
        
        if (mounted) {
          setSession(existingSession);
          setIsChecking(false);
        }
      } catch (error) {
        if (mounted) {
          setIsChecking(false);
          navigate("/auth");
        }
      }
    };
    
    checkAuth();
    
    return () => {
      mounted = false;
      clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isChecking, session };
};
