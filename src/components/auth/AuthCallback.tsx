
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("Processing authentication callback");
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (!accessToken || !refreshToken) {
          console.log("No tokens found in URL, checking session");
          // If no tokens in URL, check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log("Existing session found");
            toast({
              title: "Success",
              description: "Successfully authenticated",
            });
            navigate("/dashboard");
            return;
          }
          
          throw new Error("Authentication failed. No tokens found in URL.");
        }

        console.log("Setting session with tokens from URL");
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Successfully authenticated",
        });
        
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        
        // Delay redirect to show the error
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-destructive mb-2">Authentication Error</p>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-muted-foreground mt-2">Redirecting to login page...</p>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
