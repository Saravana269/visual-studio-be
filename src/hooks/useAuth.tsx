
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: number | undefined;
    
    // Set up auth state listener first to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        setSession(currentSession);
        
        // Only redirect if not authenticated and not already on auth-related pages
        if (!currentSession && mounted) {
          const isAuthRoute = 
            location.pathname.includes('/auth') || 
            location.pathname === '/';
          
          if (!isAuthRoute) {
            console.log("Auth state change: redirecting to auth page");
            toast({
              title: "Authentication required",
              description: "Please sign in to access this page",
              variant: "destructive",
            });
            navigate("/auth", { replace: true });
          }
        }
        
        // Always update checking state regardless of result
        setIsChecking(false);
      }
    );
    
    // Check for existing session without immediate timeout
    const checkAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          setSession(existingSession);
          setIsChecking(false);
          
          // Only redirect if no session and not on auth route
          if (!existingSession) {
            const isAuthRoute = 
              location.pathname.includes('/auth') || 
              location.pathname === '/';
              
            if (!isAuthRoute) {
              console.log("No existing session: redirecting to auth");
              navigate("/auth", { replace: true });
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (mounted) {
          setIsChecking(false);
          // Only redirect on actual errors
          navigate("/auth", { replace: true });
        }
      }
    };
    
    checkAuth();
    
    // Set a more reasonable timeout only for UI feedback, not for navigation
    timeoutId = window.setTimeout(() => {
      if (mounted && isChecking) {
        console.log("Session check timed out: updating UI state only");
        setIsChecking(false);
      }
    }, 3000);
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  return { isChecking, session };
};
