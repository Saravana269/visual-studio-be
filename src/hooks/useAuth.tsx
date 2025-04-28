
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && mounted) {
          console.log("No active session, redirecting to auth");
          toast({
            title: "Authentication required",
            description: "Please sign in to access this page",
            variant: "destructive",
          });
          navigate("/auth");
        } 
        
        if (mounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setIsChecking(false);
          navigate("/auth");
        }
      }
    };
    
    // Set up auth state listener first to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && mounted) {
          console.log("Auth state changed: No session");
          navigate("/auth");
        }
      }
    );
    
    // Then check for existing session
    checkAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isChecking };
};
