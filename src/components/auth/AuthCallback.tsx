
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Start with initial progress
        setProgress(10);
        
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        setProgress(30);

        // If no tokens in URL, check if we already have a session
        if (!accessToken || !refreshToken) {
          setProgress(50);
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          
          if (session) {
            setProgress(100);
            toast({
              title: "Already authenticated",
              description: "Redirecting to dashboard",
            });
            navigate("/dashboard");
            return;
          }
          
          throw new Error("Authentication failed. No tokens found.");
        }

        setProgress(70);
        
        // Set session with tokens from URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) throw error;

        setProgress(100);
        
        toast({
          title: "Authentication successful",
          description: "You are now signed in",
        });
        
        navigate("/dashboard");
      } catch (error: any) {
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

    // Add progress animation
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        // Don't go to 100 until auth is actually complete
        if (isLoading && prevProgress < 70) {
          return prevProgress + 5;
        }
        return prevProgress;
      });
    }, 200);

    handleOAuthCallback();

    return () => clearInterval(timer);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-center text-muted-foreground">
            {progress < 30 && "Verifying authentication..."}
            {progress >= 30 && progress < 70 && "Processing your credentials..."}
            {progress >= 70 && "Almost there..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 bg-card p-6 rounded-lg shadow-lg">
          <p className="text-destructive text-lg font-semibold text-center">Authentication Error</p>
          <p className="text-muted-foreground text-center">{error}</p>
          <p className="text-muted-foreground text-center mt-2">Redirecting to login page...</p>
          <Progress value={100} className="h-2 w-full bg-destructive/20" />
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
