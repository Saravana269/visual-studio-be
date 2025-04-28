
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
    
    // Quick check for existing session with a timeout
    const sessionTimeout = setTimeout(() => {
      if (mounted && isChecking) {
        console.log("Session check timed out: forcing completion");
        // If we're still checking after 2s, force complete to avoid UI freeze
        setIsChecking(false);
        
        const isAuthRoute = 
          location.pathname.includes('/auth') || 
          location.pathname === '/';
          
        if (!isAuthRoute) {
          navigate("/auth", { replace: true });
        }
      }
    }, 2000);
    
    // Then check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!existingSession && mounted) {
          const isAuthRoute = 
            location.pathname.includes('/auth') || 
            location.pathname === '/';
            
          if (!isAuthRoute) {
            console.log("No existing session: redirecting to auth");
            navigate("/auth", { replace: true });
          }
        }
        
        if (mounted) {
          setSession(existingSession);
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (mounted) {
          setIsChecking(false);
          navigate("/auth", { replace: true });
        }
      }
    };
    
    checkAuth();
    
    return () => {
      mounted = false;
      clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  return { isChecking, session };
};
